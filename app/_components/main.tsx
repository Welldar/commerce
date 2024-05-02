import { ProductProjectionPagedSearchResponse } from '@commercetools/platform-sdk'
import { Filters } from './filters/filters'
import { ProductList } from './productsList'
import { CategoryList } from './categoryList'
import { Suspense } from 'react'

export default function Main({
  products,
  slug,
  id,
}: {
  products: ProductProjectionPagedSearchResponse | null
  slug: string
  id?: string
}) {
  return (
    <main>
      <Filters />
      {products ? (
        <Suspense fallback={<h1>loading from main</h1>}>
          <ProductList id={id} products={products.results} />
        </Suspense>
      ) : (
        <div>No such a page</div>
      )}
      <CategoryList slug={slug} />
    </main>
  )
}
