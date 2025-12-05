import { type FetchSurChargeResponse , APIStatus} from "../interface";
import api from "../serviceRequest";
import { checkoutDetailsHandler } from "../sharedContext/checkoutDetailsHandler";

const fetchSurCharge = async() : Promise<FetchSurChargeResponse> => {
    const { amount, currencyCode } = checkoutDetailsHandler.checkoutDetails;
    
    const requestBody = {
        "discountedMoney" : {
            "amount" : amount.replace(/,/g, ''),
            "currencyCode" : currencyCode
        }
    }
    
    try {
        const response = await api.post("/surcharges/evaluate", requestBody);
        return {apiStatus : APIStatus.Success, data : response.data};
    } catch (error) {
        return { apiStatus : APIStatus.Failed , data : {status: { reasonCode: 'API_FAILED', reason: `${error}` }} };
    }
}

export default fetchSurCharge;