import { Platform } from 'react-native';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import axios from 'axios';
import { userDataHandler } from '../sharedContext/userdataHandler';
import { checkoutDetailsHandler } from '../sharedContext/checkoutDetailsHandler';
import type { DeliveryAddress, InstrumentDetails } from '../interface';
import { getEndpoint } from '../utils/stringUtils';
import {version} from '../../package.json'

const upiPostRequest = async (instrumentDetails: InstrumentDetails) => {
  const { userData } = userDataHandler;
  const { checkoutDetails } = checkoutDetailsHandler;
  const endpoint: string = getEndpoint(checkoutDetails.env);

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
  const requestBody = {
    browserData: {
      screenHeight:
        Constants.platform?.ios?.screenHeight ||
        Constants.platform?.android?.screenHeight ||
        0,
      screenWidth:
        Constants.platform?.ios?.screenWidth ||
        Constants.platform?.android?.screenWidth ||
        0,
      acceptHeader: 'application/json',
      userAgentHeader: 'Expo App',
      browserLanguage: 'en_US',
      ipAddress: 'null',
      colorDepth: 24,
      javaEnabled: true,
      timeZoneOffSet: new Date().getTimezoneOffset(),
      packageId: Constants.manifest?.id || 'com.boxpay.checkout.sdk',
    },
    instrumentDetails,
    shopper: {
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
    },
    deviceDetails: {
      browser: Platform.OS,
      platformVersion: Device.osVersion || 'Unknown',
      deviceType: Device.deviceType || 'Unknown',
      deviceName: Device.modelName || 'Unknown',
      deviceBrandName: Device.brand || 'Unknown',
    },
  };
  const API_URL = `${endpoint}${checkoutDetails.token}`;
  try {
    const response = await axios.post(API_URL, requestBody, {
      headers: {
        'X-Request-Id': generateRandomAlphanumericString(10),
        'X-Client-Connector-Name': 'React Native SDK',
        'X-Client-Connector-Version': version,
        ...(checkoutDetails.shopperToken
          ? { Authorization: `Session ${checkoutDetails.shopperToken}` }
          : {}),
      },
    });

    const data = await response.data;
    return data;
  } catch (error) {
    return { status: { reasonCode: 'API_FAILED', reason: '' } };
  }

  function generateRandomAlphanumericString(length: number): string {
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
};

export default upiPostRequest;
