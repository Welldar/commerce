import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import filtersStyle from '@/app/_components/filters/filters.module.css'

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
      <div
        style={{
          margin: '10px 0',
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <Skeleton style={{ width: '80px' }} /> {' > '}
        <Skeleton style={{ width: '80px' }} /> {' > '}
        <Skeleton style={{ width: '80px' }} />
      </div>
      <Skeleton count={4} />
    </>
  )
}

export function ProductListLoader() {
  const productLoader = new Array(8).fill(0).map((_, ind) => (
    <li key={ind}>
      {new Array(5).fill(0).map((_, ind) => (
        <Skeleton key={ind} height={'100%'} />
      ))}
    </li>
  ))
  return <div className="grid">{productLoader}</div>
}
