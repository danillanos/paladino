'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ApiService } from '@/services/api';
import { Inmueble } from '@/types';

interface InmueblesGridProps {
  limit?: number;
  showTitle?: boolean;
  title?: string;
  showViewAll?: boolean;
}

export default function InmueblesGrid({ 
  limit, 
  showTitle = true, 
  title = "Propiedades",
  showViewAll = false 
}: InmueblesGridProps) {
  const [inmuebles, setInmuebles] = useState<Inmueble[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInmuebles = async () => {
      try {
        // Usar la API real de inmuebles
        const response = await fetch('https://api.paladinopropiedades.com.ar/inmuebles');
        if (!response.ok) {
          throw new Error('Failed to fetch inmuebles');
        }
        const data = await response.json();
        // Aplicar límite si se especifica
        const inmueblesData = limit ? data.slice(0, limit) : data;
        setInmuebles(inmueblesData);
        console.log('Inmuebles data from API:', data);
      } catch (error) {
        console.error('Error fetching inmuebles:', error);
        // Fallback a mock data si la API falla
        try {
          const mockData = await ApiService.getInmuebles();
          const inmueblesData = limit ? mockData.slice(0, limit) : mockData;
          setInmuebles(inmueblesData);
        } catch (mockError) {
          console.error('Error with mock data too:', mockError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInmuebles();
  }, [limit]);

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
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            {title}
          </h2>
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
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          {title}
        </h2>
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
              href={`/inmueble/${inmueble.id}`}
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
