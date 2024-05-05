import { products } from '../_services/commerce'
import { parseParams } from '../_utils/utility'
import { ProductListInner } from './productListClient'

export async function ProductList({
  searchParams,
  categoryId,
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
  categoryId?: string
}) {
  const query = parseParams(searchParams)

  const productsResponse = await products({ queryArgs: query }, categoryId)
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
