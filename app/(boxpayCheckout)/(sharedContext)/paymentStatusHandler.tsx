import PaymentResult from "../(dataClass)/paymentType";
export type PaymentHandler = {
    onPaymentResult: (result: PaymentResult) => void;
};

export let paymentHandler: PaymentHandler = {
    onPaymentResult: () => {
        console.warn("onPaymentResult is not set yet.");
    },
};

export const setPaymentHandler = (handler: PaymentHandler) => {
    paymentHandler = handler;
};