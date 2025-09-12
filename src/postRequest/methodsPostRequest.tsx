import { checkoutDetailsHandler } from '../sharedContext/checkoutDetailsHandler';
import api from '../serviceRequest'
import type { PaymentExecutedPostResponse } from '../interface';
import { getBrowserData, getDeviceDetails, getShopperDetails } from '../utility';
import { AnalyticsEvents, APIStatus } from '../interface';
import callUIAnalytics from './callUIAnalytics';

const methodsPostRequest = async (
  instrumentDetails: string,
  paymentMethod: string
) : Promise<PaymentExecutedPostResponse> => {
  const { checkoutDetails } = checkoutDetailsHandler;
  const deviceDetails = getDeviceDetails()
  const browserData = getBrowserData()
  const shopperData = getShopperDetails()

  const requestBody = {
    browserData: browserData,
    instrumentDetails: {
      type: instrumentDetails,
      [paymentMethod]: {
        token: checkoutDetails.token,
      },
    },
    shopper: shopperData,
    deviceDetails: deviceDetails
  };

  callUIAnalytics(AnalyticsEvents.PAYMENT_CATEGORY_SELECTED,`${paymentMethod} Post Request`,``)
  callUIAnalytics(AnalyticsEvents.PAYMENT_INITIATED,`${paymentMethod} Post Request`,``)

  try {
    const response = await api.post("/", requestBody);
    return {apiStatus : APIStatus.Success, data : response.data};
  } catch (error) {
    callUIAnalytics(AnalyticsEvents.PAYMENT_INITIATED,`${paymentMethod} Post Request`,`${error}`)
    return { apiStatus : APIStatus.Failed, data: {status: { reasonCode: 'API_FAILED', reason: `${error}` } }};
  }
};

export default methodsPostRequest;
