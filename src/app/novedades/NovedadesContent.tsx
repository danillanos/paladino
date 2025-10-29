'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ApiService } from '@/services/api';
import { Novedad } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function NovedadesContent() {
  const [novedades, setNovedades] = useState<Novedad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNovedades = async () => {
      try {
        setLoading(true);
        const data = await ApiService.getNews();
        setNovedades(data);
      } catch (err) {
        console.error('Error fetching novedades:', err);
        setError('Error al cargar las novedades');
      } finally {
        setLoading(false);
      }
    };

    fetchNovedades();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Novedades
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Mantente al día con las últimas noticias y novedades de Paladino Propiedades
            </p>
          </div>
        </div>
      </section>

      {/* Novedades Grid */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          {novedades.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                No hay novedades disponibles
              </h2>
              <p className="text-gray-600">
                Pronto tendremos nuevas noticias para compartir contigo.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {novedades.map((novedad) => (
                <article
                  key={novedad.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  {/* Featured Badge */}
                  {novedad.destacado && (
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Destacado
                      </span>
                    </div>
                  )}

                  {/* Image */}
                  <div className="relative h-48 w-full">
                    <Image
                      src={`https://api.paladinopropiedades.com.ar${novedad.imagen_destacada.url}`}
                      alt={novedad.imagen_destacada.alternativeText || novedad.titulo}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="mb-3">
                      <time className="text-sm text-gray-500">
                        {formatDate(novedad.fecha_publicacion)}
                      </time>
                    </div>
                    
                    <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {novedad.titulo}
                    </h2>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {novedad.descripcion}
                    </p>

                    <Link
                      href={`/novedades/${novedad.slug}`}
                      className="inline-flex items-center text-green-600 hover:text-green-700 font-medium transition-colors"
                    >
                      Leer más
                      <svg
                        className="ml-2 w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-green-600 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            ¿Interesado en nuestras propiedades?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Descubre las mejores opciones inmobiliarias en Villa Carlos Paz
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/inmuebles"
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Ver Propiedades
            </Link>
            <Link
              href="/contacto"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
            >
              Contactanos
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
