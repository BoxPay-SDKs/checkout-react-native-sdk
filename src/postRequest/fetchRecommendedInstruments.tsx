import axios from 'axios';
import { checkoutDetailsHandler } from '../sharedContext/checkoutDetailsHandler';
import { userDataHandler } from '../sharedContext/userdataHandler';
import { getEndpoint } from '../utils/stringUtils';

const fetchRecommendedInstruments = async () => {
  const { userData } = userDataHandler;
  const { checkoutDetails } = checkoutDetailsHandler;
  const endpoint: string = getEndpoint(checkoutDetails.env);

  const API_URL = `${endpoint}${checkoutDetails.token}/shoppers/${userData.uniqueId}/recommended-instruments`;
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Session ${checkoutDetails.shopperToken}`,
      },
    });

    const data = await response.data;
    return data;
  } catch (error) {
    return { status: { reasonCode: 'API_FAILED', reason: '' } };
  }
};

export default fetchRecommendedInstruments;
