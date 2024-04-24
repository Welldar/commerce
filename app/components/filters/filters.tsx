'use client';
import { Suspense } from 'react';
import './filters.css';
import { PriceRange } from './price-range';
import { Sort } from './sort';

export function Filters() {
  return (
    <div className="filters">
      <Suspense>
        <Sort />
      </Suspense>
      <h3>Filter by</h3>
      <Suspense>
        <PriceRange />
      </Suspense>
    </div>
  );
}
