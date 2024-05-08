export type authClientResponse = {
  access_token: string
  expires_in: number // seconds (2 days)
  scope: string
  token_type: string
}

export type authUserRespone = authClientResponse & {
  refresh_token: string
}

const authUrl = process.env.AUTH_URL
const projectKey = process.env.PROJECT_KEY
const basicAuthHeader =
  'Basic ' +
  Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString(
    'base64'
  )

async function getAccessToken(path: string) {
  const response = await fetch(`${authUrl}/oauth/${path}`, {
    method: 'POST',
    headers: {
      Authorization: basicAuthHeader,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    cache: 'no-cache',
  })

  return response.json()
}

export function authorizeClient(): Promise<authClientResponse> {
  return getAccessToken('token?grant_type=client_credentials')
}

export function authorizeUser({
  email,
  password,
}: {
  email: string
  password: string
}): Promise<authUserRespone> {
  return getAccessToken(
    `${projectKey}/customers/token?grant_type=password&username=${email}&password=${password}`
  )
}

export function authorizeAnon(): Promise<authUserRespone> {
  return getAccessToken(
    `${projectKey}/anonymous/token?grant_type=client_credentials`
  )
}

export function refreshToken(token: string): Promise<authClientResponse> {
  return getAccessToken(`token?grant_type=refresh_token&refresh_token=${token}`)
}
