import api from '../serviceRequest';
import type { InstrumentDetails, PaymentExecutedPostResponse } from '../interface';
import { getBrowserData, getDeviceDetails, getShopperDetails } from '../utility';
import { AnalyticsEvents, APIStatus } from '../interface';
import callUIAnalytics from './callUIAnalytics';

const upiPostRequest = async (instrumentDetails: InstrumentDetails) : Promise<PaymentExecutedPostResponse> => {
  const deviceDetails = getDeviceDetails()
  const browserData = getBrowserData()
  const shopperData = getShopperDetails()

  const requestBody = {
    browserData: browserData,
    instrumentDetails,
    shopper: shopperData,
    deviceDetails: deviceDetails
  };

  callUIAnalytics(AnalyticsEvents.PAYMENT_CATEGORY_SELECTED,`UPI Post Request`,``)
  callUIAnalytics(AnalyticsEvents.PAYMENT_INITIATED,`UPI Post Request`,``)

  
  try {
    const response = await api.post("/", requestBody);
    return {apiStatus : APIStatus.Success , data : response.data};
  } catch (error) {
    callUIAnalytics(AnalyticsEvents.PAYMENT_INITIATED,`UPI Post Request`,`${error}`)
    return { apiStatus : APIStatus.Failed , data : { status: { reasonCode: 'API_FAILED', reason: `${error}` } }};
  }
};

export default upiPostRequest;
