'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Zona, Inmueble } from '@/types';
import { ApiService } from '@/services/api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function ZonasPage() {
  const [zonas, setZonas] = useState<Zona[]>([]);
  const [inmueblesPorZona, setInmueblesPorZona] = useState<Record<string, Inmueble[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const zonasData = await ApiService.getZonas();
        setZonas(zonasData);
        
        // Obtener inmuebles para cada zona
        const inmueblesData: Record<string, Inmueble[]> = {};
        for (const zona of zonasData) {
          const inmuebles = await ApiService.getInmuebles({ zona: zona.nombre });
          inmueblesData[zona.nombre] = inmuebles;
        }
        setInmueblesPorZona(inmueblesData);
        
        setError(null);
      } catch (err) {
        setError('Error al cargar las zonas');
        console.error('Error fetching zonas:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Zonas</h1>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Zonas</h1>
          <div className="text-center text-gray-600">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Zonas</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {zonas.map((zona) => (
            <div key={zona.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {zona.nombre}
                </h2>
                {zona.descripcion && (
                  <p className="text-gray-600 mb-4">
                    {zona.descripcion}
                  </p>
                )}
                
                <div className="mb-4">
                  <span className="text-sm text-gray-500">
                    {inmueblesPorZona[zona.nombre]?.length || 0} propiedades disponibles
                  </span>
                </div>
                
                <Link
                  href={`/inmuebles?zona=${encodeURIComponent(zona.nombre)}`}
                  className="block w-full bg-red-600 text-white text-center py-2 px-4 rounded-md hover:bg-red-700 transition-colors font-semibold"
                >
                  Ver propiedades
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        {zonas.length === 0 && (
          <div className="text-center text-gray-600">
            <p>No hay zonas disponibles en este momento.</p>
          </div>
        )}
      </div>
    </div>
  );
} 