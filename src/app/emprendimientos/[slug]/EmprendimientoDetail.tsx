'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Emprendimiento } from '@/types';
import { useSiteConfiguration } from '@/hooks/useSiteConfiguration';

interface EmprendimientoDetailProps {
  emprendimiento: Emprendimiento;
}

export default function EmprendimientoDetail({ emprendimiento }: EmprendimientoDetailProps) {
  const [selectedImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'fotos' | 'videos'>('fotos');
  const { configuration } = useSiteConfiguration();

  // Obtener todas las imágenes disponibles
  const getAllImages = () => {
    const images = [];
    
    // Agregar imagen de cover si existe
    if (emprendimiento.cover?.url) {
      images.push({
        url: emprendimiento.cover.url.startsWith('http') 
          ? emprendimiento.cover.url 
          : `https://api.paladinopropiedades.com.ar${emprendimiento.cover.url}`,
        alt: emprendimiento.nombre,
        isCover: true
      });
    }
    
    // Agregar imágenes de la galería
    if (emprendimiento.galeria && emprendimiento.galeria.length > 0) {
      emprendimiento.galeria.forEach((img, index) => {
        if (img?.url) {
          images.push({
            url: img.url.startsWith('http') 
              ? img.url 
              : `https://api.paladinopropiedades.com.ar${img.url}`,
            alt: `${emprendimiento.nombre} - Imagen ${index + 1}`,
            isCover: false
          });
        }
      });
    }
    
    return images;
  };

  const images = getAllImages();
  const currentImage = images[selectedImageIndex];

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
  const youtubeVideoField = (emprendimiento as any).Youtube_video || (emprendimiento as any).youtube_video || emprendimiento.youtube_video;
  const youtubeVideoSrc = parseYouTubeIframe(youtubeVideoField);
  const hasVideos = !!youtubeVideoSrc;

  // Funciones para manejar el modal
  const openModal = (index: number) => {
    setModalImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const nextImage = () => {
    setModalImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setModalImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Extraer información de las secciones
  const getSectionContent = (componentType: string) => {
    return emprendimiento.secciones?.find(section => section.__component === componentType);
  };

  const descripcion = getSectionContent('emprendimientos.descripcion-general');
  const precio = getSectionContent('emprendimientos.precio-financiamiento');
  const amenities = getSectionContent('infraestructura.amenities');

  // Debug: Log amenities data
  console.log('Amenities data:', amenities);
  console.log('All sections:', emprendimiento.secciones);

  // Helper function to get precio texto safely
  const getPrecioTexto = () => {
    if (precio && precio.__component === 'emprendimientos.precio-financiamiento') {
      return (precio as unknown as Record<string, unknown>).texto as string || 'Consultar precio';
    }
    return 'Consultar precio';
  };

  // Helper function to get descripcion contenido safely
  const getDescripcionContenido = () => {
    if (descripcion && descripcion.__component === 'emprendimientos.descripcion-general') {
      return (descripcion as unknown as Record<string, unknown>).contenido as string || 'Descripción no disponible';
    }
    return 'Descripción no disponible';
  };

  const generateContactMessage = () => {
    const precioTexto = getPrecioTexto();
    const descripcionTexto = getDescripcionContenido();
    const ubicacion = emprendimiento.ubicacion_avanzada 
      ? `${emprendimiento.ubicacion_avanzada.localidad}, ${emprendimiento.ubicacion_avanzada.direccion}`
      : 'Villa Carlos Paz';
    
    return `Hola,

Quiero más información del emprendimiento: ${emprendimiento.slug}

- Nombre: ${emprendimiento.nombre}
- Precio: ${precioTexto}
- Ubicación: ${ubicacion}
- Descripción: ${descripcionTexto}

Por favor, contactarme para coordinar una visita o brindarme más detalles.

Gracias.`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header con diseño de dos columnas */}
      <div className="bg-white">
        <div className="max-w-6xl mx-auto px-4 py-8 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-6">
            {/* Columna izquierda - Información */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{emprendimiento.nombre}</h1>
                <p className="text-lg text-gray-600 mb-4">
                  {emprendimiento.ubicacion_avanzada?.direccion}, {emprendimiento.ubicacion_avanzada?.localidad}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {emprendimiento.ubicacion_avanzada?.localidad || 'Villa Carlos Paz'}
                  </span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {(emprendimiento as unknown as Record<string, unknown>).tipo_emprendimiento as string || 'Emprendimiento'}
                  </span>
                </div>
                {precio && (
                  <div className="text-2xl font-bold text-gray-500 mb-6">
                    {getPrecioTexto()}
                  </div>
                )}
              </div>
              
              {/* Información básica */}
              {/* <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-gray-800">{(emprendimiento as any).dormitorios || 'N/A'}</div>
                  <div className="text-sm text-gray-600">Dormitorios</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-gray-800">{(emprendimiento as any).banos || 'N/A'}</div>
                  <div className="text-sm text-gray-600">Baños</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-gray-800">{(emprendimiento as any).superficie || 'N/A'}</div>
                  <div className="text-sm text-gray-600">m²</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-gray-800">{(emprendimiento as any).garajes || 'N/A'}</div>
                  <div className="text-sm text-gray-600">Garajes</div>
                </div>
              </div> */}
            </div>
            
            {/* Columna derecha - Imagen / Video con tabs */}
            <div className="relative">
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

              {/* Contenido de Fotos */}
              {activeTab === 'fotos' && (
                <>
                  {currentImage ? (
                    <div className="relative h-[500px] rounded-lg overflow-hidden shadow-lg">
                      <Image
                        src={currentImage.url}
                        alt={currentImage.alt}
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>
                  ) : (
                    <div className="h-[500px] bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500 text-lg">Sin imagen disponible</span>
                    </div>
                  )}
                </>
              )}

              {/* Contenido de Videos */}
              {activeTab === 'videos' && (
                <>
                  {youtubeVideoSrc ? (
                    <div className="relative h-[500px] rounded-lg overflow-hidden shadow-lg bg-black">
                      <iframe
                        src={youtubeVideoSrc}
                        title={`Video de ${emprendimiento.nombre}`}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <div className="h-[500px] bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500 text-lg">Sin video disponible</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenido principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Descripción */}
            {descripcion && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Sobre este emprendimiento
                </h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {getDescripcionContenido()}
                  </p>
                </div>
              </section>
            )}

            {/* Amenities */}
            {amenities && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Amenities y características
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(amenities).map(([key, value]) => {
                    if (key.startsWith('__')) return null;
                    
                    const amenityNames: { [key: string]: string } = {
                      pileta: 'Pileta',
                      parrilla: 'Parrilla',
                      solarium: 'Solarium',
                      gimnasio: 'Gimnasio',
                      laundry: 'Laundry',
                      sum: 'SUM',
                      terraza: 'Terraza',
                      balcon: 'Balcón',
                      seguridad: 'Seguridad 24hs',
                      ascensor: 'Ascensor',
                      expensas_incluidas: 'Expensas incluidas',
                      vista_montanas: 'Vistas a las montañas',
                      vista_ciudad: 'Vista a la ciudad',
                      vista_panoramica: 'Vista panorámica',
                      luz_natural: 'Luz natural',
                      ventanas_doble_acristalamiento: 'Ventanas de doble acristalamiento',
                      sistema_domotica: 'Sistema de domótica',
                      se_aceptan_mascotas: 'Se aceptan mascotas',
                      lavadero: 'Lavadero',
                      exterior: 'Exterior',
                      cocina_equipada: 'Cocina equipada',
                      chimenea: 'Chimenea',
                      cerca_transporte_publico: 'Cerca del transporte público',
                      cerca_colegios: 'Cerca de los colegios internacionales',
                      calefaccion: 'Calefacción',
                      aparcamiento: 'Aparcamiento',
                      garaje: 'Garaje',
                      trastero: 'Trastero'
                    };

                    // Mostrar tanto true como null/undefined
                    if (typeof value === 'boolean' || value === null || value === undefined) {
                      const isAvailable = value === true;
                      return (
                        <div key={key} className="flex items-center space-x-2">
                          {isAvailable ? (
                            // Tilde verde para elementos disponibles
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            // X gris claro para elementos no disponibles
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                          <span className={`${isAvailable ? 'text-gray-700' : 'text-gray-400'}`}>
                            {amenityNames[key] || key}
                          </span>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </section>
            )}

            {/* Ubicación */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Ubicación
              </h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-2">
                  <strong>Dirección:</strong> {emprendimiento.ubicacion_avanzada?.direccion || 'No disponible'}
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Localidad:</strong> {emprendimiento.ubicacion_avanzada?.localidad || 'No disponible'}
                </p>
                {emprendimiento.ubicacion_avanzada?.piso && (
                  <p className="text-gray-700">
                    <strong>Piso:</strong> {emprendimiento.ubicacion_avanzada.piso}
                  </p>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Información de contacto */}
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                ¿Te interesa este emprendimiento?
              </h3>
              <div className="space-y-3">
                <Link 
                  href={`/contacto?mensaje=${encodeURIComponent(generateContactMessage())}`}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors font-semibold text-center block"
                >
                  Solicitar información
                </Link>
              </div>
              <div className="mt-4 pt-4 border-t border-green-200">
                <p className="text-sm text-gray-600">
                  <strong>Teléfono:</strong> {configuration?.contactos && configuration.contactos.length > 0 ? configuration.contactos[0].telefono : ''}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Email:</strong> {configuration?.contactos && configuration.contactos.length > 0 ? configuration.contactos[0].email : ''}
                </p>
              </div>
            </div>

            {/* Detalles del emprendimiento */}
            <div className="bg-white border border-gray-200 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Detalles del emprendimiento
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Estado:</span>
                  <span className="font-semibold capitalize">{emprendimiento.estado}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tipo:</span>
                  <span className="font-semibold capitalize">{(emprendimiento as unknown as Record<string, unknown>).tipo_emprendimiento as string || 'No disponible'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Constructora:</span>
                  <span className="font-semibold">{(emprendimiento as unknown as Record<string, unknown>).constructora as string || 'No disponible'}</span>
                </div>
                {((emprendimiento as unknown as Record<string, unknown>).anio as number) && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Año:</span>
                    <span className="font-semibold">{(emprendimiento as unknown as Record<string, unknown>).anio as number}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Galería de imágenes */}
        {images.length > 1 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Galería de imágenes
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => openModal(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer ${
                    selectedImageIndex === index ? 'ring-2 ring-green-600' : ''
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    className="object-cover hover:scale-105 transition-transform"
                  />
                </button>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Modal para ver imágenes en tamaño completo */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-7xl max-h-full">
            {/* Botón cerrar */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full p-2 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Botón anterior */}
            {images.length > 1 && (
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full p-2 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {/* Botón siguiente */}
            {images.length > 1 && (
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full p-2 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}

            {/* Imagen principal */}
            <div className="relative max-w-full max-h-[90vh]">
              <Image
                src={images[modalImageIndex].url}
                alt={images[modalImageIndex].alt}
                width={1200}
                height={800}
                className="max-w-full max-h-full object-contain"
                priority
              />
            </div>

            {/* Contador de imágenes */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                {modalImageIndex + 1} / {images.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
