'use client';

import Link from 'next/link';
import Image from 'next/image';

const featuredLocations = [
  {
    id: 1,
    name: 'Centro',
    description: 'Corazón comercial y turístico',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center',
    propertiesCount: 25
  },
  {
    id: 2,
    name: 'Villa del Lago',
    description: 'Zona residencial junto al lago',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=center',
    propertiesCount: 18
  },
  {
    id: 3,
    name: 'San Antonio',
    description: 'Barrio residencial con vista al lago',
    image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&h=400&fit=crop&crop=center',
    propertiesCount: 32
  },
  {
    id: 4,
    name: 'La Calera',
    description: 'Zona residencial tranquila',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=center',
    propertiesCount: 15
  },
  {
    id: 5,
    name: 'Cuesta Blanca',
    description: 'Zona premium con vista al lago',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center',
    propertiesCount: 22
  },
  {
    id: 6,
    name: 'Tanti',
    description: 'Pueblo serrano turístico',
    image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&h=400&fit=crop&crop=center',
    propertiesCount: 28
  }
];

export default function FeaturedLocations() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Consulta nuestras ubicaciones más destacadas
          </h2>
                      <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              En Paladino Propiedades, proporcionamos a nuestros clientes las mejores casas y departamentos de lujo en Villa Carlos Paz y sus alrededores.
            </p>
        </div>
        
        {/* Locations Grid - Exactamente como Lucas Fox */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12 max-w-4xl mx-auto">
          {featuredLocations.map((location) => (
            <Link
              key={location.id}
              href={`/inmuebles?zona=${encodeURIComponent(location.name)}`}
              className="group block"
            >
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={location.image}
                  alt={location.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <h3 className="text-white font-bold text-lg uppercase tracking-wide">
                    {location.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              ¿Buscas más ubicaciones?
            </h3>
            <p className="text-gray-600 mb-6">
              Explora todas nuestras ubicaciones disponibles en Villa Carlos Paz y encuentra la zona perfecta para ti
            </p>
            <Link
              href="/zonas"
              className="inline-flex items-center bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Ver todas nuestras ubicaciones
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
