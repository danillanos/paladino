'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ApiService } from '@/services/api';
import { Emprendimiento } from '@/types';

export default function FeaturedEmprendimientos() {
  const [emprendimientos, setEmprendimientos] = useState<Emprendimiento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmprendimientos = async () => {
      try {
        const data = await ApiService.getEmprendimientos();
        console.log('Emprendimientos data:', data);
        setEmprendimientos(data);
      } catch (error) {
        console.error('Error fetching emprendimientos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmprendimientos();
  }, []);

  if (loading) {
    return (
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="h-64 bg-gray-200 rounded"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (emprendimientos.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Emprendimientos destacados
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {emprendimientos.map((emprendimiento) => {
            // Función para obtener la imagen con múltiples alternativas
            const getImageUrl = () => {
              console.log('Emprendimiento data:', emprendimiento);
              console.log('Galeria:', emprendimiento.galeria);
              console.log('Cover:', emprendimiento.cover);
              
              // 1. Imagen de cover (primera opción)
              if (emprendimiento.cover?.url) {
                // Construir la URL completa
                const fullUrl = emprendimiento.cover.url.startsWith('http') 
                  ? emprendimiento.cover.url 
                  : `https://api.paladinopropiedades.com.ar${emprendimiento.cover.url}`;
                console.log('Using cover image:', fullUrl);
                return fullUrl;
              }
              
              // 2. Primera imagen de la galería (segunda opción)
              if (emprendimiento.galeria && emprendimiento.galeria.length > 0) {
                const firstImage = emprendimiento.galeria[0];
                console.log('First image from galeria:', firstImage);
                if (firstImage?.url) {
                  // Construir la URL completa
                  const fullUrl = firstImage.url.startsWith('http') 
                    ? firstImage.url 
                    : `https://api.paladinopropiedades.com.ar${firstImage.url}`;
                  console.log('Using galeria image:', fullUrl);
                  return fullUrl;
                }
              }
              
              // 3. Fallback
              console.log('Using fallback image for:', emprendimiento.nombre);
              return '/placeholder-property.jpg';
            };

            const imageUrl = getImageUrl();
            
            return (
              <Link
                key={emprendimiento.id}
                href={`/emprendimientos/${emprendimiento.slug}`}
                className="group block"
              >
                <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt={emprendimiento.nombre}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={() => {
                        console.log('Image failed to load:', imageUrl);
                      }}
                    />
                  
                    {/* Overlay with title */}
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
                      <div className="p-6 w-full">
                        <h3 className="text-white text-xl font-semibold mb-2">
                          {emprendimiento.nombre}
                        </h3>
                        <p className="text-white text-sm opacity-90">
                          {emprendimiento.ubicacion_avanzada.localidad}
                        </p>
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
