import type { ImageSourcePropType } from 'react-native';
import type { PaymentClass } from '../interface';
interface SavedCardComponentViewProps {
    savedCards: PaymentClass[];
    onProceedForward: (instrumentValue: string, isSICheckBoxClicked: boolean) => void;
    errorImage: ImageSourcePropType;
    onClickAddCard: () => void;
    onClickRadio: (selectedInstrumentValue: string) => void;
}
declare const SavedCardComponentView: ({ savedCards, onProceedForward, errorImage, onClickAddCard, onClickRadio, }: SavedCardComponentViewProps) => import("react/jsx-runtime").JSX.Element;
export default SavedCardComponentView;
//# sourceMappingURL=savedCardComponent.d.ts.map