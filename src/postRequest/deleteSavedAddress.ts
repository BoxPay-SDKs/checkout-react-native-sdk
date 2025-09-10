import api from '../serviceRequest'
import { AnalyticsEvents, APIStatus, type DeleteSavedAddressResponse } from '../interface';
import { userDataHandler } from '../sharedContext/userdataHandler';
import callUIAnalytics from './callUIAnalytics';

const deleteSavedAddress = async (addressRef : string) : Promise<DeleteSavedAddressResponse>=> {
    const { userData } = userDataHandler;
    const API_URL = `/shoppers/${userData.uniqueId}/addresses/${addressRef}`;
    callUIAnalytics(AnalyticsEvents.ADDRESS_UPDATED,`Delete Address`,``)

    try {
        const response = await api.delete(API_URL);
        return {apiStatus : APIStatus.Success, data : response.data}
    } catch (error) {
        callUIAnalytics(AnalyticsEvents.ADDRESS_UPDATED,`Delete Address`,`${error}`)
        return {apiStatus : APIStatus.Failed, data : { status: { reasonCode: 'API_FAILED', reason: `${error}` } }};
    }
};

export default deleteSavedAddress;
