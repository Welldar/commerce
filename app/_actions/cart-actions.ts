'use server'
import type {
  LineItemDraft,
  MyCartAddLineItemAction,
  MyCartUpdate,
  MyCartUpdateAction,
} from '@commercetools/platform-sdk'
import {
  anonymousCookie,
  anonymousRefreshCookie,
  getSession,
  setSecureCookie,
} from '../_utils/server-utility'
import { authorizeAnon } from '../_services/auth'
import { createCart, getCart, updateCart } from '../_services/user'
import { redirect } from 'next/navigation'

export async function addItemAction(lineItem: LineItemDraft) {
  const { access_token, anonymous_token } = await getSession()
  let token = access_token ?? anonymous_token

  if (!token) {
    const { access_token, expires_in, refresh_token } = await authorizeAnon()

    setSecureCookie(anonymousCookie, access_token, expires_in)
    setSecureCookie(anonymousRefreshCookie, refresh_token)

    token = access_token
  }

  let cart = await getCart(token)

  if (!cart) {
    cart = await createCart(token, lineItem)
  } else {
    const action: MyCartAddLineItemAction = {
      action: 'addLineItem',
      ...lineItem,
    }
    const body: MyCartUpdate = { version: cart.version, actions: [action] }
    cart = await updateCart(token, cart.id, body)
  }

  return cart
}

export async function updateAction(update: MyCartUpdateAction) {
  let { access_token, anonymous_token } = await getSession()

  const token = access_token ?? anonymous_token

  if (!token) throw new Error('invalid action')

  let cart = await getCart(token)

  if (!cart) throw new Error('invalid action')

  const body: MyCartUpdate = { version: cart.version, actions: [update] }

  cart = await updateCart(token, cart.id, body)

  return cart
}

export async function checkoutAction() {
  let { access_token, anonymous_token } = await getSession()

  if (access_token) return { error: 'Not implemented' }

  if (!anonymous_token) return { error: 'Invalid request' }

  redirect('login')
}
