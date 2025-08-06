import axios from 'axios';
import { userDataHandler } from '../sharedContext/userdataHandler';

const fetchRecommendedInstruments = async () => {
  const { userData } = userDataHandler;

  const API_URL = `/shoppers/${userData.uniqueId}/recommended-instruments`;
  try {
    const response = await axios.get(API_URL);
    return response;
  } catch (error) {
    return { status: { reasonCode: 'API_FAILED', reason: '' } };
  }
};

export default fetchRecommendedInstruments;
