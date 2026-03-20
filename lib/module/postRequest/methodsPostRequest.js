"use strict";

import { checkoutDetailsHandler } from "../sharedContext/checkoutDetailsHandler.js";
import api from "../serviceRequest.js";
import { getBrowserData, getDeviceDetails, getShopperDetails } from "../utility.js";
import { AnalyticsEvents, APIStatus } from "../interface.js";
import callUIAnalytics from "./callUIAnalytics.js";
const methodsPostRequest = async (instrumentDetails, paymentMethod) => {
  const {
    checkoutDetails
  } = checkoutDetailsHandler;
  const deviceDetails = getDeviceDetails();
  const browserData = getBrowserData();
  const shopperData = getShopperDetails();
  const requestBody = {
    browserData: browserData,
    instrumentDetails: {
      type: instrumentDetails,
      [paymentMethod]: {
        token: checkoutDetails.token
      }
    },
    shopper: shopperData,
    deviceDetails: deviceDetails
  };
  callUIAnalytics(AnalyticsEvents.PAYMENT_CATEGORY_SELECTED, `${paymentMethod} Post Request`, ``);
  callUIAnalytics(AnalyticsEvents.PAYMENT_INITIATED, `${paymentMethod} Post Request`, ``);
  try {
    const response = await api.post("/", requestBody);
    return {
      apiStatus: APIStatus.Success,
      data: response.data
    };
  } catch (error) {
    callUIAnalytics(AnalyticsEvents.PAYMENT_INITIATED, `${paymentMethod} Post Request`, `${error}`);
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
export default methodsPostRequest;
//# sourceMappingURL=methodsPostRequest.js.map