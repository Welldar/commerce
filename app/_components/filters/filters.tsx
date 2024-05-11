import styles from './filters.module.css'
import { Suspense } from 'react'
import { PriceRange } from './price-range'
import { Sort } from './sort'
import { InputLoader } from '@/app/(routes)/loading'
import { FiltersMobile } from './filtersMobile'

export function Filters() {
  return (
    <div className="sticky">
      <FiltersDesktop />
      <FiltersMobile className={styles.mobile}>
        <FiltersDesktop />
      </FiltersMobile>
    </div>
  )
}

function FiltersDesktop() {
  return (
    <div className={`${styles.filters}`}>
      <h3>Sort by</h3>
      <Suspense fallback={<InputLoader />}>
        <Sort />
      </Suspense>
      <h3>Filter by</h3>
      <Suspense fallback={<InputLoader />}>
        <PriceRange />
      </Suspense>
    </div>
  )
}
