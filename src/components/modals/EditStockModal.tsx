'use client';

import { useState, FormEvent } from 'react';
import { inventoryService, transactionService } from '@/lib/firestore';
import { InventoryItem } from '@/types/inventory';

interface EditStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryItem | null;
  currentUser: string;
}

type AdjustmentType = 'set' | 'add' | 'subtract';

export const EditStockModal = ({ isOpen, onClose, item, currentUser }: EditStockModalProps) => {
  const [adjustmentType, setAdjustmentType] = useState<AdjustmentType>('set');
  const [amount, setAmount] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const resetForm = (): void => {
    setAdjustmentType('set');
    setAmount(0);
    setNotes('');
    setErrorMessage('');
  };

  const handleClose = (): void => {
    resetForm();
    onClose();
  };

  const calculateNewStock = (): number => {
    if (!item) return 0;

    switch (adjustmentType) {
      case 'set':
        return amount;
      case 'add':
        return item.stock + amount;
      case 'subtract':
        return Math.max(0, item.stock - amount);
      default:
        return item.stock;
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!item) return;

    const newStock = calculateNewStock();

    if (newStock < 0) {
      setErrorMessage('El stock no puede ser negativo');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    try {
      await inventoryService.update(item.id, { stock: newStock });

      const difference = newStock - item.stock;
      const transactionType = difference > 0 ? 'Ajuste +' : 'Ajuste -';

      await transactionService.create({
        itemId: item.id,
        itemDescription: item.description,
        type: transactionType,
        quantity: Math.abs(difference),
        user: currentUser,
        notes: notes.trim() || `Ajuste manual de stock: ${item.stock} → ${newStock}`,
      });

      handleClose();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Error al ajustar stock';
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-orange-600 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Editar Stock</h2>
              <p className="text-sm text-gray-500">Ajuste manual de inventario</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Cerrar modal"
          >
            <svg className="h-6 w-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Item Info */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <p className="text-sm font-semibold text-gray-700">Artículo</p>
            <p className="text-lg font-bold text-gray-900">{item.description}</p>
            <p className="text-sm text-gray-600 mt-1">
              Stock actual: <span className="font-semibold">{item.stock} {item.unit}</span>
            </p>
          </div>

          {/* Adjustment Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tipo de Ajuste *
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setAdjustmentType('set')}
                className={`p-3 border-2 rounded-xl font-medium transition-all text-sm ${
                  adjustmentType === 'set'
                    ? 'border-orange-600 bg-orange-50 text-orange-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                Establecer
              </button>
              <button
                type="button"
                onClick={() => setAdjustmentType('add')}
                className={`p-3 border-2 rounded-xl font-medium transition-all text-sm ${
                  adjustmentType === 'add'
                    ? 'border-orange-600 bg-orange-50 text-orange-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                Sumar
              </button>
              <button
                type="button"
                onClick={() => setAdjustmentType('subtract')}
                className={`p-3 border-2 rounded-xl font-medium transition-all text-sm ${
                  adjustmentType === 'subtract'
                    ? 'border-orange-600 bg-orange-50 text-orange-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                Restar
              </button>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-sm font-semibold text-gray-700 mb-2">
              {adjustmentType === 'set' ? 'Nuevo Stock' : 'Cantidad'} *
            </label>
            <input
              id="amount"
              type="number"
              required
              min="0"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-orange-600 transition-all"
              placeholder="0"
            />
            <p className="text-xs text-gray-500 mt-1">
              Stock resultante: <span className="font-semibold">{calculateNewStock()} {item.unit}</span>
            </p>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-2">
              Motivo del Ajuste *
            </label>
            <textarea
              id="notes"
              required
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-orange-600 transition-all resize-none"
              placeholder="Ej: Corrección por inventario físico, merma, pérdida, etc."
            />
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
              <div className="flex items-center space-x-2 text-red-600">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium">{errorMessage}</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors font-medium disabled:opacity-50 flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Guardando...</span>
                </>
              ) : (
                <span>Aplicar Ajuste</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
