import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  writeBatch,
  onSnapshot,
  Timestamp,
  type DocumentData,
  type QueryConstraint,
} from 'firebase/firestore';
import { db } from './firebase';
import type {
  InventoryItem,
  Transaction,
  ActiveLoan,
  ShoppingListItem,
  AppSettings,
} from '@/types/inventory';

// Collection references
export const COLLECTIONS = {
  INVENTORY: 'inventory',
  TRANSACTIONS: 'transactions',
  LOANS: 'loans',
  SHOPPING_LIST: 'shoppingList',
  SETTINGS: 'settings',
  USERS: 'users',
} as const;

// Inventory CRUD operations
export const inventoryService = {
  getAll: async (): Promise<InventoryItem[]> => {
    const snapshot = await getDocs(collection(db, COLLECTIONS.INVENTORY));
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as InventoryItem[];
  },

  getById: async (id: string): Promise<InventoryItem | null> => {
    const docRef = doc(db, COLLECTIONS.INVENTORY, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists()
      ? ({ id: docSnap.id, ...docSnap.data() } as InventoryItem)
      : null;
  },

  create: async (
    item: Omit<InventoryItem, 'id'>
  ): Promise<{ id: string; item: InventoryItem }> => {
    const docRef = await addDoc(collection(db, COLLECTIONS.INVENTORY), item);
    return {
      id: docRef.id,
      item: { id: docRef.id, ...item } as InventoryItem,
    };
  },

  update: async (
    id: string,
    updates: Partial<Omit<InventoryItem, 'id'>>
  ): Promise<void> => {
    const docRef = doc(db, COLLECTIONS.INVENTORY, id);
    await updateDoc(docRef, updates);
  },

  delete: async (id: string): Promise<void> => {
    await deleteDoc(doc(db, COLLECTIONS.INVENTORY, id));
  },

  updateStock: async (id: string, newStock: number): Promise<void> => {
    const docRef = doc(db, COLLECTIONS.INVENTORY, id);
    await updateDoc(docRef, { stock: newStock });
  },

  subscribe: (
    callback: (items: InventoryItem[]) => void
  ): (() => void) => {
    const unsubscribe = onSnapshot(
      collection(db, COLLECTIONS.INVENTORY),
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as InventoryItem[];
        callback(items);
      }
    );
    return unsubscribe;
  },
};

// Transaction operations
export const transactionService = {
  getAll: async (): Promise<Transaction[]> => {
    const snapshot = await getDocs(
      query(
        collection(db, COLLECTIONS.TRANSACTIONS),
        orderBy('timestamp', 'desc')
      )
    );
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Transaction[];
  },

  create: async (
    transaction: Omit<Transaction, 'id' | 'timestamp'>
  ): Promise<string> => {
    const docRef = await addDoc(collection(db, COLLECTIONS.TRANSACTIONS), {
      ...transaction,
      timestamp: serverTimestamp(),
    });
    return docRef.id;
  },

  delete: async (id: string): Promise<void> => {
    await deleteDoc(doc(db, COLLECTIONS.TRANSACTIONS, id));
  },

  subscribe: (
    callback: (transactions: Transaction[]) => void
  ): (() => void) => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, COLLECTIONS.TRANSACTIONS),
        orderBy('timestamp', 'desc')
      ),
      (snapshot) => {
        const transactions = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Transaction[];
        callback(transactions);
      }
    );
    return unsubscribe;
  },
};

// Loans operations
export const loanService = {
  getActive: async (): Promise<ActiveLoan[]> => {
    const snapshot = await getDocs(
      query(collection(db, COLLECTIONS.LOANS), where('returnedAt', '==', null))
    );
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ActiveLoan[];
  },

  create: async (loan: Omit<ActiveLoan, 'id'>): Promise<string> => {
    const docRef = await addDoc(collection(db, COLLECTIONS.LOANS), loan);
    return docRef.id;
  },

  markReturned: async (id: string): Promise<void> => {
    const docRef = doc(db, COLLECTIONS.LOANS, id);
    await updateDoc(docRef, { returnedAt: serverTimestamp() });
  },

  subscribe: (callback: (loans: ActiveLoan[]) => void): (() => void) => {
    const unsubscribe = onSnapshot(
      query(collection(db, COLLECTIONS.LOANS), where('returnedAt', '==', null)),
      (snapshot) => {
        const loans = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ActiveLoan[];
        callback(loans);
      }
    );
    return unsubscribe;
  },
};

// Shopping list operations
export const shoppingListService = {
  getAll: async (): Promise<ShoppingListItem[]> => {
    const snapshot = await getDocs(collection(db, COLLECTIONS.SHOPPING_LIST));
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ShoppingListItem[];
  },

  create: async (item: Omit<ShoppingListItem, 'id'>): Promise<string> => {
    const docRef = await addDoc(collection(db, COLLECTIONS.SHOPPING_LIST), item);
    return docRef.id;
  },

  delete: async (id: string): Promise<void> => {
    await deleteDoc(doc(db, COLLECTIONS.SHOPPING_LIST, id));
  },

  subscribe: (
    callback: (items: ShoppingListItem[]) => void
  ): (() => void) => {
    const unsubscribe = onSnapshot(
      collection(db, COLLECTIONS.SHOPPING_LIST),
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ShoppingListItem[];
        callback(items);
      }
    );
    return unsubscribe;
  },
};

// Settings operations
export const settingsService = {
  get: async (): Promise<AppSettings | null> => {
    const docRef = doc(db, COLLECTIONS.SETTINGS, 'global');
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as AppSettings) : null;
  },

  update: async (settings: Partial<AppSettings>): Promise<void> => {
    const docRef = doc(db, COLLECTIONS.SETTINGS, 'global');
    await updateDoc(docRef, settings);
  },
};

// Batch operations helper
export const createBatch = () => writeBatch(db);

// Server timestamp helper
export { serverTimestamp, Timestamp };
