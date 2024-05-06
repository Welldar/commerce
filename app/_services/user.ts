import { authorizeAnon, authorizeUser, refreshToken } from './auth'
import { client } from './client'

import {
  Customer,
  Cart,
  ResourceNotFoundError,
  LineItemDraft,
  CartDraft,
  MyCartUpdate,
} from '@commercetools/platform-sdk'

export async function login(credentials: { email: string; password: string }) {
  return authorizeUser(credentials)
}
export async function user(token: string): Promise<Customer> {
  return client.get('me', { token })
}

export async function getCart(token: string): Promise<Cart | null> {
  const response = (await client.get('me/active-cart', {
    token,
  })) as Cart | ResourceNotFoundError

  console.log(response)

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

export async function updateToken(token: string) {
  return refreshToken(token)
}

export async function getAnonToken() {
  return authorizeAnon()
}
