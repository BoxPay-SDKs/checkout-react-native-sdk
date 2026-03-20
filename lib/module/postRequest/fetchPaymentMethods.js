"use strict";

import api from "../serviceRequest.js";
import { APIStatus } from "../interface.js";
const fetchPaymentMethods = async () => {
  try {
    const response = await api.get("/payment-methods");
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
export default fetchPaymentMethods;
//# sourceMappingURL=fetchPaymentMethods.js.map