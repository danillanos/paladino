import { Inmueble, Destacado, Zona, Estado, ApiResponse } from '@/types';

// API configuration - you can change this to your actual API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://paladinopropiedades.com.ar';
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' || false; // Set to false to test real API

// For development, we can test with a local API endpoint
const DEV_API_BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : '';

export class ApiService {
  // Test method to check API connectivity
  static async testApiConnection(): Promise<boolean> {
    try {
      if (DEV_API_BASE_URL) {
        const testResponse = await globalThis.fetch(`${DEV_API_BASE_URL}/api/test`);
        if (testResponse.ok) {
          console.log('✅ Local API test endpoint is working');
          return true;
        }
      }
      
      // Test the main API
      const testResponse = await globalThis.fetch(`${API_BASE_URL}/api/test`, {
        signal: AbortSignal.timeout(5000),
      });
      
      if (testResponse.ok) {
        console.log('✅ Main API is working');
        return true;
      }
      
      return false;
    } catch {
      console.log('❌ API test failed, will use mock data');
      return false;
    }
  }

  private static async fetchApi<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      // If using mock data or API is not available, throw an error to trigger fallback
      if (USE_MOCK_DATA) {
        console.log(`Using mock data for endpoint: ${endpoint}`);
        throw new Error('Using mock data - API not available');
      }

      const fullUrl = `${API_BASE_URL}${endpoint}`;
      console.log(`Fetching from API: ${fullUrl}`);

      // Use globalThis.fetch to ensure we're using the global fetch
      const response = await globalThis.fetch(fullUrl, {
        headers: {
          'Content-Type': 'application/json',
        },
        // Add timeout and better error handling
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      if (!response.ok) {
        const errorMessage = `API endpoint not found (${response.status}): ${fullUrl}`;
        console.warn(errorMessage);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log(`Successfully fetched data from: ${fullUrl}`);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.error(`Request timeout for ${endpoint}`);
        } else if (error.message.includes('Failed to fetch')) {
          console.error(`Network error or CORS issue for ${endpoint}`);
        } else {
          console.error(`Error fetching ${endpoint}:`, error.message);
        }
      } else {
        console.error(`Unknown error fetching ${endpoint}:`, error);
      }
      throw error;
    }
  }

  static async getDestacados(): Promise<Destacado[]> {
    try {
      // Como el endpoint /destacado no existe, usamos inmuebles y filtramos los destacados
      const inmuebles = await ApiService.getInmuebles();
      const destacados = inmuebles
        .filter(inmueble => inmueble.destacado === true)
        .slice(0, 6) // Limitamos a 6 destacados
        .map((inmueble, index) => ({
          id: index + 1,
          inmueble: inmueble,
          orden: index + 1,
          created_at: inmueble.created_at,
          updated_at: inmueble.updated_at
        }));
      
      return destacados;
    } catch (error) {
      console.error('Error fetching destacados:', error);
      return [];
    }
  }

  static async getInmuebles(params?: {
    zona?: string;
    estado?: string;
    tipo?: string;
    precio_min?: number;
    precio_max?: number;
    dormitorios?: number;
  }): Promise<Inmueble[]> {
    try {
      // First test if API is available
      const apiAvailable = await ApiService.testApiConnection();
      
      if (!apiAvailable) {
        console.log('API not available, using mock data directly');
        return ApiService.getMockInmuebles(params);
      }

      const queryParams = new URLSearchParams();
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value.toString());
          }
        });
      }

      const endpoint = `/inmuebles${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await ApiService.fetchApi<Inmueble>(endpoint);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching inmuebles:', error);
      console.log('Falling back to mock data...');
      // Return mock data as fallback
      return ApiService.getMockInmuebles(params);
    }
  }

  static async getInmuebleById(id: number): Promise<Inmueble | null> {
    try {
      const response = await ApiService.fetchApi<Inmueble>(`/inmuebles/${id}`);
      return response.data?.[0] || null;
    } catch (error) {
      console.error(`Error fetching inmueble ${id}:`, error);
      return null;
    }
  }

  static async getZonas(): Promise<Zona[]> {
    try {
      // Como el endpoint /catalogo_de_zonas no existe, devolvemos zonas mock
      const zonasMock: Zona[] = [
        {
          id: 1,
          nombre: 'Palermo',
          descripcion: 'Zona exclusiva de Buenos Aires',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 2,
          nombre: 'Recoleta',
          descripcion: 'Barrio histórico y elegante',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 3,
          nombre: 'Belgrano',
          descripcion: 'Zona residencial y comercial',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 4,
          nombre: 'Villa Crespo',
          descripcion: 'Barrio en crecimiento',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 5,
          nombre: 'Caballito',
          descripcion: 'Zona céntrica y accesible',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      return zonasMock;
    } catch (error) {
      console.error('Error fetching zonas:', error);
      return [];
    }
  }

  static async getEstados(): Promise<Estado[]> {
    try {
      // Como el endpoint /estadl no existe, devolvemos estados mock
      const estadosMock: Estado[] = [
        {
          id: 1,
          nombre: 'Nuevo',
          descripcion: 'Propiedades nuevas',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 2,
          nombre: 'Usado',
          descripcion: 'Propiedades usadas',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 3,
          nombre: 'En construcción',
          descripcion: 'Propiedades en construcción',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      return estadosMock;
    } catch (error) {
      console.error('Error fetching estados:', error);
      return [];
    }
  }

  private static getMockInmuebles(params?: {
    zona?: string;
    estado?: string;
    tipo?: string;
    precio_min?: number;
    precio_max?: number;
    dormitorios?: number;
  }): Inmueble[] {
    const mockInmuebles: Inmueble[] = [
      {
        id: 1,
        nombre: 'Hermoso departamento en Palermo',
        descripcion: 'Departamento de 2 dormitorios en excelente ubicación',
        precio: 150000,
        precio_inmueble: 150000,
        moneda: 'USD',
        tipo: 'Departamento',
        estado: 'Usado',
        zona: 'Palermo',
        habitaciones: 2,
        banos: 1,
        superficie: 65,
        destacado: true,
        imagenes: ['https://picsum.photos/400/300?random=1'],
        galeria: [],
        multimedia: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        published_at: new Date().toISOString(),
        slug: 'hermoso-departamento-palermo',
        direccion: 'Av. Santa Fe 1234',
        localidad: 'Palermo',
        cochera: null,
        operacion: 'Venta',
        ubicacion: 'Palermo, Buenos Aires',
        ambientes: '2 dormitorios, 1 baño',
        estado_general: 'Excelente',
        latitud: -34.6037,
        longitud: -58.3816,
        tipo_de_ambiente: 'Departamento',
        piso: '5',
        orientacion: 'Norte',
        estado_del_inmueble: 'Usado',
        mostrar_precio: true,
        estado_ref: 'Usado',
        moneda_ref: 'USD',
        inmueble: null,
        portada_ref: null,
        catalogo_de_zona: 'Palermo',
        servicios: null,
        amenities: null,
        comodidades_internas: null,
        seguridad: null,
        reglas_convivencia: null,
        reglas_documentacion: null,
        reglas_economicas: null,
        contacto: null,
        galeria_destacada: [],
        precio_ref: '150000',
        ubicacion_avanzada: null,
        imagen: 'https://picsum.photos/400/300?random=1'
      },
      {
        id: 2,
        nombre: 'Casa moderna en Recoleta',
        descripcion: 'Casa de 3 dormitorios con jardín',
        precio: 350000,
        precio_inmueble: 350000,
        moneda: 'USD',
        tipo: 'Casa',
        estado: 'Nuevo',
        zona: 'Recoleta',
        habitaciones: 3,
        banos: 2,
        superficie: 120,
        destacado: true,
        imagenes: ['https://picsum.photos/400/300?random=2'],
        galeria: [],
        multimedia: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        published_at: new Date().toISOString(),
        slug: 'casa-moderna-recoleta',
        direccion: 'Av. Alvear 567',
        localidad: 'Recoleta',
        cochera: null,
        operacion: 'Venta',
        ubicacion: 'Recoleta, Buenos Aires',
        ambientes: '3 dormitorios, 2 baños',
        estado_general: 'Nuevo',
        latitud: -34.5895,
        longitud: -58.3924,
        tipo_de_ambiente: 'Casa',
        piso: null,
        orientacion: 'Norte',
        estado_del_inmueble: 'Nuevo',
        mostrar_precio: true,
        estado_ref: 'Nuevo',
        moneda_ref: 'USD',
        inmueble: null,
        portada_ref: null,
        catalogo_de_zona: 'Recoleta',
        servicios: null,
        amenities: null,
        comodidades_internas: null,
        seguridad: null,
        reglas_convivencia: null,
        reglas_documentacion: null,
        reglas_economicas: null,
        contacto: null,
        galeria_destacada: [],
        precio_ref: '350000',
        ubicacion_avanzada: null,
        imagen: 'https://picsum.photos/400/300?random=2'
      },
      {
        id: 3,
        nombre: 'PH en Belgrano',
        descripcion: 'PH de 1 dormitorio ideal para inversión',
        precio: 95000,
        precio_inmueble: 95000,
        moneda: 'USD',
        tipo: 'PH',
        estado: 'Usado',
        zona: 'Belgrano',
        habitaciones: 1,
        banos: 1,
        superficie: 45,
        destacado: false,
        imagenes: ['https://picsum.photos/400/300?random=3'],
        galeria: [],
        multimedia: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        published_at: new Date().toISOString(),
        slug: 'ph-belgrano',
        direccion: 'Av. Cabildo 890',
        localidad: 'Belgrano',
        cochera: null,
        operacion: 'Venta',
        ubicacion: 'Belgrano, Buenos Aires',
        ambientes: '1 dormitorio, 1 baño',
        estado_general: 'Bueno',
        latitud: -34.5627,
        longitud: -58.4564,
        tipo_de_ambiente: 'PH',
        piso: '2',
        orientacion: 'Este',
        estado_del_inmueble: 'Usado',
        mostrar_precio: true,
        estado_ref: 'Usado',
        moneda_ref: 'USD',
        inmueble: null,
        portada_ref: null,
        catalogo_de_zona: 'Belgrano',
        servicios: null,
        amenities: null,
        comodidades_internas: null,
        seguridad: null,
        reglas_convivencia: null,
        reglas_documentacion: null,
        reglas_economicas: null,
        contacto: null,
        galeria_destacada: [],
        precio_ref: '95000',
        ubicacion_avanzada: null,
        imagen: 'https://picsum.photos/400/300?random=3'
      },
      {
        id: 4,
        nombre: 'Departamento de lujo en Puerto Madero',
        descripcion: 'Departamento premium con vista al río',
        precio: 500000,
        precio_inmueble: 500000,
        moneda: 'USD',
        tipo: 'Departamento',
        estado: 'Nuevo',
        zona: 'Puerto Madero',
        habitaciones: 4,
        banos: 3,
        superficie: 180,
        destacado: true,
        imagenes: ['https://picsum.photos/400/300?random=4'],
        galeria: [],
        multimedia: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        published_at: new Date().toISOString(),
        slug: 'departamento-lujo-puerto-madero',
        direccion: 'Av. Alicia Moreau de Justo 123',
        localidad: 'Puerto Madero',
        cochera: 'Sí',
        operacion: 'Venta',
        ubicacion: 'Puerto Madero, Buenos Aires',
        ambientes: '4 dormitorios, 3 baños',
        estado_general: 'Nuevo',
        latitud: -34.6084,
        longitud: -58.3731,
        tipo_de_ambiente: 'Departamento',
        piso: '15',
        orientacion: 'Norte',
        estado_del_inmueble: 'Nuevo',
        mostrar_precio: true,
        estado_ref: 'Nuevo',
        moneda_ref: 'USD',
        inmueble: null,
        portada_ref: null,
        catalogo_de_zona: 'Puerto Madero',
        servicios: null,
        amenities: null,
        comodidades_internas: null,
        seguridad: null,
        reglas_convivencia: null,
        reglas_documentacion: null,
        reglas_economicas: null,
        contacto: null,
        galeria_destacada: [],
        precio_ref: '500000',
        ubicacion_avanzada: null,
        imagen: 'https://picsum.photos/400/300?random=4'
      },
      {
        id: 5,
        nombre: 'Casa quinta en San Isidro',
        descripcion: 'Hermosa casa quinta con amplio terreno',
        precio: 750000,
        precio_inmueble: 750000,
        moneda: 'USD',
        tipo: 'Casa Quinta',
        estado: 'Usado',
        zona: 'San Isidro',
        habitaciones: 5,
        banos: 4,
        superficie: 300,
        destacado: true,
        imagenes: ['https://picsum.photos/400/300?random=5'],
        galeria: [],
        multimedia: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        published_at: new Date().toISOString(),
        slug: 'casa-quinta-san-isidro',
        direccion: 'Av. del Libertador 456',
        localidad: 'San Isidro',
        cochera: 'Sí',
        operacion: 'Venta',
        ubicacion: 'San Isidro, Buenos Aires',
        ambientes: '5 dormitorios, 4 baños',
        estado_general: 'Excelente',
        latitud: -34.4732,
        longitud: -58.5156,
        tipo_de_ambiente: 'Casa Quinta',
        piso: null,
        orientacion: 'Norte',
        estado_del_inmueble: 'Usado',
        mostrar_precio: true,
        estado_ref: 'Usado',
        moneda_ref: 'USD',
        inmueble: null,
        portada_ref: null,
        catalogo_de_zona: 'San Isidro',
        servicios: null,
        amenities: null,
        comodidades_internas: null,
        seguridad: null,
        reglas_convivencia: null,
        reglas_documentacion: null,
        reglas_economicas: null,
        contacto: null,
        galeria_destacada: [],
        precio_ref: '750000',
        ubicacion_avanzada: null,
        imagen: 'https://picsum.photos/400/300?random=5'
      },
      {
        id: 6,
        nombre: 'Monoambiente en Villa Crespo',
        descripcion: 'Monoambiente moderno y funcional',
        precio: 65000,
        precio_inmueble: 65000,
        moneda: 'USD',
        tipo: 'Monoambiente',
        estado: 'Nuevo',
        zona: 'Villa Crespo',
        habitaciones: 0,
        banos: 1,
        superficie: 35,
        destacado: false,
        imagenes: ['https://picsum.photos/400/300?random=6'],
        galeria: [],
        multimedia: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        published_at: new Date().toISOString(),
        slug: 'monoambiente-villa-crespo',
        direccion: 'Av. Corrientes 789',
        localidad: 'Villa Crespo',
        cochera: null,
        operacion: 'Venta',
        ubicacion: 'Villa Crespo, Buenos Aires',
        ambientes: 'Monoambiente, 1 baño',
        estado_general: 'Nuevo',
        latitud: -34.6037,
        longitud: -58.4456,
        tipo_de_ambiente: 'Monoambiente',
        piso: '3',
        orientacion: 'Oeste',
        estado_del_inmueble: 'Nuevo',
        mostrar_precio: true,
        estado_ref: 'Nuevo',
        moneda_ref: 'USD',
        inmueble: null,
        portada_ref: null,
        catalogo_de_zona: 'Villa Crespo',
        servicios: null,
        amenities: null,
        comodidades_internas: null,
        seguridad: null,
        reglas_convivencia: null,
        reglas_documentacion: null,
        reglas_economicas: null,
        contacto: null,
        galeria_destacada: [],
        precio_ref: '65000',
        ubicacion_avanzada: null,
        imagen: 'https://picsum.photos/400/300?random=6'
      }
    ];

    // Apply filters if provided
    let filteredInmuebles = mockInmuebles;

    if (params?.zona) {
      filteredInmuebles = filteredInmuebles.filter(inmueble => 
        inmueble.zona?.toLowerCase().includes(params.zona!.toLowerCase()) ?? false
      );
    }

    if (params?.estado) {
      filteredInmuebles = filteredInmuebles.filter(inmueble => 
        inmueble.estado?.toLowerCase().includes(params.estado!.toLowerCase()) ?? false
      );
    }

    if (params?.tipo) {
      filteredInmuebles = filteredInmuebles.filter(inmueble => 
        inmueble.tipo?.toLowerCase().includes(params.tipo!.toLowerCase()) ?? false
      );
    }

    if (params?.precio_min) {
      filteredInmuebles = filteredInmuebles.filter(inmueble => 
        (inmueble.precio ?? 0) >= params.precio_min!
      );
    }

    if (params?.precio_max) {
      filteredInmuebles = filteredInmuebles.filter(inmueble => 
        (inmueble.precio ?? 0) <= params.precio_max!
      );
    }

    if (params?.dormitorios) {
      filteredInmuebles = filteredInmuebles.filter(inmueble => 
        (inmueble.habitaciones ?? 0) >= params.dormitorios!
      );
    }

    return filteredInmuebles;
  }
} 