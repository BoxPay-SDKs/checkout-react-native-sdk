import axios from 'axios';
import type { ErrorResponse, FetchStatusResponse } from '../interface';

const fetchStatus = async () : Promise<FetchStatusResponse | ErrorResponse> => {
  try {
    const response = await axios.get("/status");
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    return { status: { reasonCode: 'API_FAILED', reason: '' } };
  }
};

export default fetchStatus;
