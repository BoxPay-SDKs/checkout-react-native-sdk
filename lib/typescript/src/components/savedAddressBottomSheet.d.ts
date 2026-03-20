import { type ImageSourcePropType } from "react-native";
interface Props {
    visible: boolean;
    onClose: () => void;
    onEdit: () => void;
    onSetDefault: () => void;
    onDelete: () => void;
    label: string;
    address: string;
    icon: ImageSourcePropType;
}
declare const SavedAddressBottomSheet: ({ visible, onClose, onEdit, onSetDefault, onDelete, label, address, icon, }: Props) => import("react/jsx-runtime").JSX.Element;
export default SavedAddressBottomSheet;
//# sourceMappingURL=savedAddressBottomSheet.d.ts.map