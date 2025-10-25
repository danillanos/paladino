'use client';

import { Suspense } from 'react';
import NovedadDetailContent from './NovedadDetailContent';

export default function NovedadDetailWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NovedadDetailContent />
    </Suspense>
  );
}
