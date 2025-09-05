
const TEST_API_URL = "https://test-apis.boxpay.tech"
const PROD_API_URL = "https://apis.boxpay.in"
const ROUTE = "/v0/checkout/sessions/"

export function getEndpoint(env: string): string {
  const baseUrl = env === 'test' ? TEST_API_URL : PROD_API_URL;
  return `${baseUrl}${ROUTE}`;
}

export function generateRandomAlphanumericString(length: number): string {
  const charPool: string[] =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split(
      ''
    );
  let result = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charPool.length);
    result += charPool[randomIndex];
  }

  return result;
}
