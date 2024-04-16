'use client';
import './filters.css';
import { PriceRange } from './price-range';
import { Sort } from './sort';

export function Filters() {
  return (
    <div className="filters">
      <Sort></Sort>
      <h3>Filter by</h3>
      <PriceRange></PriceRange>
    </div>
  );
}
