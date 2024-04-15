import { products } from '@/service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('category');

  searchParams.delete('category');

  const { results } = await products(
    { queryArgs: searchParams },
    id ?? undefined
  );

  return NextResponse.json(results, { status: 200 });
}
