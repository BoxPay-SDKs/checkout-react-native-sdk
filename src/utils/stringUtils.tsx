
export function getEndpoint(env: string): string {
  const testUrl = process.env.TEST_API_URL
  const prodUrl = process.env.PROD_API_URL
  const route = process.env.ROUTE
  const baseUrl = env === 'test' ? testUrl : prodUrl;
  return `${baseUrl}${route}`;
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
