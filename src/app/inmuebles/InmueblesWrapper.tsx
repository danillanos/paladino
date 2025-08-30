'use client';

import { Suspense } from 'react';
import InmueblesPageContent from './InmueblesContent';

export default function InmueblesWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InmueblesPageContent />
    </Suspense>
  );
} 