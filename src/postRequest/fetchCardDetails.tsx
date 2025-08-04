import axios from 'axios';
import { getEndpoint } from '../utils/stringUtils';

const fetchCardDetails = async (
  token: string,
  env: string,
  cardNumber: string
) => {
  const endpoint: string = getEndpoint(env);
  const API_URL = `${endpoint}${token}/bank-identification-numbers/${cardNumber}`;
  try {
    const response = await axios.post(API_URL, {});

    const data = await response.data;
    return data;
  } catch (error) {
    return { status: { reasonCode: 'API_FAILED', reason: '' } };
  }
};

export default fetchCardDetails;
