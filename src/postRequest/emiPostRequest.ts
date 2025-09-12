import api from '../serviceRequest'
import type { PaymentExecutedPostResponse } from '../interface';
import { getBrowserData, getDeviceDetails, getShopperDetails, formatExpiry } from '../utility';
import { AnalyticsEvents, APIStatus } from '../interface';
import callUIAnalytics from './callUIAnalytics';

interface EmiPostPayload {
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  holderName?: string;
  cardType?: string;
  offerCode?: string;
  duration?: string;
}

const emiPostRequest = async (
  {
    cardNumber,
    expiryDate,
    cvv,
    holderName,
    cardType,
    offerCode,
    duration
  } : EmiPostPayload
) : Promise<PaymentExecutedPostResponse> => {
  const deviceDetails = getDeviceDetails()
  const browserData = getBrowserData()
  const shopperData = getShopperDetails()
  const instrumentType = cardType
    ? cardType.includes('Credit')
      ? 'emi/cc'
      : 'emi/dc'
    : 'emi/cardless';

  const instrumentDetails = cardType
    ? {
        type: instrumentType,
        card: {
          number: cardNumber?.replace(/ /g, ''),
          expiry: formatExpiry(expiryDate ?? ""),
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

  const requestBody = {
    browserData: browserData,
    instrumentDetails: instrumentDetails,
    ...(offerCode?.trim() !== '' && { offers: [offerCode] }),
    shopper: shopperData,
    deviceDetails: deviceDetails,
  };

  callUIAnalytics(AnalyticsEvents.PAYMENT_CATEGORY_SELECTED,"EMI Post Request",``)
  callUIAnalytics(AnalyticsEvents.PAYMENT_INITIATED,"EMI Post Request",``)
  
  try {
    const response = await api.post("/", requestBody);
    return {apiStatus : APIStatus.Success, data : response.data};
  } catch (error) {
    callUIAnalytics(AnalyticsEvents.PAYMENT_INITIATED,"EMI Post Request",`${error}`)
    return { apiStatus : APIStatus.Failed, data : {status: { reasonCode: 'API_FAILED', reason: `${error}` }} };
  }
};

export default emiPostRequest;
