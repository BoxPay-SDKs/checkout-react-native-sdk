import Constants from 'expo-constants';
import { checkoutDetailsHandler } from '../sharedContext/checkoutDetailsHandler';
import axios from 'axios';
import { userDataHandler } from '../sharedContext/userdataHandler';
import type { DeliveryAddress } from '../interface';
import { getEndpoint } from '../utils/stringUtils';
import { getDeviceDetails } from '../utils/listAndObjectUtils';

const methodsPostRequest = async (
  instrumentDetails: string,
  paymentMethod: string
) => {
  const { userData } = userDataHandler;
  const { checkoutDetails } = checkoutDetailsHandler;
  const deviceDetails = getDeviceDetails()
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
    instrumentDetails: {
      type: instrumentDetails,
      [paymentMethod]: {
        token: checkoutDetails.token,
      },
    },
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
    deviceDetails: deviceDetails
  };

  const API_URL = `${endpoint}${checkoutDetails.token}`;
  try {
    const response = await axios.post(API_URL, requestBody);

    const data = await response.data;
    return data;
  } catch (error) {
    return { status: { reasonCode: 'API_FAILED', reason: '' } };
  }
};

export default methodsPostRequest;
