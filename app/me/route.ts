import { accessCookie, refreshCookie, refreshToken, user } from '@/service';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const cookiesJar = cookies();

  const access_token = cookiesJar.get(accessCookie);
  const refresh_token = cookiesJar.get(refreshCookie);

  let token = access_token?.value ?? '';

  if (!access_token && !refresh_token)
    return NextResponse.json('', { status: 401, statusText: 'invalid token' });
  else if (!access_token && refresh_token) {
    const { access_token, expires_in } = await refreshToken(
      refresh_token.value
    );

    cookiesJar.set({
      name: accessCookie,
      value: access_token,
      httpOnly: true,
      maxAge: expires_in,
      secure: true,
    });

    token = access_token;
  }

  const userData = await user(token);

  return NextResponse.json(userData);
}
