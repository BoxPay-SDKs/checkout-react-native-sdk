"use strict";

import api from "../serviceRequest.js";
import { APIStatus } from "../interface.js";
const fetchSessionDetails = async () => {
  try {
    const response = await api.get("/", {});
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
export default fetchSessionDetails;
//# sourceMappingURL=fetchSessionDetails.js.map