import { getCart } from '@/app/_services/user'

import { getSession } from '@/app/_utils/server-utility'

import { NextResponse } from 'next/server'

export async function GET() {
  const { access_token, anonymous_token } = await getSession()
  const token = access_token ?? anonymous_token

  if (!token)
    return NextResponse.json('', { status: 401, statusText: 'no credentials' })

  const cart = await getCart(token)

  return NextResponse.json(cart, { status: 200 })
}
