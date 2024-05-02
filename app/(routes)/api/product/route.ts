import { products } from '@/app/_services/commerce'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('category')

  searchParams.delete('category')

  const productsData = await products(
    { queryArgs: searchParams },
    id ?? undefined
  )

  return NextResponse.json(productsData ? productsData.results : [], {
    status: 200,
  })
}
