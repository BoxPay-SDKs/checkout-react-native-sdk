import api from '../serviceRequest'
import { APIStatus, type FetchCardDetailsResponse } from '../interface';

const fetchCardDetails = async (
  cardNumber: string
) : Promise<FetchCardDetailsResponse>=> {
  const API_URL = `/bank-identification-numbers/${cardNumber}`;
  try {
    const response = await api.post(API_URL);
    return {apiStatus : APIStatus.Success, data : response.data}
  } catch (error) {
    return { apiStatus : APIStatus.Failed, data : {status: { reasonCode: 'API_FAILED', reason: `${error}` }} };
  }
};

export default fetchCardDetails;
