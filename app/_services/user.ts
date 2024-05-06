import { client } from './apiClient'

import {
  Customer,
  Cart,
  ResourceNotFoundError,
  LineItemDraft,
  CartDraft,
  MyCartUpdate,
} from '@commercetools/platform-sdk'

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
