import type { PaymentExecutedPostResponse } from '../interface';
interface EmiPostPayload {
    cardNumber?: string;
    expiryDate?: string;
    cvv?: string;
    holderName?: string;
    cardType?: string;
    offerCode?: string;
    duration?: string;
}
declare const emiPostRequest: ({ cardNumber, expiryDate, cvv, holderName, cardType, offerCode, duration }: EmiPostPayload) => Promise<PaymentExecutedPostResponse>;
export default emiPostRequest;
//# sourceMappingURL=emiPostRequest.d.ts.map