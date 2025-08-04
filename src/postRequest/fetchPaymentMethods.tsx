import axios from 'axios';
import { getEndpoint } from '../utils/stringUtils';

const fetchPaymentMethods = async (token: string, env: string) => {
  const endpoint: string = getEndpoint(env);
  const API_URL = `${endpoint}${token}/payment-methods`;
  try {
    const response = await axios.get(API_URL);
    const data = await response.data;
    return data;
  } catch (error) {
    return { status: { reasonCode: 'API_FAILED', reason: '' } };
  }
};

export default fetchPaymentMethods;
