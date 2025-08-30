'use client';

import { useState, useEffect } from 'react';
import { Destacado } from '@/types';
import { ApiService } from '@/services/api';
import PropertyCard from './PropertyCard';
import LoadingSpinner from './ui/LoadingSpinner';

export default function FeaturedProperties() {
  const [destacados, setDestacados] = useState<Destacado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDestacados = async () => {
      try {
        setLoading(true);
        const data = await ApiService.getDestacados();
        setDestacados(data);
        setError(null);
      } catch (err) {
        setError('Error al cargar las propiedades destacadas');
        console.error('Error fetching destacados:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDestacados();
  }, []);

  if (loading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Propiedades Destacadas
          </h2>
          <LoadingSpinner />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Propiedades Destacadas
          </h2>
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
      </section>
    );
  }

  if (destacados.length === 0) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Propiedades Destacadas
          </h2>
          <div className="text-center text-gray-600">
            <p>No hay propiedades destacadas disponibles en este momento.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Propiedades Destacadas
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {destacados.map((destacado) => (
            <PropertyCard
              key={destacado.id}
              property={destacado.inmueble}
              isDestacado={true}
            />
          ))}
        </div>
        
        <div className="text-center mt-8">
          <a
            href="/inmuebles"
            className="inline-block bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition-colors font-semibold"
          >
            Ver todas las propiedades
          </a>
        </div>
      </div>
    </section>
  );
} 