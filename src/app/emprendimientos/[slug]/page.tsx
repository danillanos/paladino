import { notFound } from 'next/navigation';
import { ApiService } from '@/services/api';
import EmprendimientoDetail from './EmprendimientoDetail';

interface EmprendimientoPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function EmprendimientoPage({ params }: EmprendimientoPageProps) {
  const { slug } = await params;
  const emprendimiento = await ApiService.getEmprendimientoBySlug(slug);

  if (!emprendimiento) {
    notFound();
  }

  return <EmprendimientoDetail emprendimiento={emprendimiento} />;
}

export async function generateMetadata({ params }: EmprendimientoPageProps) {
  const { slug } = await params;
  const emprendimiento = await ApiService.getEmprendimientoBySlug(slug);

  if (!emprendimiento) {
    return {
      title: 'Emprendimiento no encontrado',
    };
  }

  return {
    title: `${emprendimiento.nombre} - Emprendimiento en ${emprendimiento.ubicacion_avanzada?.localidad || 'Villa Carlos Paz'}`,
    description: emprendimiento.resumen || `Descubre ${emprendimiento.nombre}, un emprendimiento de lujo en ${emprendimiento.ubicacion_avanzada?.localidad || 'Villa Carlos Paz'}`,
  };
}
