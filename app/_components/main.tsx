import { Filters } from './filters/filters'
import { ProductList } from './products-list/products-list'
import { CategoryList } from './category-list/category-list'
import { Suspense } from 'react'
import { CategoriesLoader, ProductListLoader } from '../(routes)/loading'

export default function Main({
  id,
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
  id?: string
}) {
  return (
    <main>
      <Filters />
      <Suspense fallback={<ProductListLoader />}>
        <ProductList searchParams={searchParams} categoryId={id} />
      </Suspense>

      <div className="sticky">
        <h2>Categories</h2>
        <Suspense fallback={<CategoriesLoader />}>
          <CategoryList categoryId={id} />
        </Suspense>
      </div>
    </main>
  )
}
