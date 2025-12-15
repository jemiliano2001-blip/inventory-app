import { create } from 'zustand';
import type { InventoryItem } from '@/types/inventory';

interface InventoryStore {
  inventory: InventoryItem[];
  // Actions
  setInventory: (items: InventoryItem[]) => void;
  addItem: (item: Omit<InventoryItem, 'id'>) => InventoryItem;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<Omit<InventoryItem, 'id'>>) => void;
  updateStock: (id: string, newStock: number) => void;
  incrementStock: (id: string, quantity: number) => void;
  decrementStock: (id: string, quantity: number) => void;
  getItemById: (id: string) => InventoryItem | undefined;
  getLowStockItems: () => InventoryItem[];
  getItemsByCategory: (category: string) => InventoryItem[];
}

export const useInventoryStore = create<InventoryStore>((set, get) => ({
  inventory: [],

  setInventory: (items: InventoryItem[]) => {
    set({ inventory: items });
  },

  addItem: (itemData: Omit<InventoryItem, 'id'>) => {
    const newItem: InventoryItem = {
      ...itemData,
      id: crypto.randomUUID(),
    };
    
    set((state) => ({
      inventory: [...state.inventory, newItem],
    }));
    
    return newItem;
  },

  removeItem: (id: string) => {
    set((state) => ({
      inventory: state.inventory.filter((item) => item.id !== id),
    }));
  },

  updateItem: (id: string, updates: Partial<Omit<InventoryItem, 'id'>>) => {
    set((state) => ({
      inventory: state.inventory.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    }));
  },

  updateStock: (id: string, newStock: number) => {
    set((state) => ({
      inventory: state.inventory.map((item) =>
        item.id === id ? { ...item, stock: newStock } : item
      ),
    }));
  },

  incrementStock: (id: string, quantity: number) => {
    if (quantity <= 0) return;
    set((state) => ({
      inventory: state.inventory.map((item) =>
        item.id === id ? { ...item, stock: item.stock + quantity } : item
      ),
    }));
  },

  decrementStock: (id: string, quantity: number) => {
    if (quantity <= 0) return;
    set((state) => ({
      inventory: state.inventory.map((item) => {
        if (item.id === id) {
          const newStock = item.stock - quantity;
          return { ...item, stock: Math.max(0, newStock) };
        }
        return item;
      }),
    }));
  },

  getItemById: (id: string) => {
    return get().inventory.find((item) => item.id === id);
  },

  getLowStockItems: () => {
    return get().inventory.filter((item) => item.stock <= item.minStock);
  },

  getItemsByCategory: (category: string) => {
    if (category === 'Todas') {
      return get().inventory;
    }
    return get().inventory.filter((item) => item.category === category);
  },
}));
