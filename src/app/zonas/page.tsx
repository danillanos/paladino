'use client';

import Link from 'next/link';
import Image from 'next/image';

// Datos de zonas organizadas por región de Villa Carlos Paz
const zonasData = {
  "Villa Carlos Paz Centro": {
    "Centro": {
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center",
      description: "Corazón comercial y turístico de la ciudad",
      subzonas: ["Centro Comercial", "Plaza San Martín", "Av. San Martín", "Zona Hotelera"]
    },
    "Villa del Lago": {
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center",
      description: "Zona residencial junto al lago San Roque",
      subzonas: ["Villa del Lago Norte", "Villa del Lago Sur", "Costanera", "Club Náutico"]
    },
    "San Antonio": {
      image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&h=300&fit=crop&crop=center",
      description: "Barrio residencial con vista al lago",
      subzonas: ["San Antonio Norte", "San Antonio Sur", "Loteo San Antonio", "Club de Pesca"]
    },
    "La Calera": {
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center",
      description: "Zona residencial tranquila y familiar",
      subzonas: ["La Calera Centro", "La Calera Norte", "Loteo La Calera", "Club de Golf"]
    },
    "Villa Parque": {
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center",
      description: "Barrio con amplios espacios verdes",
      subzonas: ["Villa Parque Norte", "Villa Parque Sur", "Parque Recreativo", "Club Social"]
    },
    "Villa Esquiú": {
      image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&h=300&fit=crop&crop=center",
      description: "Zona residencial con vista panorámica",
      subzonas: ["Villa Esquiú Alto", "Villa Esquiú Bajo", "Mirador", "Club de Montaña"]
    }
  },
  "Zona Norte": {
    "Cuesta Blanca": {
      image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&h=300&fit=crop&crop=center",
      description: "Zona residencial premium con vista al lago",
      subzonas: ["Cuesta Blanca Norte", "Cuesta Blanca Sur", "Loteo Cuesta Blanca", "Club Náutico"]
    },
    "Villa Río Icho Cruz": {
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center",
      description: "Zona residencial junto al río",
      subzonas: ["Villa Río Norte", "Villa Río Sur", "Club de Pesca", "Camping"]
    },
    "Tanti": {
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center",
      description: "Pueblo serrano con tradición turística",
      subzonas: ["Tanti Centro", "Tanti Norte", "Club de Montaña", "Cascada"]
    }
  },
  "Zona Sur": {
    "Villa Giardino": {
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center",
      description: "Zona residencial con jardines",
      subzonas: ["Villa Giardino Norte", "Villa Giardino Sur", "Club Social", "Parque"]
    },
    "La Falda": {
      image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&h=300&fit=crop&crop=center",
      description: "Ciudad turística con tradición hotelera",
      subzonas: ["La Falda Centro", "La Falda Norte", "Hotel Edén", "Parque Sarmiento"]
    }
  }
};

export default function ZonasPage() {
  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Header Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Localidades
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Ofrecemos las mejores viviendas de lujo en venta y en alquiler en las mejores ubicaciones de Villa Carlos Paz y sus alrededores. 
              Paladino Propiedades ayuda a sus clientes a encontrar la vivienda ideal con un alto nivel de profesionalidad y un servicio excelente.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Villa Carlos Paz Centro */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Villa Carlos Paz Centro</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(zonasData["Villa Carlos Paz Centro"]).map(([zona, data]) => (
              <div
                key={zona}
                className="group block cursor-pointer"
                onClick={() => window.location.href = `/inmuebles?zona=${encodeURIComponent(zona)}`}
              >
                <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={data.image}
                      alt={zona}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white mb-1">
                        {zona}
                      </h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 text-sm mb-4">
                      {data.description}
                    </p>
                    <div className="space-y-1">
                      {data.subzonas.map((subzona) => (
                        <Link
                          key={subzona}
                          href={`/inmuebles?zona=${encodeURIComponent(subzona)}`}
                          className="block text-sm text-green-600 hover:text-green-700 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {subzona}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Zona Norte */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Zona Norte</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(zonasData["Zona Norte"]).map(([zona, data]) => (
              <div
                key={zona}
                className="group block cursor-pointer"
                onClick={() => window.location.href = `/inmuebles?zona=${encodeURIComponent(zona)}`}
              >
                <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={data.image}
                      alt={zona}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white mb-1">
                        {zona}
                      </h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 text-sm mb-4">
                      {data.description}
                    </p>
                    <div className="space-y-1">
                      {data.subzonas.map((subzona) => (
                        <Link
                          key={subzona}
                          href={`/inmuebles?zona=${encodeURIComponent(subzona)}`}
                          className="block text-sm text-green-600 hover:text-green-700 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {subzona}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Zona Sur */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Zona Sur</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(zonasData["Zona Sur"]).map(([zona, data]) => (
              <div
                key={zona}
                className="group block cursor-pointer"
                onClick={() => window.location.href = `/inmuebles?zona=${encodeURIComponent(zona)}`}
              >
                <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={data.image}
                      alt={zona}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white mb-1">
                        {zona}
                      </h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 text-sm mb-4">
                      {data.description}
                    </p>
                    <div className="space-y-1">
                      {data.subzonas.map((subzona) => (
                        <Link
                          key={subzona}
                          href={`/inmuebles?zona=${encodeURIComponent(subzona)}`}
                          className="block text-sm text-green-600 hover:text-green-700 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {subzona}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Call to Action Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ¿No encuentras la zona que buscas?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Contáctanos y te ayudaremos a encontrar la ubicación perfecta para tu próxima propiedad
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/inmuebles"
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Ver todas las propiedades
            </Link>
            <Link
              href="/contacto"
              className="border-2 border-green-600 text-green-600 px-8 py-3 rounded-lg hover:bg-green-600 hover:text-white transition-colors font-semibold"
            >
              Contactar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 