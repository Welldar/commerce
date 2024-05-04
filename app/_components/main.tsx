import { ProductProjection } from './types'
import { Filters } from './filters/filters'
import { ProductList } from './productsList'
import { CategoryList } from './categoryList'
import { Suspense } from 'react'

export default function Main({
  products,
  slug,
  searchParams = '',
  id,
}: {
  products: ProductProjection[] | null
  slug: string
  searchParams?: string
  id?: string
}) {
  return (
    <main>
      <Filters />
      {products ? (
        <Suspense fallback={<h1>loading from main</h1>}>
          <ProductList key={searchParams} categoryId={id} products={products} />
        </Suspense>
      ) : (
        <div>No such a page</div>
      )}
      <CategoryList slug={slug} />
    </main>
  )
}
