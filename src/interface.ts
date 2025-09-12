export interface PaymentResultObject {
  status: string;
  transactionId: string;
}

export enum ConfigurationOptions {
  ShowBoxpaySuccessScreen = 'SHOW_BOXPAY_SUCCESS_SCREEN',
  EnableSandboxEnv = 'ENABLE_SANDBOX_ENV',
  ShowUPIQROnLoad = 'SHOW_UPI_QR_ON_LOAD',
}

export interface BoxpayCheckoutProps {
  token: string;
  configurationOptions?: Partial<Record<ConfigurationOptions, boolean>> | null;
  onPaymentResult: (result: PaymentResultObject) => void;
  shopperToken?: string | null;
}

export interface CheckoutDetails {
  currencySymbol: string;
  amount: string;
  token: string;
  brandColor: string;
  env: string;
  itemsLength: number;
  errorMessage: string;
  shopperToken: string | null;
  isSuccessScreenVisible: boolean;
  isShippingAddressEnabled: boolean;
  isShippingAddressEditable: boolean;
  isFullNameEnabled: boolean;
  isFullNameEditable: boolean;
  isEmailEnabled: boolean;
  isEmailEditable: boolean;
  isPhoneEnabled: boolean;
  isPhoneEditable: boolean;
  isPanEnabled: boolean;
  isPanEditable: boolean;
  isDOBEnabled: boolean;
  isDOBEditable: boolean;
  isUpiIntentMethodEnabled : boolean,
  isUpiCollectMethodEnabled : boolean,
  isUpiQRMethodEnabled : boolean,
  isCardMethodEnabled : boolean,
  isWalletMethodEnabled : boolean,
  isNetBankingMethodEnabled : boolean,
  isEmiMethodEnabled : boolean,
  isBnplMethodEnabled : boolean
}

interface AnalyticsResponse {
  id : string
}

export interface CardType {
  cardType: string; // Restricting values
  banks: Bank[];
}

export interface Bank {
  iconUrl: string;
  name: string;
  percent: number;
  noCostApplied: boolean;
  lowCostApplied: boolean;
  emiList: Emi[];
  cardLessEmiValue: string;
  issuerBrand?: string;
}

export interface ChooseEmiModel {
  cards: CardType[];
}

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
}

export interface PaymentClass {
  type: string;
  id: string;
  displayName: string;
  displayValue: string;
  iconUrl: string;
  instrumentTypeValue: string;
  isLastUsed?: boolean | null;
  isSelected: boolean;
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
}

export interface DeliveryAddress {
  address1: string | null;
  address2: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  countryCode: string | null;
  labelName: string | null;
  labelType: string | null;
}

interface UPIIntentPayload {
  type: 'upi/intent';
  upiAppDetails?: {
    upiApp: string; // Or a more specific type for the UPI app identifier
  };
}

interface CardTokenPayload {
  type: 'card/token';
  savedCard: {
    instrumentRef: string;
  };
}

interface UPIQRPayload {
  type : 'upi/qr'
}

interface UPICollectPayload {
  type: 'upi/collect';
  upi?: {
    instrumentRef?: string;
    shopperVpa?: string;
  };
}

export type InstrumentDetails =
  | UPIIntentPayload
  | CardTokenPayload
  | UPICollectPayload
  | UPIQRPayload

export interface PaymentMethod {
  id: string;
  type: string;
  brand: string;
  title: string;
  logoUrl: string;
  instrumentTypeValue: string;
  emiMethod?: {
    brand: string;
    issuer: string;
    duration: number;
    effectiveInterestRate: number;
    merchantBorneInterestRate: number;
    issuerTitle: string;
    netAmountLocaleFull: string;
    totalAmountLocaleFull: string;
    emiAmountLocaleFull: string;
    merchantBorneInterestAmountLocaleFull: string;
    bankChargedInterestAmountLocaleFull: string;
    interestChargedAmountLocaleFull: string;
    cardlessEmiProviderTitle: string;
    cardlessEmiProviderValue: string;
    applicableOffer: {
      code: string;
      discount: {
        percentage: number;
        type: string;
      };
    };
    processingFee: {
      amountLocaleFull: string;
    };
  };
}

export interface RecommendedInstruments {
  type: string;
  brand: string;
  instrumentRef: string;
  displayValue: string;
  logoUrl: string;
  cardNickName: string;
}

export interface OrderItem {
  id: string;
  itemName: string;
  quantity: number;
  imageUrl: string;
  amountWithoutTaxLocaleFull: string;
  description : string | null,
}

export interface ErrorResponse {
  status: {
    reasonCode: string;
    reason: string;
  };
}

export interface FetchStatusResponse {
  status : string,
  transactionId : string,
  reasonCode : string,
  reason : string,
  transactionTimestampLocale : string
}

export interface PaymentMethodPostResponse {
  transactionId : string,
  transactionTimestampLocale : string,
  status : {
    status : string,
    reason : string,
    reasonCode : string
  },
  actions : [PaymentActions]
}

interface PaymentActions {
  method : string,
  url : string,
  type : string,
  htmlPageString : string,
  content : string
}

export interface FetchCardDetails {
  paymentMethod : {
    id : string,
    type : string,
    brand : string,
    issuer : string,
    classification : string
  }
  methodEnabled : boolean,
  issuerName : string | null,
  issuerTitle : string | null
}

export interface HandlePaymentOptions {
  response: PaymentExecutedPostResponse;
  upiId?: string;
  checkoutDetailsErrorMessage: string;
  onSetStatus: (status: string) => void;
  onSetTransactionId: (txnId: string) => void;
  onSetPaymentUrl?: (url: string) => void;
  onSetPaymentHtml?: (html: string) => void;
  onSetFailedMessage?: (message: string) => void;
  onShowFailedModal?: () => void;
  onShowSuccessModal?: (timestamp: string) => void;
  onShowSessionExpiredModal?: () => void;
  onNavigateToTimer?: (upiId: string) => void;
  onOpenQr? : (qrImage : string) => void
  onOpenUpiIntent?: (url: string) => void; 
  setLoading: (loading: boolean) => void;
}

export type PaymentExecutedPostResponse =
| {
    apiStatus: APIStatus.Success;
    data: PaymentMethodPostResponse;
  }
| {
    apiStatus: APIStatus.Failed;
    data: ErrorResponse;
  };

export type FetchStatusApiResponse = 
| {
  apiStatus: APIStatus.Success;
  data: FetchStatusResponse;
}
| {
  apiStatus: APIStatus.Failed;
  data: ErrorResponse;
};

export type AnalyticsApiResponse = 
| {
  apiStatus: APIStatus.Success;
  data: AnalyticsResponse;
}
| {
  apiStatus: APIStatus.Failed;
  data: ErrorResponse;
};

export type PaymentMethodFetchResponse = 
| {
  apiStatus: APIStatus.Success;
  data: PaymentMethod[];
}
| {
  apiStatus: APIStatus.Failed;
  data: ErrorResponse;
};

export type SavedInstrumentFetchResponse = 
| {
  apiStatus: APIStatus.Success;
  data: RecommendedInstruments[];
}
| {
  apiStatus: APIStatus.Failed;
  data: ErrorResponse;
};


export type FetchCardDetailsResponse = 
| {
  apiStatus: APIStatus.Success;
  data: FetchCardDetails
}
| {
  apiStatus: APIStatus.Failed;
  data: ErrorResponse;
};

export type DeleteSavedAddressResponse = 
| {
  apiStatus: APIStatus.Success;
  data: FetchSavedAddress
}
| {
  apiStatus: APIStatus.Failed;
  data: ErrorResponse;
};

export type FetchSavedAddressResponse = 
| {
  apiStatus: APIStatus.Success;
  data: FetchSavedAddress[]
}
| {
  apiStatus: APIStatus.Failed;
  data: ErrorResponse;
};

export type FetchSessionDetailsResponse = 
| {
  apiStatus : APIStatus.Success,
  data : SessionDetails
}
| {
  apiStatus : APIStatus.Failed,
  data : ErrorResponse
}

export interface HandleFetchStatusOptions {
  response: FetchStatusApiResponse;
  checkoutDetailsErrorMessage: string;
  onSetStatus: (status: string) => void;
  onSetTransactionId: (txnId: string) => void;
  onSetFailedMessage: (message: string) => void;
  onShowFailedModal: () => void;
  onShowSuccessModal: (timestamp: string) => void;
  onShowSessionExpiredModal: () => void;
  setLoading?: (loading: boolean) => void;
  stopBackgroundApiTask? : () => void
}

export enum TransactionStatus {
  RequiresAction = 'REQUIRESACTION',
  Failed = 'FAILED',
  Rejected = 'REJECTED',
  Approved = 'APPROVED',
  Success = 'SUCCESS',
  Paid = 'PAID',
  Expired = 'EXPIRED',
}

export enum APIStatus {
  Success = 'SUCCESS',
  Failed = 'FAILED',
}

export interface FetchSavedAddress {
  address1 : string,
  address2 : string | null,
  city : string,
  state : string,
  countryCode : string,
  postalCode : string,
  shopperRef : string,
  addressRef : string,
  labelType : string,
  labelName : string | null,
  name : string,
  email : string,
  phoneNumber : string
}

export interface SessionDetails {
  configs : {
    paymentMethods : PaymentMethod[],
    enabledFields : EnabledFields[]
  },
  paymentDetails : {
    context : {
      countryCode : string,
      localeCode : string,
    },
    money : {
      amountLocaleFull : string,
      currencySymbol : string,
      currencyCode : string
    },
    shopper : {
      firstName : string | null,
      lastName : string | null,
      phoneNumber : string | null,
      email : string | null,
      uniqueReference : string,
      deliveryAddress : DeliveryAddress | null,
      dateOfBirth : string | null,
      panNumber : string | null
    },
    order : OrderDetails | null
  },
  merchantDetails : {
    checkoutTheme : {
      primaryButtonColor : string,
      buttonTextColor : string
    }
  },
  sessionExpiryTimestamp : string,
  status : string,
  lastPaidAtTimestamp : string,
  lastTransactionId : string
}

interface EnabledFields {
  field : string,
  editable : boolean,
  mandatory : boolean
}
interface OrderDetails {
  shippingAmountLocaleFull : string | null,
  taxAmountLocaleFull : string | null,
  originalAmountLocaleFull : string | null,
  items : OrderItem[] | null
}

export enum AnalyticsEvents {
  CHECKOUT_LOADED = "CHECKOUT_LOADED",
  ADDRESS_UPDATED = "ADDRESS_UPDATED",
  PAYMENT_CATEGORY_SELECTED = "PAYMENT_CATEGORY_SELECTED",
  PAYMENT_METHOD_SELECTED = "PAYMENT_METHOD_SELECTED",
  PAYMENT_INITIATED = "PAYMENT_INITIATED",
  PAYMENT_INSTRUMENT_PROVIDED = "PAYMENT_INSTRUMENT_PROVIDED",
  UPI_APP_NOT_FOUND = "UPI_APP_NOT_FOUND",
  FAILED_TO_LAUNCH_UPI_INTENT = "FAILED_TO_LAUNCH_UPI_INTENT",
  ERROR_GETTING_UPI_URL = "ERROR_GETTING_UPI_URL",
  SDK_CRASH = "SDK_CRASH",
  PAYMENT_RESULT_SCREEN_DISPLAYED = "PAYMENT_RESULT_SCREEN_DISPLAYED"
}

export interface CardScreenParams {
  duration?: number;
  bankName?: string;
  bankUrl?: string;
  offerCode?: string;
  amount?: string; 
  percent?: number; 
  cardType?: string;
  issuerBrand?: string;
}

export interface UPITimerScreenParams {
  upiId : string
}