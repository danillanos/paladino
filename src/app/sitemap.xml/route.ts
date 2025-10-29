import { NextResponse } from 'next/server';

// Tipos para los datos de la API
interface InmuebleSitemap {
  slug: string;
  updated_at?: string;
}

interface EmprendimientoSitemap {
  slug: string;
  updated_at?: string;
}

interface NovedadSitemap {
  id: number;
  titulo: string;
  slug: string;
  updated_at?: string;
}

// Tipo para las páginas del sitemap
interface SitemapPage {
  url: string;
  lastmod: string;
  changefreq: string;
  priority: string;
}

export async function GET(request: Request) {
  // Detectar si estamos en desarrollo local o producción
  const host = request.headers.get('host') || '';
  const isLocal = host.includes('localhost') || host.includes('127.0.0.1');
  const baseUrl = isLocal ? `http://${host}` : 'https://paladinopropiedades.com.ar';
  
  // Páginas estáticas principales
  const staticPages: SitemapPage[] = [
    {
      url: `${baseUrl}/`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: '1.0'
    },
    {
      url: `${baseUrl}/inmuebles`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: '0.9'
    },
    {
      url: `${baseUrl}/emprendimientos`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: '0.8'
    },
    {
      url: `${baseUrl}/novedades`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: '0.7'
    },
    {
      url: `${baseUrl}/zonas`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: '0.6'
    },
    {
      url: `${baseUrl}/contacto`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: '0.5'
    }
  ];

  // Obtener propiedades dinámicamente
  let inmueblesPages: SitemapPage[] = [];
  
  try {
    const inmueblesResponse = await fetch('https://api.paladinopropiedades.com.ar/inmuebles');
    if (inmueblesResponse.ok) {
      const inmuebles: InmuebleSitemap[] = await inmueblesResponse.json();
      inmueblesPages = inmuebles.map((inmueble) => ({
        url: `${baseUrl}/inmueble/${inmueble.slug}`,
        lastmod: inmueble.updated_at ? new Date(inmueble.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        changefreq: 'weekly',
        priority: '0.8'
      }));
    }
  } catch (error) {
    console.error('Error fetching inmuebles for sitemap:', error);
  }

  // Obtener emprendimientos dinámicamente
  let emprendimientosPages: SitemapPage[] = [];
  
  try {
    const emprendimientosResponse = await fetch('https://api.paladinopropiedades.com.ar/emprendimientos');
    if (emprendimientosResponse.ok) {
      const emprendimientos: EmprendimientoSitemap[] = await emprendimientosResponse.json();
      emprendimientosPages = emprendimientos.map((emprendimiento) => ({
        url: `${baseUrl}/emprendimientos/${emprendimiento.slug}`,
        lastmod: emprendimiento.updated_at ? new Date(emprendimiento.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        changefreq: 'weekly',
        priority: '0.7'
      }));
    }
  } catch (error) {
    console.error('Error fetching emprendimientos for sitemap:', error);
  }

  // Obtener novedades dinámicamente
  let novedadesPages: SitemapPage[] = [];
  
  // Obtener novedades de la API real
  try {
    const novedadesResponse = await fetch('https://api.paladinopropiedades.com.ar/novedades');
    if (novedadesResponse.ok) {
      const novedades: NovedadSitemap[] = await novedadesResponse.json();
      novedadesPages = novedades.map((novedad) => ({
        url: `${baseUrl}/novedades/${novedad.slug}`,
        lastmod: novedad.updated_at ? new Date(novedad.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        changefreq: 'weekly',
        priority: '0.6'
      }));
    }
  } catch (error) {
    console.error('Error fetching novedades for sitemap:', error);
  }

  // Combinar todas las páginas
  const allPages = [
    ...staticPages,
    ...inmueblesPages,
    ...emprendimientosPages,
    ...novedadesPages
  ];

  // Generar XML del sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    }
  });
}
