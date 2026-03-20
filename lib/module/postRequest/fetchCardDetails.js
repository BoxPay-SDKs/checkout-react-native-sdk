"use strict";

import api from "../serviceRequest.js";
import { APIStatus } from "../interface.js";
const fetchCardDetails = async cardNumber => {
  const API_URL = `/bank-identification-numbers/${cardNumber}`;
  try {
    const response = await api.post(API_URL);
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
export default fetchCardDetails;
//# sourceMappingURL=fetchCardDetails.js.map