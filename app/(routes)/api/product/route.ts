import { getProducts } from '@/app/_services/storefront'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('category')

  searchParams.delete('category')

  const productsData = await getProducts(searchParams, id ?? undefined)

  return NextResponse.json(productsData ? productsData : [], {
    status: 200,
  })
}
