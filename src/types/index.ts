export interface Inmueble {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio: number | null;
  precio_inmueble: number | null;
  moneda: string | null;
  tipo: string | null;
  estado: {
    nombre: string;
  } | null;
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
  catalogo_de_zona: {
    nombre: string;
  } | null;
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
  ubicacion_avanzada: {
    localidad: string;
  } | null;
  imagen: {
    url: string;
  } | null;
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

// Site Configuration Types
export interface Contacto {
  id: number;
  nombre: string;
  telefono: string;
  email: string;
  observaciones: string;
  whatsapp: string;
  whatsapp_mensaje: string;
  whatsapp_url: string | null;
  instagram: string;
}

export interface Ubicacion {
  id: number;
  direccion: string;
  localidad: string;
  piso: string | null;
  latitud: number;
  longitud: number;
  orientacion: string | null;
  zoom: number;
}

export interface HeroImagen {
  id: number;
  name: string;
  alternativeText: string;
  caption: string;
  width: number;
  height: number;
  formats: {
    thumbnail: {
      ext: string;
      url: string;
      hash: string;
      mime: string;
      name: string;
      path: string | null;
      size: number;
      width: number;
      height: number;
    };
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: unknown;
  created_at: string;
  updated_at: string;
}

export interface SiteConfiguration {
  id: number;
  published_at: string;
  created_at: string;
  updated_at: string;
  hero_titulo: string;
  hero_subtitulo: string;
  hero_opacidad: number;
  ubicacion: Ubicacion;
  contactos: Contacto[];
  hero_imagen: HeroImagen[];
  maps_html: string;
  instagram: string;
}

// Emprendimientos Types
export interface EmprendimientoImagen {
  id: number;
  name: string;
  alternativeText: string;
  caption: string;
  width: number;
  height: number;
  formats: {
    thumbnail?: {
      ext: string;
      url: string;
      hash: string;
      mime: string;
      name: string;
      path: string | null;
      size: number;
      width: number;
      height: number;
    };
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: unknown;
  created_at: string;
  updated_at: string;
}

export interface EmprendimientoAmenities {
  __component: string;
  id: number;
  pileta: boolean | null;
  parrilla: boolean | null;
  solarium: boolean | null;
  gimnasio: boolean | null;
  laundry: boolean | null;
  sum: boolean | null;
  terraza: boolean | null;
  balcon: boolean | null;
  seguridad: boolean | null;
  ascensor: boolean | null;
  expensas_incluidas: boolean | null;
}

export interface EmprendimientoDescripcion {
  __component: string;
  id: number;
  contenido: string;
}

export interface EmprendimientoPrecio {
  __component: string;
  id: number;
  moneda: string | null;
  precio_desde: number | null;
  texto: string;
}

export interface EmprendimientoUbicacion {
  id: number;
  direccion: string;
  localidad: string;
  piso: string | null;
  latitud: number;
  longitud: number;
  orientacion: string | null;
  zoom: number;
}

export interface Emprendimiento {
  id: number;
  nombre: string;
  slug: string;
  resumen: string | null;
  estado: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  ubicacion_avanzada: EmprendimientoUbicacion;
  secciones: (EmprendimientoDescripcion | EmprendimientoAmenities | EmprendimientoPrecio)[];
  cover: EmprendimientoImagen;
  galeria: EmprendimientoImagen[];
}

export interface ObraImagen {
  id: number;
  name: string;
  alternativeText: string;
  caption: string;
  width: number;
  height: number;
  formats: {
    thumbnail?: {
      ext: string;
      url: string;
      hash: string;
      mime: string;
      name: string;
      path: string | null;
      size: number;
      width: number;
      height: number;
    };
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: unknown;
  created_at: string;
  updated_at: string;
}

export interface Obra {
  id: number;
  nombre: string;
  slug: string;
  descripcion: string | null;
  visible: boolean;
  orden: number;
  published_at: string;
  created_at: string;
  updated_at: string;
  ubicacion: string;
  anio: number;
  tipo_obra: string;
  constructora: string;
  arquitecto: string | null;
  seo_title: string;
  seo_descripcion: string | null;
  galeria: ObraImagen[];
  imagen_portada: ObraImagen;
} 