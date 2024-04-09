import {
  CategoryPagedQueryResponse,
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
      { method: 'POST', headers: { Authorization } }
    );

    console.log(response);

    const { access_token, token_type } =
      (await response.json()) as authResponse;
    return (this.bearerAuthHeader = `${token_type} ${access_token}`);
  }

  async request(path: string, method: method, options: options = {}) {
    const url = new URL(`${this.apiUrl}/${this.projectKey}/${path}`);
    const search = new URLSearchParams(options.queryArgs);
    url.search = search.toString();

    const Authorization =
      this.bearerAuthHeader ?? (await this.authorizeClient());

    const response = await fetch(url, { headers: { Authorization } });
    return response.json();
  }
}

const client = new ApiClient();

export async function products(
  options?: options
): Promise<ProductProjectionPagedSearchResponse> {
  return client.request('product-projections', 'GET', options);
}

export async function productsByCategory(
  id: string
): Promise<ProductProjectionPagedSearchResponse> {
  return client.request('product-projections/search', 'GET', {
    queryArgs: { 'filter.query': `categories.id: subtree("${id}")` },
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

async function user() {}

type authResponse = {
  access_token: string;
  expires_in: number; // seconds (2 days)
  scope: string;
  token_type: string;
};

type method = 'GET' | 'POST';

type options = {
  offset?: number;
  limit?: number;
  queryArgs?: Partial<queryArgs>;
};

type queryArgs = {
  sort: string;
  localeProjection: string;
  'filter.query': string;
};
