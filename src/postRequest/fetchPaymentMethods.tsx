import axios from "axios";

const fetchPaymentMethods = async (
    token: string,
    env: string
) => {
    const endpoint: string = env === 'test'
        ? 'test-apis.boxpay.tech'
            : 'apis.boxpay.in';

    const API_URL = `https://${endpoint}/v0/checkout/sessions/${token}/payment-methods`;
    try {
        const response = await axios.get(API_URL);
        const data = await response.data;
        return data;
    } catch (error) {
        return { status: { reasonCode: "API_FAILED", reason: "" } };
    }

};

export default fetchPaymentMethods;