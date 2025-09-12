import type { PaymentMethod, PaymentClass, DeliveryAddress } from '../interface';
import { Dimensions, Platform } from 'react-native';
import { userDataHandler } from '../sharedContext/userdataHandler';
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
    screenHeight: height,
    screenWidth: width,
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