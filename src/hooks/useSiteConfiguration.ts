'use client';

import { useState, useEffect } from 'react';
import { ApiService } from '@/services/api';
import { SiteConfiguration } from '@/types';

export function useSiteConfiguration() {
  const [configuration, setConfiguration] = useState<SiteConfiguration | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfiguration = async () => {
      try {
        setLoading(true);
        const data = await ApiService.getSiteConfiguration();
        setConfiguration(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        setConfiguration(null);
      } finally {
        setLoading(false);
      }
    };

    fetchConfiguration();
  }, []);

  return { configuration, loading, error };
}
