export interface PaymentResult {
    status: string;
    transactionId: string;
};

export enum ConfigurationOptions {
    ShowBoxpaySuccessScreen = "SHOW_BOXPAY_SUCCESS_SCREEN",
    EnableSandboxEnv = "ENABLE_SANDBOX_ENV",
}

export interface CheckoutDetails {
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
    isDOBEditable: boolean,
    showSuccessScreen: boolean
}

export interface CardType {
    cardType: string; // Restricting values
    banks: Bank[];
};

export interface Bank {
    iconUrl: string;
    name: string;
    percent: number;
    noCostApplied: boolean;
    lowCostApplied: boolean;
    emiList: Emi[];
    cardLessEmiValue: string;
    issuerBrand?: string;
};

export interface ChooseEmiModel {
    cards: CardType[];
};

export interface Emi {
    duration: number;
    percent: number;
    amount: string;
    totalAmount: string;
    discount?: string;
    interestCharged?: string;
    noCostApplied: boolean;
    lowCostApplied: boolean;
    processingFee: string;
    code?: string;
    netAmount?: string;
};

export interface PaymentClass {
    type:string,
    id: string,
    displayName: string,
    displayValue : string,
    iconUrl: string,
    instrumentTypeValue: string,
    isLastUsed?: boolean | null,
    isSelected: boolean,
}

export interface UserData {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    phone: string | null;
    dob: string | null;
    pan: string | null;
    address1: string | null;
    address2: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    pincode: string | null;
    labelType: string | null;
    labelName: string | null;
    uniqueId: string | null;
};