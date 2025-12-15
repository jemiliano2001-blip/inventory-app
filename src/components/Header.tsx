'use client';

import React, { useState, useCallback } from 'react';
import { debounce } from '@/utils/debounce';

interface HeaderProps {
  title: string;
  subtitle: string;
  onMenuToggle: () => void;
}

export const Header = ({ title, subtitle, onMenuToggle }: HeaderProps): React.ReactElement => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState<boolean>(false);

  const performSearch = useCallback((query: string): void => {
    if (query.trim()) {
      // La búsqueda se implementará cuando se integre con el store de inventario
    }
  }, []);

  const debouncedSearch = useCallback(
    debounce((query: string) => performSearch(query), 300),
    [performSearch]
  );

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    performSearch(searchQuery);
  };

  const clearSearch = (): void => {
    setSearchQuery('');
  };

  return (
    <header
      className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-white border-b border-slate-200 sticky top-0 z-20"
      role="banner"
    >
      <div className="flex items-center space-x-4 mb-4 md:mb-0">
        <button
          onClick={onMenuToggle}
          className="focus:outline-none md:hidden p-2 -ml-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
          aria-label="Abrir menú de navegación"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
          <p className="text-sm text-slate-500 font-medium">{subtitle}</p>
        </div>
      </div>
      
      <div className="w-full md:w-auto flex items-center">
        <form onSubmit={handleSearch} className="relative w-full md:w-96 group">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="h-4 w-4 text-slate-400 group-focus-within:text-slate-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="search"
              value={searchQuery}
              onChange={handleSearchInput}
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition-all duration-200"
              placeholder="Buscar (Ctrl+K)"
              aria-label="Buscar artículos en el inventario"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-2">
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-colors"
                  aria-label="Limpiar búsqueda"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </form>
        <button
          onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
          className={`ml-3 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-slate-500 hover:text-slate-900 ${showAdvancedSearch ? 'bg-slate-100 text-slate-900 border-slate-300' : ''}`}
          aria-label="Filtros avanzados"
          title="Filtros avanzados"
        >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
        </button>
      </div>

      {showAdvancedSearch && (
        <div className="absolute top-full right-6 mt-2 p-4 bg-white border border-slate-200 rounded-lg shadow-xl z-30 w-80 animate-fade-in-down">
          <div className="text-xs font-semibold text-slate-900 mb-3 uppercase tracking-wider">Ayuda de Búsqueda</div>
          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex items-center justify-between">
                <span>Combinar términos:</span>
                <code className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-800 font-mono">AND</code>
            </div>
            <div className="flex items-center justify-between">
                <span>Cualquier término:</span>
                <code className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-800 font-mono">OR</code>
            </div>
            <div className="flex items-center justify-between">
                <span>Excluir término:</span>
                <code className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-800 font-mono">NOT</code>
            </div>
            <div className="flex items-center justify-between">
                <span>Frase exacta:</span>
                <code className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-800 font-mono">&quot;...&quot;</code>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
