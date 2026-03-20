"use strict";

import api from "../serviceRequest.js";
import { userDataHandler } from "../sharedContext/userdataHandler.js";
import { APIStatus } from "../interface.js";
const fetchRecommendedInstruments = async () => {
  const {
    userData
  } = userDataHandler;
  const API_URL = `/shoppers/${userData.uniqueId}/recommended-instruments`;
  try {
    const response = await api.get(API_URL);
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
export default fetchRecommendedInstruments;
//# sourceMappingURL=fetchRecommendedInstruments.js.map