'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ApiService } from '@/services/api';
import { Novedad } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function NovedadDetailContent() {
  const params = useParams();
  const router = useRouter();
  const [novedad, setNovedad] = useState<Novedad | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNovedad = async () => {
      try {
        setLoading(true);
        const novedades = await ApiService.getNews();
        const foundNovedad = novedades.find(n => n.slug === params.slug);
        
        if (foundNovedad) {
          setNovedad(foundNovedad);
        } else {
          setError('Novedad no encontrada');
        }
      } catch (err) {
        console.error('Error fetching novedad:', err);
        setError('Error al cargar la novedad');
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchNovedad();
    }
  }, [params.slug]);

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

  if (error || !novedad) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error || 'Novedad no encontrada'}</p>
          <Link
            href="/novedades"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Volver a Novedades
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <section className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-green-600">
              Inicio
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/novedades" className="text-gray-500 hover:text-green-600">
              Novedades
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium truncate">
              {novedad.titulo}
            </span>
          </nav>
        </div>
      </section>

      {/* Article Header */}
      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            {novedad.destacado && (
              <div className="mb-4">
                <span className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                  Destacado
                </span>
              </div>
            )}
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {novedad.titulo}
            </h1>
            
            <p className="text-xl text-gray-600 mb-6">
              {novedad.bajada}
            </p>
            
            <div className="flex items-center justify-center space-x-4 text-gray-500">
              <time className="text-sm">
                {formatDate(novedad.fecha_publicacion)}
              </time>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-4 pb-8">
          <div className="relative h-96 w-full rounded-lg overflow-hidden">
            <Image
              src={`https://api.paladinopropiedades.com.ar${novedad.portada.url}`}
              alt={novedad.portada.alternativeText || novedad.titulo}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
              priority
            />
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-4 pb-12">
          <div className="prose prose-lg max-w-none">
            <div 
              className="text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: novedad.contenido }}
            />
          </div>
        </div>
      </section>

      {/* Gallery */}
      {novedad.galeria && novedad.galeria.length > 0 && (
        <section className="bg-gray-50 py-12">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Galería de Imágenes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {novedad.galeria.map((imagen, index) => (
                <div key={index} className="relative h-64 w-full rounded-lg overflow-hidden">
                  <Image
                    src={`https://api.paladinopropiedades.com.ar${imagen.url}`}
                    alt={imagen.alternativeText || `Imagen ${index + 1}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Navigation */}
      <section className="bg-white border-t">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <Link
              href="/novedades"
              className="flex items-center text-green-600 hover:text-green-700 font-medium transition-colors"
            >
              <svg
                className="mr-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Volver a Novedades
            </Link>
            
            <div className="flex space-x-4">
              <Link
                href="/inmuebles"
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Ver Propiedades
              </Link>
              <Link
                href="/contacto"
                className="border-2 border-green-600 text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-600 hover:text-white transition-colors"
              >
                Contactanos
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
