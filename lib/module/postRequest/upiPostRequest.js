"use strict";

import api from "../serviceRequest.js";
import { getBrowserData, getDeviceDetails, getShopperDetails } from "../utility.js";
import { AnalyticsEvents, APIStatus } from "../interface.js";
import callUIAnalytics from "./callUIAnalytics.js";
import { checkoutDetailsHandler } from "../sharedContext/checkoutDetailsHandler.js";
const upiPostRequest = async (instrumentDetails, isSICheckBoxClicked) => {
  const deviceDetails = getDeviceDetails();
  const browserData = getBrowserData();
  const shopperData = getShopperDetails();
  const {
    checkoutDetails
  } = checkoutDetailsHandler;
  const requestBody = {
    browserData: browserData,
    instrumentDetails,
    ...(checkoutDetails.isSubscriptionCheckout && instrumentDetails.type === 'card/token' ? {
      oneTimePayment: checkoutDetails.isSICheckboxVisible ? isSICheckBoxClicked : true
    } : {}),
    shopper: shopperData,
    deviceDetails: deviceDetails
  };
  callUIAnalytics(AnalyticsEvents.PAYMENT_CATEGORY_SELECTED, `UPI Post Request`, ``);
  callUIAnalytics(AnalyticsEvents.PAYMENT_INITIATED, `UPI Post Request`, ``);
  try {
    const response = await api.post("/", requestBody);
    return {
      apiStatus: APIStatus.Success,
      data: response.data
    };
  } catch (error) {
    callUIAnalytics(AnalyticsEvents.PAYMENT_INITIATED, `UPI Post Request`, `${error}`);
    return {
      apiStatus: APIStatus.Failed,
      data: {
        status: {
          reasonCode: 'API_FAILED',
          reason: `${error}`
        }
      }
    };
  }
};
export default upiPostRequest;
//# sourceMappingURL=upiPostRequest.js.map