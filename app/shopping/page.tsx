'use client';

import { DashboardLayout } from '@/components/DashboardLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';

function ShoppingPage(): JSX.Element {
  return (
    <DashboardLayout title="Lista de Compras" subtitle="Gestión de lista de compras">
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-12 max-w-md w-full text-center">
          <div className="mb-6">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Próximamente</h2>
          <p className="text-gray-600">
            La funcionalidad de Lista de Compras estará disponible pronto.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}

function ShoppingPageWrapper(): JSX.Element {
  return (
    <ProtectedRoute>
      <ShoppingPage />
    </ProtectedRoute>
  );
}

export default ShoppingPageWrapper;

