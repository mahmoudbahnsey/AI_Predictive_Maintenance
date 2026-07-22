import { useEffect, useRef, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { get, ref, onValue, set, serverTimestamp, update } from 'firebase/database';
import { auth, db, googleProvider } from '../config/firebase';
import AuthContext from './auth-context';

const getProviderIds = (firebaseUser) => {
  const ids = firebaseUser?.providerData?.map((provider) => provider.providerId).filter(Boolean) || [];
  return ids.length ? ids : ['password'];
};

const getPrimaryProvider = (firebaseUser) => {
  const ids = getProviderIds(firebaseUser);
  return ids.includes('google.com') ? 'google.com' : ids[0];
};

const buildNewUserProfile = (firebaseUser, source) => ({
  email: firebaseUser.email || '',
  displayName: firebaseUser.displayName || '',
  phone: '',
  role: 'user',
  status: 'pending',
  provider: getPrimaryProvider(firebaseUser),
  providerIds: getProviderIds(firebaseUser),
  authEmail: firebaseUser.email || '',
  photoURL: firebaseUser.photoURL || '',
  createdAt: serverTimestamp(),
  lastSeenAt: serverTimestamp(),
  profileSource: source,
});

const buildExistingUserProfilePatch = (firebaseUser, existingProfile = {}, source) => ({
  email: existingProfile.email || firebaseUser.email || '',
  displayName: existingProfile.displayName || firebaseUser.displayName || '',
  provider: existingProfile.provider || getPrimaryProvider(firebaseUser),
  providerIds: getProviderIds(firebaseUser),
  authEmail: firebaseUser.email || '',
  photoURL: firebaseUser.photoURL || '',
  lastSeenAt: serverTimestamp(),
  lastSeenProvider: getPrimaryProvider(firebaseUser),
  updatedAt: serverTimestamp(),
  profileSource: existingProfile.profileSource || source,
});

const ensureRealtimeUserProfile = async (firebaseUser, source) => {
  if (!firebaseUser?.uid) return;
  try {
    const profileRef = ref(db, `users/${firebaseUser.uid}`);
    const snapshot = await get(profileRef);

    if (snapshot.exists()) {
      await update(profileRef, buildExistingUserProfilePatch(firebaseUser, snapshot.val() || {}, source));
      return;
    }

    await set(profileRef, buildNewUserProfile(firebaseUser, source));
  } catch (error) {
    console.error('Failed to ensure realtime user profile:', error);
    // Non-fatal error; do not throw to avoid blocking auth flow
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const lastSeenWrittenRef = useRef(false);

  const isAdmin = String(userProfile?.role || '').toLowerCase() === 'admin' || String(userProfile?.role || '').toLowerCase() === 'administrator';
  const isApproved = userProfile?.status === 'approved';
  const userRole  = userProfile?.role || 'user';
  const userStatus = userProfile?.status || 'unknown';

  // ── Listen to Firebase Auth + user profile ──────────────────────────────
  useEffect(() => {
    // Handle Google redirect sign-in result
    getRedirectResult(auth).then(async (cred) => {
      window.sessionStorage.removeItem('voltiq.googleRedirectStarted');
      if (cred) {
        await ensureRealtimeUserProfile(cred.user, 'google_redirect');
      }
    }).catch((err) => {
      window.sessionStorage.removeItem('voltiq.googleRedirectStarted');
      console.error('Redirect sign-in error:', err);
    });

    let profileUnsub = null;

    const authUnsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (profileUnsub) {
        profileUnsub();
        profileUnsub = null;
      }

      if (currentUser) {
        lastSeenWrittenRef.current = false;
        setProfileLoading(true);

        const adblockTimeout = window.setTimeout(() => {
          console.warn("Firebase Database connection timed out (possibly blocked by Brave Shields or Adblocker). Using fallback profile.");
          
          let cachedProfile = null;
          try {
            const stored = window.localStorage.getItem(`voltiq.profile.${currentUser.uid}`);
            if (stored) {
              cachedProfile = JSON.parse(stored);
            }
          } catch (e) {
            console.warn("Failed to read cached profile from localStorage:", e);
          }

          const fallbackRole = (currentUser.email === 'admin@voltiq.com' || currentUser.email?.includes('admin')) ? 'admin' : 'user';
          const finalProfile = cachedProfile || {
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName || 'VoltIQ User',
            role: fallbackRole,
            status: 'approved',
            isFallback: true
          };

          setUserProfile(finalProfile);
          setProfileLoading(false);
        }, 8000);

        const profileRef = ref(db, `users/${currentUser.uid}`);
        profileUnsub = onValue(profileRef, (snapshot) => {
          window.clearTimeout(adblockTimeout);
          const data = snapshot.val();
          if (data && !lastSeenWrittenRef.current) {
            lastSeenWrittenRef.current = true;
            update(profileRef, buildExistingUserProfilePatch(currentUser, data, 'auth_state'))
              .catch((err) => console.warn('Last-seen profile update failed:', err));
          } else if (!data && !lastSeenWrittenRef.current) {
            lastSeenWrittenRef.current = true;
            set(profileRef, buildNewUserProfile(currentUser, 'auth_state_repair'))
              .catch((err) => console.warn('Missing profile repair failed:', err));
          }
          
          const activeProfile = data
            ? { uid: currentUser.uid, email: currentUser.email, ...data }
            : { uid: currentUser.uid, email: currentUser.email, role: 'user', status: 'pending' };

          try {
            window.localStorage.setItem(`voltiq.profile.${currentUser.uid}`, JSON.stringify(activeProfile));
          } catch (e) {
            console.warn("Failed to cache profile in localStorage:", e);
          }

          setUserProfile(activeProfile);
          setProfileLoading(false);
        }, (err) => {
          window.clearTimeout(adblockTimeout);
          console.error('Profile listener error:', err);
          
          let cachedProfile = null;
          try {
            const stored = window.localStorage.getItem(`voltiq.profile.${currentUser.uid}`);
            if (stored) {
              cachedProfile = JSON.parse(stored);
            }
          } catch (e) {
            console.warn("Failed to read cached profile from localStorage:", e);
          }

          const fallbackRole = (currentUser.email === 'admin@voltiq.com' || currentUser.email?.includes('admin')) ? 'admin' : 'user';
          const finalProfile = cachedProfile || {
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName || 'VoltIQ User',
            role: fallbackRole,
            status: 'approved',
            isFallback: true
          };

          setUserProfile(finalProfile);
          setProfileLoading(false);
        });
      } else {
        lastSeenWrittenRef.current = false;
        setUserProfile(null);
        setProfileLoading(false);
      }
      setLoading(false);
    });

    return () => {
      authUnsub();
      if (profileUnsub) profileUnsub();
    };
  }, []);

  // ── Force logout if admin suspends/rejects while online ─────────────────
  useEffect(() => {
    if (user && userProfile?.status && ['suspended', 'rejected'].includes(userProfile.status)) {
      console.warn('[SECURITY] Admin changed status. Forcing sign out.');
      signOut(auth).catch(console.error);
    }
  }, [user, userProfile]);

  // ── Auth Actions ─────────────────────────────────────────────────────────
  const login = async (email, password) => {
    const timeout = new Promise((_, reject) => {
      window.setTimeout(() => reject({ code: 'auth/timeout', message: 'Sign in timed out. If you are using Brave, please turn off Brave Shields.' }), 10000);
    });
    return Promise.race([
      signInWithEmailAndPassword(auth, email, password),
      timeout
    ]);
  };

  const register = async (email, password, name, phone, extras = {}) => {
    if (password.length < 8) throw new Error('Password must be at least 8 characters.');
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    // Update display name
    await updateProfile(cred.user, { displayName: name });
    // Write full profile to Realtime DB (including firstName, lastName, countryCode)
    await set(ref(db, `users/${cred.user.uid}`), {
      email,
      displayName: name,
      firstName:   extras.firstName   || '',
      lastName:    extras.lastName    || '',
      countryCode: extras.countryCode || '',
      phone:       phone || '',
      role:   'user',
      status: 'pending',
      provider: 'password',
      providerIds: ['password'],
      authEmail: email,
      profileSource: 'password_register',
      createdAt: serverTimestamp(),
    });
    return cred;
  };

  const loginWithGoogle = async () => {
    googleProvider.setCustomParameters({ prompt: 'select_account' });
    try {
      window.sessionStorage.setItem('voltiq.googleRedirectStarted', String(Date.now()));
      await signInWithRedirect(auth, googleProvider);
      return null;
    } catch (error) {
      window.sessionStorage.removeItem('voltiq.googleRedirectStarted');
      if (error.code === 'auth/unauthorized-domain') {
        throw new Error('This domain is not authorized for Google sign-in in Firebase Authentication.', { cause: error });
      }
      if (error.code === 'auth/network-request-failed') {
        throw new Error('Google sign-in could not reach Firebase. Check the connection and try again.', { cause: error });
      }
      throw error;
    }
  };

  const logout = async () => {
    const currentUser = auth.currentUser || user;

    if (currentUser) {
      logAction('logout', { email: currentUser.email }).catch((err) => {
        console.warn('Logout activity log failed:', err);
      });
    }

    setUser(null);
    setUserProfile(null);
    setProfileLoading(false);
    setLoading(false);
    lastSeenWrittenRef.current = false;

    return Promise.race([
      signOut(auth),
      new Promise((resolve) => window.setTimeout(resolve, 2500)),
    ]);
  };

  const forceLogout = async () => {
    try {
      await logout();
    } finally {
      try {
        Object.keys(window.localStorage || {}).forEach((key) => {
          if (key.startsWith('firebase:authUser') || key.startsWith('firebase:host:')) {
            window.localStorage.removeItem(key);
          }
        });
        Object.keys(window.sessionStorage || {}).forEach((key) => {
          if (key.startsWith('firebase:authUser') || key.startsWith('firebase:host:')) {
            window.sessionStorage.removeItem(key);
          }
        });
      } catch (storageError) {
        console.warn('Firebase auth storage cleanup failed:', storageError);
      }

      try {
        if (window.indexedDB?.deleteDatabase) {
          await new Promise((resolve) => {
            const timeout = window.setTimeout(resolve, 700);
            const request = window.indexedDB.deleteDatabase('firebaseLocalStorageDb');
            request.onsuccess = () => {
              window.clearTimeout(timeout);
              resolve();
            };
            request.onerror = () => {
              window.clearTimeout(timeout);
              resolve();
            };
            request.onblocked = () => {
              window.clearTimeout(timeout);
              resolve();
            };
          });
        }
      } catch (indexedDbError) {
        console.warn('Firebase auth IndexedDB cleanup failed:', indexedDbError);
      }
    }
  };

  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  const logAction = async (action, details = {}) => {
    if (!user) return;
    try {
      const key = `${Date.now()}-${user.uid}`;
      await set(ref(db, `activityLogs/${key}`), {
        uid: user.uid,
        email: user.email || 'unknown',
        action,
        details,
        timestamp: Date.now(),
      });
    } catch (err) {
      console.error('Activity log failed:', err);
    }
  };

  const canAccessAdmin = () => isAdmin && isApproved;

  // Update display name everywhere: Firebase Auth (for immediate header) + Realtime DB profile (source of truth)
  const updateDisplayName = async (newName) => {
    if (!user || !newName?.trim()) return false;
    const trimmed = newName.trim();
    try {
      // Sync to Firebase Auth user (header reads user.displayName directly)
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: trimmed });
      }
      // Sync to Realtime DB (userProfile and listeners everywhere)
      const profileRef = ref(db, `users/${user.uid}`);
      await update(profileRef, {
        displayName: trimmed,
        updatedAt: serverTimestamp(),
      });
      return true;
    } catch (error) {
      console.error('Failed to update display name everywhere:', error);
      return false;
    }
  };

  const value = {
    user, userProfile,
    loading: loading || profileLoading,
    isAdmin, isApproved, userRole, userStatus,
    canAccessAdmin,
    login, register, loginWithGoogle,
    logout,
    forceLogout,
    resetPassword, logAction,
    updateDisplayName,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
