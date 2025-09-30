'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Inmueble, Zona, Estado } from '@/types';
import { ApiService } from '@/services/api';
import PropertyCard from '@/components/PropertyCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function InmueblesPageContent() {
  const searchParams = useSearchParams();
  const [inmuebles, setInmuebles] = useState<Inmueble[]>([]);
  // const [zonas, setZonas] = useState<Zona[]>([]);
  const [estados, setEstados] = useState<Estado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filtros
  const [filtros, setFiltros] = useState({
    zona: searchParams.get('zona') || '',
    estado: searchParams.get('estado') || '',
    tipo: searchParams.get('tipo') || '',
    precio_min: searchParams.get('precio_min') || '',
    precio_max: searchParams.get('precio_max') || '',
    dormitorios: searchParams.get('dormitorios') || '',
    search: searchParams.get('search') || '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Convertir filtros para la API
        const apiFiltros: {
          zona?: string;
          estado?: string;
          tipo?: string;
          precio_min?: number;
          precio_max?: number;
          dormitorios?: number;
        } = {};
        
        if (filtros.zona) apiFiltros.zona = filtros.zona;
        if (filtros.estado) apiFiltros.estado = filtros.estado;
        if (filtros.tipo) apiFiltros.tipo = filtros.tipo;
        if (filtros.precio_min) apiFiltros.precio_min = parseInt(filtros.precio_min);
        if (filtros.precio_max) apiFiltros.precio_max = parseInt(filtros.precio_max);
        if (filtros.dormitorios) apiFiltros.dormitorios = parseInt(filtros.dormitorios);
        
        // Cargar datos en paralelo
        const [inmueblesData, , estadosData] = await Promise.all([
          ApiService.getInmuebles(apiFiltros),
          // ApiService.getZonas(), // Comentado porque no se usa
          ApiService.getEstados(),
        ]);
        
        setInmuebles(inmueblesData);
        // setZonas(zonasData); // Comentado porque no se usa
        setEstados(estadosData);
        setError(null);
      } catch (err) {
        setError('Error al cargar las propiedades');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filtros]);

  const handleFilterChange = (key: string, value: string) => {
    setFiltros(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFiltros({
      zona: '',
      estado: '',
      tipo: '',
      precio_min: '',
      precio_max: '',
      dormitorios: '',
      search: '',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Propiedades</h1>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Propiedades</h1>
        
        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Filtros</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Búsqueda */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Búsqueda
              </label>
              <input
                type="text"
                placeholder="Buscar propiedades..."
                value={filtros.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              />
            </div>
            
            {/* Zona - Hidden */}
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zona
              </label>
              <select
                value={filtros.zona}
                onChange={(e) => handleFilterChange('zona', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              >
                <option value="">Todas las zonas</option>
                {zonas.map((zona) => (
                  <option key={zona.id} value={zona.nombre}>
                    {zona.nombre}
                  </option>
                ))}
              </select>
            </div> */}
            
            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                value={filtros.estado}
                onChange={(e) => handleFilterChange('estado', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              >
                <option value="">Todos los estados</option>
                {estados?.map((estado) => (
                  <option key={estado.id} value={estado.nombre}>
                    {estado.nombre}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Tipo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo
              </label>
              <select
                value={filtros.tipo}
                onChange={(e) => handleFilterChange('tipo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              >
                <option value="">Todos los tipos</option>
                <option value="Departamento">Departamento</option>
                <option value="Casa">Casa</option>
                <option value="PH">PH</option>
                <option value="Oficina">Oficina</option>
                <option value="Local">Local</option>
              </select>
            </div>
            
            {/* Precio mínimo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio mínimo
              </label>
              <input
                type="number"
                placeholder="USD"
                value={filtros.precio_min}
                onChange={(e) => handleFilterChange('precio_min', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              />
            </div>
            
            {/* Precio máximo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio máximo
              </label>
              <input
                type="number"
                placeholder="USD"
                value={filtros.precio_max}
                onChange={(e) => handleFilterChange('precio_max', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              />
            </div>
            
            {/* Dormitorios */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dormitorios
              </label>
              <select
                value={filtros.dormitorios}
                onChange={(e) => handleFilterChange('dormitorios', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              >
                <option value="">Cualquier cantidad</option>
                <option value="1">1 dormitorio</option>
                <option value="2">2 dormitorios</option>
                <option value="3">3 dormitorios</option>
                <option value="4">4+ dormitorios</option>
              </select>
            </div>
            
            {/* Botón limpiar filtros */}
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        </div>
        
        {/* Resultados */}
        {error ? (
          <div className="text-center text-gray-600">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        ) : inmuebles.length === 0 ? (
          <div className="text-center text-gray-600">
            <p>No se encontraron propiedades con los filtros seleccionados.</p>
            <button 
              onClick={clearFilters}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Ver todas las propiedades
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                Se encontraron {inmuebles?.length || 0} propiedades
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {inmuebles?.map((inmueble) => (
                <PropertyCard
                  key={inmueble.id}
                  property={inmueble}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
} 