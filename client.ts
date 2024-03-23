import { ctpClient } from './BuildClient';
import {
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
export function product() {
  return apiRoot
    .products()
    .get()
    .execute()
    .then(({ body }) => body);
}
