import api from '../serviceRequest'
import { checkoutDetailsHandler } from '../sharedContext/checkoutDetailsHandler';
import type { PaymentExecutedPostResponse } from '../interface';
import { getBrowserData, getDeviceDetails, getShopperDetails, formatExpiry } from '../utility';
import { AnalyticsEvents, APIStatus } from '../interface';
import callUIAnalytics from './callUIAnalytics';

const cardPostRequest = async (
  cardNumber: string,
  expiryDate: string,
  cvv: string,
  holderName: string,
  cardNickName: string,
  isCheckboxClicked: boolean
) : Promise<PaymentExecutedPostResponse> => {
  const { checkoutDetails } = checkoutDetailsHandler;
  const deviceDetails = getDeviceDetails()
  const browserData = getBrowserData()
  const shopperData = getShopperDetails()

  const requestBody = {
    browserData: browserData,
    instrumentDetails: {
      type: 'card/plain',
      card: {
        number: cardNumber.replace(/ /g, ''),
        expiry: formatExpiry(expiryDate),
        cvc: cvv,
        holderName: holderName,
        ...(checkoutDetails.shopperToken && isCheckboxClicked
          ? { nickName: cardNickName }
          : {}),
      },
      ...(checkoutDetails.shopperToken && isCheckboxClicked
        ? { saveInstrument: true }
        : {}),
    },
    shopper: shopperData,
    deviceDetails: deviceDetails,
  };
  callUIAnalytics(AnalyticsEvents.PAYMENT_CATEGORY_SELECTED,"Card Post Request",``)
  callUIAnalytics(AnalyticsEvents.PAYMENT_INITIATED,"Card Post Request",``)

  try {
    const response = await api.post("/", requestBody);
    return {apiStatus : APIStatus.Success, data : response.data};
  } catch (error) {
    callUIAnalytics(AnalyticsEvents.PAYMENT_INITIATED,"Card Post Request",`${error}`)
    return { apiStatus : APIStatus.Failed , data : {status: { reasonCode: 'API_FAILED', reason: `${error}` }} };
  }
};

export default cardPostRequest;
