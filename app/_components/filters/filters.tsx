import styles from './filters.module.css';
import { Suspense } from 'react';
import { PriceRange } from './price-range';
import { Sort } from './sort';

export function Filters() {
  return (
    <div className={styles.filters}>
      <Suspense>
        <Sort />
        <h3>Filter by</h3>
        <PriceRange />
      </Suspense>
    </div>
  );
}
