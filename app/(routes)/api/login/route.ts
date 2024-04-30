import {
  accessCookie,
  getCart,
  login,
  refreshCookie,
  setSecureCookie,
  user,
} from '@/app/_services/commerce';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.formData();
  const email = body.get('email');
  const password = body.get('password');

  if (!email || !password || email instanceof File || password instanceof File)
    return NextResponse.json(
      {},
      { status: 401, statusText: 'invalid credentials' }
    );

  const { access_token, expires_in, refresh_token } = await login({
    email,
    password,
  });

  const [customer, cart] = await Promise.all([
    user(access_token),
    getCart(access_token),
  ]);

  setSecureCookie(accessCookie, access_token, expires_in);
  setSecureCookie(refreshCookie, refresh_token);

  return NextResponse.json({ customer, cart }, { status: 200, headers: {} });
}