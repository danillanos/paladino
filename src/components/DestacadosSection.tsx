'use client';

import { Suspense } from 'react';
import InmueblesGrid from './InmueblesGrid';

export default function DestacadosSection() {
  return (
    <section className="py-16 bg-gray-50">
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
          limit={12}
          title="Destacados"
          showViewAll={true}
          onlyFeatured={true}
          showFilters={false}
        />
      </Suspense>
    </section>
  );
}
