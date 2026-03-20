"use strict";

import api from "../serviceRequest.js";
import { checkoutDetailsHandler } from "../sharedContext/checkoutDetailsHandler.js";
import { getBrowserData, getDeviceDetails, getShopperDetails, formatExpiry } from "../utility.js";
import { AnalyticsEvents, APIStatus } from "../interface.js";
import callUIAnalytics from "./callUIAnalytics.js";
const cardPostRequest = async (cardNumber, expiryDate, cvv, holderName, cardNickName, isCheckboxClicked, isSICheckBoxClicked) => {
  const {
    checkoutDetails
  } = checkoutDetailsHandler;
  const deviceDetails = getDeviceDetails();
  const browserData = getBrowserData();
  const shopperData = getShopperDetails();
  const requestBody = {
    browserData: browserData,
    instrumentDetails: {
      type: 'card/plain',
      card: {
        number: cardNumber.replace(/ /g, ''),
        expiry: formatExpiry(expiryDate),
        cvc: cvv,
        holderName: holderName,
        ...(checkoutDetails.shopperToken && isCheckboxClicked ? {
          nickName: cardNickName
        } : {})
      },
      ...(checkoutDetails.shopperToken && isCheckboxClicked ? {
        saveInstrument: true
      } : {})
    },
    shopper: shopperData,
    ...(checkoutDetails.isSubscriptionCheckout ? {
      oneTimePayment: checkoutDetails.isSICheckboxVisible ? isSICheckBoxClicked : true
    } : {}),
    deviceDetails: deviceDetails
  };
  callUIAnalytics(AnalyticsEvents.PAYMENT_CATEGORY_SELECTED, "Card Post Request", ``);
  callUIAnalytics(AnalyticsEvents.PAYMENT_INITIATED, "Card Post Request", ``);
  try {
    const response = await api.post("/", requestBody);
    return {
      apiStatus: APIStatus.Success,
      data: response.data
    };
  } catch (error) {
    callUIAnalytics(AnalyticsEvents.PAYMENT_INITIATED, "Card Post Request", `${error}`);
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
export default cardPostRequest;
//# sourceMappingURL=cardPostRequest.js.map