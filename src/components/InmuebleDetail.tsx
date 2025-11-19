'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import DOMPurify from 'isomorphic-dompurify';
import { Inmueble } from '@/types';
import { useSiteConfiguration } from '@/hooks/useSiteConfiguration';

interface InmuebleDetailProps {
  inmueble: Inmueble;
}

export default function InmuebleDetail({ inmueble }: InmuebleDetailProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'fotos' | 'videos'>('fotos');
  const { configuration } = useSiteConfiguration();

  // Sanitizar y preparar el HTML de la descripción
  const getSanitizedDescription = () => {
    if (!inmueble.descripcion) return '';
    
    let processedContent = inmueble.descripcion;
    
    // Convertir saltos de línea (\n) en <br> para que se respeten en el HTML
    processedContent = processedContent.replace(/\n/g, '<br>');
    
    // Sanitizar el contenido HTML
    return DOMPurify.sanitize(processedContent, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'b', 'i', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'img', 'div', 'span', 'blockquote', 'hr'],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'style', 'target', 'rel', 'width', 'height'],
      ALLOW_DATA_ATTR: false,
      KEEP_CONTENT: true
    });
  };

  // Obtener todas las imágenes disponibles
  const getAllImages = () => {
    const images = [];
    
    // Agregar imagen principal si existe
    if (inmueble.imagen?.url) {
      const fullUrl = inmueble.imagen.url.startsWith('http') 
        ? inmueble.imagen.url 
        : `https://api.paladinopropiedades.com.ar${inmueble.imagen.url}`;
      images.push(fullUrl);
    }
    
    // Agregar imágenes de la galería si existen
    if (inmueble.galeria && inmueble.galeria.length > 0) {
      inmueble.galeria.forEach((img) => {
        if (img.url) {
          const fullUrl = img.url.startsWith('http') 
            ? img.url 
            : `https://api.paladinopropiedades.com.ar${img.url}`;
          images.push(fullUrl);
        }
      });
    }
    
    return images;
  };

  const images = getAllImages();
  const currentImage = images[selectedImageIndex] || '/placeholder-property.jpg';

  // Función para parsear el iframe y extraer el src, agregando rel=0 para ocultar videos relacionados
  const parseYouTubeIframe = (iframeString: string | null | undefined): string | null => {
    if (!iframeString) return null;
    
    let videoUrl: string | null = null;
    
    // Buscar el atributo src en el iframe
    const srcMatch = iframeString.match(/src=["']([^"']+)["']/);
    if (srcMatch && srcMatch[1]) {
      videoUrl = srcMatch[1];
    } else {
      // Si no se encuentra src, intentar extraer la URL directamente
      const urlMatch = iframeString.match(/https?:\/\/[^\s"']+/);
      if (urlMatch) {
        videoUrl = urlMatch[0];
      }
    }
    
    if (!videoUrl) return null;
    
    // Agregar o reemplazar el parámetro rel=0
    try {
      const url = new URL(videoUrl);
      // Establecer rel=0 para ocultar videos relacionados
      url.searchParams.set('rel', '0');
      return url.toString();
    } catch {
      // Si la URL no es válida, intentar agregar el parámetro manualmente
      if (videoUrl.includes('?')) {
        // Ya tiene parámetros, agregar o reemplazar rel=0
        if (videoUrl.includes('rel=')) {
          return videoUrl.replace(/rel=\d+/g, 'rel=0');
        } else {
          return `${videoUrl}&rel=0`;
        }
      } else {
        // No tiene parámetros, agregar ?rel=0
        return `${videoUrl}?rel=0`;
      }
    }
  };

  // Buscar el campo youtube_video en diferentes variantes (mayúsculas/minúsculas)
  const inmuebleWithVideo = inmueble as Inmueble & { Youtube_video?: string | null };
  const youtubeVideoField = inmuebleWithVideo.Youtube_video || inmueble.youtube_video;
  const youtubeVideoSrc = parseYouTubeIframe(youtubeVideoField);
  const hasVideos = !!youtubeVideoSrc;

  const formatPrice = (price: number | null, currency: string | null) => {
    if (!price) return 'Consultar precio';
    
    // Mapear nombres de moneda a códigos ISO
    const getCurrencyCode = (currencyName: string | null): string => {
      if (!currencyName) return 'USD';
      const normalized = currencyName.toLowerCase().trim();
      if (normalized.includes('peso') || normalized.includes('ars')) return 'ARS';
      if (normalized.includes('dolar') || normalized.includes('usd') || normalized.includes('dólar')) return 'USD';
      // Si ya es un código ISO válido, devolverlo
      if (normalized.length === 3) return normalized.toUpperCase();
      return 'USD'; // Fallback
    };
    
    const currencyCode = getCurrencyCode(currency);
    
    try {
      return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(price);
    } catch {
      // Si hay error con el código de moneda, usar formato simple
      return `$${price.toLocaleString('es-AR')} ${currencyCode}`;
    }
  };

  const getLocationText = () => {
    const parts = [];
    if (inmueble.ubicacion_avanzada?.localidad) {
      parts.push(inmueble.ubicacion_avanzada.localidad);
    }
    if (inmueble.ubicacion_avanzada?.direccion) {
      parts.push(inmueble.ubicacion_avanzada.direccion);
    }
    if (inmueble.catalogo_de_zona?.nombre) {
      parts.push(inmueble.catalogo_de_zona.nombre);
    }
    if (inmueble.direccion) {
      parts.push(inmueble.direccion);
    }
    return parts.length > 0 ? parts.join(', ') : 'Villa Carlos Paz';
  };

  const generateContactMessage = () => {
    const location = getLocationText();
    const tipo = inmueble.tipo_inmueble || 'Propiedad';
    const operacion = typeof inmueble.operacion === 'string' ? inmueble.operacion : inmueble.operacion?.nombre;
    const precio = inmueble.precio ? `$${inmueble.precio.toLocaleString()}` : 'Consultar precio';
    
    return `Hola,

Quiero más información del inmueble: ${inmueble.slug}

- Tipo: ${tipo}
- Operación: ${operacion}
- Precio: ${precio}
- Ubicación: ${location}
- Descripción: ${inmueble.descripcion || 'Sin descripción disponible'}

Por favor, contactarme para coordinar una visita o brindarme más detalles.

Gracias.`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con información básica */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
            <span>{inmueble.estado?.nombre || 'Disponible'}</span>
            <span>•</span>
            <span>{inmueble.tipo_inmueble || 'Propiedad'}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{inmueble.nombre}</h1>
          <p className="text-lg text-gray-600">{getLocationText()}</p>
        </div>
      </div>

      {/* Imagen principal / Video con tabs */}
      <div className="bg-white">
        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Tabs */}
          {(images.length > 0 || hasVideos) && (
            <div className="mb-4 border-b border-gray-200">
              <div className="flex space-x-1">
                {images.length > 0 && (
                  <button
                    onClick={() => setActiveTab('fotos')}
                    className={`px-6 py-3 text-sm font-medium transition-colors ${
                      activeTab === 'fotos'
                        ? 'text-green-600 border-b-2 border-green-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Fotos
                  </button>
                )}
                {hasVideos && (
                  <button
                    onClick={() => setActiveTab('videos')}
                    className={`px-6 py-3 text-sm font-medium transition-colors ${
                      activeTab === 'videos'
                        ? 'text-green-600 border-b-2 border-green-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Videos
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="relative">
            {/* Contenido de Fotos */}
            {activeTab === 'fotos' && (
              <>
                {images.length > 0 ? (
                  <div className="relative aspect-video rounded-lg overflow-hidden">
                    <Image
                      src={currentImage}
                      alt={inmueble.nombre}
                      fill
                      className="object-cover"
                      priority
                    />
                    
                    {/* Contador de imágenes */}
                    {images.length > 1 && (
                      <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                        {selectedImageIndex + 1} / {images.length}
                      </div>
                    )}

                    {/* Controles de navegación */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={() => setSelectedImageIndex(prev => prev > 0 ? prev - 1 : images.length - 1)}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setSelectedImageIndex(prev => prev < images.length - 1 ? prev + 1 : 0)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="aspect-video bg-gray-300 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 text-lg">Sin imagen</span>
                  </div>
                )}

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="mt-4">
                    <div className="flex space-x-2 overflow-x-auto pb-2">
                      {images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`relative flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                            index === selectedImageIndex 
                              ? 'border-green-600 ring-2 ring-green-200' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Image
                            src={image}
                            alt={`${inmueble.nombre} - Imagen ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Contenido de Videos */}
            {activeTab === 'videos' && (
              <>
                {youtubeVideoSrc ? (
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
                    <iframe
                      src={youtubeVideoSrc}
                      title={`Video de ${inmueble.nombre}`}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-gray-300 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 text-lg">Sin video disponible</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenido principal */}
          <div className="lg:col-span-2">
            {/* Precio destacado */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {formatPrice(inmueble.precio, inmueble.precio_ref?.moneda?.nombre || null)}
              </div>
              <div className="text-gray-600">
                {typeof inmueble.operacion === 'string' ? inmueble.operacion : inmueble.operacion?.nombre} • {inmueble.tipo_inmueble || 'Propiedad'}
              </div>
            </div>

            {/* Características principales */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Características principales</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {inmueble.habitaciones && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{inmueble.habitaciones}</div>
                    <div className="text-sm text-gray-600">Dormitorios</div>
                  </div>
                )}
                {inmueble.banos && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{inmueble.banos}</div>
                    <div className="text-sm text-gray-600">Baños</div>
                  </div>
                )}
                {inmueble.superficie && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{inmueble.superficie}m²</div>
                    <div className="text-sm text-gray-600">Superficie</div>
                  </div>
                )}
                {inmueble.ambientes && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{inmueble.ambientes}</div>
                    <div className="text-sm text-gray-600">Ambientes</div>
                  </div>
                )}
              </div>
            </div>

            {/* Descripción */}
            {inmueble.descripcion && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Descripción</h2>
                <div 
                  className="text-gray-700 leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: getSanitizedDescription() }}
                />
              </div>
            )}

            {/* Servicios */}
            {inmueble.servicios && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Servicios</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(inmueble.servicios).map(([key, value]) => {
                    if (typeof value === 'boolean' && key !== 'id') {
                      const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                      return (
                        <div key={key} className="flex items-center space-x-2">
                          {value ? (
                            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          )}
                          <span className={`text-sm ${value ? 'text-gray-900' : 'text-gray-500'}`}>
                            {label}
                          </span>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            )}

            {/* Amenities */}
            {inmueble.amenities && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(inmueble.amenities).map(([key, value]) => {
                    if (typeof value === 'boolean' && key !== 'id') {
                      const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                      return (
                        <div key={key} className="flex items-center space-x-2">
                          {value ? (
                            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          )}
                          <span className={`text-sm ${value ? 'text-gray-900' : 'text-gray-500'}`}>
                            {label}
                          </span>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            )}

            {/* Comodidades Internas */}
            {inmueble.comodidades_internas && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Comodidades Internas</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(inmueble.comodidades_internas).map(([key, value]) => {
                    if (typeof value === 'boolean' && key !== 'id') {
                      const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                      return (
                        <div key={key} className="flex items-center space-x-2">
                          {value ? (
                            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          )}
                          <span className={`text-sm ${value ? 'text-gray-900' : 'text-gray-500'}`}>
                            {label}
                          </span>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            )}

            {/* Detalles adicionales */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Detalles de la propiedad</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inmueble.estado_general && (
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Estado general:</span>
                    <span className="font-medium capitalize">{inmueble.estado_general}</span>
                  </div>
                )}
                {inmueble.orientacion && (
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Orientación:</span>
                    <span className="font-medium">{inmueble.orientacion}</span>
                  </div>
                )}
                {inmueble.piso && (
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Piso:</span>
                    <span className="font-medium">{inmueble.piso}</span>
                  </div>
                )}
                {inmueble.cochera && (
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Cochera:</span>
                    <span className="font-medium">{inmueble.cochera ? 'Sí' : 'No'}</span>
                  </div>
                )}
                {inmueble.tipo_de_ambiente && (
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Tipo de ambiente:</span>
                    <span className="font-medium capitalize">{inmueble.tipo_de_ambiente}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Galería de imágenes */}
            {images.length > 1 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Galería de imágenes</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedImageIndex(index);
                        setModalImageIndex(index);
                        setIsModalOpen(true);
                      }}
                      className="relative aspect-square rounded-lg overflow-hidden hover:opacity-80 transition-opacity"
                    >
                      <Image
                        src={image}
                        alt={`${inmueble.nombre} - Imagen ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Información de contacto */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Información de contacto</h3>
              <div className="space-y-4">
                <Link 
                  href={`/contacto?mensaje=${encodeURIComponent(generateContactMessage())}`}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors font-semibold text-center block"
                >
                  Solicitar información
                </Link>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                {inmueble.contacto && (
                  <>
                    <p className="text-sm text-gray-600">
                      <strong>Teléfono:</strong> {inmueble.contacto.telefono || 'No disponible'}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Email:</strong> {inmueble.contacto.email || 'No disponible'}
                    </p>
                    {inmueble.contacto.whatsapp && (
                      <p className="text-sm text-gray-600">
                        <strong>WhatsApp:</strong> {inmueble.contacto.whatsapp}
                      </p>
                    )}
                  </>
                )}
                {!inmueble.contacto && (
                  <>
                    <p className="text-sm text-gray-600">
                      <strong>Teléfono:</strong> {configuration?.contactos && configuration.contactos.length > 0 ? configuration.contactos[0].telefono : ''}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Email:</strong> {configuration?.contactos && configuration.contactos.length > 0 ? configuration.contactos[0].email : ''}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Ubicación */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Ubicación</h3>
              <div className="text-gray-700">
                <p className="mb-2">{getLocationText()}</p>
                {inmueble.latitud && inmueble.longitud && (
                  <div className="mt-4">
                    <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500">Mapa</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de imagen */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-white text-2xl z-10 hover:text-gray-300"
            >
              ×
            </button>
            <Image
              src={images[modalImageIndex]}
              alt={`${inmueble.nombre} - Imagen ${modalImageIndex + 1}`}
              width={800}
              height={600}
              className="object-contain max-h-[80vh]"
            />
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setModalImageIndex(index)}
                    className={`w-3 h-3 rounded-full ${
                      index === modalImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
