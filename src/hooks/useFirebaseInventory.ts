import { useEffect } from 'react';
import { useInventoryStore } from '@/store/inventoryStore';
import { inventoryService } from '@/lib/firestore';

export const useFirebaseInventory = () => {
  const setInventory = useInventoryStore((state) => state.setInventory);

  useEffect(() => {
    const unsubscribe = inventoryService.subscribe((items) => {
      setInventory(items);
    });

    return () => unsubscribe();
  }, [setInventory]);
};
