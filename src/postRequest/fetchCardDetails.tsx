import axios from 'axios';

const fetchCardDetails = async (
    token: string,
    env: string,
    cardNumber: string
) => {

    const endpoint: string = env === 'test'
        ? 'test-apis.boxpay.tech'
            : 'apis.boxpay.in';

    const API_URL = `https://${endpoint}/v0/checkout/sessions/${token}/bank-identification-numbers/${cardNumber}`;
    try {
        const response = await axios.post(API_URL, {});

        const data = await response.data;
        return data;
    } catch (error) {
        return { status: { reasonCode: "API_FAILED", reason: "" } };
    }

};

export default fetchCardDetails;