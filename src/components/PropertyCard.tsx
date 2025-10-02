import Image from 'next/image';
import Link from 'next/link';
import { Inmueble } from '@/types';

interface PropertyCardProps {
  property: Inmueble;
  isDestacado?: boolean;
}

export default function PropertyCard({ property, isDestacado = false }: PropertyCardProps) {
  const formatPrice = (price: number | null, currency: string | null) => {
    if (!price) return 'Consultar';
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getImageUrl = (images: string[]) => {
    if (images && images.length > 0) {
      return images[0];
    }
    return '/placeholder-property.jpg';
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
      isDestacado ? 'ring-2 ring-green-500' : ''
    }`}>
      <div className="relative h-64 overflow-hidden">
        <Image
          src={getImageUrl(property.imagenes)}
          alt={property.nombre}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {isDestacado && (
          <div className="absolute top-3 left-3 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold tracking-wide">
            DESTACADO
          </div>
        )}
        <div className="absolute top-3 right-3 bg-white bg-opacity-90 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold">
          {property.tipo?.nombre || 'Propiedad'}
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <div className="bg-white bg-opacity-95 rounded-lg p-2">
            <span className="text-lg font-bold text-green-600">
              {formatPrice(property.precio_inmueble || property.precio, property.moneda)}
            </span>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-3">
          <span className="text-sm text-gray-500 font-medium">
            {property.zona || property.localidad}
          </span>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
          {property.nombre}
        </h3>
        
        <div className="flex items-center justify-between text-sm text-gray-600 mb-6">
          <div className="flex items-center space-x-4">
            <span className="flex items-center bg-gray-100 px-2 py-1 rounded-full">
              <svg className="w-4 h-4 mr-1 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {property.habitaciones || 0} dorm.
            </span>
            <span className="flex items-center bg-gray-100 px-2 py-1 rounded-full">
              <svg className="w-4 h-4 mr-1 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6z" />
              </svg>
              {property.banos || 0} baños
            </span>
          </div>
          <span className="bg-gray-100 px-2 py-1 rounded-full text-gray-600">
            {property.superficie ? `${property.superficie}m²` : 'N/A'}
          </span>
        </div>
        
        <Link
          href={`/inmueble/${property.id}`}
          className="block w-full bg-green-600 text-white text-center py-3 px-4 rounded-lg hover:bg-green-700 transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
        >
          Ver más detalles
        </Link>
      </div>
    </div>
  );
} 