export interface Inmueble {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio: number | null;
  precio_inmueble: number | null;
  moneda: string | null;
  tipo: string | null;
  estado: string | null;
  zona: string | null;
  habitaciones: number | null;
  banos: number | null;
  superficie: number | null;
  superficie_terreno?: number | null;
  imagenes: string[];
  galeria: string[];
  multimedia: unknown[];
  destacado: boolean | null;
  created_at: string;
  updated_at: string;
  published_at: string;
  slug: string;
  direccion: string | null;
  localidad: string | null;
  cochera: string | null;
  operacion: string | null;
  ubicacion: string | null;
  ambientes: string | null;
  estado_general: string | null;
  latitud: number | null;
  longitud: number | null;
  tipo_de_ambiente: string | null;
  piso: string | null;
  orientacion: string | null;
  estado_del_inmueble: string | null;
  mostrar_precio: boolean | null;
  estado_ref: string | null;
  moneda_ref: string | null;
  inmueble: string | null;
  portada_ref: string | null;
  catalogo_de_zona: string | null;
  servicios: string | null;
  amenities: string | null;
  comodidades_internas: string | null;
  seguridad: string | null;
  reglas_convivencia: string | null;
  reglas_documentacion: string | null;
  reglas_economicas: string | null;
  contacto: string | null;
  galeria_destacada: unknown[];
  precio_ref: string | null;
  ubicacion_avanzada: string | null;
  imagen: string | null;
}

export interface Destacado {
  id: number;
  inmueble: Inmueble;
  orden: number;
  created_at: string;
  updated_at: string;
}

export interface Zona {
  id: number;
  nombre: string;
  descripcion?: string;
  created_at: string;
  updated_at: string;
}

export interface Estado {
  id: number;
  nombre: string;
  descripcion?: string;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  data: T[];
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
} 