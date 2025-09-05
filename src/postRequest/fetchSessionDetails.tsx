import api from '../serviceRequest';
import { APIStatus, type FetchSessionDetailsResponse } from '../interface';

const fetchSessionDetails = async () : Promise<FetchSessionDetailsResponse>=> {
  try {
    const response = await api.get("/", {});
    return {apiStatus : APIStatus.Success, data : response.data}
  } catch (error) {
    return {apiStatus : APIStatus.Failed, data: { status: { reasonCode: 'API_FAILED', reason: `${error}` } }}
  }
} 

export default fetchSessionDetails;
