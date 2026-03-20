import { type HandleFetchStatusOptions, type HandlePaymentOptions, type PaymentClass } from "../interface";
export declare function handlePaymentResponse({ response, upiId, checkoutDetailsErrorMessage, onSetStatus, onSetTransactionId, onSetPaymentUrl, onSetPaymentHtml, onSetFailedMessage, onShowFailedModal, onShowSuccessModal, onShowSessionExpiredModal, onNavigateToTimer, onOpenQr, onOpenUpiIntent, setLoading }: HandlePaymentOptions): void;
export declare function handleFetchStatusResponseHandler({ response, checkoutDetailsErrorMessage, onSetStatus, onSetTransactionId, onSetFailedMessage, onShowFailedModal, onShowSuccessModal, onShowSessionExpiredModal, setLoading, stopBackgroundApiTask, isFromUPIIntentFlow }: HandleFetchStatusOptions): void;
interface fetchPaymentMethodHandlerArgs {
    paymentType: string;
    setList: (list: PaymentClass[]) => void;
}
export declare function fetchPaymentMethodHandler({ paymentType, setList }: fetchPaymentMethodHandlerArgs): Promise<void>;
interface fetchSavedInstrumentsArgs {
    setRecommendedList: (list: PaymentClass[]) => void;
    setUpiInstrumentList: (list: PaymentClass[]) => void;
    setCardInstrumentList: (list: PaymentClass[]) => void;
}
export declare function fetchSavedInstrumentsHandler({ setRecommendedList, setUpiInstrumentList, setCardInstrumentList }: fetchSavedInstrumentsArgs): Promise<void>;
export {};
//# sourceMappingURL=handlePaymentResponseHandler.d.ts.map