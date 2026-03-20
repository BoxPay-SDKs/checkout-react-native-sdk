import type { PaymentExecutedPostResponse } from '../interface';
declare const cardPostRequest: (cardNumber: string, expiryDate: string, cvv: string, holderName: string, cardNickName: string, isCheckboxClicked: boolean, isSICheckBoxClicked: boolean) => Promise<PaymentExecutedPostResponse>;
export default cardPostRequest;
//# sourceMappingURL=cardPostRequest.d.ts.map