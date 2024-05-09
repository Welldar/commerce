import { client } from './client'

import type {
  Customer,
  Cart,
  ResourceNotFoundError,
  LineItemDraft,
  CartDraft,
  MyCartUpdate,
  CustomerSignInResult,
} from '@commercetools/platform-sdk'

export async function getUser(token: string): Promise<Customer> {
  return client.get('me', { token })
}

export async function authenticateUser(
  body: { email: string; password: string },
  token?: string
): Promise<CustomerSignInResult> {
  return client.post('me/login', { token, body })
}

export async function getCart(token: string): Promise<Cart | null> {
  const response = (await client.get('me/active-cart', {
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
  return client.post('me/carts', { body, token })
}

export async function updateCart(
  token: string,
  cartId: string,
  body: MyCartUpdate
): Promise<Cart> {
  return client.post(`me/carts/${cartId}`, { body, token })
}
