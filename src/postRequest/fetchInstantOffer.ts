import { type GetInstantDiscountResponse, APIStatus} from "../interface";
import api from "../serviceRequest";

const fetchInstantOffer = async(amount : string) : Promise<GetInstantDiscountResponse> => {
    
    const requestBody = {
        "minAmount" : amount,
        "maxAmount" : amount
    }
    
    try {
        const response = await api.post("/offers/search", requestBody);
        return {apiStatus : APIStatus.Success, data : response.data};
    } catch (error) {
        return { apiStatus : APIStatus.Failed , data : {status: { reasonCode: 'API_FAILED', reason: `${error}` }} };
    }
}

export default fetchInstantOffer;