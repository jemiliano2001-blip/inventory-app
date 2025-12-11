'use client';

import React, { useState, useCallback } from 'react';
import { debounce } from '@/utils/debounce';

interface HeaderProps {
  title: string;
  subtitle: string;
  onMenuToggle: () => void;
}

export const Header = ({ title, subtitle, onMenuToggle }: HeaderProps): React.JSX.Element => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState<boolean>(false);

  const performSearch = useCallback((query: string): void => {
    // TODO: Implement search logic with the query
    if (query.trim()) {
      // Search implementation will go here
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
      className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-6 border-b bg-white"
      role="banner"
    >
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuToggle}
          className="focus:outline-none md:hidden p-2 rounded hover:bg-gray-100 transition-colors"
          aria-label="Abrir menú de navegación"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto mt-4 sm:mt-0">
        <form onSubmit={handleSearch} className="relative w-full sm:w-96">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="search"
              value={searchQuery}
              onChange={handleSearchInput}
              className="w-full pl-10 pr-24 py-3.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black focus:border-black bg-white transition-colors"
              placeholder="Buscar artículos... (Usa AND, OR, NOT)"
              aria-label="Buscar artículos en el inventario"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 space-x-1">
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100 transition-all duration-200"
                  aria-label="Limpiar búsqueda"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                className="p-1.5 text-gray-400 hover:text-black rounded hover:bg-gray-100 transition-colors"
                aria-label="Mostrar ayuda de búsqueda avanzada"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </button>
            </div>
          </div>
          {showAdvancedSearch && (
            <div className="absolute mt-2 p-4 bg-white border border-gray-200 rounded shadow-lg z-50 w-full">
              <div className="text-xs font-semibold text-gray-700 mb-3">Búsqueda Avanzada</div>
              <div className="space-y-2 text-xs text-gray-600">
                <div><strong>AND:</strong> Buscar ambos términos (ej: <code className="px-1 py-0.5 bg-gray-100 rounded">martillo AND herramientas</code>)</div>
                <div><strong>OR:</strong> Buscar cualquiera de los términos (ej: <code className="px-1 py-0.5 bg-gray-100 rounded">tornillo OR clavo</code>)</div>
                <div><strong>NOT:</strong> Excluir término (ej: <code className="px-1 py-0.5 bg-gray-100 rounded">pintura NOT roja</code>)</div>
                <div><strong>&quot;frase&quot;:</strong> Búsqueda exacta (ej: <code className="px-1 py-0.5 bg-gray-100 rounded">&quot;sierra circular&quot;</code>)</div>
              </div>
            </div>
          )}
        </form>
      </div>
    </header>
  );
};
