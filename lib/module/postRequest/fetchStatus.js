"use strict";

import api from "../serviceRequest.js";
import { APIStatus } from "../interface.js";
const fetchStatus = async () => {
  try {
    const response = await api.get("/status");
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
export default fetchStatus;
//# sourceMappingURL=fetchStatus.js.map