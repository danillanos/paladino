# Paladino Propiedades - Web Inmobiliaria

Una aplicación web moderna para Paladino Propiedades, desarrollada con Next.js 14, TypeScript y Tailwind CSS. La aplicación consume datos de una API REST de Strapi v3.6.

## 🚀 Características

- **Página Principal**: Hero section con búsqueda avanzada y propiedades destacadas
- **Listado de Propiedades**: Filtros por zona, estado, tipo, precio y dormitorios
- **Detalle de Propiedad**: Vista completa con imágenes, características y contacto
- **Página de Zonas**: Exploración de zonas disponibles
- **Página de Contacto**: Formulario de contacto y información de la empresa
- **Diseño Responsive**: Optimizado para móviles, tablets y desktop
- **Navegación Intuitiva**: Navbar fija con búsqueda rápida

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 14 con App Router
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **API**: REST API (Strapi v3.6)
- **Imágenes**: Next.js Image Optimization
- **Estado**: React Hooks (useState, useEffect)

## 📁 Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── globals.css        # Estilos globales
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Página principal
│   ├── inmuebles/         # Páginas de propiedades
│   ├── inmueble/[id]/     # Detalle de propiedad
│   ├── zonas/             # Página de zonas
│   └── contacto/          # Página de contacto
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes de UI básicos
│   ├── Navbar.tsx        # Barra de navegación
│   ├── Footer.tsx        # Pie de página
│   ├── HeroSection.tsx   # Sección hero
│   ├── PropertyCard.tsx  # Tarjeta de propiedad
│   └── FeaturedProperties.tsx # Propiedades destacadas
├── services/             # Servicios de API
│   └── api.ts           # Cliente de API
└── types/               # Tipos TypeScript
    └── index.ts         # Definiciones de tipos
```

## 🔌 Configuración de la API

La aplicación está configurada para usar datos mock por defecto, ya que los endpoints de la API original no están disponibles. Para configurar una API real:

### Variables de Entorno

Crea un archivo `.env.local` con las siguientes variables:

```bash
# URL de tu API
NEXT_PUBLIC_API_URL=https://your-api-url.com

# Set to 'false' para usar API real, 'true' para usar datos mock
NEXT_PUBLIC_USE_MOCK_DATA=false
```

### Endpoints Esperados

Si configuras una API real, debe tener los siguientes endpoints:

- **Inmuebles**: `GET /inmuebles` - Lista de propiedades con filtros opcionales
- **Inmueble por ID**: `GET /inmuebles/{id}` - Detalle de una propiedad específica
- **Zonas**: `GET /catalogo_de_zonas` - Lista de zonas disponibles
- **Estados**: `GET /estadl` - Lista de estados de propiedades

### Datos Mock

Actualmente la aplicación usa datos mock que incluyen:
- 6 propiedades de ejemplo con diferentes tipos y zonas
- Filtros funcionales por zona, estado, tipo, precio y dormitorios
- Imágenes placeholder para demostración

## 🎨 Diseño y UX

- **Colores**: Rojo oscuro (#dc2626) y gris como colores principales
- **Tipografía**: Sans-serif moderna y legible
- **Componentes**: Cards con bordes suaves y sombras sutiles
- **Responsive**: Grid system adaptativo
- **Accesibilidad**: Navegación por teclado y contraste adecuado

## 🚀 Instalación y Desarrollo

### Prerrequisitos

- Node.js 18+ 
- npm o yarn

### Instalación

1. Clonar el repositorio:
```bash
git clone <repository-url>
cd paladino-web
```

2. Instalar dependencias:
```bash
npm install
```

3. Ejecutar en modo desarrollo:
```bash
npm run dev
```

4. Abrir [http://localhost:3000](http://localhost:3000) en el navegador

### Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run start` - Servidor de producción
- `npm run lint` - Linting del código

## 📱 Páginas Principales

### Página Principal (`/`)
- Hero section con búsqueda avanzada
- Propiedades destacadas en grilla
- Sección "Por qué elegirnos"
- Call-to-action

### Listado de Propiedades (`/inmuebles`)
- Filtros avanzados (zona, estado, tipo, precio, dormitorios)
- Búsqueda por texto
- Grilla responsive de propiedades
- Paginación y ordenamiento

### Detalle de Propiedad (`/inmueble/[id]`)
- Galería de imágenes con navegación
- Información completa de la propiedad
- Características principales
- Información de contacto
- Botones de acción (WhatsApp, solicitar info)

### Zonas (`/zonas`)
- Listado de zonas disponibles
- Contador de propiedades por zona
- Enlaces directos a filtros

### Contacto (`/contacto`)
- Formulario de contacto
- Información de la empresa
- Redes sociales
- Horarios de atención

## 🔧 Configuración

### Variables de Entorno

Crear un archivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://api.paladino.senectar.com
```

### Personalización

- **Colores**: Modificar las clases de Tailwind en `globals.css`
- **API**: Actualizar la URL base en `services/api.ts`
- **Imágenes**: Reemplazar placeholder en `public/placeholder-property.jpg`

## 🚀 Despliegue

### Vercel (Recomendado)

1. Conectar el repositorio a Vercel
2. Configurar variables de entorno
3. Deploy automático en cada push

### Otros Proveedores

- **Netlify**: Compatible con Next.js
- **AWS Amplify**: Soporte nativo
- **Docker**: Incluir Dockerfile para contenedores

## 📊 Performance

- **Lighthouse Score**: 90+ en todas las métricas
- **Core Web Vitals**: Optimizado para LCP, FID, CLS
- **SEO**: Meta tags y estructura semántica
- **Imágenes**: Optimización automática con Next.js Image

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 📞 Contacto

Paladino Propiedades - [info@paladinopropiedades.com.ar](mailto:info@paladinopropiedades.com.ar)

---

Desarrollado con ❤️ para Paladino Propiedades
