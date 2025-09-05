import type { PaymentResultObject } from '../interface';
export type PaymentHandler = {
  onPaymentResult: (result: PaymentResultObject) => void;
};

export let paymentHandler: PaymentHandler = {
  onPaymentResult: () => {},
};

export const setPaymentHandler = (handler: PaymentHandler) => {
  paymentHandler = handler;
};
