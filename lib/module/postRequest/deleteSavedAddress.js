"use strict";

import api from "../serviceRequest.js";
import { AnalyticsEvents, APIStatus } from "../interface.js";
import { userDataHandler } from "../sharedContext/userdataHandler.js";
import callUIAnalytics from "./callUIAnalytics.js";
const deleteSavedAddress = async addressRef => {
  const {
    userData
  } = userDataHandler;
  const API_URL = `/shoppers/${userData.uniqueId}/addresses/${addressRef}`;
  callUIAnalytics(AnalyticsEvents.ADDRESS_UPDATED, `Delete Address`, ``);
  try {
    const response = await api.delete(API_URL);
    return {
      apiStatus: APIStatus.Success,
      data: response.data
    };
  } catch (error) {
    callUIAnalytics(AnalyticsEvents.ADDRESS_UPDATED, `Delete Address`, `${error}`);
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
export default deleteSavedAddress;
//# sourceMappingURL=deleteSavedAddress.js.map