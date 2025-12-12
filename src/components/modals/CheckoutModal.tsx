'use client';

import { useState, FormEvent } from 'react';
import { inventoryService, transactionService, loanService } from '@/lib/firestore';
import { InventoryItem } from '@/types/inventory';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryItem | null;
  currentUser: string;
}

type CheckoutType = 'salida' | 'prestamo';

export const CheckoutModal = ({ isOpen, onClose, item, currentUser }: CheckoutModalProps) => {
  const [checkoutType, setCheckoutType] = useState<CheckoutType>('salida');
  const [quantity, setQuantity] = useState<number>(1);
  const [borrower, setBorrower] = useState<string>('');
  const [returnDate, setReturnDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const resetForm = (): void => {
    setCheckoutType('salida');
    setQuantity(1);
    setBorrower('');
    setReturnDate('');
    setNotes('');
    setErrorMessage('');
  };

  const handleClose = (): void => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!item) return;

    if (quantity > item.stock) {
      setErrorMessage('La cantidad excede el stock disponible');
      return;
    }

    if (checkoutType === 'prestamo' && !borrower.trim()) {
      setErrorMessage('Debes especificar quién recibe el préstamo');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    try {
      const newStock = item.stock - quantity;
      await inventoryService.update(item.id, { stock: newStock });

      if (checkoutType === 'prestamo') {
        await loanService.create({
          itemId: item.id,
          itemDescription: item.description,
          quantity,
          borrower: borrower.trim(),
          loanDate: new Date().toISOString(),
          expectedReturnDate: returnDate ? new Date(returnDate).toISOString() : null,
          notes: notes.trim(),
          isReturned: false,
        });

        await transactionService.create({
          itemId: item.id,
          itemDescription: item.description,
          type: 'Préstamo',
          quantity,
          user: currentUser,
          notes: `Préstamo a ${borrower.trim()}`,
        });
      } else {
        await transactionService.create({
          itemId: item.id,
          itemDescription: item.description,
          type: 'Salida',
          quantity,
          user: currentUser,
          notes: notes.trim() || 'Salida de stock',
        });
      }

      handleClose();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Error al registrar salida';
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
            <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Registrar Salida</h2>
              <p className="text-sm text-gray-500">Retirar stock del inventario</p>
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
              Stock disponible: <span className="font-semibold">{item.stock} {item.unit}</span>
            </p>
          </div>

          {/* Checkout Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tipo de Salida *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setCheckoutType('salida')}
                className={`p-3 border-2 rounded-xl font-medium transition-all ${
                  checkoutType === 'salida'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                Salida
              </button>
              <button
                type="button"
                onClick={() => setCheckoutType('prestamo')}
                className={`p-3 border-2 rounded-xl font-medium transition-all ${
                  checkoutType === 'prestamo'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                Préstamo
              </button>
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label htmlFor="quantity" className="block text-sm font-semibold text-gray-700 mb-2">
              Cantidad *
            </label>
            <input
              id="quantity"
              type="number"
              required
              min="1"
              max={item.stock}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
              placeholder="1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Stock restante: <span className="font-semibold">{Math.max(0, item.stock - quantity)} {item.unit}</span>
            </p>
          </div>

          {/* Borrower (only for loans) */}
          {checkoutType === 'prestamo' && (
            <>
              <div>
                <label htmlFor="borrower" className="block text-sm font-semibold text-gray-700 mb-2">
                  Prestado a *
                </label>
                <input
                  id="borrower"
                  type="text"
                  required
                  value={borrower}
                  onChange={(e) => setBorrower(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
                  placeholder="Nombre de la persona"
                />
              </div>

              <div>
                <label htmlFor="returnDate" className="block text-sm font-semibold text-gray-700 mb-2">
                  Fecha esperada de devolución
                </label>
                <input
                  id="returnDate"
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
                />
              </div>
            </>
          )}

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-2">
              Notas
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all resize-none"
              placeholder="Información adicional (opcional)"
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
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Registrando...</span>
                </>
              ) : (
                <span>Registrar Salida</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
