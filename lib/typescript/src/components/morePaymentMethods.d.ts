import type { PaymentClass } from '../interface';
import type { SurchargeProp } from './orderDetails';
interface MorePaymentMethodsArgs {
    savedCards: PaymentClass[];
    stopTimer: () => void;
    setSelectedPaymentMethod: (method: string) => void;
    surchargeDetails: SurchargeProp[];
}
declare const MorePaymentMethods: ({ savedCards, stopTimer, setSelectedPaymentMethod, surchargeDetails }: MorePaymentMethodsArgs) => import("react/jsx-runtime").JSX.Element;
export default MorePaymentMethods;
//# sourceMappingURL=morePaymentMethods.d.ts.map