import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';
import fs from 'fs';

const env = fs.readFileSync('.env', 'utf-8').split('\n').reduce((acc, line) => {
  const [key, value] = line.split('=');
  if (key && value) acc[key.trim()] = value.trim();
  return acc;
}, {});

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: env.VITE_FIREBASE_DATABASE_URL,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

async function createAdmin() {
  try {
    const cred = await signInWithEmailAndPassword(auth, 'admin@voltiq.com', 'Admin123!');
    await set(ref(db, `users/${cred.user.uid}`), {
      email: 'admin@voltiq.com',
      displayName: 'System Admin',
      firstName: 'System',
      lastName: 'Admin',
      countryCode: 'EG',
      phone: '',
      role: 'admin',
      status: 'approved',
      provider: 'password',
      providerIds: ['password'],
      authEmail: 'admin@voltiq.com',
      profileSource: 'script',
      createdAt: Date.now(),
    });
    console.log('Admin account created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createAdmin();
