import { checkoutDetailsHandler } from '../sharedContext/checkoutDetailsHandler';
import type { AnalyticsApiResponse } from '../interface';
import { getBrowserData, getDeviceDetails } from '../utils/listAndObjectUtils';
import { APIStatus } from '../interface';
import axios from 'axios';
import { getBaseURL } from '../utils/stringUtils';

const callUIAnalytics = async (
    uiEvent: string,
    screenName: string,
    message: string
  ) : Promise<AnalyticsApiResponse> => {
    const { checkoutDetails } = checkoutDetailsHandler;
    const deviceDetails = getDeviceDetails()
    const browserData = getBrowserData()

    const requestBody = {
        browserData: browserData,
        callerToken : checkoutDetails.token,
        uiEvent : uiEvent,
        eventAttrs : {
            errorMessage: message,
            screenName: screenName
        },
        deviceDetails: deviceDetails,
      };

      try {
        const API_URL = `${getBaseURL(checkoutDetails.env)}/ui-analytics`
        const response = await axios.post(API_URL, requestBody);
        return {apiStatus : APIStatus.Success, data : response.data};
      } catch (error) {
        return { apiStatus : APIStatus.Failed , data : {status: { reasonCode: 'API_FAILED', reason: `${error}` }} };
      }
}

export default callUIAnalytics;