import axios from 'axios';
import { checkoutDetailsHandler } from "../sharedContext/checkoutDetailsHandler";
import { userDataHandler } from '../sharedContext/userdataHandler';

const fetchRecommendedInstruments = async () => {
    const { userData } = userDataHandler
    const { checkoutDetails } = checkoutDetailsHandler
    const endpoint: string = checkoutDetails.env === 'test'
        ? 'test-apis.boxpay.tech'
            : 'apis.boxpay.in';

    const API_URL = `https://${endpoint}/v0/checkout/sessions/${checkoutDetails.token}/shoppers/${userData.uniqueId}/recommended-instruments`;
    try {
        const response = await axios.get(API_URL, {
            headers: {
                Authorization: `Session ${checkoutDetails.shopperToken}`
            },
        });

        const data = await response.data;
        return data;
    } catch (error) {
        return { status: { reasonCode: "API_FAILED", reason: "" } };
    }

};

export default fetchRecommendedInstruments;