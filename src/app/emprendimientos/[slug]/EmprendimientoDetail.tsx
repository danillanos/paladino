'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Emprendimiento } from '@/types';

interface EmprendimientoDetailProps {
  emprendimiento: Emprendimiento;
}

export default function EmprendimientoDetail({ emprendimiento }: EmprendimientoDetailProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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

  // Extraer información de las secciones
  const getSectionContent = (componentType: string) => {
    return emprendimiento.secciones.find(section => section.__component === componentType);
  };

  const descripcion = getSectionContent('emprendimientos.descripcion-general');
  const precio = getSectionContent('emprendimientos.precio-financiamiento');
  const amenities = getSectionContent('emprendimientos.amenities');

  return (
    <div className="min-h-screen bg-white">
      {/* Header con imagen principal */}
      <div className="relative h-[60vh] min-h-[400px] bg-gray-100">
        {currentImage ? (
          <Image
            src={currentImage.url}
            alt={currentImage.alt}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500 text-lg">Sin imagen disponible</span>
          </div>
        )}
        
        {/* Overlay con información básica */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {emprendimiento.nombre}
              </h1>
              <p className="text-lg opacity-90 mb-4">
                {emprendimiento.ubicacion_avanzada.direccion}, {emprendimiento.ubicacion_avanzada.localidad}
              </p>
              {precio && (
                <div className="text-2xl font-semibold">
                  {precio.texto || 'Consultar precio'}
                </div>
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
                    {descripcion.contenido}
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
                    if (key.startsWith('__') || value === null || value === undefined) return null;
                    
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
                      expensas_incluidas: 'Expensas incluidas'
                    };

                    if (typeof value === 'boolean' && value) {
                      return (
                        <div key={key} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                          <span className="text-gray-700">{amenityNames[key] || key}</span>
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
                  <strong>Dirección:</strong> {emprendimiento.ubicacion_avanzada.direccion}
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Localidad:</strong> {emprendimiento.ubicacion_avanzada.localidad}
                </p>
                {emprendimiento.ubicacion_avanzada.piso && (
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
                <button className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors font-semibold">
                  Solicitar información
                </button>
                <button className="w-full border border-green-600 text-green-600 py-3 px-4 rounded-md hover:bg-green-50 transition-colors font-semibold">
                  Agendar visita
                </button>
              </div>
              <div className="mt-4 pt-4 border-t border-green-200">
                <p className="text-sm text-gray-600">
                  <strong>Teléfono:</strong> +54 9 3541 123-456
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Email:</strong> info@paladinopropiedades.com.ar
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
                  <span className="font-semibold capitalize">{emprendimiento.tipo_emprendimiento}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Constructora:</span>
                  <span className="font-semibold">{emprendimiento.constructora}</span>
                </div>
                {emprendimiento.anio && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Año:</span>
                    <span className="font-semibold">{emprendimiento.anio}</span>
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
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden ${
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
    </div>
  );
}
