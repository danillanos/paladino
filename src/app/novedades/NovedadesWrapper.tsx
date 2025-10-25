'use client';

import { Suspense } from 'react';
import NovedadesContent from './NovedadesContent';

export default function NovedadesWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NovedadesContent />
    </Suspense>
  );
}
