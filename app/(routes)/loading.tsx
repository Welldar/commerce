import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import filtersStyle from '@/app/_components/filters/filters.module.css'
import categoriesStyle from '@/app/_components/categoryList.module.css'

export default function Loading() {
  return (
    <main>
      <div
        className={`sticky ${filtersStyle.wrapper}`}
        style={{ width: '100%' }}
      >
        <div className={filtersStyle.filters}>
          <h3>Sort by</h3>
          <InputLoader />
          <h3>Filter by</h3>
          <InputLoader />
        </div>
        <div className={filtersStyle.mobile}>Filters</div>
      </div>
      <ProductListLoader />
      <div>
        <h2>Categories</h2>
        <CategoriesLoader />
      </div>
    </main>
  )
}

export function InputLoader() {
  return (
    <Skeleton
      style={{ height: '37px', borderRadius: '10px' }}
      containerClassName="lineHeight-1"
    />
  )
}

export function CategoriesLoader() {
  return (
    <>
      <nav className={categoriesStyle.nav}>
        {new Array(3).fill(0).map((_, ind) => (
          <span style={{ flexGrow: '1' }} key={ind}>
            <Skeleton />
          </span>
        ))}
      </nav>
      <ul className={categoriesStyle.list}>
        {new Array(4).fill(0).map((_, ind) => (
          <li style={{ flexGrow: '1' }} key={ind}>
            <Skeleton />
          </li>
        ))}
      </ul>
    </>
  )
}

export function ProductListLoader() {
  const productLoader = new Array(16)
    .fill(0)
    .map((_, ind) => <ProductLoader key={ind} />)
  return <div className="grid">{productLoader}</div>
}

export function ProductLoader() {
  return (
    <li>
      {new Array(5).fill(0).map((_, ind) => (
        <Skeleton key={ind} height={'100%'} />
      ))}
    </li>
  )
}
