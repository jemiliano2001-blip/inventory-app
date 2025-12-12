// src/types/inventory.ts

/**
 * Firebase Timestamp interface
 */
export interface FirebaseTimestamp {
  seconds: number;
  nanoseconds: number;
  toMillis(): number;
  toDate(): Date;
}

/**
 * Category type - string literal for strict typing
 * Extend this union as needed when new categories are added
 */
export type Category = 
  | 'Sin categoría'
  | 'Electrónica'
  | 'Herramientas'
  | 'Oficina'
  | 'Consumibles'
  | string; // Allow custom categories

/**
 * Unit of measurement
 */
export type Unit = 
  | 'pza'
  | 'kg'
  | 'lt'
  | 'mt'
  | 'caja'
  | 'paquete'
  | string;

/**
 * Transaction type enumeration
 */
export type TransactionType = 
  | 'Entrada'
  | 'Salida'
  | 'Ajuste'
  | 'Ajuste Positivo'
  | 'Ajuste Negativo'
  | 'Creación'
  | 'Eliminado'
  | 'Intercambio'
  | 'Préstamo'
  | 'Devolución'
  | 'Baja';

/**
 * Main InventoryItem interface
 */
export interface InventoryItem {
  id: string;
  description: string;
  category: Category;
  stock: number;
  minStock: number;
  unit: Unit;
  name?: string;
  code?: string;
  location?: string;
  supplier?: string;
  notes?: string;
  isReturnable?: boolean;
  image?: string;
  barcode?: string;
  tags?: string[];
  lastRestockDate?: FirebaseTimestamp;
}

/**
 * Transaction interface - history of inventory movements
 */
export interface Transaction {
  id: string;
  itemId: string;
  itemDescription: string;
  type: TransactionType;
  quantity: number;
  timestamp: FirebaseTimestamp;
  user: string;
  notes?: string;
  supplier?: string;
  borrower?: string;
}

/**
 * Active loan interface - returnable items currently borrowed
 */
export interface ActiveLoan {
  id: string;
  itemId: string;
  itemDescription: string;
  borrower: string;
  loanedAt: FirebaseTimestamp;
  returnedAt: FirebaseTimestamp | null;
}

/**
 * Shopping list item interface
 */
export interface ShoppingListItem {
  id: string;
  description: string;
  category: Category;
  quantity: number;
  unit: Unit;
  priority?: 'low' | 'medium' | 'high';
  notes?: string;
  addedAt: FirebaseTimestamp;
  addedBy: string;
}

/**
 * User interface
 */
export interface User {
  id: string;
  email: string;
  role: 'admin' | 'operator' | 'viewer';
}

/**
 * Settings interface - application configuration
 */
export interface AppSettings {
  itemsPerPage: number;
  defaultUnit: Unit;
  defaultMinStock: number;
  sessionTimeout: number;
  enableAuditLog: boolean;
  barcodeScanning: boolean;
  customValidations: {
    maxQuantityPerTransaction: number;
    requireNotesForLargeTransactions: boolean;
    preventNegativeStock: boolean;
  };
  displayPreferences: {
    tableDensity: 'compact' | 'comfortable' | 'spacious';
    defaultView: 'table' | 'grid' | 'list';
    showColumnLines: boolean;
    enableRowHover: boolean;
    showStockBadges: boolean;
  };
  operationalPreferences: {
    confirmBeforeDelete: boolean;
    defaultTransactionType: TransactionType;
    showRecentItems: boolean;
    recentItemsCount: number;
    enableKeyboardShortcuts: boolean;
    enableBulkOperations: boolean;
    showAdvancedFilters: boolean;
  };
  dashboardCustomization: {
    showStockOverview: boolean;
    showRecentTransactions: boolean;
    showLowStockAlerts: boolean;
    showQuickActions: boolean;
    chartType: 'line' | 'bar' | 'pie' | 'area';
    defaultDateRange: '7d' | '30d' | '90d' | '1y' | 'all';
    refreshInterval: number;
  };
  backup: {
    autoBackup: boolean;
    backupFrequency: 'daily' | 'weekly' | 'monthly';
    lastBackupDate: string | null;
  };
  lowStockNotifications: boolean;
  notificationEmails: string;
  stockAlertDays: number[];
  enableScheduledReports: boolean;
  categories: Category[];
}

/**
 * Application state interface
 */
export interface AppState {
  inventory: InventoryItem[];
  activeLoans: ActiveLoan[];
  transactions: Transaction[];
  shoppingList: ShoppingListItem[];
  categories: Category[];
  allUsers: User[];
  searchIndex: Map<string, InventoryItem>;
  currentUser: User | null;
  userRole: 'admin' | 'operator' | 'viewer';
  currentPage: number;
  itemsPerPage: number;
  searchTerm: string;
  activeCategory: Category | 'Todas';
  inventoryFilter: 'all' | 'low' | 'returnable';
  aiSearchResults: string[] | null;
  isInitialized: boolean;
  historyFilters: {
    dateFrom: string | null;
    dateTo: string | null;
    responsible: string;
    quantityMin: number | null;
    quantityMax: number | null;
  };
  historySortBy: 'date' | 'quantity' | 'responsible' | 'item';
  historySortOrder: 'asc' | 'desc';
  historyViewMode: 'table' | 'cards';
  historyCurrentPage: number;
  settings: AppSettings;
}

/**
 * CSV Import row interface
 */
export interface CSVImportRow {
  Nombre: string;
  Categoría?: string;
  Stock: string | number;
  Unidad: string;
  'Stock Mínimo': string | number;
  Código?: string;
  Proveedor?: string;
  Ubicación?: string;
  Descripción?: string;
}

/**
 * Validation result interface
 */
export interface ValidationResult {
  valid: boolean;
  error: string | null;
  value?: string | number;
}

/**
 * Backup data interface
 */
export interface BackupData {
  timestamp: string;
  inventory: InventoryItem[];
  transactions: Transaction[];
  activeLoans: ActiveLoan[];
  shoppingList: ShoppingListItem[];
  settings: AppSettings;
  categories: Category[];
}
