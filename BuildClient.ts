// import fetch from 'node-fetch';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import {
  ClientBuilder,
  type AuthMiddlewareOptions,
  type HttpMiddlewareOptions,
  type PasswordAuthMiddlewareOptions,
} from '@commercetools/sdk-client-v2';

// Configure authMiddlewareOptions
const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: 'https://auth.europe-west1.gcp.commercetools.com',
  projectKey: 'test-super-unique',
  credentials: {
    clientId: 'Nw5IG8oOCHESeMtuOj5NGRzc',
    clientSecret: 'Al_DTFHaX-rM7Rjs_CYIETpgWSrklKJT',
  },
  scopes: ['manage_project:test-super-unique'],
  fetch,
};

export function buildApiRoot(password: string, username: string) {
  const passwordAuthMiddlewareOptions: PasswordAuthMiddlewareOptions = {
    host: 'https://auth.europe-west1.gcp.commercetools.com',
    projectKey: 'test-super-unique',
    credentials: {
      clientId: 'Nw5IG8oOCHESeMtuOj5NGRzc',
      clientSecret: 'Al_DTFHaX-rM7Rjs_CYIETpgWSrklKJT',
      user: { password, username },
    },
    scopes: ['manage_project:test-super-unique'],
    fetch,
  };

  const client = new ClientBuilder()
    // .withClientCredentialsFlow(authMiddlewareOptions)
    .withHttpMiddleware(httpMiddlewareOptions)
    .withLoggerMiddleware()
    .withPasswordFlow(passwordAuthMiddlewareOptions)
    .build();

  return createApiBuilderFromCtpClient(client).withProjectKey({
    projectKey: 'test-super-unique',
  });
}

// Configure httpMiddlewareOptions
const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: 'https://api.europe-west1.gcp.commercetools.com',
  fetch,
};

// Export the ClientBuilder
export const ctpClient = new ClientBuilder()
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware()
  .build();
