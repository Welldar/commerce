import { client } from './apiClient'
import { options } from './interfaces'

import type {
  ProductProjectionPagedSearchResponse,
  ErrorResponse,
  ProductProjection,
  CategoryPagedQueryResponse,
} from '@commercetools/platform-sdk'

export type productsResponse =
  | ProductProjectionPagedSearchResponse
  | ErrorResponse

export async function products(options: options = {}, id?: string) {
  options.queryArgs = options.queryArgs
    ? options.queryArgs
    : new URLSearchParams()

  options.queryArgs.set('priceCurrency', 'USD')
  options.queryArgs.set('priceCountry', 'US')
  options.queryArgs.set('markMatchingVariants', 'true')
  options.queryArgs.get('sort')
    ? null
    : options.queryArgs.set('sort', 'lastModifiedAt desc')

  const priceRange = options.queryArgs.get('price_range')

  if (priceRange) {
    let [from, to] = priceRange
      .split(':')
      .map((item) => (item ? item.concat('00') : '*'))

    options.queryArgs.append(
      'filter.query',
      `variants.scopedPrice.currentValue.centAmount:range(${from} to ${to})`
    )
  }

  if (id)
    options.queryArgs.append('filter.query', `categories.id: subtree("${id}")`)

  const predicate = (
    products: productsResponse
  ): products is ProductProjectionPagedSearchResponse =>
    'errors' in products ? false : true

  const response = (await client.request(
    'product-projections/search',
    'GET',
    options
  )) as productsResponse

  if (predicate(response)) {
    const sort = options.queryArgs.get('sort')
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

export async function product(id: string): Promise<ProductProjection> {
  const options = { queryArgs: new URLSearchParams() }
  if (options.queryArgs) {
    options.queryArgs.set('priceCurrency', 'USD')
    options.queryArgs.set('priceCountry', 'US')
  }
  return client.request(`product-projections/${id}`, 'GET', options)
}

export async function category(
  options?: options
): Promise<CategoryPagedQueryResponse> {
  return client.request('categories', 'GET', options)
}
