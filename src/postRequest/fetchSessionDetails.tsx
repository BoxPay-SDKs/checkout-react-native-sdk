import axios from 'axios';
import { APIStatus, type FetchSessionDetailsResponse } from '../interface';

const fetchSessionDetails = async () : Promise<FetchSessionDetailsResponse>=> {
  try {
    const response = await axios.get("/", {});
    return {apiStatus : APIStatus.Success, data : response.data}
  } catch (error) {
    return {apiStatus : APIStatus.Failed, data: { status: { reasonCode: 'API_FAILED', reason: `${error}` } }}
  }
} 

export default fetchSessionDetails;
