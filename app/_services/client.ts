import { authorizeClient } from './auth'

class ApiClient {
  apiUrl = process.env.API_URL
  projectKey = process.env.PROJECT_KEY
  url = `${this.apiUrl}/${this.projectKey}/`
  bearerToken: undefined | string = undefined

  async getToken() {
    const { access_token, token_type } = await authorizeClient()
    this.bearerToken = `${token_type} ${access_token}`

    return this.bearerToken
  }

  async makeRequest(
    path: string,
    { requestInit = {}, token }: { requestInit?: RequestInit; token?: string }
  ) {
    token = token ? `Bearer ${token}` : undefined
    const authToken = token ?? this.bearerToken ?? (await this.getToken())

    const url = `${this.apiUrl}/${this.projectKey}/${path}`

    let fetchData = (Authorization: string) => {
      requestInit.headers = { Authorization, ...requestInit.headers }
      return fetch(url, requestInit)
    }

    let response = await fetchData(authToken)

    if (response.status == 401 && !token) {
      const newToken = await this.getToken()
      response = await fetchData(newToken)
    }

    return response.json()
  }

  async get(
    path: string,
    options?: { queryArgs?: URLSearchParams; token?: string }
  ) {
    const queryArgs = options?.queryArgs ?? new URLSearchParams()
    const token = options?.token

    return this.makeRequest(`${path}?${queryArgs.toString()}`, {
      token,
    })
  }

  async post(path: string, { body, token }: { body?: object; token?: string }) {
    const requestInit: RequestInit = {
      body: JSON.stringify(body),
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }

    return this.makeRequest(path, { requestInit, token })
  }
}

export const client = new ApiClient()
