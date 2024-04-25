import {
  updateCart,
  anonymousCookie,
  anonymousRefreshCookie,
  createCart,
  getAnonToken,
  getCart,
  getSession,
  setSecureCookie,
} from '@/app/_services/commerce';
import {
  CartAddLineItemAction,
  LineItemDraft,
  MyCartAddLineItemAction,
  MyCartUpdate,
} from '@commercetools/platform-sdk';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  let { access_token, anonymous_token } = await getSession();

  if (!access_token && !anonymous_token) {
    const { access_token, expires_in, refresh_token } = await getAnonToken();

    setSecureCookie(anonymousCookie, access_token, expires_in);
    setSecureCookie(anonymousRefreshCookie, refresh_token);

    anonymous_token = access_token;
  }

  const token = access_token ?? anonymous_token!;

  let cart = await getCart(token);

  const lineItem = (await request.json()) as LineItemDraft;

  if (!cart) {
    cart = await createCart(token, lineItem);
  } else {
    const action: MyCartAddLineItemAction = {
      action: 'addLineItem',
      ...lineItem,
    };
    const body: MyCartUpdate = { version: cart.version, actions: [action] };
    cart = await updateCart(token, cart.id, body);
  }

  let status = 200;

  if ('errors' in cart) status = 400;

  return NextResponse.json(cart, { status });
}

export async function GET(request: NextRequest) {
  let { access_token, refresh_token } = await getSession();

  if (!access_token && !refresh_token)
    return NextResponse.json('', { status: 401, statusText: 'no credentials' });

  const cart = await getCart(access_token ?? refresh_token!);

  if (!cart) {
    return NextResponse.json('', { status: 404 });
  }

  return NextResponse.json(cart, { status: 200 });
}
