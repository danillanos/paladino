'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSiteConfiguration } from '@/hooks/useSiteConfiguration';

export default function Footer() {
  const { configuration, loading } = useSiteConfiguration();
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-[58px] w-[300px] flex items-center">
                <Image
                  src="/images/logos/logo.png"
                  alt="Paladino Propiedades"
                  width={300}
                  height={58}
                  className="h-auto w-auto max-h-[58px]"
                  priority
                />
              </div>
            </div>
            <p className="text-gray-300 mb-4">
              {configuration?.texto_footer }
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/inmuebles" className="text-gray-300 hover:text-white transition-colors">
                  Propiedades
                </Link>
              </li>
              {/* <li>
                <Link href="/zonas" className="text-gray-300 hover:text-white transition-colors">
                  Zonas
                </Link>
              </li> */}
              <li>
                <Link href="/contacto" className="text-gray-300 hover:text-white transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <div className="space-y-2 text-gray-300">
              {loading ? (
                <div className="space-y-2">
                  <div className="h-4 bg-gray-600 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-600 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-600 rounded animate-pulse"></div>
                </div>
              ) : (
                <>
                  {/* Dirección */}
                  {configuration?.ubicacion && (
                    <p className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {configuration.ubicacion.direccion}, {configuration.ubicacion.localidad}
                      {configuration.ubicacion.piso && `, ${configuration.ubicacion.piso}`}
                    </p>
                  )}
                  
                  {/* Contactos */}
                  {configuration?.contactos && configuration.contactos.length > 0 && (
                    <>
                      {configuration.contactos.map((contacto) => (
                        <div key={contacto.id}>
                          {/* Email */}
                          {contacto.email && (
                            <p className="flex items-center">
                              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                              </svg>
                              {contacto.email}
                            </p>
                          )}
                          
                          {/* Teléfono */}
                          {contacto.telefono && (
                            <p className="flex items-center">
                              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                              </svg>
                              {contacto.telefono}
                            </p>
                          )}
                          
                          {/* WhatsApp */}
                          {contacto.whatsapp && (
                            <p className="flex items-center">
                              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                              </svg>
                              {contacto.whatsapp}
                            </p>
                          )}
                        </div>
                      ))}
                    </>
                  )}
                  
                  {/* Fallback si no hay configuración */}
                  {!configuration && (
                    <>
                      <p className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        San Martín 540, Villa Carlos Paz, Córdoba
                      </p>
                      <p className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        {process.env.NEXT_PUBLIC_DEFAULT_EMAIL}
                      </p>
                      <p className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        +54 11 1234-5678
                      </p>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>{configuration?.copy || '© 2024 Paladino Propiedades. To'}</p>
        </div>
      </div>
    </footer>
  );
} 