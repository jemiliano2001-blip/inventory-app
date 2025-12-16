import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Lazy initialization - Firebase app is only created when actually needed
let firebaseApp: FirebaseApp | null = null;

const getFirebaseApp = (): FirebaseApp => {
  // Prevent execution during SSR/build time
  if (typeof window === 'undefined') {
    throw new Error('Firebase cannot be initialized during server-side rendering');
  }

  // Return existing instance if already initialized
  if (firebaseApp) {
    return firebaseApp;
  }

  // Check for existing Firebase apps
  const existingApps = getApps();
  if (existingApps.length > 0) {
    firebaseApp = existingApps[0];
    return firebaseApp;
  }

  // Validate environment variables
  if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
    throw new Error('Firebase API key is not configured. Please set NEXT_PUBLIC_FIREBASE_API_KEY in your environment variables.');
  }

  // Initialize new Firebase app
  firebaseApp = initializeApp(firebaseConfig);
  return firebaseApp;
};

// Lazy getter functions for Firebase services
export const getAuthInstance = (): Auth => {
  return getAuth(getFirebaseApp());
};

export const getFirestoreInstance = (): Firestore => {
  return getFirestore(getFirebaseApp());
};

export const getStorageInstance = (): FirebaseStorage => {
  return getStorage(getFirebaseApp());
};

// Export app getter for backwards compatibility if needed
export const getAppInstance = (): FirebaseApp => {
  return getFirebaseApp();
};
