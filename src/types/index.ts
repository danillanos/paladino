export interface Inmueble {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio: number | null;
  precio_inmueble: number | null;
  moneda: string | null;
  tipo: {
    nombre: string;
  } | null;
  tipo_inmueble?: string | null;
  estado: {
    nombre: string;
  } | null;
  zona: string | null;
  habitaciones: number | null;
  banos: number | null;
  superficie: number | null;
  superficie_terreno?: number | null;
  imagenes: string[];
  galeria: {
    id: number;
    name: string;
    alternativeText: string;
    caption: string;
    width: number;
    height: number;
    formats: unknown;
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
  }[];
  multimedia: unknown[];
  destacado: boolean | null;
  created_at: string;
  updated_at: string;
  published_at: string;
  slug: string;
  direccion: string | null;
  localidad: string | null;
  cochera: string | null;
  operacion: string | {
    nombre: string;
  } | null;
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
  servicios: {
    id: number;
    agua_corriente: boolean;
    luz: boolean;
    gas_natural: boolean;
    cloacas: boolean;
    internet: boolean;
    cable: boolean;
    telefono: boolean;
  } | null;
  amenities: {
    id: number;
    pileta: boolean;
    parrilla: boolean;
    solarium: boolean;
    gimnasio: boolean;
    laundry: boolean;
    sum: boolean;
    terraza: boolean;
    balcon: boolean;
    seguridad: boolean;
    ascensor: boolean;
    expensas_incluidas: boolean | null;
  } | null;
  comodidades_internas: {
    id: number;
    aire_acondicionado: boolean;
    calefaccion: boolean;
    hogar: boolean;
    estufa: boolean | null;
    salamandra: boolean | null;
    ventilador: boolean | null;
    calefon: boolean | null;
    termotanque: boolean | null;
    placares_empotrados: boolean | null;
    vestidor: boolean | null;
    alarma: boolean | null;
    domotica_automatizaciones_del_hogar: boolean | null;
    cocina_equipada: boolean;
    lavadero_interno: boolean | null;
    detector_de_humo: boolean | null;
    portero_video: boolean | null;
    iluminacion_led: boolean;
    cerradura_digital: boolean | null;
  } | null;
  seguridad: {
    id: number;
    porton_electrico: boolean | null;
    rejas: boolean | null;
    camara_seguridad: boolean | null;
    sistema_alarma: boolean | null;
    vigilancia_24hs: boolean | null;
    barrio_cerrado: boolean | null;
    acceso_controlado: boolean | null;
  } | null;
  reglas_convivencia: string | null;
  reglas_documentacion: string | null;
  reglas_economicas: string | null;
  contacto: {
    id: number;
    nombre: string;
    telefono: string;
    email: string;
    observaciones: string | null;
    whatsapp: string;
    whatsapp_mensaje: string;
    whatsapp_url: string | null;
    instagram: string | null;
  } | null;
  galeria_destacada: unknown[];
  precio_ref: {
    moneda: {
      nombre: string;
    } | null;
  } | null;
  ubicacion_avanzada: {
    id: number;
    direccion: string;
    localidad: string;
    piso: string | null;
    latitud: number | null;
    longitud: number | null;
    orientacion: string | null;
    zoom: number;
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
  texto_footer: string;
  copy: string;
  horario_de_atencion?: string | null;
  Organizacion?: string | null;
  contact_whastapp_home?: string | null;
  email_de_contacto?: string | null;
  texto_de_contacto_web?: string | null;
  Facebook?: string | null;
  youtube?: string | null;
  Zonaprop?: string | null;
  Logos: {
    id: number;
    Logo_1: LogoImage[];
    Logo_2: LogoImage[];
  };
}

export interface LogoImage {
  id: number;
  name: string;
  alternativeText: string;
  caption: string;
  width: number;
  height: number;
  formats: {
    small?: {
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

export interface CompanyDetail {
  id: number;
  titulo: string;
  descripcion: string;
  mision: string;
  vision: string;
  seo_title: string;
  seo_descripcion: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  foto_principal: CompanyImage[];
  galeria: CompanyImage[];
  seo_imagen: CompanyImage[];
}

export interface CompanyImage {
  id: number;
  name: string;
  alternativeText: string;
  caption: string;
  width: number;
  height: number;
  formats: unknown;
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

// Novedades Types
export interface NovedadImagen {
  id: number;
  name: string;
  alternativeText: string;
  caption: string;
  width: number;
  height: number;
  formats: {
    small?: {
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

export interface Novedad {
  id: number;
  titulo: string;
  slug: string;
  descripcion: string;
  contenido: string | null;
  fecha_publicacion: string;
  destacado: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
  imagen_destacada: NovedadImagen;
  galeria?: NovedadImagen[];
} 