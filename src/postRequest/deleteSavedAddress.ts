import axios from 'axios';
import { APIStatus, type DeleteSavedAddressResponse } from '../interface';
import { userDataHandler } from '../sharedContext/userdataHandler';

const deleteSavedAddress = async (addressRef : string) : Promise<DeleteSavedAddressResponse>=> {
    const { userData } = userDataHandler;
    const API_URL = `/shoppers/${userData.uniqueId}/addresses/${addressRef}`;
    try {
    const response = await axios.delete(API_URL);
    return {apiStatus : APIStatus.Success, data : response.data}
    } catch (error) {
    return {apiStatus : APIStatus.Failed, data : { status: { reasonCode: 'API_FAILED', reason: `${error}` } }};
    }
};

export default deleteSavedAddress;
