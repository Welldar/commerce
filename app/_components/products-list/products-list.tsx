import { getProducts } from '../../_services/storefront'
import { parseParams } from '../../_utils/client-utility'
import { ProductListInner } from './products-list-client'

export async function ProductList({
  searchParams,
  categoryId,
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
  categoryId?: string
}) {
  const query = parseParams(searchParams)

  const productsResponse = await getProducts(query, categoryId)
  const searchString = query.toString()

  return productsResponse ? (
    <ProductListInner
      initialProducts={productsResponse}
      key={searchString}
      searchParams={searchString}
      categoryId={categoryId}
    />
  ) : (
    'no such a page'
  )
}
