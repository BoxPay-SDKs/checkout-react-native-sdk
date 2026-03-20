import type { Emi } from '../interface';
interface SelectTenureProps {
    bankName: string;
    cardType: string;
    emiModel: Emi[];
    bankUrl: string;
    onbackPress: () => void;
    onProceedForward: (duration: number, bankName: string, bankUrl: string, offerCode: string, amount: string, percent: number) => void;
}
declare const SelectTenureScreen: ({ bankName, cardType, emiModel, bankUrl, onbackPress, onProceedForward, }: SelectTenureProps) => import("react/jsx-runtime").JSX.Element;
export default SelectTenureScreen;
//# sourceMappingURL=selectTenureScreen.d.ts.map