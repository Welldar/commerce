import { authClientResponse, authUserRespone } from './interfaces'

class Authorization {
  authUrl = process.env.AUTH_URL
  projectKey = process.env.PROJECT_KEY
  basicAuthHeader =
    'Basic ' +
    Buffer.from(
      process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET
    ).toString('base64')
  bearerToken: string | null = null

  async getAccessToken(path: string) {
    const response = await fetch(`${this.authUrl}/oauth/${path}`, {
      method: 'POST',
      headers: {
        Authorization: this.basicAuthHeader,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      cache: 'no-cache',
    })

    return response.json()
  }

  authorizeClient(): Promise<authClientResponse> {
    return this.getAccessToken('token?grant_type=client_credentials')
  }

  authorizeUser({
    email,
    password,
  }: {
    email: string
    password: string
  }): Promise<authUserRespone> {
    return this.getAccessToken(
      `${this.projectKey}/customers/token?grant_type=password&username=${email}&password=${password}`
    )
  }

  authorizeAnon(): Promise<authUserRespone> {
    return this.getAccessToken(
      `${this.projectKey}/anonymous/token?grant_type=client_credentials`
    )
  }

  refreshToken(token: string): Promise<authClientResponse> {
    return this.getAccessToken(
      `token?grant_type=refresh_token&refresh_token=${token}`
    )
  }
}
