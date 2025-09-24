'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZona, setSelectedZona] = useState('');
  const [selectedTipo, setSelectedTipo] = useState('');
  const [selectedOperacion, setSelectedOperacion] = useState('comprar');
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
    if (selectedOperacion) {
      params.append('operacion', selectedOperacion);
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
          
          {/* RE/MAX Style Search Form */}
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              {/* Operation Type Tabs */}
              <div className="flex border-b border-gray-200">
                <button
                  type="button"
                  onClick={() => setSelectedOperacion('comprar')}
                  className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                    selectedOperacion === 'comprar'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Quiero comprar
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOperacion('alquilar')}
                  className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                    selectedOperacion === 'alquilar'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Quiero alquilar
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOperacion('vender')}
                  className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                    selectedOperacion === 'vender'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Quiero vender
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOperacion('emprendimientos')}
                  className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                    selectedOperacion === 'emprendimientos'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Emprendimientos
                </button>
              </div>

              {/* Search Form */}
              <form onSubmit={handleSearch} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Search Input */}
                  <div className="lg:col-span-2">
                    <input
                      type="text"
                      placeholder="¿Dónde querés mudarte?"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-gray-900"
                    />
                  </div>
                  
                  {/* Property Type */}
                  <div>
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
                  
                  {/* Location */}
                  <div>
                    <select
                      value={selectedZona}
                      onChange={(e) => setSelectedZona(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-gray-900"
                    >
                      <option value="">Ubicación</option>
                      <option value="Centro">Centro</option>
                      <option value="Villa del Lago">Villa del Lago</option>
                      <option value="San Antonio">San Antonio</option>
                      <option value="La Calera">La Calera</option>
                      <option value="Cuesta Blanca">Cuesta Blanca</option>
                      <option value="Tanti">Tanti</option>
                      <option value="Costa Azul">Costa Azul</option>
                    </select>
                  </div>
                </div>
                
                {/* Search Button */}
                <div className="mt-6">
                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-4 px-8 rounded-md hover:bg-green-700 transition-colors font-semibold text-lg shadow-lg"
                  >
                    {selectedOperacion === 'comprar' && 'Quiero comprar'}
                    {selectedOperacion === 'alquilar' && 'Quiero alquilar'}
                    {selectedOperacion === 'vender' && 'Quiero vender'}
                    {selectedOperacion === 'emprendimientos' && 'Ver emprendimientos'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 