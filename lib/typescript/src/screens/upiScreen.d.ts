import React from 'react';
import { type PaymentClass } from '../interface';
interface UpiScreenProps {
    handleUpiPayment: (selectedIntent: string) => void;
    handleCollectPayment: (item: string, id: string, type: string) => void;
    savedUpiArray: PaymentClass[];
    onClickRadio: (instrumentValue: string) => void;
    qrIsExpired: boolean;
    timeRemaining: number;
    stopTimer: () => void;
    setLoading: (loading: boolean) => void;
    setStatus: (status: string) => void;
    setTransaction: (transactionId: string) => void;
    onStartQRTimer: () => void;
    setFailedModal: (state: boolean) => void;
    setFailedModalMessage: (message: string) => void;
}
declare const UpiScreen: React.FC<UpiScreenProps>;
export default UpiScreen;
//# sourceMappingURL=upiScreen.d.ts.map