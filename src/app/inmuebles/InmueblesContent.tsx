'use client';

import { Suspense } from 'react';
import InmueblesGrid from '@/components/InmueblesGrid';

export default function InmueblesPageContent() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Suspense fallback={
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      }>
        <InmueblesGrid 
          title="Listado de Propiedades"
          showViewAll={false}
        />
      </Suspense>
    </div>
  );
}