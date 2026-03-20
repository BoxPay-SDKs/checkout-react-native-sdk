"use strict";

import api from "../serviceRequest.js";
import { APIStatus } from "../interface.js";
import { userDataHandler } from "../sharedContext/userdataHandler.js";
const fetchSavedAddress = async () => {
  const {
    userData
  } = userDataHandler;
  const API_URL = `/shoppers/${userData.uniqueId}/addresses`;
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
export default fetchSavedAddress;
//# sourceMappingURL=fetchSavedAddress.js.map