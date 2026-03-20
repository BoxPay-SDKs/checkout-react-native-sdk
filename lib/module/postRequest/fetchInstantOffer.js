"use strict";

import { APIStatus } from "../interface.js";
import api from "../serviceRequest.js";
const fetchInstantOffer = async amount => {
  const requestBody = {
    "minAmount": amount,
    "maxAmount": amount
  };
  try {
    const response = await api.post("/offers/search", requestBody);
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
export default fetchInstantOffer;
//# sourceMappingURL=fetchInstantOffer.js.map