import type { DeliveryAddress } from "../interface";

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


export function getBaseURL(env: string): string {
  const baseUrl = env === 'test' ? TEST_API_URL : PROD_API_URL;
  return `${baseUrl}/v0`;
}

export function formatAddress(deliveryAddress : DeliveryAddress) : string {
  if (deliveryAddress.address2 == null || deliveryAddress.address2 == '') {
    return `${deliveryAddress.address1}, ${deliveryAddress.city}, ${deliveryAddress.state}, ${deliveryAddress.postalCode}`
  } else {
    return `${deliveryAddress.address1}, ${deliveryAddress.address2}, ${deliveryAddress.city}, ${deliveryAddress.state}, ${deliveryAddress.postalCode}`
  }
}

export function extractNames(fullName: string): {
  firstName: string;
  lastName: string;
} {
  const components = fullName
    .trim()
    .split(' ')
    .filter((part) => part !== '');

  if (components.length === 0) {
    return { firstName: '', lastName: '' };
  }

  const firstName = components[0] || '';
  const lastName = components.slice(1).join(' ') || '';

  return { firstName, lastName };
}

export const formattedTime = (timeRemaining: number): string => {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};