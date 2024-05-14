import { productAdapter, queriesAdapter } from '../_utils/server-utility'
import { client } from './client'

import type {
  ProductProjectionPagedSearchResponse,
  ErrorResponse,
  ProductProjection,
  CategoryPagedQueryResponse,
} from '@commercetools/platform-sdk'

export type productsResponse =
  | ProductProjectionPagedSearchResponse
  | ErrorResponse

export async function getProducts(
  queryArgs: URLSearchParams = new URLSearchParams(),
  categoryId?: string
) {
  queryArgs = queriesAdapter(queryArgs, categoryId)

  const isProductsResponse = (
    products: productsResponse
  ): products is ProductProjectionPagedSearchResponse =>
    'errors' in products ? false : true

  const response = (await client.get('product-projections/search', {
    queryArgs,
  })) as productsResponse

  if (isProductsResponse(response)) {
    const sort = queryArgs.get('sort') ?? ''
    const asc = sort.includes('centAmount') ? sort.includes('asc') : undefined

    const modifiedResponse = response.results.map((product) =>
      productAdapter(product, asc)
    )

    return modifiedResponse
  } else return null
}

export async function getProduct(id: string): Promise<ProductProjection> {
  const queryArgs = new URLSearchParams()

  queryArgs.set('priceCurrency', 'USD')
  queryArgs.set('priceCountry', 'US')
  queryArgs.set('localeProjection', 'en-US')

  return client.get(`product-projections/${id}`, { queryArgs })
}

export async function getCategories(): Promise<CategoryPagedQueryResponse> {
  return client.get('categories')
}
