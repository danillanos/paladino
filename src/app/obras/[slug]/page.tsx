import { notFound } from 'next/navigation';
import { ApiService } from '@/services/api';
import ObraDetail from './ObraDetail';

interface ObraPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ObraPage({ params }: ObraPageProps) {
  const { slug } = await params;
  const obra = await ApiService.getObraBySlug(slug);

  if (!obra) {
    notFound();
  }

  return <ObraDetail obra={obra} />;
}

export async function generateMetadata({ params }: ObraPageProps) {
  const { slug } = await params;
  const obra = await ApiService.getObraBySlug(slug);

  if (!obra) {
    return {
      title: 'Obra no encontrada',
    };
  }

  return {
    title: `${obra.nombre} - Obra realizada por ${obra.constructora}`,
    description: obra.descripcion || obra.seo_descripcion || `Descubre ${obra.nombre}, una obra realizada por ${obra.constructora} en ${obra.ubicacion} en el año ${obra.anio}`,
  };
}
