import { accessCookie, refreshCookie } from '@/service';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export function GET() {
  const cookiesJar = cookies();

  cookiesJar.delete(accessCookie);
  cookiesJar.delete(refreshCookie);

  return NextResponse.json('', { status: 200 });
}
