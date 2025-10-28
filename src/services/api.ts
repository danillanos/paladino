import { Inmueble, Destacado, Zona, Estado, ApiResponse, SiteConfiguration, Emprendimiento, Obra, CompanyDetail, Novedad } from '@/types';

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
      const testController = new AbortController();
      const testTimeoutId = setTimeout(() => testController.abort(), 5000);
      
      const testResponse = await globalThis.fetch(`${API_BASE_URL}/api/test`, {
        signal: testController.signal,
      });
      
      clearTimeout(testTimeoutId);
      
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

      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      // Use globalThis.fetch to ensure we're using the global fetch
      const response = await globalThis.fetch(fullUrl, {
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

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
      // Usar la API real de inmuebles
      const response = await fetch('https://api.paladinopropiedades.com.ar/inmuebles');
      if (!response.ok) {
        throw new Error('Failed to fetch inmuebles');
      }
      const data = await response.json();
      
      // Buscar el inmueble por ID
      const inmueble = data.find((item: Inmueble) => item.id === id);
      
      if (inmueble) {
        return inmueble;
      }
      
      // Si no se encuentra, intentar con datos mock como fallback
      const mockData = await ApiService.getMockInmuebles();
      const mockInmueble = mockData.find((item: Inmueble) => item.id === id);
      return mockInmueble || null;
    } catch (error) {
      console.error(`Error fetching inmueble ${id}:`, error);
      // Fallback a datos mock
      try {
        const mockData = await ApiService.getMockInmuebles();
        const mockInmueble = mockData.find((item: Inmueble) => item.id === id);
        return mockInmueble || null;
      } catch (mockError) {
        console.error('Error with mock data too:', mockError);
        return null;
      }
    }
  }

  static async getInmuebleBySlug(slug: string): Promise<Inmueble | null> {
    try {
      // Usar la API real de inmuebles
      const response = await fetch('https://api.paladinopropiedades.com.ar/inmuebles');
      if (!response.ok) {
        throw new Error('Failed to fetch inmuebles');
      }
      const data = await response.json();
      
      // Buscar el inmueble por slug
      const inmueble = data.find((item: Inmueble) => item.slug === slug);
      
      if (inmueble) {
        return inmueble;
      }
      
      // Si no se encuentra, intentar con datos mock como fallback
      const mockData = await ApiService.getMockInmuebles();
      const mockInmueble = mockData.find((item: Inmueble) => item.slug === slug);
      return mockInmueble || null;
    } catch (error) {
      console.error(`Error fetching inmueble by slug ${slug}:`, error);
      // Fallback a datos mock
      try {
        const mockData = await ApiService.getMockInmuebles();
        const mockInmueble = mockData.find((item: Inmueble) => item.slug === slug);
        return mockInmueble || null;
      } catch (mockError) {
        console.error('Error with mock data too:', mockError);
        return null;
      }
    }
  }

  static async getZonas(): Promise<Zona[]> {
    try {
      // Como el endpoint /catalogo_de_zonas no existe, devolvemos zonas mock
      const zonasMock: Zona[] = [
        {
          id: 1,
          nombre: 'Centro',
          descripcion: 'Corazón comercial y turístico de Villa Carlos Paz',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 2,
          nombre: 'Villa del Lago',
          descripcion: 'Zona residencial junto al lago San Roque',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 3,
          nombre: 'San Antonio',
          descripcion: 'Barrio residencial con vista al lago',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 4,
          nombre: 'La Calera',
          descripcion: 'Zona residencial tranquila y familiar',
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

  static async getSiteConfiguration(): Promise<SiteConfiguration | null> {
    try {
      // Use the specific API endpoint for site configuration
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await globalThis.fetch('https://api.paladinopropiedades.com.ar/configuracion-sitio', {
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorMessage = `Site configuration API not available (${response.status})`;
        console.warn(errorMessage);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Successfully fetched site configuration');
      return data;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.error('Request timeout for site configuration');
        } else if (error.message.includes('Failed to fetch')) {
          console.error('Network error or CORS issue for site configuration');
        } else {
          console.error('Error fetching site configuration:', error.message);
        }
      } else {
        console.error('Unknown error fetching site configuration:', error);
      }
      
      // Return null if configuration cannot be fetched
      console.log('Falling back to default site configuration...');
      return null;
    }
  }

  static async getEmprendimientos(): Promise<Emprendimiento[]> {
    try {
      // Use the specific API endpoint for emprendimientos
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await globalThis.fetch('https://api.paladinopropiedades.com.ar/emprendimientos', {
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorMessage = `Emprendimientos API not available (${response.status})`;
        console.warn(errorMessage);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Successfully fetched emprendimientos');
      return data;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.error('Request timeout for emprendimientos');
        } else if (error.message.includes('Failed to fetch')) {
          console.error('Network error or CORS issue for emprendimientos');
        } else {
          console.error('Error fetching emprendimientos:', error.message);
        }
      } else {
        console.error('Unknown error fetching emprendimientos:', error);
      }
      
      // Return empty array if emprendimientos cannot be fetched
      console.log('Falling back to empty emprendimientos list...');
      return [];
    }
  }

  static async getEmprendimientoBySlug(slug: string): Promise<Emprendimiento | null> {
    try {
      const emprendimientos = await ApiService.getEmprendimientos();
      const emprendimiento = emprendimientos.find(emp => emp.slug === slug);
      return emprendimiento || null;
    } catch (error) {
      console.error(`Error fetching emprendimiento with slug ${slug}:`, error);
      return null;
    }
  }

  static async getObras(): Promise<Obra[]> {
    try {
      // Use the specific API endpoint for obras
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await globalThis.fetch('https://api.paladinopropiedades.com.ar/obras', {
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorMessage = `Obras API not available (${response.status})`;
        console.warn(errorMessage);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Obras data received:', data);
      
      // Transform the data to match our Obra interface
      const obras: Obra[] = data.map((obra: Record<string, unknown>) => ({
        id: obra.id as number,
        nombre: obra.nombre as string,
        slug: obra.slug as string,
        descripcion: obra.descripcion as string | null,
        visible: obra.visible as boolean,
        orden: obra.orden as number,
        published_at: obra.published_at as string,
        created_at: obra.created_at as string,
        updated_at: obra.updated_at as string,
        ubicacion: obra.ubicacion as string,
        anio: obra.anio as number,
        tipo_obra: obra.tipo_obra as string,
        constructora: obra.constructora as string,
        arquitecto: obra.arquitecto as string | null,
        seo_title: obra.seo_title as string,
        seo_descripcion: obra.seo_descripcion as string | null,
        galeria: (obra.galeria as unknown[]) || [],
        imagen_portada: obra.imagen_portada as unknown
      }));

      return obras;
    } catch (error) {
      console.error('Error fetching obras:', error);
      return [];
    }
  }

  static async getObraBySlug(slug: string): Promise<Obra | null> {
    try {
      const obras = await ApiService.getObras();
      const obra = obras.find(obra => obra.slug === slug);
      return obra || null;
    } catch (error) {
      console.error(`Error fetching obra with slug ${slug}:`, error);
      return null;
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
        nombre: 'Hermoso departamento en Centro',
        descripcion: 'Departamento de 2 dormitorios en el corazón de Villa Carlos Paz',
        precio: 85000,
        precio_inmueble: 85000,
        moneda: 'USD',
        tipo: { nombre: 'Departamento' },
        estado: { nombre: 'Usado' },
        zona: 'Centro',
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
        slug: 'hermoso-departamento-centro',
        direccion: 'Av. San Martín 1234',
        localidad: 'Centro',
        cochera: null,
        operacion: { nombre: 'No especificado' },
        ubicacion: 'Centro, Villa Carlos Paz',
        ambientes: '2 dormitorios, 1 baño',
        estado_general: 'Excelente',
        latitud: -31.4242,
        longitud: -64.4979,
        tipo_de_ambiente: 'Departamento',
        piso: '5',
        orientacion: 'Norte',
        estado_del_inmueble: 'Usado',
        mostrar_precio: true,
        estado_ref: 'Usado',
        moneda_ref: 'USD',
        inmueble: null,
        portada_ref: null,
        catalogo_de_zona: { nombre: 'Centro' },
        servicios: null,
        amenities: null,
        comodidades_internas: null,
        seguridad: null,
        reglas_convivencia: null,
        reglas_documentacion: null,
        reglas_economicas: null,
        contacto: null,
        galeria_destacada: [],
        precio_ref: '85000',
        ubicacion_avanzada: null,
        imagen: { url: 'https://picsum.photos/400/300?random=1' }
      },
      {
        id: 2,
        nombre: 'Casa moderna en Villa del Lago',
        descripcion: 'Casa de 3 dormitorios con vista al lago San Roque',
        precio: 180000,
        precio_inmueble: 180000,
        moneda: 'USD',
        tipo: { nombre: 'Casa' },
        estado: { nombre: 'Nuevo' },
        zona: 'Villa del Lago',
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
        slug: 'casa-moderna-villa-del-lago',
        direccion: 'Costanera del Lago 567',
        localidad: 'Villa del Lago',
        cochera: 'Sí',
        operacion: { nombre: 'No especificado' },
        ubicacion: 'Villa del Lago, Villa Carlos Paz',
        ambientes: '3 dormitorios, 2 baños',
        estado_general: 'Nuevo',
        latitud: -31.4200,
        longitud: -64.5000,
        tipo_de_ambiente: 'Casa',
        piso: null,
        orientacion: 'Norte',
        estado_del_inmueble: 'Nuevo',
        mostrar_precio: true,
        estado_ref: 'Nuevo',
        moneda_ref: 'USD',
        inmueble: null,
        portada_ref: null,
        catalogo_de_zona: { nombre: 'Villa del Lago' },
        servicios: null,
        amenities: null,
        comodidades_internas: null,
        seguridad: null,
        reglas_convivencia: null,
        reglas_documentacion: null,
        reglas_economicas: null,
        contacto: null,
        galeria_destacada: [],
        precio_ref: '180000',
        ubicacion_avanzada: null,
        imagen: { url: 'https://picsum.photos/400/300?random=2' }
      },
      {
        id: 3,
        nombre: 'Casaquinta en San Antonio',
        descripcion: 'Casaquinta de 1 dormitorio ideal para turismo',
        precio: 120000,
        precio_inmueble: 120000,
        moneda: 'USD',
        tipo: { nombre: 'Casaquinta' },
        estado: { nombre: 'Usado' },
        zona: 'San Antonio',
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
        slug: 'casaquinta-san-antonio',
        direccion: 'Av. San Antonio 890',
        localidad: 'San Antonio',
        cochera: null,
        operacion: { nombre: 'No especificado' },
        ubicacion: 'San Antonio, Villa Carlos Paz',
        ambientes: '1 dormitorio, 1 baño',
        estado_general: 'Bueno',
        latitud: -31.4300,
        longitud: -64.4900,
        tipo_de_ambiente: 'Casaquinta',
        piso: null,
        orientacion: 'Este',
        estado_del_inmueble: 'Usado',
        mostrar_precio: true,
        estado_ref: 'Usado',
        moneda_ref: 'USD',
        inmueble: null,
        portada_ref: null,
        catalogo_de_zona: { nombre: 'San Antonio' },
        servicios: null,
        amenities: null,
        comodidades_internas: null,
        seguridad: null,
        reglas_convivencia: null,
        reglas_documentacion: null,
        reglas_economicas: null,
        contacto: null,
        galeria_destacada: [],
        precio_ref: '120000',
        ubicacion_avanzada: null,
        imagen: { url: 'https://picsum.photos/400/300?random=3' }
      },
      {
        id: 4,
        nombre: 'Departamento de lujo en La Calera',
        descripcion: 'Departamento premium con vista panorámica',
        precio: 220000,
        precio_inmueble: 220000,
        moneda: 'USD',
        tipo: { nombre: 'Departamento' },
        estado: { nombre: 'Nuevo' },
        zona: 'La Calera',
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
        slug: 'departamento-lujo-la-calera',
        direccion: 'Av. La Calera 123',
        localidad: 'La Calera',
        cochera: 'Sí',
        operacion: { nombre: 'No especificado' },
        ubicacion: 'La Calera, Villa Carlos Paz',
        ambientes: '4 dormitorios, 3 baños',
        estado_general: 'Nuevo',
        latitud: -31.4400,
        longitud: -64.4800,
        tipo_de_ambiente: 'Departamento',
        piso: '8',
        orientacion: 'Norte',
        estado_del_inmueble: 'Nuevo',
        mostrar_precio: true,
        estado_ref: 'Nuevo',
        moneda_ref: 'USD',
        inmueble: null,
        portada_ref: null,
        catalogo_de_zona: { nombre: 'La Calera' },
        servicios: null,
        amenities: null,
        comodidades_internas: null,
        seguridad: null,
        reglas_convivencia: null,
        reglas_documentacion: null,
        reglas_economicas: null,
        contacto: null,
        galeria_destacada: [],
        precio_ref: '220000',
        ubicacion_avanzada: null,
        imagen: { url: 'https://picsum.photos/400/300?random=4' }
      },
      {
        id: 5,
        nombre: 'Casa quinta en Cuesta Blanca',
        descripcion: 'Hermosa casa quinta con vista al lago',
        precio: 350000,
        precio_inmueble: 350000,
        moneda: 'USD',
        tipo: { nombre: 'Casa Quinta' },
        estado: { nombre: 'Usado' },
        zona: 'Cuesta Blanca',
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
        slug: 'casa-quinta-cuesta-blanca',
        direccion: 'Av. Cuesta Blanca 456',
        localidad: 'Cuesta Blanca',
        cochera: 'Sí',
        operacion: { nombre: 'No especificado' },
        ubicacion: 'Cuesta Blanca, Villa Carlos Paz',
        ambientes: '5 dormitorios, 4 baños',
        estado_general: 'Excelente',
        latitud: -31.4100,
        longitud: -64.5100,
        tipo_de_ambiente: 'Casa Quinta',
        piso: null,
        orientacion: 'Norte',
        estado_del_inmueble: 'Usado',
        mostrar_precio: true,
        estado_ref: 'Usado',
        moneda_ref: 'USD',
        inmueble: null,
        portada_ref: null,
        catalogo_de_zona: { nombre: 'Cuesta Blanca' },
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
        imagen: { url: 'https://picsum.photos/400/300?random=5' }
      },
      {
        id: 6,
        nombre: 'Monoambiente en Costa Azul',
        descripcion: 'Monoambiente moderno y funcional',
        precio: 65000,
        precio_inmueble: 65000,
        moneda: 'USD',
        tipo: { nombre: 'Monoambiente' },
        estado: { nombre: 'Nuevo' },
        zona: 'Costa Azul',
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
        slug: 'monoambiente-costa-azul',
        direccion: 'Av. Costa Azul 789',
        localidad: 'Costa Azul',
        cochera: null,
        operacion: { nombre: 'No especificado' },
        ubicacion: 'Costa Azul, Villa Carlos Paz',
        ambientes: 'Monoambiente, 1 baño',
        estado_general: 'Nuevo',
        latitud: -31.4500,
        longitud: -64.4700,
        tipo_de_ambiente: 'Monoambiente',
        piso: '3',
        orientacion: 'Oeste',
        estado_del_inmueble: 'Nuevo',
        mostrar_precio: true,
        estado_ref: 'Nuevo',
        moneda_ref: 'USD',
        inmueble: null,
        portada_ref: null,
        catalogo_de_zona: { nombre: 'Costa Azul' },
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
        imagen: { url: 'https://picsum.photos/400/300?random=6' }
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
        inmueble.estado?.nombre?.toLowerCase().includes(params.estado!.toLowerCase()) ?? false
      );
    }

    if (params?.tipo) {
      filteredInmuebles = filteredInmuebles.filter(inmueble => 
        inmueble.tipo?.nombre?.toLowerCase().includes(params.tipo!.toLowerCase()) ?? false
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

  // Get company detail information
  static async getCompanyDetail(): Promise<CompanyDetail> {
    try {
      const response = await fetch('https://admipa.paladinopropiedades.com.ar/quienes-somos');
      if (!response.ok) {
        throw new Error('Failed to fetch company detail');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching company detail:', error);
      throw error;
    }
  }

  // Get novedades (news) from the API
  static async getNews(): Promise<Novedad[]> {
    try {
      // Use the specific API endpoint for novedades
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await globalThis.fetch('https://api.paladinopropiedades.com.ar/novedades', {
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorMessage = `Novedades API not available (${response.status})`;
        console.warn(errorMessage);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Successfully fetched novedades');
      return data;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.error('Request timeout for novedades');
        } else if (error.message.includes('Failed to fetch')) {
          console.error('Network error or CORS issue for novedades');
        } else {
          console.error('Error fetching novedades:', error.message);
        }
      } else {
        console.error('Unknown error fetching novedades:', error);
      }
      
      // Return empty array if novedades cannot be fetched
      console.log('Falling back to empty novedades list...');
      return [];
    }
  }
} 