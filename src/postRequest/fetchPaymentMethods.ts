import axios from 'axios';
import type { CombinedPaymentMethod, ErrorResponse } from '../interface';

const fetchPaymentMethods = async () : Promise<CombinedPaymentMethod[] | ErrorResponse> => {
  try {
    const response = await axios.get("/payment-methods");
    return response.data;
  } catch (error) {
    return { status: { reasonCode: 'API_FAILED', reason: '' } };
  }
};

export default fetchPaymentMethods;

