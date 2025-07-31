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

export interface DeliveryAddress {
    address1 : string | null,
    address2 : string | null,
    city  : string | null,
    state : string | null,
    postalCode : string | null,
    countryCode : string | null,
    labelName : string | null,
    labelType : string | null
}

interface UPIIntentPayload {
    type: "upi/intent";
    upiAppDetails?: {
        upiApp: string; // Or a more specific type for the UPI app identifier
    };
}
  
interface CardTokenPayload {
    type: "card/token";
    savedCard: {
        instrumentRef: string;
    };
}

interface UPICollectPayload {
    type: "upi/collect";
    upi?: {
        instrumentRef?: string;
        shopperVpa?: string;
    };
}
  
export type InstrumentDetails = UPIIntentPayload | CardTokenPayload | UPICollectPayload;

export interface PaymentMethod {
    id : string | null,
    type : string | null,
    brand : string | null,
    title : string | null,
    logoUrl : string | null,
    instrumentTypeValue : string | null
}

export interface EMIPaymentMethod {
    type : string | null,
    title : string | null,
    logoUrl : string | null,
    emiMethod : {
        brand : string | null,
        issuer : string | null,
        duration : number | null,
        effectiveInterestRate : number | null,
        merchantBorneInterestRate : number | null,
        issuerTitle : string | null,
        netAmountLocaleFull : string | null,
        totalAmountLocaleFull : string | null,
        emiAmountLocaleFull : string | null,
        merchantBorneInterestAmountLocaleFull : string | null,
        bankChargedInterestAmountLocaleFull : string | null,
        interestChargedAmountLocaleFull : string | null,
        cardlessEmiProviderTitle : string | null,
        cardlessEmiProviderValue : string | null,
        applicableOffer : {
            code : string | null,
            discount : {
                percentage : number | null,
                type : string | null
            }
        },
        processingFee : {
            amountLocaleFull : string | null
        }
    }
}