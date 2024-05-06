import type {
  authClientResponse,
  authUserRespone,
  method,
  options,
} from './interfaces'

class ApiClient {
  authUrl = process.env.AUTH_URL
  apiUrl = process.env.API_URL

  projectKey = process.env.PROJECT_KEY

  scopes = ['manage_project:test-super-unique']

  basicAuthHeader =
    'Basic ' +
    Buffer.from(
      process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET
    ).toString('base64')
  bearerAuthHeader: string | null = null

  async authorizeClient() {
    const Authorization = this.basicAuthHeader

    const response = await fetch(
      `${this.authUrl}/oauth/token?grant_type=client_credentials`,
      {
        method: 'POST',
        headers: { Authorization },
        next: { revalidate: 60 * 60 * 47 },
      }
    )

    const { access_token, token_type } =
      (await response.json()) as authClientResponse

    this.bearerAuthHeader = `${token_type} ${access_token}`
    return this.bearerAuthHeader
  }

  async authorizeUser({
    email,
    password,
  }: {
    email: string
    password: string
  }): Promise<authUserRespone> {
    const Authorization = this.basicAuthHeader

    // &scope=view_published_products:${this.projectKey}%20manage_my_orders:${this.projectKey}%20manage_my_profile:${this.projectKey}

    const response = await fetch(
      `${this.authUrl}/oauth/${this.projectKey}/customers/token?grant_type=password&username=${email}&password=${password}`,
      { method: 'POST', headers: { Authorization }, cache: 'no-cache' }
    )

    return response.json()
  }

  async authorizeAnon(): Promise<authUserRespone> {
    const Authorization = this.basicAuthHeader

    const response = await fetch(
      `${this.authUrl}/oauth/${this.projectKey}/anonymous/token?grant_type=client_credentials`,
      { method: 'POST', headers: { Authorization }, cache: 'no-cache' }
    )

    return response.json()
  }

  async refreshToken(token: string): Promise<authClientResponse> {
    const Authorization = this.basicAuthHeader
    const response = await fetch(
      `${this.authUrl}/oauth/token?grant_type=refresh_token&refresh_token=${token}`,
      {
        method: 'POST',
        headers: {
          Authorization,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    )

    return response.json()
  }

  async request(path: string, method: method, options: options = {}) {
    options.queryArgs?.set('localeProjection', 'en-US')
    options.queryArgs?.set('withTotal', 'false')

    const url = `${this.apiUrl}/${this.projectKey}/${path}${
      options.queryArgs ? '?' + options.queryArgs.toString() : ''
    }`

    console.log(url, ' eldar ')

    if (options.token) options.token = `Bearer ${options.token}`

    const Authorization =
      options.token ?? this.bearerAuthHeader ?? (await this.authorizeClient())

    console.log(Authorization, path)

    const fetchData = (Authorization: string) =>
      fetch(url, {
        method,
        body: JSON.stringify(options.body),
        headers: { Authorization, 'Content-Type': 'application/json' },
      })

    let response = await fetchData(Authorization)

    if (response.status == 401) {
      const Authorization = await this.authorizeClient()
      response = await fetchData(Authorization)
    }

    return response.json()
  }
}

export const client = new ApiClient()
