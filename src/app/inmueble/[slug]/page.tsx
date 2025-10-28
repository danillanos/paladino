'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Inmueble } from '@/types';
import { ApiService } from '@/services/api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import InmuebleDetail from '@/components/InmuebleDetail';

export default function InmuebleDetailPage() {
  const params = useParams();
  const [inmueble, setInmueble] = useState<Inmueble | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInmueble = async () => {
      try {
        setLoading(true);
        const slug = params.slug as string;
        const data = await ApiService.getInmuebleBySlug(slug);
        
        if (data) {
          setInmueble(data);
          setError(null);
        } else {
          setError('Propiedad no encontrada');
        }
      } catch (err) {
        setError('Error al cargar la propiedad');
        console.error('Error fetching inmueble:', err);
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchInmueble();
    }
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !inmueble) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Propiedad no encontrada</h1>
          <p className="text-gray-600 mb-6">{error || 'La propiedad que buscas no existe'}</p>
          <Link
            href="/inmuebles"
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Ver todas las propiedades
          </Link>
        </div>
      </div>
    );
  }

  return <InmuebleDetail inmueble={inmueble} />;
}
