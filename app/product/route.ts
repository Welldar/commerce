import { products } from '@/service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const { results } = await products({ queryArgs: searchParams });

  return NextResponse.json(results, { status: 200 });
}
