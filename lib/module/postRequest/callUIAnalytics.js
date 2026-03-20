"use strict";

import { checkoutDetailsHandler } from "../sharedContext/checkoutDetailsHandler.js";
import { getBrowserData, getDeviceDetails, getBaseURL } from "../utility.js";
import { APIStatus } from "../interface.js";
import axios from 'axios';
const callUIAnalytics = async (uiEvent, screenName, message) => {
  const {
    checkoutDetails
  } = checkoutDetailsHandler;
  const deviceDetails = getDeviceDetails();
  const browserData = getBrowserData();
  const requestBody = {
    browserData: browserData,
    callerToken: checkoutDetails.token,
    uiEvent: uiEvent,
    eventAttrs: {
      errorMessage: message,
      screenName: screenName
    },
    deviceDetails: deviceDetails
  };
  try {
    const API_URL = `${getBaseURL(checkoutDetails.env)}/ui-analytics`;
    const response = await axios.post(API_URL, requestBody);
    return {
      apiStatus: APIStatus.Success,
      data: response.data
    };
  } catch (error) {
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
export default callUIAnalytics;
//# sourceMappingURL=callUIAnalytics.js.map