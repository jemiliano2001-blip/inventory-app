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

// Force dynamic rendering to prevent prerendering during build
export const dynamic = 'force-dynamic';

function InventoryPage() {
  useFirebaseInventory();
  
  const { user } = useAuth();
  const inventory = useInventoryStore((state) => state.inventory);
  const isAdmin = true; // TODO: Obtener del rol del usuario cuando se implemente el sistema de roles
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showEntryModal, setShowEntryModal] = useState<boolean>(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState<boolean>(false);
  const [showEditStockModal, setShowEditStockModal] = useState<boolean>(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const currentUser = user?.email ?? 'sistema@inventario.local';

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
    const item = inventory.find((item) => item.id === itemId);
    if (item) {
      // Redirigir a la página de compras con el artículo seleccionado
      // La funcionalidad completa se implementará en la página de compras
    }
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
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <button
            onClick={handleAddItem}
            className="flex items-center space-x-2 px-5 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all shadow-md hover:shadow-lg text-sm font-medium"
            aria-label="Agregar nuevo artículo"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Agregar Artículo</span>
          </button>
          
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 transition-colors text-sm font-medium"
              aria-label="Exportar inventario"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Exportar</span>
            </button>
            <button
              className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 transition-colors text-sm font-medium"
              aria-label="Importar inventario"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span>Importar</span>
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center justify-between hover:shadow-md transition-shadow duration-200">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Total Artículos</p>
              <p className="text-3xl font-bold text-slate-900 tracking-tight">{inventory.length}</p>
            </div>
            <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-100">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center justify-between hover:shadow-md transition-shadow duration-200">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Stock Bajo</p>
              <div className="flex items-baseline space-x-2">
                <p className="text-3xl font-bold text-red-600 tracking-tight">
                    {inventory.filter(item => item.stock < item.minStock).length}
                </p>
                <span className="text-xs font-medium text-red-500 bg-red-50 px-2 py-0.5 rounded-full">Atención</span>
              </div>
            </div>
            <div className="h-12 w-12 bg-red-50 rounded-lg flex items-center justify-center border border-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center justify-between hover:shadow-md transition-shadow duration-200">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Categorías</p>
              <p className="text-3xl font-bold text-purple-600 tracking-tight">
                {new Set(inventory.map(item => item.category)).size}
              </p>
            </div>
            <div className="h-12 w-12 bg-purple-50 rounded-lg flex items-center justify-center border border-purple-100">
              <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
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

export default function InventoryPageWrapper() {
  return (
    <ProtectedRoute>
      <InventoryPage />
    </ProtectedRoute>
  );
}
