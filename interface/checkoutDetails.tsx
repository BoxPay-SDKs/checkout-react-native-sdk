export default interface CheckoutDetails {
    currencySymbol: string;
    amount: string;
    token: string;
    brandColor: string;
    env: string;
    itemsLength: number;
    errorMessage: string,
    shopperToken: string | null,
    isSuccessScreenVisible: boolean,
    isShippingAddressEnabled: boolean,
    isShippingAddressEditable: boolean,
    isFullNameEnabled: boolean,
    isFullNameEditable: boolean,
    isEmailEnabled: boolean,
    isEmailEditable: boolean,
    isPhoneEnabled: boolean,
    isPhoneEditable: boolean,
    isPanEnabled: boolean,
    isPanEditable: boolean,
    isDOBEnabled: boolean,
    isDOBEditable: boolean
}
