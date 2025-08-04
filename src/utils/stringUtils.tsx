import { TEST_API_URL, PROD_API_URL, ROUTE } from '@env';

export function getEndpoint(env: string): string {
  const baseUrl = env === 'test' ? TEST_API_URL : PROD_API_URL;
  return `${baseUrl}${ROUTE}`;
}
