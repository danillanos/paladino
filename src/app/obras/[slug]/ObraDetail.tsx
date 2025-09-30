'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Obra } from '@/types';

interface ObraDetailProps {
  obra: Obra;
}

export default function ObraDetail({ obra }: ObraDetailProps) {
  const [selectedImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  // Obtener todas las imágenes disponibles
  const getAllImages = () => {
    const images = [];
    
    // Agregar imagen de portada si existe
    if (obra.imagen_portada?.url) {
      images.push({
        url: obra.imagen_portada.url.startsWith('http') 
          ? obra.imagen_portada.url 
          : `https://api.paladinopropiedades.com.ar${obra.imagen_portada.url}`,
        alt: obra.nombre,
        isCover: true
      });
    }
    
    // Agregar imágenes de la galería
    if (obra.galeria && obra.galeria.length > 0) {
      obra.galeria.forEach((img, index) => {
        if (img?.url) {
          images.push({
            url: img.url.startsWith('http') 
              ? img.url 
              : `https://api.paladinopropiedades.com.ar${img.url}`,
            alt: `${obra.nombre} - Imagen ${index + 1}`,
            isCover: false
          });
        }
      });
    }
    
    return images;
  };

  const images = getAllImages();
  const currentImage = images[selectedImageIndex];

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

  return (
    <div className="min-h-screen bg-white">
      {/* Header con diseño de dos columnas */}
      <div className="bg-white">
        <div className="max-w-6xl mx-auto px-4 py-8 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-6">
            {/* Columna izquierda - Información */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{obra.nombre}</h1>
                <p className="text-lg text-gray-600 mb-4">
                  {obra.ubicacion}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {obra.ubicacion}
                  </span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {obra.tipo_obra}
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-500 mb-6">
                  Año: {obra.anio}
                </div>
              </div>
              
              {/* Información básica */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-gray-800">{obra.anio}</div>
                  <div className="text-sm text-gray-600">Año de construcción</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-gray-800">{obra.tipo_obra}</div>
                  <div className="text-sm text-gray-600">Tipo de obra</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-gray-800">{obra.constructora}</div>
                  <div className="text-sm text-gray-600">Constructora</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-gray-800">{obra.arquitecto || 'N/A'}</div>
                  <div className="text-sm text-gray-600">Arquitecto</div>
                </div>
              </div>
            </div>
            
            {/* Columna derecha - Imagen */}
            <div className="relative">
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
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenido principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Descripción */}
            {obra.descripcion && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Descripción
                </h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {obra.descripcion}
                  </p>
                </div>
              </section>
            )}

            {/* Información técnica */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Información técnica
              </h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-600">Constructora:</span>
                    <span className="font-semibold ml-2">{obra.constructora}</span>
                  </div>
                  {obra.arquitecto && (
                    <div>
                      <span className="text-gray-600">Arquitecto:</span>
                      <span className="font-semibold ml-2">{obra.arquitecto}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-600">Año de construcción:</span>
                    <span className="font-semibold ml-2">{obra.anio}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Tipo de obra:</span>
                    <span className="font-semibold ml-2 capitalize">{obra.tipo_obra}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Ubicación */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Ubicación
              </h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-2">
                  <strong>Dirección:</strong> {obra.ubicacion}
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Localidad:</strong> Villa Carlos Paz
                </p>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Información de contacto */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                ¿Interesado en esta obra?
              </h3>
              <p className="text-gray-600 mb-4">
                Contáctanos para más información sobre esta obra realizada por {obra.constructora}.
              </p>
              <div className="space-y-3">
                <button className="w-full bg-slate-600 text-white py-3 px-4 rounded-md hover:bg-slate-700 transition-colors font-semibold">
                  Contactar por WhatsApp
                </button>
                <button className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-md hover:bg-gray-300 transition-colors font-semibold">
                  Solicitar información
                </button>
              </div>
            </div>

            {/* Información adicional */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Detalles del proyecto
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Constructora:</span>
                  <span className="font-semibold">{obra.constructora}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Año:</span>
                  <span className="font-semibold">{obra.anio}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tipo:</span>
                  <span className="font-semibold capitalize">{obra.tipo_obra}</span>
                </div>
                {obra.arquitecto && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Arquitecto:</span>
                    <span className="font-semibold">{obra.arquitecto}</span>
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
                    selectedImageIndex === index ? 'ring-2 ring-slate-600' : ''
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
