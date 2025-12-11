'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { InventoryTable } from '@/components/InventoryTable';
import { useInventoryStore } from '@/store/inventoryStore';
import { useFirebaseInventory } from '@/hooks/useFirebaseInventory';
import { useAuth } from '@/contexts/AuthContext';
import { AddItemModal } from '@/components/modals/AddItemModal';
import { EditItemModal } from '@/components/modals/EditItemModal';
import { DeleteItemModal } from '@/components/modals/DeleteItemModal';
import { EntryModal } from '@/components/modals/EntryModal';
import { CheckoutModal } from '@/components/modals/CheckoutModal';
import { EditStockModal } from '@/components/modals/EditStockModal';

function InventoryPage(): JSX.Element {
  useFirebaseInventory();
  
  const { user } = useAuth();
  const inventory = useInventoryStore((state) => state.inventory);
  const [isAdmin] = useState<boolean>(true);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showEntryModal, setShowEntryModal] = useState<boolean>(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState<boolean>(false);
  const [showEditStockModal, setShowEditStockModal] = useState<boolean>(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const currentUser = user?.email || 'unknown@example.com';

  const selectedItem = selectedItemId 
    ? inventory.find(item => item.id === selectedItemId) || null
    : null;

  const handleEntry = (itemId: string): void => {
    setSelectedItemId(itemId);
    setShowEntryModal(true);
  };

  const handleCheckout = (itemId: string): void => {
    setSelectedItemId(itemId);
    setShowCheckoutModal(true);
  };

  const handleAddToCart = (itemId: string): void => {
    // TODO: Implement shopping cart functionality
  };

  const handleEdit = (itemId: string): void => {
    setSelectedItemId(itemId);
    setShowEditModal(true);
  };

  const handleEditStock = (itemId: string): void => {
    setSelectedItemId(itemId);
    setShowEditStockModal(true);
  };

  const handleDelete = (itemId: string): void => {
    setSelectedItemId(itemId);
    setShowDeleteModal(true);
  };

  const handleAddItem = (): void => {
    setShowAddModal(true);
  };

  return (
    <DashboardLayout title="Inventario" subtitle="Gestión de artículos y stock">
      <div className="space-y-6">
        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleAddItem}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium shadow-lg hover:shadow-xl"
              aria-label="Agregar nuevo artículo"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Agregar Artículo</span>
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <button
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              aria-label="Exportar inventario"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Exportar</span>
            </button>
            <button
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              aria-label="Importar inventario"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span>Importar</span>
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Artículos</p>
                <p className="text-3xl font-bold text-gray-900">{inventory.length}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Stock Bajo</p>
                <p className="text-3xl font-bold text-red-600">
                  {inventory.filter(item => item.stock < item.minStock).length}
                </p>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Categorías</p>
                <p className="text-3xl font-bold text-purple-600">
                  {new Set(inventory.map(item => item.category)).size}
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        <InventoryTable
          items={inventory}
          isAdmin={isAdmin}
          onEntry={handleEntry}
          onCheckout={handleCheckout}
          onAddToCart={handleAddToCart}
          onEdit={handleEdit}
          onEditStock={handleEditStock}
          onDelete={handleDelete}
        />
      </div>

      {/* Modals */}
      <AddItemModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
        currentUser={currentUser}
      />
      <EditItemModal 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)} 
        item={selectedItem}
        currentUser={currentUser}
      />
      <DeleteItemModal 
        isOpen={showDeleteModal} 
        onClose={() => setShowDeleteModal(false)} 
        item={selectedItem}
        currentUser={currentUser}
      />
      <EntryModal 
        isOpen={showEntryModal} 
        onClose={() => setShowEntryModal(false)} 
        item={selectedItem}
        currentUser={currentUser}
      />
      <CheckoutModal 
        isOpen={showCheckoutModal} 
        onClose={() => setShowCheckoutModal(false)} 
        item={selectedItem}
        currentUser={currentUser}
      />
      <EditStockModal 
        isOpen={showEditStockModal} 
        onClose={() => setShowEditStockModal(false)} 
        item={selectedItem}
        currentUser={currentUser}
      />
    </DashboardLayout>
  );
}

export default function InventoryPageWrapper(): JSX.Element {
  return (
    <ProtectedRoute>
      <InventoryPage />
    </ProtectedRoute>
  );
}
