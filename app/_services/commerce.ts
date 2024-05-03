import {
  Cart,
  CartDraft,
  CategoryPagedQueryResponse,
  Customer,
  ErrorResponse,
  LineItemDraft,
  MyCartChangeLineItemQuantityAction,
  MyCartUpdate,
  MyCartUpdateAction,
  ProductProjection,
  ProductProjectionPagedSearchResponse,
  ResourceNotFoundError,
} from '@commercetools/platform-sdk'
import { cookies } from 'next/headers'

class ApiClient {
  authUrl = process.env.AUTH_URL
  apiUrl = process.env.API_URL

  projectKey = process.env.PROJECT_KEY
  clientId = process.env.CLIENT_ID
  clientSecret = process.env.CLIENT_SECRET

  scopes = ['manage_project:test-super-unique']

  basicAuthHeader =
    'Basic ' +
    Buffer.from(this.clientId + ':' + this.clientSecret).toString('base64')
  bearerAuthHeader: string | null = null

  async authorizeClient() {
    const Authorization = this.basicAuthHeader

    const response = await fetch(
      `${this.authUrl}/oauth/token?grant_type=client_credentials`,
      {
        method: 'POST',
        headers: { Authorization },
        next: { revalidate: 60 * 60 * 47 },
      }
    )

    const { access_token, token_type } =
      (await response.json()) as authClientResponse

    this.bearerAuthHeader = `${token_type} ${access_token}`
    return this.bearerAuthHeader
  }

  async authorizeUser({
    email,
    password,
  }: {
    email: string
    password: string
  }): Promise<authUserRespone> {
    const Authorization = this.basicAuthHeader

    // &scope=view_published_products:${this.projectKey}%20manage_my_orders:${this.projectKey}%20manage_my_profile:${this.projectKey}

    const response = await fetch(
      `${this.authUrl}/oauth/${this.projectKey}/customers/token?grant_type=password&username=${email}&password=${password}`,
      { method: 'POST', headers: { Authorization }, cache: 'no-cache' }
    )

    return response.json()
  }

  async authorizeAnon(): Promise<authUserRespone> {
    const Authorization = this.basicAuthHeader

    const response = await fetch(
      `${this.authUrl}/oauth/${this.projectKey}/anonymous/token?grant_type=client_credentials`,
      { method: 'POST', headers: { Authorization }, cache: 'no-cache' }
    )

    return response.json()
  }

  async refreshToken(token: string): Promise<authClientResponse> {
    const Authorization = this.basicAuthHeader
    const response = await fetch(
      `${this.authUrl}/oauth/token?grant_type=refresh_token&refresh_token=${token}`,
      {
        method: 'POST',
        headers: {
          Authorization,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    )

    return response.json()
  }

  async request(path: string, method: method, options: options = {}) {
    options.queryArgs?.set('localeProjection', 'en-US')
    options.queryArgs?.set('withTotal', 'false')

    const url = `${this.apiUrl}/${this.projectKey}/${path}${
      options.queryArgs ? '?' + options.queryArgs.toString() : ''
    }`

    console.log(url, ' eldar ')

    if (options.token) options.token = `Bearer ${options.token}`

    const Authorization =
      options.token ?? this.bearerAuthHeader ?? (await this.authorizeClient())

    console.log(Authorization, path)

    const fetchData = (Authorization: string) =>
      fetch(url, {
        method,
        body: JSON.stringify(options.body),
        headers: { Authorization, 'Content-Type': 'application/json' },
      })

    let response = await fetchData(Authorization)

    if (response.status == 401) {
      const Authorization = await this.authorizeClient()
      response = await fetchData(Authorization)
    }

    return response.json()
  }
}

const client = new ApiClient()

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

export async function login(credentials: { email: string; password: string }) {
  return client.authorizeUser(credentials)
}
export async function user(token: string): Promise<Customer> {
  return client.request('me', 'GET', { token })
}

export async function getCart(token: string): Promise<Cart | null> {
  const response = (await client.request('me/active-cart', 'GET', {
    token,
  })) as Cart | ResourceNotFoundError

  const predicate = (cart: Cart | ResourceNotFoundError): cart is Cart =>
    'errors' in cart ? false : true

  return predicate(response) ? response : null
}

export async function createCart(
  token: string,
  lineItem: LineItemDraft
): Promise<Cart> {
  const body: CartDraft = {
    currency: 'USD',
    country: 'US',
    locale: 'en-US',
    lineItems: [lineItem],
  }
  return client.request('me/carts', 'POST', { body, token })
}

export async function updateCart(
  token: string,
  cartId: string,
  body: MyCartUpdate
): Promise<Cart> {
  return client.request(`me/carts/${cartId}`, 'POST', { body, token })
}

export async function refreshToken(token: string) {
  return client.refreshToken(token)
}

export async function getAnonToken() {
  return client.authorizeAnon()
}

export const accessCookie = 'access-token'
export const refreshCookie = 'refresh-token'
export const anonymousCookie = 'anon-token'
export const anonymousRefreshCookie = 'refresh-anon-token'

type authClientResponse = {
  access_token: string
  expires_in: number // seconds (2 days)
  scope: string
  token_type: string
}

type authUserRespone = authClientResponse & {
  refresh_token: string
}

type method = 'GET' | 'POST'

type options = {
  offset?: number
  limit?: number
  token?: string
  queryArgs?: queryArgs
  body?: object
}

type queryArgs = URLSearchParams

export async function getSession() {
  const cookiesJar = cookies()

  let access_token = cookiesJar.get(accessCookie)?.value
  const refresh_token = cookiesJar.get(refreshCookie)?.value
  const anonymous_token = cookiesJar.get(anonymousCookie)?.value

  if (!access_token && refresh_token) {
    const { access_token: token, expires_in } =
      await refreshToken(refresh_token)

    setSecureCookie(accessCookie, token, expires_in)

    access_token = token
  }

  return { access_token, refresh_token, anonymous_token }
}

export function setSecureCookie(
  name: string,
  value: string,
  maxAge: number = 60 * 60 * 24 * 365
) {
  const cookiesJar = cookies()

  cookiesJar.set({
    name,
    value,
    httpOnly: true,
    maxAge,
    secure: true,
  })
}
