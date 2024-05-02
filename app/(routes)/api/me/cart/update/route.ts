import { updateCart, getCart, getSession } from '@/app/_services/commerce'
import {
  MyCartChangeLineItemQuantityAction,
  MyCartUpdate,
} from '@commercetools/platform-sdk'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  let { access_token, anonymous_token } = await getSession()

  const token = access_token ?? anonymous_token!

  let cart = await getCart(token)

  const update = (await request.json()) as MyCartChangeLineItemQuantityAction

  const body: MyCartUpdate = { version: cart!.version, actions: [update] }

  cart = await updateCart(token, cart!.id, body)

  let status = 200

  if ('errors' in cart) status = 420

  return NextResponse.json(cart, { status })
}
