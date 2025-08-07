import axios from 'axios';
import type { ErrorResponse, FetchCardDetailsResponse } from '../interface';

const fetchCardDetails = async (
  cardNumber: string
) : Promise<FetchCardDetailsResponse | ErrorResponse>=> {
  const API_URL = `/bank-identification-numbers/${cardNumber}`;
  try {
    const response = await axios.post(API_URL, {});
    return response.data;
  } catch (error) {
    return { status: { reasonCode: 'API_FAILED', reason: '' } };
  }
};

export default fetchCardDetails;
