import Constants from 'expo-constants';
import axios from 'axios';
import { userDataHandler } from '../sharedContext/userdataHandler';
import type { DeliveryAddress, InstrumentDetails, PaymentExecutedPostResponse } from '../interface';
import { getDeviceDetails } from '../utils/listAndObjectUtils';
import { APIStatus } from '../interface';

const upiPostRequest = async (instrumentDetails: InstrumentDetails) : Promise<PaymentExecutedPostResponse> => {
  const { userData } = userDataHandler;
  const deviceDetails = getDeviceDetails()

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
    deviceDetails: deviceDetails
  };
  try {
    const response = await axios.post("/", requestBody);
    return {apiStatus : APIStatus.Success , data : response.data};
  } catch (error) {
    return { apiStatus : APIStatus.Failed , data : { status: { reasonCode: 'API_FAILED', reason: '' } }};
  }
};

export default upiPostRequest;
