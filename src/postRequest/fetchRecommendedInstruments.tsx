import axios from 'axios';
import { userDataHandler } from '../sharedContext/userdataHandler';
import { APIStatus, type SavedInstrumentFetchResponse } from '../interface';

const fetchRecommendedInstruments = async () : Promise<SavedInstrumentFetchResponse> => {
  const { userData } = userDataHandler;

  const API_URL = `/shoppers/${userData.uniqueId}/recommended-instruments`;
  try {
    const response = await axios.get(API_URL);
    return {apiStatus : APIStatus.Success, data : response.data};
  } catch (error) {
    return { apiStatus : APIStatus.Failed,data : {status: { reasonCode: 'API_FAILED', reason: '' } }};
  }
};

export default fetchRecommendedInstruments;
