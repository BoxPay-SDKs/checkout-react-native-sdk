import type { PaymentResult } from '../interface';
export type PaymentHandler = {
  onPaymentResult: (result: PaymentResult) => void;
};

export let paymentHandler: PaymentHandler = {
  onPaymentResult: () => {},
};

export const setPaymentHandler = (handler: PaymentHandler) => {
  paymentHandler = handler;
};
