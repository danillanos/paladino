'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ApiService } from '@/services/api';
import { Obra } from '@/types';

export default function FeaturedObras() {
  const [obras, setObras] = useState<Obra[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchObras = async () => {
      try {
        const data = await ApiService.getObras();
        console.log('Obras data:', data);
        setObras(data || []);
      } catch (error) {
        console.error('Error fetching obras:', error);
        setObras([]);
      } finally {
        setLoading(false);
      }
    };

    fetchObras();
  }, []);

  if (loading) {
    return (
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Emprendimientos finalizados
          </h2>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        </div>
      </section>
    );
  }

  if (obras.length === 0) {
    return (
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Emprendimientos finalizados
          </h2>
          <p className="text-center text-gray-600">No hay obras disponibles en este momento.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Emprendimientos finalizados
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {obras.map((obra) => {
            const getImageUrl = () => {
              // Priorizar imagen_portada
              if (obra.imagen_portada?.url) {
                const fullUrl = obra.imagen_portada.url.startsWith('http')
                  ? obra.imagen_portada.url
                  : `https://api.paladinopropiedades.com.ar${obra.imagen_portada.url}`;
                return fullUrl;
              }
              
              // Si no hay imagen_portada, usar la primera de la galería
              if (obra.galeria && obra.galeria.length > 0 && obra.galeria[0]?.url) {
                const fullUrl = obra.galeria[0].url.startsWith('http')
                  ? obra.galeria[0].url
                  : `https://api.paladinopropiedades.com.ar${obra.galeria[0].url}`;
                return fullUrl;
              }
              
              // Fallback a imagen placeholder
              return 'https://picsum.photos/600/400?random=' + obra.id;
            };
            
            const imageUrl = getImageUrl();

            return (
              <Link
                key={obra.id}
                href={`/obras/${obra.slug}`}
                className="group block"
              >
                <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="relative h-[22rem] overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt={obra.nombre}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={() => {
                        console.log('Image failed to load:', imageUrl);
                      }}
                    />
                    {/* Overlay with title - opacity removed, gradient added to text area */}
                    <div className="absolute inset-0 flex items-end">
                      <div className="p-6 w-full bg-gradient-to-t from-black/70 to-transparent">
                        <h3 className="text-white text-xl font-semibold mb-2">
                          {obra.nombre}
                        </h3>
                        <p className="text-white text-sm opacity-90">
                          {obra.ubicacion} • {obra.anio}
                        </p>
                        {obra.constructora && (
                          <p className="text-white text-sm opacity-90">
                            {obra.constructora}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
