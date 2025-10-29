import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Detectar si estamos en desarrollo local o producción
  const host = request.headers.get('host') || '';
  const isLocal = host.includes('localhost') || host.includes('127.0.0.1');
  const baseUrl = isLocal ? `http://${host}` : 'https://paladinopropiedades.com.ar';
  
  // Páginas estáticas principales
  const staticPages = [
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
  let inmueblesPages = [];
  
  if (isLocal) {
    // En local, usar datos mock
    inmueblesPages = [
      {
        url: `${baseUrl}/inmueble/casa-villa-carlos-paz-3-dormitorios`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'weekly',
        priority: '0.8'
      },
      {
        url: `${baseUrl}/inmueble/departamento-centro-2-ambientes`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'weekly',
        priority: '0.8'
      },
      {
        url: `${baseUrl}/inmueble/casa-quinta-sierras-4-dormitorios`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'weekly',
        priority: '0.8'
      }
    ];
  } else {
    // En producción, obtener datos reales
    try {
      const inmueblesResponse = await fetch('https://api.paladinopropiedades.com.ar/inmuebles');
      if (inmueblesResponse.ok) {
        const inmuebles = await inmueblesResponse.json();
        inmueblesPages = inmuebles.map((inmueble: any) => ({
          url: `${baseUrl}/inmueble/${inmueble.slug}`,
          lastmod: inmueble.updated_at ? new Date(inmueble.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          changefreq: 'weekly',
          priority: '0.8'
        }));
      }
    } catch (error) {
      console.error('Error fetching inmuebles for sitemap:', error);
    }
  }

  // Obtener emprendimientos dinámicamente
  let emprendimientosPages = [];
  
  if (isLocal) {
    // En local, usar datos mock
    emprendimientosPages = [
      {
        url: `${baseUrl}/emprendimientos/complejo-goethe`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'weekly',
        priority: '0.7'
      },
      {
        url: `${baseUrl}/emprendimientos/barrio-cerrado-villa-carlos-paz`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'weekly',
        priority: '0.7'
      },
      {
        url: `${baseUrl}/emprendimientos/condominio-montanas`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'weekly',
        priority: '0.7'
      }
    ];
  } else {
    // En producción, obtener datos reales
    try {
      const emprendimientosResponse = await fetch('https://api.paladinopropiedades.com.ar/emprendimientos');
      if (emprendimientosResponse.ok) {
        const emprendimientos = await emprendimientosResponse.json();
        emprendimientosPages = emprendimientos.map((emprendimiento: any) => ({
          url: `${baseUrl}/emprendimientos/${emprendimiento.slug}`,
          lastmod: emprendimiento.updated_at ? new Date(emprendimiento.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          changefreq: 'weekly',
          priority: '0.7'
        }));
      }
    } catch (error) {
      console.error('Error fetching emprendimientos for sitemap:', error);
    }
  }

  // Obtener novedades dinámicamente
  let novedadesPages = [];
  
  if (isLocal) {
    // En local, usar datos mock
    novedadesPages = [
      {
        url: `${baseUrl}/novedades/expo-2025`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'weekly',
        priority: '0.6'
      },
      {
        url: `${baseUrl}/novedades/nuevos-emprendimientos-villa-carlos-paz`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'weekly',
        priority: '0.6'
      }
    ];
  } else {
    // En producción, obtener datos reales
    try {
      const novedadesResponse = await fetch('https://api.paladinopropiedades.com.ar/novedades');
      if (novedadesResponse.ok) {
        const novedades = await novedadesResponse.json();
        novedadesPages = novedades.map((novedad: any) => ({
          url: `${baseUrl}/novedades/${novedad.id}`,
          lastmod: novedad.updated_at ? new Date(novedad.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          changefreq: 'weekly',
          priority: '0.6'
        }));
      }
    } catch (error) {
      console.error('Error fetching novedades for sitemap:', error);
    }
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
