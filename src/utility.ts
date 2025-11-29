import type { PaymentMethod, PaymentClass, DeliveryAddress } from './interface';
import { Dimensions, Platform } from 'react-native';
import { userDataHandler } from './sharedContext/userdataHandler';
import { useState, useRef, useCallback, useEffect } from 'react';

export function transformAndFilterList(
  data: PaymentMethod[],
  filterType: string
): PaymentClass[] {
  const filteredList = data
    .filter((item) => item.type === filterType)
    .sort((a, b) => a.title?.trim().localeCompare(b.title?.trim() ?? ''))
    .map((item) => ({
      type: filterType,
      id: item.id,
      displayName: item.title,
      displayValue: item.title,
      iconUrl: item.logoUrl,
      instrumentTypeValue: item.instrumentTypeValue,
      isSelected: false,
    }));

  return filteredList;
}


export function getDeviceDetails() {
  return {
    browser: Platform.OS,
    platformVersion: Platform.Version.toString(),
    deviceType: Platform.OS === 'ios' || Platform.OS === 'android' ? 'Phone' : 'Web',
    deviceName: Platform.OS === 'ios' ? 'iOS Device' : 'Android Device',
    deviceBrandName: Platform.OS === 'ios' ? 'Apple' : 'Android'
  };
}

export function getBrowserData() {
  return {
    screenHeight: Math.trunc(height).toString(),
    screenWidth: Math.trunc(width).toString(),
    acceptHeader: 'application/json',
    userAgentHeader: 'Expo App',
    browserLanguage: 'en_US',
    ipAddress: 'null',
    colorDepth: 24,
    javaEnabled: true,
    timeZoneOffSet: new Date().getTimezoneOffset(),
    packageId: 'com.boxpay.checkout.sdk',
  }
}

export function getShopperDetails() {
  const { userData } = userDataHandler;
  const isDeliveryAddressEmpty = (address: DeliveryAddress): boolean => {
    return Object.values(address).every(
      (value) => value === null || value === undefined || value === ''
    );
  };
  const deliveryAddress = {
    address1: userData.address1,
    address2: userData.address2,
    city: userData.city,
    state: userData.state,
    countryCode: userData.country,
    postalCode: userData.pincode,
    labelType: userData.labelType,
    labelName: userData.labelName,
  };
  return {
    email: userData.email,
    firstName: userData.firstName,
    gender: null,
    lastName: userData.lastName,
    phoneNumber: userData.phone,
    uniqueReference: userData.uniqueId,
    dateOfBirth: userData.dob,
    panNumber: userData.pan,
    deliveryAddress: isDeliveryAddressEmpty(deliveryAddress)
      ? null
      : deliveryAddress,
  }
}

export const { height, width } = Dimensions.get("window");

export const useCountdown = (initialSeconds: number) => {
  const [timeRemaining, setTimeRemaining] = useState(initialSeconds);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const stop = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);
  const start = useCallback(() => {
    stop();
    setTimeRemaining(initialSeconds);
    timerRef.current = setInterval(() => {
      setTimeRemaining(prevTime => {
        if (prevTime <= 1) {
          stop();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  }, [initialSeconds]);
  useEffect(() => {
    return stop;
  }, [stop]);
  return { timeRemaining, start, stop };
};

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

export const formatTime = (timeRemaining : number) => {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export const formatExpiry = (input: string): string => {
  const parts = input.split('/');
  if (parts.length !== 2 || parts[0]?.length !== 2 || parts[1]?.length !== 2) {
    return ''; // Return for any invalid format.
  }
  const [month, twoDigitYearStr] = parts;
  const twoDigitYear = parseInt(twoDigitYearStr, 10);
  const currentYear = new Date().getFullYear();
  const century = Math.floor(currentYear / 100) * 100;
  let fullYear = century + twoDigitYear;

  if (fullYear < currentYear - 1) {
    fullYear += 100;
  }

  return `${fullYear}-${month}`;
};