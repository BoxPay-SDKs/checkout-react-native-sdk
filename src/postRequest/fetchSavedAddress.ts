import axios from 'axios';
import { APIStatus, type FetchSavedAddressResponse } from '../interface';
import { userDataHandler } from '../sharedContext/userdataHandler';

const fetchSavedAddress = async () : Promise<FetchSavedAddressResponse>=> {
    const { userData } = userDataHandler;
    const API_URL = `/shoppers/${userData.uniqueId}/addresses`;
    try {
    const response = await axios.get(API_URL);
    return {apiStatus : APIStatus.Success, data : response.data}
    } catch (error) {
    return {apiStatus : APIStatus.Failed, data : { status: { reasonCode: 'API_FAILED', reason: '' } }}
    }
};

export default fetchSavedAddress;
