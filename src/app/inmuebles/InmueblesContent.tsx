'use client';

import InmueblesGrid from '@/components/InmueblesGrid';

export default function InmueblesPageContent() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <InmueblesGrid 
        title="Todas las Propiedades"
        showViewAll={false}
      />
    </div>
  );
}