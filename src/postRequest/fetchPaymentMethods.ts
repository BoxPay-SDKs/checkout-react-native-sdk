import api from '../serviceRequest'
import { APIStatus, type PaymentMethodFetchResponse } from '../interface';

const fetchPaymentMethods = async (): Promise<PaymentMethodFetchResponse> => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  try {
    const response = await api.get("/payment-methods", {
      params: {
        browserTimeZone: timezone
      }
    });

    return {
      apiStatus: APIStatus.Success,
      data: response.data
    };

  } catch (error: any) {
    return { apiStatus : APIStatus.Failed,data : {status: { reasonCode: 'API_FAILED', reason: `${error}` } }};
  }
};

export default fetchPaymentMethods;

