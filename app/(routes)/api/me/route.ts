import { user } from '@/app/_services/user'
import { getSession } from '@/app/_utils/serverUtility'

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { access_token } = await getSession()

  if (!access_token)
    return NextResponse.json('', { status: 401, statusText: 'invalid token' })

  const customer = await user(access_token)

  return NextResponse.json(customer)
}
