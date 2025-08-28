import axios from 'axios';
import type { FetchStatusApiResponse } from '../interface';
import { APIStatus } from '../interface';

const fetchStatus = async () : Promise<FetchStatusApiResponse> => {
  try {
    const response = await axios.get("/status");
    return {apiStatus : APIStatus.Success, data : response.data};
  } catch (error) {
    console.error('API Error:', error);
    return { apiStatus: APIStatus.Failed, data : {status: { reasonCode: 'API_FAILED', reason: `${error}` }} };
  }
};

export default fetchStatus;
