import { initializeApp } from "firebase/app";
import { initializeAuth, browserLocalPersistence, browserPopupRedirectResolver, GoogleAuthProvider } from "firebase/auth";
import { getDatabase, forceLongPolling } from "firebase/database";

// Firebase config loaded from environment variables (Vite)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Export initialized services
export const auth = initializeAuth(app, {
  persistence: browserLocalPersistence,
  popupRedirectResolver: browserPopupRedirectResolver
});
export const db = getDatabase(app);
// WebSockets are preferred for database connection. Long polling is commented out to avoid timeouts.
// try {
//   forceLongPolling(db);
// } catch (err) {
//   console.warn("Failed to force long polling:", err);
// }
export const googleProvider = new GoogleAuthProvider();

export default app;
