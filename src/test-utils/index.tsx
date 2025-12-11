import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { AuthProvider } from '@/contexts/AuthContext'

interface AllProvidersProps {
  children: React.ReactNode
}

const AllProviders = ({ children }: AllProvidersProps): JSX.Element => {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }

// Mock data helpers
export const mockInventoryItem = {
  id: 'test-item-1',
  description: 'Test Item',
  category: 'Test Category',
  unit: 'pza',
  stock: 100,
  minStock: 10,
  location: 'Warehouse A',
  isReturnable: true,
  notes: 'Test notes',
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: 'test@example.com',
}

export const mockTransaction = {
  id: 'test-transaction-1',
  itemId: 'test-item-1',
  itemDescription: 'Test Item',
  type: 'Entrada' as const,
  quantity: 10,
  user: 'test@example.com',
  timestamp: new Date(),
  notes: 'Test transaction',
}

export const mockLoan = {
  id: 'test-loan-1',
  itemId: 'test-item-1',
  itemDescription: 'Test Item',
  borrower: 'John Doe',
  quantity: 5,
  loanDate: new Date(),
  dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  returnedAt: null,
  notes: 'Test loan',
}

export const mockUser = {
  uid: 'test-user-id',
  email: 'test@example.com',
  displayName: 'Test User',
  emailVerified: true,
}
