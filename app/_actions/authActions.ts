'use server'

import { cookies } from 'next/headers'
import { authorizeUser } from '../_services/auth'
import { getCart, getUser } from '../_services/user'
import {
  accessCookie,
  refreshCookie,
  setSecureCookie,
} from '../_utils/serverUtility'
import { redirect } from 'next/navigation'

export async function loginAction(formData: FormData) {
  const email = formData.get('email')
  const password = formData.get('password')

  if (!email || !password || email instanceof File || password instanceof File)
    return { error: 'invalid credentials' }

  const { access_token, expires_in, refresh_token } = await authorizeUser({
    email,
    password,
  })

  const [customer, cart] = await Promise.all([
    getUser(access_token),
    getCart(access_token),
  ])

  setSecureCookie(accessCookie, access_token, expires_in)
  setSecureCookie(refreshCookie, refresh_token)

  return { customer, cart }
}

export async function logoutAction() {
  const cookiesJar = cookies()

  cookiesJar.delete(accessCookie)
  cookiesJar.delete(refreshCookie)
  redirect('/')
}
