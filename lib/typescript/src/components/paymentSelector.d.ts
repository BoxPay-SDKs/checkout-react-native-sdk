import type { ImageSourcePropType } from 'react-native';
import type { PaymentClass } from '../interface';
interface PaymentSelectorViewProps {
    providerList: PaymentClass[];
    onProceedForward: (instrumentType: string, instrumentValue: string, type: string) => void;
    isLastUsed?: boolean | null;
    errorImage: ImageSourcePropType;
    onClickRadio: (selctedInstrumentValue: string) => void;
}
declare const PaymentSelectorView: ({ providerList, onProceedForward, isLastUsed, errorImage, onClickRadio, }: PaymentSelectorViewProps) => import("react/jsx-runtime").JSX.Element;
export default PaymentSelectorView;
//# sourceMappingURL=paymentSelector.d.ts.map