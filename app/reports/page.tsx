'use client';

import { DashboardLayout } from '@/components/DashboardLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';

function ReportsPage(): JSX.Element {
  return (
    <DashboardLayout title="Reportes" subtitle="Análisis y reportes del inventario">
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-12 max-w-md w-full text-center">
          <div className="mb-6">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Próximamente</h2>
          <p className="text-gray-600">
            Esta funcionalidad está en desarrollo. Los reportes estarán disponibles pronto.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}

function ReportsPageWrapper(): JSX.Element {
  return (
    <ProtectedRoute>
      <ReportsPage />
    </ProtectedRoute>
  );
}

export default ReportsPageWrapper;

