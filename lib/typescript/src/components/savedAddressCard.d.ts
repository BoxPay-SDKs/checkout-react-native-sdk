import type { FetchSavedAddress } from "../interface";
interface SavedAddressComponentArgs {
    savedAddressList: FetchSavedAddress[];
    onClickAddress: (savedAddress: FetchSavedAddress) => void;
    onClickOtherOptions: (savedAddress: FetchSavedAddress) => void;
}
declare const SavedAddressComponent: ({ savedAddressList, onClickAddress, onClickOtherOptions }: SavedAddressComponentArgs) => import("react/jsx-runtime").JSX.Element;
export default SavedAddressComponent;
//# sourceMappingURL=savedAddressCard.d.ts.map