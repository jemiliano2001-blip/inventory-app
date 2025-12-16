import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { getAuthInstance } from './firebase';

export const authService = {
  signIn: async (email: string, password: string): Promise<User> => {
    const auth = getAuthInstance();
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  },

  signOut: async (): Promise<void> => {
    const auth = getAuthInstance();
    await firebaseSignOut(auth);
  },

  getCurrentUser: (): User | null => {
    const auth = getAuthInstance();
    return auth.currentUser;
  },

  onAuthStateChanged: (callback: (user: User | null) => void): (() => void) => {
    const auth = getAuthInstance();
    return onAuthStateChanged(auth, callback);
  },
};
