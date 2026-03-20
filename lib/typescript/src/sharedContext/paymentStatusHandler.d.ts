import type { PaymentResultObject } from '../interface';
export type PaymentHandler = {
    onPaymentResult: (result: PaymentResultObject) => void;
};
export declare let paymentHandler: PaymentHandler;
export declare const setPaymentHandler: (handler: PaymentHandler) => void;
//# sourceMappingURL=paymentStatusHandler.d.ts.map