import axios from 'axios';
import { APIStatus, type PaymentMethodFetchResponse } from '../interface';

const fetchPaymentMethods = async () : Promise<PaymentMethodFetchResponse> => {
  try {
    const response = await axios.get("/payment-methods");
    return {apiStatus : APIStatus.Success, data : response.data};
  } catch (error) {
    return { apiStatus : APIStatus.Failed,data : {status: { reasonCode: 'API_FAILED', reason: `${error}` } }};
  }
};

export default fetchPaymentMethods;

