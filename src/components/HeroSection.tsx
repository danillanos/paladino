'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');
  // const [selectedZona, setSelectedZona] = useState(''); // Comentado porque no se usa
  const [selectedTipo, setSelectedTipo] = useState('');
  const [selectedOperacion, setSelectedOperacion] = useState('comprar');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    
    if (searchQuery.trim()) {
      params.append('search', searchQuery);
    }
    // if (selectedZona) {
    //   params.append('zona', selectedZona);
    // }
    if (selectedTipo) {
      params.append('tipo', selectedTipo);
    }
    if (selectedOperacion) {
      params.append('operacion', selectedOperacion);
    }

    const queryString = params.toString();
    router.push(`/inmuebles${queryString ? `?${queryString}` : ''}`);
  };

  return (
    <section className="relative min-h-[500px] md:h-[600px] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(https://static.wixstatic.com/media/766cf0_8996761e261444b79e8857de3fb84e51~mv2.jpg/v1/fill/w_1960,h_754,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/766cf0_8996761e261444b79e8857de3fb84e51~mv2.jpg)' }}>
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      
      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full py-8">
        <div className="text-center text-white px-4 w-full">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 md:mb-6">
            Invertí en Villa Carlos Paz
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-6 md:mb-8 max-w-2xl mx-auto">
            Descubre las mejores propiedades en las zonas más exclusivas de Villa Carlos Paz
          </p>
          
          {/* Simple Search Form */}
          <div className="max-w-4xl mx-auto px-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Operation Type Tabs */}
              <div className="flex">
                <button
                  type="button"
                  onClick={() => setSelectedOperacion('comprar')}
                  className={`flex-1 py-3 px-4 text-center font-bold transition-colors ${
                    selectedOperacion === 'comprar'
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300'
                  }`}
                >
                  <span className="hidden sm:inline">Quiero comprar</span>
                  <span className="sm:hidden">Comprar</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOperacion('alquilar')}
                  className={`flex-1 py-3 px-4 text-center font-bold transition-colors ${
                    selectedOperacion === 'alquilar'
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300'
                  }`}
                >
                  <span className="hidden sm:inline">Quiero alquilar</span>
                  <span className="sm:hidden">Alquilar</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOperacion('emprendimientos')}
                  className={`flex-1 py-3 px-4 text-center font-bold transition-colors ${
                    selectedOperacion === 'emprendimientos'
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300'
                  }`}
                >
                  <span className="hidden sm:inline">Emprendimientos</span>
                  <span className="sm:hidden">Proyectos</span>
                </button>
              </div>

              {/* Search Form */}
              <form onSubmit={handleSearch} className="p-4">
                <div className="flex flex-col md:flex-row gap-2">
                  {/* Location Input */}
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="¿Que propiedad estas buscando?"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-gray-900"
                    />
                  </div>
                  
                  {/* Property Type */}
                  <div className="flex-1">
                    <select
                      value={selectedTipo}
                      onChange={(e) => setSelectedTipo(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-gray-900"
                    >
                      <option value="">Tipo de propiedad</option>
                      <option value="Departamento">Departamento</option>
                      <option value="Casa">Casa</option>
                      <option value="Casaquinta">Casaquinta</option>
                      <option value="Casa Quinta">Casa Quinta</option>
                      <option value="Terreno">Terreno</option>
                      <option value="Monoambiente">Monoambiente</option>
                    </select>
                  </div>
                  
                  {/* Search Button */}
                  <div>
                    <button
                      type="submit"
                      className="w-full md:w-auto bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition-colors font-semibold"
                    >
                      <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 