'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Inmueble } from '@/types';
import { ApiService } from '@/services/api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function InmuebleDetailPage() {
  const params = useParams();
  const [inmueble, setInmueble] = useState<Inmueble | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchInmueble = async () => {
      try {
        setLoading(true);
        const id = parseInt(params.id as string);
        const data = await ApiService.getInmuebleById(id);
        
        if (data) {
          setInmueble(data);
          setError(null);
        } else {
          setError('Propiedad no encontrada');
        }
      } catch (err) {
        setError('Error al cargar la propiedad');
        console.error('Error fetching inmueble:', err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchInmueble();
    }
  }, [params.id]);

  const formatPrice = (price: number | null, currency: string | null) => {
    if (!price) return 'Consultar';
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error || !inmueble) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              {error || 'Propiedad no encontrada'}
            </h1>
            <Link
              href="/inmuebles"
              className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition-colors"
            >
              Volver a las propiedades
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-red-600 transition-colors">
                Inicio
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/inmuebles" className="hover:text-red-600 transition-colors">
                Propiedades
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-800">{inmueble.nombre}</li>
          </ol>
        </nav>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Imágenes */}
          <div className="relative h-96 md:h-[500px]">
            {inmueble.imagenes && inmueble.imagenes.length > 0 ? (
              <>
                <Image
                  src={inmueble.imagenes[selectedImage]}
                  alt={inmueble.nombre}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                />
                
                {/* Navegación de imágenes */}
                {inmueble.imagenes.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {inmueble.imagenes.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`w-3 h-3 rounded-full ${
                          index === selectedImage ? 'bg-white' : 'bg-white bg-opacity-50'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Sin imagen disponible</span>
              </div>
            )}
          </div>

          <div className="p-6 md:p-8">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-800">{inmueble.nombre}</h1>
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {inmueble.tipo}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-green-600">
                  {formatPrice(inmueble.precio_inmueble || inmueble.precio, inmueble.moneda)}
                </div>
                <div className="text-gray-600">
                  <span className="font-semibold">{inmueble.zona}</span>
                </div>
              </div>
            </div>

            {/* Características principales */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-800">{inmueble.habitaciones || 0}</div>
                <div className="text-sm text-gray-600">Dormitorios</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-800">{inmueble.banos || 0}</div>
                <div className="text-sm text-gray-600">Baños</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-800">{inmueble.superficie}</div>
                <div className="text-sm text-gray-600">m²</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-800">{inmueble.estado?.nombre || 'N/A'}</div>
                <div className="text-sm text-gray-600">Estado</div>
              </div>
            </div>

            {/* Descripción */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Descripción</h2>
              <p className="text-gray-600 leading-relaxed">
                {inmueble.descripcion}
              </p>
            </div>

            {/* Información adicional */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Detalles</h3>
                <div className="space-y-2 text-gray-600">
                  <div className="flex justify-between">
                    <span>Tipo:</span>
                    <span className="font-medium">{inmueble.tipo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estado:</span>
                    <span className="font-medium">{inmueble.estado?.nombre || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Zona:</span>
                    <span className="font-medium">{inmueble.zona}</span>
                  </div>
                  {inmueble.superficie_terreno && (
                    <div className="flex justify-between">
                      <span>Superficie terreno:</span>
                      <span className="font-medium">{inmueble.superficie_terreno} m²</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Contacto</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <span>+54 11 1234-5678</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <span>info@paladinopropiedades.com</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span>Av. Principal 123, CABA</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex-1 bg-red-600 text-white py-3 px-6 rounded-md hover:bg-red-700 transition-colors font-semibold">
                Contactar por WhatsApp
              </button>
              <button className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-md hover:bg-gray-700 transition-colors font-semibold">
                Solicitar información
              </button>
              <Link
                href="/inmuebles"
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-md hover:bg-gray-300 transition-colors font-semibold text-center"
              >
                Ver más propiedades
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 