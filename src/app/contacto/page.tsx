'use client';

import { useState } from 'react';
import { useSiteConfiguration } from '@/hooks/useSiteConfiguration';

export default function ContactoPage() {
  const { configuration, loading: configLoading } = useSiteConfiguration();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: '',
    tipo: 'consulta'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simular envío del formulario
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        mensaje: '',
        tipo: 'consulta'
      });
    }, 2000);
  };

  return (
          <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Contacto</h1>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Información de contacto */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Información de Contacto</h2>
              
              {configLoading ? (
                <div className="space-y-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gray-300 rounded-full animate-pulse"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-300 rounded animate-pulse mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded animate-pulse w-3/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Dirección */}
                  {configuration?.ubicacion && (
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">Dirección</h3>
                        <p className="text-gray-600">
                          {configuration.ubicacion.direccion}, {configuration.ubicacion.localidad}
                          {configuration.ubicacion.piso && `, ${configuration.ubicacion.piso}`}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* Contactos dinámicos */}
                  {configuration?.contactos && configuration.contactos.length > 0 ? (
                    configuration.contactos.map((contacto) => (
                      <div key={contacto.id}>
                        {/* Teléfono */}
                        {contacto.telefono && (
                          <div className="flex items-start space-x-4 mb-4">
                            <div className="w-12 h-12 bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                              </svg>
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-800">Teléfono</h3>
                              <p className="text-gray-600">{contacto.telefono}</p>
                            </div>
                          </div>
                        )}
                        
                        {/* Email */}
                        {contacto.email && (
                          <div className="flex items-start space-x-4 mb-4">
                            <div className="w-12 h-12 bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                              </svg>
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-800">Email</h3>
                              <p className="text-gray-600">{contacto.email}</p>
                            </div>
                          </div>
                        )}
                        
                        {/* WhatsApp */}
                        {contacto.whatsapp && (
                          <div className="flex items-start space-x-4 mb-4">
                            <div className="w-12 h-12 bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
                              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                              </svg>
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-800">WhatsApp</h3>
                              <p className="text-gray-600">{contacto.whatsapp}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    /* Fallback si no hay configuración */
                    <>
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">Dirección</h3>
                          <p className="text-gray-600">San Martín 540, Villa Carlos Paz, Córdoba</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">Teléfono</h3>
                          <p className="text-gray-600">+54 11 1234-5678</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">Email</h3>
                          <p className="text-gray-600">info@paladinopropiedades.com</p>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {/* Horarios de Atención */}
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Horarios de Atención</h3>
                      <p className="text-gray-600">
                        Lunes a Viernes: 9:00 - 18:00<br />
                        Sábados: 9:00 - 13:00
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Redes sociales */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Síguenos</h3>
                <div className="flex space-x-4">
                  <a href="#" className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                  <a href="#" className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                    </svg>
                  </a>
                  <a href="#" className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            
            {/* Formulario de contacto */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Envíanos un mensaje</h2>
              
              {success ? (
                <div className="bg-slate-100 border border-slate-400 text-slate-700 px-4 py-3 rounded">
                  <p className="font-semibold">¡Mensaje enviado con éxito!</p>
                  <p>Nos pondremos en contacto contigo pronto.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de consulta
                    </label>
                    <select
                      id="tipo"
                      name="tipo"
                      value={formData.tipo}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-transparent"
                    >
                      <option value="consulta">Consulta general</option>
                      <option value="venta">Venta de propiedad</option>
                      <option value="alquiler">Alquiler de propiedad</option>
                      <option value="tasacion">Tasación</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700 mb-1">
                      Mensaje *
                    </label>
                    <textarea
                      id="mensaje"
                      name="mensaje"
                      value={formData.mensaje}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-transparent"
                      placeholder="Cuéntanos en qué podemos ayudarte..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-slate-600 text-white py-3 px-6 rounded-md hover:bg-slate-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Enviando...' : 'Enviar mensaje'}
                  </button>
                </form>
              )}
            </div>
          </div>
          
          {/* Sección de Ubicación */}
          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Ubicación</h2>
            
            {configLoading ? (
              <div className="w-full h-96 bg-gray-300 rounded-lg animate-pulse flex items-center justify-center">
                <p className="text-gray-600">Cargando mapa...</p>
              </div>
            ) : configuration?.ubicacion ? (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-gray-600 mb-4">
                    <strong>Dirección:</strong> {configuration.ubicacion.direccion}, {configuration.ubicacion.localidad}
                    {configuration.ubicacion.piso && `, ${configuration.ubicacion.piso}`}
                  </p>
                </div>
                
                {/* Mapa embebido */}
                {configuration.maps_html ? (
                  <div 
                    className="w-full h-96 rounded-lg overflow-hidden shadow-lg"
                    dangerouslySetInnerHTML={{ __html: configuration.maps_html }}
                  />
                ) : (
                  <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                    <p className="text-gray-600">Mapa no disponible</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-gray-600">Información de ubicación no disponible</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 