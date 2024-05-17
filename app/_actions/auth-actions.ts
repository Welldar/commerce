'use server'

import { cookies } from 'next/headers'
import { authorizeUser } from '../_services/auth'
import { authenticateUser } from '../_services/user'
import {
  accessCookie,
  deleteAnonCookies,
  getSession,
  refreshCookie,
  setSecureCookie,
} from '../_utils/server-utility'
import { redirect } from 'next/navigation'

export async function loginAction(formData: FormData) {
  const email = formData.get('email')
  const password = formData.get('password')

  const { access_token: haveToken, anonymous_token } = await getSession()

  if (haveToken) redirect('/')

  if (!email || !password || email instanceof File || password instanceof File)
    throw new Error('invalid credentials')

  const response = await authorizeUser({
    email,
    password,
  })

  if ('errors' in response) return { error: response.message }

  const { access_token, expires_in, refresh_token } = response

  setSecureCookie(accessCookie, access_token, expires_in)
  setSecureCookie(refreshCookie, refresh_token)
  deleteAnonCookies()

  return await authenticateUser({ email, password }, anonymous_token)
}

export async function logoutAction() {
  const cookiesJar = cookies()

  cookiesJar.delete(accessCookie)
  cookiesJar.delete(refreshCookie)
}
