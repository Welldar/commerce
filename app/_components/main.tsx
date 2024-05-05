import { Filters } from './filters/filters'
import { ProductList } from './productsList'
import { CategoryList } from './categoryList'
import { Suspense } from 'react'

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
      <Suspense fallback={<h1>loading products</h1>}>
        <ProductList searchParams={searchParams} categoryId={id} />
      </Suspense>

      <Suspense fallback={<h1>Loading category</h1>}>
        <CategoryList categoryId={id} />
      </Suspense>
    </main>
  )
}
