import { ctpClient } from './BuildClient';
import {
  Category,
  CustomerSignin,
  ErrorResponse,
  createApiBuilderFromCtpClient,
} from '@commercetools/platform-sdk';

// Create apiRoot from the imported ClientBuilder and include your Project key
const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
  projectKey: 'test-super-unique',
});

export function login(htmlBody: CustomerSignin) {
  return apiRoot
    .login()
    .post({ body: htmlBody })
    .execute()
    .then(({ body }) => body)
    .catch((body: ErrorResponse) => null);
}
export function product(
  options: {
    [key: string]: string | string[] | undefined;
  } = {}
) {
  options = { ...options, localeProjection: 'en-US' };

  return apiRoot
    .productProjections()
    .search()
    .get({ queryArgs: options })
    .execute()
    .then(({ body }) => body);
}

export function productById(id: string) {
  return apiRoot
    .productProjections()
    .withId({ ID: id })
    .get()
    .execute()
    .then(({ body }) => body);
}

export function productSearch(Id: Category['id']) {
  return apiRoot
    .productProjections()
    .search()
    .get({
      queryArgs: {
        'filter.query': `categories.id: subtree("${Id}")`,
        localeProjection: 'en-US',
      },
    })
    .execute()
    .then(({ body }) => body);
}

export function category() {
  return apiRoot
    .categories()
    .get({ queryArgs: { limit: 30 } })
    .execute()
    .then(({ body }) => body);
}
