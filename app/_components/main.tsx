import { ProductProjection } from './types'
import { Filters } from './filters/filters'
import { ProductList } from './productsList'
import { CategoryList } from './categoryList'
import { Suspense } from 'react'

export default function Main({
  products,
  id,
}: {
  products: ProductProjection[] | null
  id?: string
}) {
  return (
    <main>
      <Filters />
      {products ? (
        <Suspense fallback={<h1>loading products</h1>}>
          <ProductList categoryId={id} initialProducts={products} />
        </Suspense>
      ) : (
        <div>No such a page</div>
      )}
      <Suspense fallback={<h1>Loading category</h1>}>
        <CategoryList categoryId={id} />
      </Suspense>
    </main>
  )
}
