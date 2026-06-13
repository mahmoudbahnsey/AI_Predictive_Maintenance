import { initializeApp } from 'firebase/app';
import { getDatabase, ref, update } from 'firebase/database';
import fs from 'fs';

// Read .env file for config
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
const db = getDatabase(app);

const userRef = ref(db, 'users/jywNexFQEZXUHY5XmDiGuiVr3EK2');
update(userRef, { role: 'admin', status: 'approved' })
  .then(() => {
    console.log('User successfully updated to admin and approved');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Failed to update user', err);
    process.exit(1);
  });
