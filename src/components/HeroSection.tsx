'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZona, setSelectedZona] = useState('');
  const [selectedTipo, setSelectedTipo] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    
    if (searchQuery.trim()) {
      params.append('search', searchQuery);
    }
    if (selectedZona) {
      params.append('zona', selectedZona);
    }
    if (selectedTipo) {
      params.append('tipo', selectedTipo);
    }

    const queryString = params.toString();
    router.push(`/inmuebles${queryString ? `?${queryString}` : ''}`);
  };

  return (
    <section className="relative h-[600px] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(https://static.wixstatic.com/media/766cf0_8996761e261444b79e8857de3fb84e51~mv2.jpg/v1/fill/w_1960,h_754,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/766cf0_8996761e261444b79e8857de3fb84e51~mv2.jpg)' }}>
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      
      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Encuentra tu hogar ideal
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Descubre las mejores propiedades en las zonas más exclusivas de Villa Carlos Paz
          </p>
          
          {/* Search Form */}
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSearch} className="bg-white rounded-lg p-6 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                                <input
                type="text"
                placeholder="Buscar por dirección, zona o características..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
              />
                </div>
                
                <div>
                  <select
                    value={selectedZona}
                    onChange={(e) => setSelectedZona(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  >
                    <option value="">Todas las zonas</option>
                    <option value="Centro">Centro</option>
                    <option value="Villa del Lago">Villa del Lago</option>
                    <option value="San Antonio">San Antonio</option>
                    <option value="La Calera">La Calera</option>
                    <option value="Cuesta Blanca">Cuesta Blanca</option>
                    <option value="Tanti">Tanti</option>
                  </select>
                </div>
                
                <div>
                  <select
                    value={selectedTipo}
                    onChange={(e) => setSelectedTipo(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  >
                    <option value="">Todos los tipos</option>
                    <option value="Departamento">Departamento</option>
                    <option value="Casa">Casa</option>
                    <option value="Casaquinta">Casaquinta</option>
                    <option value="Casa Quinta">Casa Quinta</option>
                    <option value="Terreno">Terreno</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-4">
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition-colors font-semibold text-lg"
                >
                  Buscar Propiedades
                </button>
              </div>
            </form>
          </div>
          
          {/* Stats */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">200+</div>
              <div className="text-lg">Propiedades</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">15+</div>
              <div className="text-lg">Zonas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-lg">Clientes Satisfechos</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 