import HeroSection from '@/components/HeroSection';
import FeaturedProperties from '@/components/FeaturedProperties';
import FeaturedEmprendimientos from '@/components/FeaturedEmprendimientos';
// import FeaturedLocations from '@/components/FeaturedLocations';

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <FeaturedEmprendimientos />
      <FeaturedProperties />
      {/* <FeaturedLocations /> */}
      
      {/* About Section */}
     {/*  <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              ¿Por qué elegir Paladino Propiedades?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Con más de 10 años de experiencia en el mercado inmobiliario de Buenos Aires, 
              somos tu socio de confianza para encontrar la propiedad perfecta. Nuestro equipo 
              de profesionales especializados te acompaña en cada paso del proceso.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                        <div className="text-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Experiencia</h3>
                <p className="text-gray-600">
                  Más de 10 años en el mercado inmobiliario de Buenos Aires
                </p>
              </div>
              
                        <div className="text-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Atención Personalizada</h3>
                <p className="text-gray-600">
                  Cada cliente recibe atención personalizada y dedicada
                </p>
              </div>
              
                        <div className="text-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Mejores Precios</h3>
                <p className="text-gray-600">
                  Garantizamos los mejores precios del mercado
                </p>
              </div>
            </div>
          </div>
        </div>
      </section> */}
      
      {/* CTA Section */}
{/*       <section className="py-16 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para encontrar tu hogar ideal?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Nuestro equipo está listo para ayudarte a encontrar la propiedad perfecta. 
            Contáctanos hoy mismo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/inmuebles"
              className="bg-white text-green-600 px-8 py-3 rounded-md hover:bg-gray-100 transition-colors font-semibold"
            >
              Ver Propiedades
            </a>
            <a
              href="/contacto"
              className="border-2 border-white text-white px-8 py-3 rounded-md hover:bg-white hover:text-green-600 transition-colors font-semibold"
            >
              Contactar
            </a>
          </div>
        </div>
      </section> */}
    </div>
  );
}
