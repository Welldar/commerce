import { queriesAdapter } from '../_utils/serverUtility'
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

  const predicate = (
    products: productsResponse
  ): products is ProductProjectionPagedSearchResponse =>
    'errors' in products ? false : true

  const response = (await client.get('product-projections/search', {
    queryArgs,
  })) as productsResponse

  if (predicate(response)) {
    const sort = queryArgs.get('sort')
    let asc: boolean | undefined = undefined

    if (sort?.includes('centAmount')) asc = sort.includes('asc')

    const modifiedResponse = response.results.map((product) => {
      const variants = [product.masterVariant, ...product.variants].filter(
        (variant) => variant.isMatchingVariant
      )

      if (asc != undefined)
        variants.sort(({ scopedPrice: p1 }, { scopedPrice: p2 }) => {
          if (asc)
            return p1!.currentValue.centAmount - p2!.currentValue.centAmount
          else return p2!.currentValue.centAmount - p1!.currentValue.centAmount
        })

      const displayedVariant = variants[0] ?? product.masterVariant

      const modifiedProduct = {
        name: product.name['en-US'],
        description: product.description?.['en-US'],
        id: product.id,
        masterVariant: displayedVariant,
      }
      return modifiedProduct
    })
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
