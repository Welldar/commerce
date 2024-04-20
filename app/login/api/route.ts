import { accessCookie, login, refreshCookie, user } from '@/service';
import { cookies } from 'next/headers';
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

  // const { access_token, expires_in, refresh_token } = await login({
  //   email,
  //   password,
  // });

  const loginData = await login({
    email,
    password,
  });

  const { access_token, expires_in, refresh_token } = loginData;

  console.log(loginData);

  const userData = await user(access_token);

  const year = 60 * 60 * 24 * 365 * 1000;

  cookies().set({
    name: accessCookie,
    value: access_token,
    httpOnly: true,
    maxAge: expires_in,
    secure: true,
  });
  cookies().set({
    name: refreshCookie,
    value: refresh_token,
    expires: Date.now() + year,
    httpOnly: true,
    secure: true,
  });

  return NextResponse.json(userData, { status: 200, headers: {} });
}
