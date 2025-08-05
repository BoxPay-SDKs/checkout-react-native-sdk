import axios from 'axios';
import { getEndpoint } from '../utils/stringUtils';
import { checkoutDetailsHandler } from '../sharedContext/checkoutDetailsHandler';

const fetchStatus = async () => {
  const {checkoutDetails} = checkoutDetailsHandler
  const endpoint: string = getEndpoint(checkoutDetails.env);

  const API_URL = `${endpoint}${checkoutDetails.token}/status`;
  try {
    const response = await axios.get(API_URL);

    const data = await response.data;
    return data;
  } catch (error) {
    console.error('API Error:', error);
    return { status: { reasonCode: 'API_FAILED', reason: '' } };
  }
};

export default fetchStatus;
