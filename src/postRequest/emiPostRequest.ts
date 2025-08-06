import Constants from 'expo-constants';
import axios from 'axios';
import { userDataHandler } from '../sharedContext/userdataHandler';
import type { DeliveryAddress, ErrorResponse, PaymentMethodPostResponse } from '../interface';
import { getDeviceDetails } from '../utils/listAndObjectUtils';

const emiPostRequest = async (
  cardNumber: string,
  expiryDate: string,
  cvv: string,
  holderName: string,
  cardType: string,
  offerCode: string,
  duration: string
) : Promise<PaymentMethodPostResponse | ErrorResponse> => {
  const { userData } = userDataHandler;
  const deviceDetails = getDeviceDetails()
  const formatExpiry = (input: string) => {
    const [month, year] = input.split('/');
    return `20${year}-${month}`;
  };
  const instrumentType = cardType
    ? cardType.includes('Credit')
      ? 'emi/cc'
      : 'emi/dc'
    : 'emi/cardless';

  const instrumentDetails = cardType
    ? {
        type: instrumentType,
        card: {
          number: cardNumber.replace(/ /g, ''),
          expiry: formatExpiry(expiryDate),
          cvc: cvv,
          holderName: holderName,
        },
        emi: {
          duration: duration,
        },
      }
    : {
        type: 'emi/cardless',
        emi: {
          provider: duration,
        },
      };

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
    instrumentDetails: instrumentDetails,
    ...(offerCode.trim() !== '' && { offers: [offerCode] }),
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
    deviceDetails: deviceDetails,
  };
  try {
    const response = await axios.post("/", requestBody);
    return response.data;
  } catch (error) {
    return { status: { reasonCode: 'API_FAILED', reason: '' } };
  }
};

export default emiPostRequest;
