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
    <div className={`bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-lg ${
      isDestacado ? 'ring-2 ring-green-600' : ''
    }`}>
      <div className="relative h-48 overflow-hidden">
        <Image
          src={getImageUrl(property.imagenes)}
          alt={property.nombre}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {isDestacado && (
          <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold">
            DESTACADO
          </div>
        )}
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
          {property.tipo}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {property.nombre}
        </h3>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-green-600">
            {formatPrice(property.precio_inmueble || property.precio, property.moneda)}
          </span>
          <span className="text-sm text-gray-500">
            {property.zona || property.localidad}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {property.habitaciones || 0} dorm.
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6z" />
              </svg>
              {property.banos || 0} baños
            </span>
          </div>
          <span className="text-gray-500">
            {property.superficie ? `${property.superficie}m²` : 'N/A'}
          </span>
        </div>
        
        <Link
          href={`/inmueble/${property.id}`}
          className="block w-full bg-green-600 text-white text-center py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-200 font-semibold"
        >
          Ver más
        </Link>
      </div>
    </div>
  );
} 