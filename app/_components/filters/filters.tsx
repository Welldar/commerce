import styles from './filters.module.css'
import { PriceRange } from './price-range'
import { Sort } from './sort'
import { FiltersMobile } from './filters-mobile'

export function Filters() {
  return (
    <div className={`sticky ${styles.wrapper}`}>
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
      <Sort />
      <h3>Filter by</h3>
      <PriceRange />
    </div>
  )
}
