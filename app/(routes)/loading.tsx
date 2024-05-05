import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function Loading() {
  return (
    <main>
      <div
        style={{
          fontSize: '14px',
          display: 'flex',
          gap: '10px',
          flexDirection: 'column',
        }}
      >
        <h3>Sort by</h3>
        <InputLoader />
        <h3>Filter by</h3>
        <InputLoader />
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
      <div style={{ margin: '10px 0', display: 'flex', alignItems: 'center' }}>
        <Skeleton style={{ width: '80px' }} /> {' > '}
        <Skeleton style={{ width: '80px' }} /> {' > '}
        <Skeleton style={{ width: '80px' }} />
      </div>
      <Skeleton count={4} />
    </>
  )
}

export function ProductListLoader() {
  const productLoader = new Array(8).fill(0).map((item, ind) => (
    <li key={ind}>
      {new Array(5).fill(0).map((item, ind) => (
        <Skeleton key={ind} height={'100%'} />
      ))}
    </li>
  ))
  return <div className="grid">{productLoader}</div>
}
