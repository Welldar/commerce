import type { ProductVariant } from '@commercetools/platform-sdk'

export type ProductProjection = {
  name: string
  description: string | undefined
  id: string
  masterVariant: ProductVariant
}

export type authClientResponse = {
  access_token: string
  expires_in: number // seconds (2 days)
  scope: string
  token_type: string
}

export type authUserRespone = authClientResponse & {
  refresh_token: string
}

export type method = 'GET' | 'POST'

export type options = {
  offset?: number
  limit?: number
  token?: string
  queryArgs?: URLSearchParams
  body?: object
}
