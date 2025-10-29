'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { ApiService } from '@/services/api';
import { Inmueble } from '@/types';

interface InmueblesGridProps {
  limit?: number;
  showTitle?: boolean;
  title?: string;
  showViewAll?: boolean;
  onlyFeatured?: boolean;
  showFilters?: boolean;
}

export default function InmueblesGrid({ 
  limit, 
  showTitle = true, 
  title = "Propiedades",
  showViewAll = false,
  onlyFeatured = false,
  showFilters = true
}: InmueblesGridProps) {
  const [inmuebles, setInmuebles] = useState<Inmueble[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  // Función para mapear parámetros de URL a valores de base de datos
  const mapOperacionParam = (operacionParam: string) => {
    const mapping: { [key: string]: string } = {
      'comprar': 'venta',
      'alquilar': 'alquiler'
    };
    return mapping[operacionParam.toLowerCase()] || operacionParam;
  };

  useEffect(() => {
    // Función para aplicar filtros basados en parámetros de URL
    const applyFilters = (data: Inmueble[]) => {
      let filteredData = [...data];

      // Filtro por búsqueda (search)
      const searchQuery = searchParams.get('search');
      if (searchQuery) {
        filteredData = filteredData.filter((inmueble: Inmueble) => 
          inmueble.nombre.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Filtro por tipo
      const tipoQuery = searchParams.get('tipo');
      if (tipoQuery) {
        filteredData = filteredData.filter((inmueble: Inmueble) => 
          inmueble.tipo?.nombre?.toLowerCase().includes(tipoQuery.toLowerCase())
        );
      }

      // Filtro por operación
      const operacionQuery = searchParams.get('operacion');
      if (operacionQuery) {
        const mappedOperacion = mapOperacionParam(operacionQuery);
        filteredData = filteredData.filter((inmueble: Inmueble) => {
          const operacionValue = typeof inmueble.operacion === 'string' 
            ? inmueble.operacion 
            : inmueble.operacion?.nombre;
          return operacionValue?.toLowerCase().includes(mappedOperacion.toLowerCase());
        });
      }

      return filteredData;
    };

    const fetchInmuebles = async () => {
      try {
        // Usar la API real de inmuebles
        const response = await fetch('https://api.paladinopropiedades.com.ar/inmuebles');
        if (!response.ok) {
          throw new Error('Failed to fetch inmuebles');
        }
        const data = await response.json();
        
        // Aplicar filtros basados en parámetros de URL
        let filteredData = applyFilters(data);
        
        // Filtrar solo destacados si se especifica
        if (onlyFeatured) {
          filteredData = filteredData.filter((inmueble: Inmueble) => inmueble.destacado === true);
        }
        
        // Aplicar límite si se especifica
        const inmueblesData = limit ? filteredData.slice(0, limit) : filteredData;
        setInmuebles(inmueblesData);
        console.log('Inmuebles data from API:', data);
      } catch (error) {
        console.error('Error fetching inmuebles:', error);
        // Fallback a mock data si la API falla
        try {
          const mockData = await ApiService.getInmuebles();
          
          // Aplicar filtros basados en parámetros de URL
          let filteredMockData = applyFilters(mockData);
          
          // Filtrar solo destacados si se especifica
          if (onlyFeatured) {
            filteredMockData = filteredMockData.filter((inmueble: Inmueble) => inmueble.destacado === true);
          }
          
          const inmueblesData = limit ? filteredMockData.slice(0, limit) : filteredMockData;
          setInmuebles(inmueblesData);
        } catch (mockError) {
          console.error('Error with mock data too:', mockError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInmuebles();
  }, [limit, onlyFeatured, searchParams]);

  // Función para obtener filtros activos
  const getActiveFilters = () => {
    return {
      search: searchParams.get('search') || '',
      tipo: searchParams.get('tipo') || '',
      operacion: searchParams.get('operacion') || ''
    };
  };

  // Función para actualizar filtros
  const updateFilters = (filterType: string, value: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    
    if (value === '') {
      newParams.delete(filterType);
    } else {
      newParams.set(filterType, value);
    }
    
    const queryString = newParams.toString();
    window.location.href = `/inmuebles${queryString ? `?${queryString}` : ''}`;
  };

  // Función para limpiar todos los filtros
  const clearAllFilters = () => {
    window.location.href = '/inmuebles';
  };

  // Opciones para los selects
  const tipoOptions = [
    { value: '', label: 'Todos los tipos' },
    { value: 'casa', label: 'Casa' },
    { value: 'departamento', label: 'Departamento' },
    { value: 'casa-quinta', label: 'Casa Quinta' },
    { value: 'terreno', label: 'Terreno' },
    { value: 'local', label: 'Local' },
    { value: 'oficina', label: 'Oficina' }
  ];

  const operacionOptions = [
    { value: '', label: 'Todas las operaciones' },
    { value: 'comprar', label: 'Comprar' },
    { value: 'alquilar', label: 'Alquilar' }
  ];

  const activeFilters = getActiveFilters();

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4">
        {showTitle && (
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto animate-pulse"></div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(limit || 12)].map((_, i) => (
            <div key={i} className="h-80 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (inmuebles.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4">
        {showTitle && (
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {title}
            </h2>
            {showFilters && (
              <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-4xl mx-auto shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Filtros de búsqueda</h3>
                    <p className="text-sm text-gray-500">Refina tu búsqueda de propiedades</p>
                  </div>
                </div>
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Ver todas
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Filtro de búsqueda */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Búsqueda
                  </label>
                  <input
                    type="text"
                    value={activeFilters.search}
                    onChange={(e) => updateFilters('search', e.target.value)}
                    placeholder="Buscar por nombre, zona..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>

                {/* Filtro de tipo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de propiedad
                  </label>
                  <select
                    value={activeFilters.tipo}
                    onChange={(e) => updateFilters('tipo', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    {tipoOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Filtro de operación */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Operación
                  </label>
                  <select
                    value={activeFilters.operacion}
                    onChange={(e) => updateFilters('operacion', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    {operacionOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            )}
          </div>
        )}
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No se encontraron propiedades</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      {showTitle && (
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          {showFilters && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-4xl mx-auto shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Filtros de búsqueda</h3>
                  <p className="text-sm text-gray-500">Refina tu búsqueda de propiedades</p>
                </div>
              </div>
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Ver todas
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Filtro de búsqueda */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Búsqueda
                </label>
                <input
                  type="text"
                  value={activeFilters.search}
                  onChange={(e) => updateFilters('search', e.target.value)}
                  placeholder="Buscar por nombre, zona..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Filtro de tipo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de propiedad
                </label>
                <select
                  value={activeFilters.tipo}
                  onChange={(e) => updateFilters('tipo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  {tipoOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro de operación */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Operación
                </label>
                <select
                  value={activeFilters.operacion}
                  onChange={(e) => updateFilters('operacion', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  {operacionOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
            )}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {inmuebles.map((inmueble) => {
          // Construir la URL de la imagen
          const getImageUrl = () => {
            if (inmueble.imagen?.url) {
              const fullUrl = inmueble.imagen.url.startsWith('http') 
                ? inmueble.imagen.url 
                : `https://api.paladinopropiedades.com.ar${inmueble.imagen.url}`;
              return fullUrl;
            }
            return '/placeholder-property.jpg';
          };

          const imageUrl = getImageUrl();
          
          return (
            <Link
              key={inmueble.id}
              href={`/inmueble/${inmueble.slug}`}
              className="group block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={imageUrl}
                  alt={inmueble.nombre}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={() => {
                    console.log('Image failed to load:', imageUrl);
                  }}
                />
                
                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold">
                    {inmueble.estado?.nombre || 'Disponible'}
                  </span>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-4">
                {/* Price */}
                <div className="text-lg font-bold text-gray-900 mb-2">
                  {inmueble.precio ? `$${inmueble.precio.toLocaleString()}` : 'Consultar precio'}
                  {inmueble.moneda && <span className="text-sm text-gray-600 ml-1">{inmueble.moneda}</span>}
                </div>
                
                {/* Description */}
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                  {inmueble.descripcion || inmueble.nombre}
                </p>
                
                {/* Location */}
                <div className="flex items-center text-sm text-gray-500">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {inmueble.ubicacion_avanzada?.localidad || inmueble.catalogo_de_zona?.nombre || 'Villa Carlos Paz'}
                </div>
                
                {/* Property Details */}
                <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                  <span>{inmueble.habitaciones || 0} dorm.</span>
                  <span>{inmueble.banos || 0} baños</span>
                  <span>{inmueble.superficie || 0}m²</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      
      {/* Ver más propiedades */}
      {showViewAll && (
        <div className="text-center mt-12">
          <Link
            href="/inmuebles"
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            Ver todas las propiedades
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
}
