'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { transactionService } from '@/lib/firestore';
import { Transaction } from '@/types/inventory';

function HistoryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [filterType, setFilterType] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = transactionService.subscribe((data) => {
      const sorted = [...data].sort((a, b) => 
        b.timestamp.seconds - a.timestamp.seconds
      );
      setTransactions(sorted);
      setFilteredTransactions(sorted);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let filtered = transactions;

    if (filterType !== 'Todos') {
      filtered = filtered.filter(t => t.type === filterType);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.itemDescription.toLowerCase().includes(query) ||
        t.user.toLowerCase().includes(query) ||
        t.notes?.toLowerCase().includes(query)
      );
    }

    setFilteredTransactions(filtered);
  }, [filterType, searchQuery, transactions]);

  const formatDate = (timestamp: any): string => {
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'Entrada':
        return (
          <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
            <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'Salida':
        return (
          <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'Préstamo':
        return (
          <div className="h-10 w-10 bg-yellow-100 rounded-lg flex items-center justify-center">
            <svg className="h-5 w-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
        );
      case 'Devolución':
        return (
          <div className="h-10 w-10 bg-teal-100 rounded-lg flex items-center justify-center">
            <svg className="h-5 w-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
          </div>
        );
      case 'Creación':
        return (
          <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
        );
      case 'Eliminación':
        return (
          <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center">
            <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  const transactionTypes = ['Todos', 'Entrada', 'Salida', 'Préstamo', 'Devolución', 'Creación', 'Eliminación', 'Modificación', 'Ajuste Positivo', 'Ajuste Negativo'];

  return (
    <DashboardLayout title="Historial" subtitle="Registro de transacciones del inventario">
      <div className="space-y-6">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Filtrar por tipo
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all"
              >
                {transactionTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Buscar
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por artículo, usuario o notas..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Transacciones</p>
                <p className="text-3xl font-bold text-gray-900">{filteredTransactions.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Entradas</p>
                <p className="text-3xl font-bold text-green-600">
                  {filteredTransactions.filter(t => t.type === 'Entrada').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Salidas</p>
                <p className="text-3xl font-bold text-blue-600">
                  {filteredTransactions.filter(t => t.type === 'Salida').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Préstamos</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {filteredTransactions.filter(t => t.type === 'Préstamo').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Transacciones</h2>
          </div>

          <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
            {isLoading ? (
              <div className="p-12 text-center">
                <svg className="animate-spin h-8 w-8 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="mt-4 text-gray-500">Cargando transacciones...</p>
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="p-12 text-center">
                <svg className="h-16 w-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mt-4">No hay transacciones</h3>
                <p className="text-gray-500 mt-2">No se encontraron transacciones con los filtros aplicados</p>
              </div>
            ) : (
              filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-4">
                    {getTransactionIcon(transaction.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-gray-900">{transaction.itemDescription}</h3>
                        <span className={`text-sm font-semibold ${
                          transaction.type === 'Entrada' || transaction.type === 'Ajuste Positivo' || transaction.type === 'Devolución'
                            ? 'text-green-600'
                            : transaction.type === 'Salida' || transaction.type === 'Ajuste Negativo' || transaction.type === 'Préstamo'
                            ? 'text-red-600'
                            : 'text-gray-600'
                        }`}>
                          {transaction.type === 'Entrada' || transaction.type === 'Ajuste Positivo' || transaction.type === 'Devolución' ? '+' : 
                           transaction.type === 'Salida' || transaction.type === 'Ajuste Negativo' || transaction.type === 'Préstamo' ? '-' : ''}
                          {transaction.quantity}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="font-semibold">{transaction.type}</span> por {transaction.user}
                      </p>
                      {transaction.notes && (
                        <p className="text-sm text-gray-500 mt-1">{transaction.notes}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-2">{formatDate(transaction.timestamp)}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function HistoryPageWrapper() {
  return (
    <ProtectedRoute>
      <HistoryPage />
    </ProtectedRoute>
  );
}
