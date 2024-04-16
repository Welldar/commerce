import {
  CategoryPagedQueryResponse,
  Customer,
  ProductProjection,
  ProductProjectionPagedSearchResponse,
} from '@commercetools/platform-sdk';

class ApiClient {
  authUrl = 'https://auth.europe-west1.gcp.commercetools.com';
  apiUrl = 'https://api.europe-west1.gcp.commercetools.com';

  projectKey = 'test-super-unique';
  clientId = 'Nw5IG8oOCHESeMtuOj5NGRzc';
  clientSecret = 'Al_DTFHaX-rM7Rjs_CYIETpgWSrklKJT';

  scopes = ['manage_project:test-super-unique'];

  basicAuthHeader =
    'Basic ' +
    Buffer.from(this.clientId + ':' + this.clientSecret).toString('base64');
  bearerAuthHeader: string | null = null;

  async authorizeClient() {
    const Authorization = this.basicAuthHeader;

    const response = await fetch(
      `${this.authUrl}/oauth/token?grant_type=client_credentials`,
      {
        method: 'POST',
        headers: { Authorization },
        next: { revalidate: 60 * 60 * 47 },
      }
    );

    const { access_token, token_type } =
      (await response.json()) as authClientResponse;

    this.bearerAuthHeader = `${token_type} ${access_token}`;
    return this.bearerAuthHeader;
  }

  async authorizeUser({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<authUserRespone> {
    const Authorization = this.basicAuthHeader;

    // &scope=view_published_products:${this.projectKey}%20manage_my_orders:${this.projectKey}%20manage_my_profile:${this.projectKey}

    const response = await fetch(
      `${this.authUrl}/oauth/${this.projectKey}/customers/token?grant_type=password&username=${email}&password=${password}`,
      { method: 'POST', headers: { Authorization }, cache: 'no-cache' }
    );

    return response.json();
  }

  async refreshToken(token: string): Promise<authClientResponse> {
    const Authorization = this.basicAuthHeader;
    const response = await fetch(
      `${this.authUrl}/oauth/token?grant_type=refresh_token&refresh_token=${token}`,
      {
        method: 'POST',
        headers: {
          Authorization,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return response.json();
  }

  makeSearchQuery(queryArgs = {}) {
    let searchQuery = '';

    for (let [q, value] of Object.entries(queryArgs)) {
      if (Array.isArray(value)) {
        value.forEach(v => (searchQuery += `${q}=${v}`));
      } else searchQuery += `${q}=${value}`;
    }

    return searchQuery;
  }

  async request(path: string, method: method, options: options = {}) {
    const url = `${this.apiUrl}/${this.projectKey}/${path}${
      options.queryArgs ? '?' + options.queryArgs.toString() : ''
    }`;

    console.log(url, ' eldar ');

    if (options.token) options.token = `Bearer ${options.token}`;

    const Authorization =
      options.token ?? this.bearerAuthHeader ?? (await this.authorizeClient());

    console.log(Authorization, path);

    const fetchData = (Authorization: string) =>
      fetch(url, { headers: { Authorization } });

    let response = await fetchData(Authorization);

    if (response.status == 401) {
      const Authorization = await this.authorizeClient();
      response = await fetchData(Authorization);
    }

    return response.json();
  }
}

const client = new ApiClient();

export async function products(
  options: options = {},
  id?: string
): Promise<ProductProjectionPagedSearchResponse> {
  if (options.queryArgs) {
    options.queryArgs.set('priceCurrency', 'USD');
    options.queryArgs.set('priceCountry', 'US');
    options.queryArgs.get('sort')
      ? null
      : options.queryArgs.set('sort', 'lastModifiedAt desc');

    const priceRange = options.queryArgs.get('price_range');

    if (priceRange) {
      const [from, to] = priceRange.split(':');
      options.queryArgs.append(
        'filter.query',
        `variants.scopedPrice.currentValue.centAmount:range(${from} to ${to})`
      );
    }
  }

  if (id)
    options.queryArgs?.append(
      'filter.query',
      `categories.id: subtree("${id}")`
    );

  return client.request('product-projections/search', 'GET', options);
}

export async function productsByCategory(
  id: string
): Promise<ProductProjectionPagedSearchResponse> {
  const params = new URLSearchParams({
    'filter.query': `categories.id: subtree("${id}")`,
  });
  return client.request('product-projections/search', 'GET', {
    queryArgs: params,
  });
}

export async function product(id: string): Promise<ProductProjection> {
  return client.request(`product-projections/${id}`, 'GET');
}

export async function category(
  options?: options
): Promise<CategoryPagedQueryResponse> {
  return client.request('categories', 'GET', options);
}

export async function login(credentials: { email: string; password: string }) {
  return client.authorizeUser(credentials);
}
export async function user(token: string): Promise<Customer> {
  return client.request('me', 'GET', { token });
}

export async function refreshToken(token: string) {
  return client.refreshToken(token);
}

export const accessCookie = 'access-token';
export const refreshCookie = 'refresh-token';

type authClientResponse = {
  access_token: string;
  expires_in: number; // seconds (2 days)
  scope: string;
  token_type: string;
};

type authUserRespone = authClientResponse & {
  refresh_token: string;
};

type method = 'GET' | 'POST';

type options = {
  offset?: number;
  limit?: number;
  token?: string;
  queryArgs?: queryArgs;
};

// type queryArgs = { [key: string]: string | string[] };

type queryArgs = URLSearchParams;
