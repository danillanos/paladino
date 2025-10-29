'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Novedad } from '@/types';
import { ApiService } from '@/services/api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function NovedadDetailPage() {
  const params = useParams();
  const [novedad, setNovedad] = useState<Novedad | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNovedad = async () => {
      try {
        setLoading(true);
        const slug = params.slug as string;
        
        if (!slug) {
          setError('Slug no proporcionado');
          setLoading(false);
          return;
        }
        
        // Obtener novedad directamente por slug desde la API
        const novedadEncontrada = await ApiService.getNovedadBySlug(slug);
        
        if (novedadEncontrada) {
          console.log('Novedad encontrada:', novedadEncontrada);
          console.log('Imagen destacada:', novedadEncontrada.imagen_destacada);
          setNovedad(novedadEncontrada);
          setError(null);
        } else {
          setError('Novedad no encontrada');
        }
      } catch (err) {
        setError('Error al cargar la novedad');
        console.error('Error fetching novedad:', err);
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchNovedad();
    }
  }, [params.slug]);

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
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Novedad no encontrada</h1>
          <p className="text-gray-600 mb-6">{error || 'La novedad que buscas no existe'}</p>
          <Link
            href="/novedades"
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Ver todas las novedades
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li><Link href="/" className="hover:text-green-600">Inicio</Link></li>
            <li>/</li>
            <li><Link href="/novedades" className="hover:text-green-600">Novedades</Link></li>
            <li>/</li>
            <li className="text-gray-900 font-medium">{novedad.titulo}</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{novedad.titulo}</h1>
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <time dateTime={novedad.fecha_publicacion}>
              {new Date(novedad.fecha_publicacion).toLocaleDateString('es-AR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
            {novedad.destacado && (
              <span className="ml-4 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                Destacado
              </span>
            )}
          </div>
        </header>

        {/* Imagen destacada */}
        {novedad.imagen_destacada && novedad.imagen_destacada.url && (
          <div className="mb-8">
            <img
              src={novedad.imagen_destacada.url.startsWith('http') 
                ? novedad.imagen_destacada.url 
                : `https://api.paladinopropiedades.com.ar${novedad.imagen_destacada.url}`
              }
              alt={novedad.imagen_destacada.alternativeText || novedad.titulo}
              className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
              onError={(e) => {
                console.error('Error loading image:', e);
                console.log('Image src:', novedad.imagen_destacada?.url);
                console.log('Full image src:', novedad.imagen_destacada.url.startsWith('http') 
                  ? novedad.imagen_destacada.url 
                  : `https://api.paladinopropiedades.com.ar${novedad.imagen_destacada.url}`);
              }}
            />
          </div>
        )}

        {/* Descripción */}
        {novedad.descripcion && (
          <div className="mb-8">
            <p className="text-xl text-gray-700 leading-relaxed">{novedad.descripcion}</p>
          </div>
        )}

        {/* Contenido */}
        {novedad.contenido ? (
          <div 
            className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: novedad.contenido }}
          />
        ) : (
          <p className="text-gray-500 italic">No hay contenido disponible para esta novedad.</p>
        )}

        {/* Botón de regreso */}
        <div className="mt-12 text-center">
          <Link
            href="/novedades"
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            ← Volver a Novedades
          </Link>
        </div>
      </div>
    </div>
  );
}
