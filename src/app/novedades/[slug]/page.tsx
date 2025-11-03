'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Novedad } from '@/types';
import { ApiService } from '@/services/api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function NovedadDetailPage() {
  const params = useParams();
  const [novedad, setNovedad] = useState<Novedad | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

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
          console.log('Galería:', novedadEncontrada.galeria);
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

  // Manejo de teclado para navegación en el lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null || !novedad?.galeria) return;

      if (e.key === 'Escape') {
        setSelectedImageIndex(null);
      } else if (e.key === 'ArrowLeft' && selectedImageIndex > 0) {
        setSelectedImageIndex(selectedImageIndex - 1);
      } else if (e.key === 'ArrowRight' && selectedImageIndex < novedad.galeria.length - 1) {
        setSelectedImageIndex(selectedImageIndex + 1);
      }
    };

    if (selectedImageIndex !== null) {
      window.addEventListener('keydown', handleKeyDown);
      // Prevenir scroll del body cuando el lightbox está abierto
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [selectedImageIndex, novedad?.galeria]);

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
            <Image
              src={novedad.imagen_destacada.url.startsWith('http') 
                ? novedad.imagen_destacada.url 
                : `https://api.paladinopropiedades.com.ar${novedad.imagen_destacada.url}`
              }
              alt={novedad.imagen_destacada.alternativeText || novedad.titulo}
              width={800}
              height={400}
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

        {/* Galería de fotos */}
        {novedad.galeria && novedad.galeria.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Galería de fotos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {novedad.galeria.map((imagen, index) => {
                const imageUrl = imagen.url?.startsWith('http') 
                  ? imagen.url 
                  : `https://api.paladinopropiedades.com.ar${imagen.url}`;
                
                return (
                  <div 
                    key={imagen.id || index} 
                    className="relative group cursor-pointer"
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <Image
                      src={imageUrl}
                      alt={imagen.alternativeText || `Imagen ${index + 1} de ${novedad.titulo}`}
                      width={400}
                      height={300}
                      className="w-full h-64 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow"
                      onError={(e) => {
                        console.error('Error loading gallery image:', e);
                      }}
                    />
                    {imagen.caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-sm">{imagen.caption}</p>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded-lg flex items-center justify-center">
                      <svg className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Lightbox Modal */}
        {selectedImageIndex !== null && novedad.galeria && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
            onClick={() => setSelectedImageIndex(null)}
          >
            {/* Botón cerrar */}
            <button
              onClick={() => setSelectedImageIndex(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
              aria-label="Cerrar"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Navegación anterior */}
            {selectedImageIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIndex(selectedImageIndex - 1);
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 bg-black bg-opacity-50 rounded-full p-2"
                aria-label="Imagen anterior"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {/* Navegación siguiente */}
            {selectedImageIndex < novedad.galeria.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIndex(selectedImageIndex + 1);
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 bg-black bg-opacity-50 rounded-full p-2"
                aria-label="Imagen siguiente"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}

            {/* Imagen ampliada */}
            <div 
              className="max-w-7xl max-h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {novedad.galeria[selectedImageIndex] && (
                <>
                  <Image
                    src={novedad.galeria[selectedImageIndex].url?.startsWith('http') 
                      ? novedad.galeria[selectedImageIndex].url 
                      : `https://api.paladinopropiedades.com.ar${novedad.galeria[selectedImageIndex].url}`
                    }
                    alt={novedad.galeria[selectedImageIndex].alternativeText || `Imagen ${selectedImageIndex + 1} de ${novedad.titulo}`}
                    width={1200}
                    height={800}
                    className="max-w-full max-h-[90vh] object-contain rounded-lg"
                    priority
                  />
                  {novedad.galeria[selectedImageIndex].caption && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white px-4 py-2 rounded-lg max-w-2xl text-center">
                      <p className="text-sm">{novedad.galeria[selectedImageIndex].caption}</p>
                    </div>
                  )}
                  {/* Contador de imágenes */}
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white px-4 py-2 rounded-lg">
                    <p className="text-sm">{selectedImageIndex + 1} / {novedad.galeria.length}</p>
                  </div>
                </>
              )}
            </div>
          </div>
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
