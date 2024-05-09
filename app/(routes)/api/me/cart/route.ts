import { getCart } from '@/app/_services/user'

import { getSession } from '@/app/_utils/serverUtility'

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  let { access_token, anonymous_token } = await getSession()

  if (!access_token && !anonymous_token)
    return NextResponse.json('', { status: 401, statusText: 'no credentials' })

  const cart = await getCart(access_token ?? anonymous_token!)

  return NextResponse.json(cart, { status: 200 })
}
