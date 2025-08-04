import axios from 'axios';
import { getEndpoint } from '../utils/stringUtils';

const fetchStatus = async (token: string, env: string) => {
  const endpoint: string = getEndpoint(env);

  const API_URL = `${endpoint}${token}/status`;
  try {
    const response = await axios.get(API_URL, {
      headers: {
        'X-Trace-Id': generateRandomAlphanumericString(10),
      },
    });

    const data = await response.data;
    return data;
  } catch (error) {
    console.error('API Error:', error);
    return { status: { reasonCode: 'API_FAILED', reason: '' } };
  }

  function generateRandomAlphanumericString(length: number): string {
    const charPool: string[] =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split(
        ''
      );
    let result = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charPool.length);
      result += charPool[randomIndex];
    }

    return result;
  }
};

export default fetchStatus;
