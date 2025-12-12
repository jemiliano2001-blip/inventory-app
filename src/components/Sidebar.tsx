'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface NavLinkProps {
  href: string;
  icon: React.ReactElement;
  label: string;
  badge?: number;
  isActive?: boolean;
}

const NavLink = ({ href, icon, label, badge, isActive }: NavLinkProps) => {
  return (
    <a
      href={href}
      className={`flex items-center space-x-3 py-2.5 px-4 rounded-lg transition-all duration-200 group relative ${
        isActive
          ? 'bg-slate-900 text-white shadow-md'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      }`}
      aria-label={`Ir a ${label}`}
      aria-current={isActive ? 'page' : undefined}
    >
      <div className={`h-6 w-6 flex items-center justify-center transition-colors ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-900'}`}>
        {icon}
      </div>
      <span className="font-medium text-sm">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </a>
  );
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();

  const handleLogout = async (): Promise<void> => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`bg-white w-72 h-screen fixed md:static inset-y-0 left-0 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out z-50 flex flex-col border-r border-slate-200 shadow-xl md:shadow-none`}
        role="complementary"
        aria-label="Barra lateral de navegación"
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-slate-100">
          <a href="/dashboard" className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-lg bg-slate-900 flex items-center justify-center shadow-lg">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <span className="block text-lg font-bold text-slate-900 leading-none">Inventario</span>
              <span className="text-xs font-medium text-slate-500">Sistema Central</span>
            </div>
          </a>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1" role="navigation" aria-label="Navegación principal">
          <NavLink
            href="/dashboard"
            label="Dashboard"
            isActive={pathname === '/dashboard'}
            icon={
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            }
          />
          <NavLink
            href="/inventory"
            label="Inventario"
            isActive={pathname === '/inventory'}
            icon={
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            }
          />
          <NavLink
            href="/loans"
            label="Préstamos"
            isActive={pathname === '/loans'}
            icon={
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            }
          />
          <NavLink
            href="/history"
            label="Historial"
            isActive={pathname === '/history'}
            icon={
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <NavLink
            href="/reports"
            label="Reportes"
            isActive={pathname === '/reports'}
            icon={
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          />
          <NavLink
            href="/shopping"
            label="Compras"
            isActive={pathname === '/shopping'}
            icon={
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            }
          />
          <div className="pt-4 mt-4 border-t border-slate-100">
            <NavLink
              href="/settings"
              label="Configuración"
              isActive={pathname === '/settings'}
              icon={
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
            />
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 py-2.5 px-4 rounded-lg transition-all duration-200 group text-slate-600 hover:bg-red-50 hover:text-red-600 mt-1"
              aria-label="Cerrar sesión"
            >
              <div className="h-6 w-6 flex items-center justify-center text-slate-500 group-hover:text-red-500">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <span className="font-medium text-sm">Cerrar Sesión</span>
            </button>
          </div>
        </nav>
        
        {/* User Info / Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <div className="flex items-center space-x-3">
             <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
                US
             </div>
             <div>
                <p className="text-xs font-semibold text-slate-900">Usuario</p>
                <p className="text-[10px] text-slate-500">Operador</p>
             </div>
          </div>
        </div>
      </aside>
    </>
  );
};
