import { notFound } from 'next/navigation';
import { ApiService } from '@/services/api';
import { Emprendimiento } from '@/types';
import EmprendimientoDetail from './EmprendimientoDetail';

interface EmprendimientoPageProps {
  params: {
    slug: string;
  };
}

export default async function EmprendimientoPage({ params }: EmprendimientoPageProps) {
  const emprendimiento = await ApiService.getEmprendimientoBySlug(params.slug);

  if (!emprendimiento) {
    notFound();
  }

  return <EmprendimientoDetail emprendimiento={emprendimiento} />;
}

export async function generateMetadata({ params }: EmprendimientoPageProps) {
  const emprendimiento = await ApiService.getEmprendimientoBySlug(params.slug);

  if (!emprendimiento) {
    return {
      title: 'Emprendimiento no encontrado',
    };
  }

  return {
    title: `${emprendimiento.nombre} - Emprendimiento en ${emprendimiento.ubicacion_avanzada.localidad}`,
    description: emprendimiento.resumen || `Descubre ${emprendimiento.nombre}, un emprendimiento de lujo en ${emprendimiento.ubicacion_avanzada.localidad}`,
  };
}
