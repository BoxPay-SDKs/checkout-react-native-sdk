import axios from 'axios';
import { getEndpoint } from '../utils/stringUtils';

const fetchSessionDetails = async (env: string, token:string) => {
    const endpoint: string = getEndpoint(env);
  const API_URL = `${endpoint}${token}`;
  try {
    const response = await axios.get(API_URL, {});

    const data = await response.data;
    return data;
  } catch (error) {
    return { status: { reasonCode: 'API_FAILED', reason: '' } };
  }
} 

export default fetchSessionDetails;
