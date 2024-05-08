import { cookies } from 'next/headers'
import { refreshToken } from '../_services/auth'

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

export function queriesAdapter(
  queryArgs: URLSearchParams,
  categoryId?: string
) {
  queryArgs.set('localeProjection', 'en-US')
  queryArgs.set('priceCurrency', 'USD')
  queryArgs.set('priceCountry', 'US')
  queryArgs.set('markMatchingVariants', 'true')
  queryArgs.get('sort') ? null : queryArgs.set('sort', 'lastModifiedAt desc')

  const priceRange = queryArgs.get('price_range')

  if (priceRange) {
    let [from, to] = priceRange
      .split(':')
      .map((item) => (item ? item.concat('00') : '*'))

    queryArgs.append(
      'filter.query',
      `variants.scopedPrice.currentValue.centAmount:range(${from} to ${to})`
    )
  }

  if (categoryId)
    queryArgs.append('filter.query', `categories.id: subtree("${categoryId}")`)

  return queryArgs
}

export const accessCookie = 'access-token'
export const refreshCookie = 'refresh-token'
export const anonymousCookie = 'anon-token'
export const anonymousRefreshCookie = 'refresh-anon-token'
