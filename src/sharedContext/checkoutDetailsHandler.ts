import type { CheckoutDetails } from '../interface';

export type CheckoutDetailsHandler = {
  checkoutDetails: CheckoutDetails;
};

export let checkoutDetailsHandler: CheckoutDetailsHandler = {
  checkoutDetails: {
    currencySymbol: '',
    currencyCode : '',
    amount: '',
    token: '',
    fontFamily : {},
    ctaBorderRadius:0,
    buttonColor: '#1CA672',
    textInputFieldFocusedOutlineColor : "#2D2B32",
    textInputFieldUnFocusedOutlineColor: "#ADACB0",
    buttonTextColor:'white',
    headerColor : 'white',
    headerTextColor:'#363840',
    env: '',
    itemsLength: 0,
    errorMessage: '',
    shopperToken: null,
    isSuccessScreenVisible: false,
    isFailedScreenVisible: false,
    isShippingAddressEnabled: false,
    isShippingAddressEditable: false,
    isFullNameEnabled: false,
    isFullNameEditable: false,
    isEmailEnabled: false,
    isEmailEditable: false,
    isPhoneEnabled: false,
    isPhoneEditable: false,
    isPanEnabled: false,
    isPanEditable: false,
    isDOBEnabled: false,
    isDOBEditable: false,
    isUpiIntentMethodEnabled : false,
    isUpiQRMethodEnabled:false,
    isUpiCollectMethodEnabled : false,
    isCardMethodEnabled : false,
    isWalletMethodEnabled : false,
    isNetBankingMethodEnabled : false,
    isEmiMethodEnabled : false,
    isBnplMethodEnabled : false,
    isUPIOtmIntentMethodEnabled : false,
    isUPIOtmCollectMethodEnabled : false,
    isUPIOtmQRMethodEnabled : false,
    isOrderItemDetailsVisible : true,
    isSICheckboxChecked : false,
    isSICheckboxEnabled : false,
    isSubscriptionCheckout : false,
    subscriptionDetails : null
  },
};

export const setCheckoutDetailsHandler = (handler: CheckoutDetailsHandler) => {
  checkoutDetailsHandler = handler;
};

export const setCheckOutDetailsHandlerToDefault = () => {
  checkoutDetailsHandler = {
    checkoutDetails: {
      currencySymbol: '',
      currencyCode: '',
      amount: '',
      token: '',
      fontFamily : {},
      ctaBorderRadius:0,
      buttonColor: '',
      textInputFieldFocusedOutlineColor : "",
      textInputFieldUnFocusedOutlineColor: "",
      buttonTextColor:'',
      headerColor : '',
      headerTextColor:'',
      env: '',
      itemsLength: 0,
      errorMessage: '',
      shopperToken: null,
      isSuccessScreenVisible: false,
      isFailedScreenVisible: false,
      isShippingAddressEnabled: false,
      isShippingAddressEditable: false,
      isFullNameEnabled: false,
      isFullNameEditable: false,
      isEmailEnabled: false,
      isEmailEditable: false,
      isPhoneEnabled: false,
      isPhoneEditable: false,
      isPanEnabled: false,
      isPanEditable: false,
      isDOBEnabled: false,
      isDOBEditable: false,
      isUpiIntentMethodEnabled: false,
      isUpiQRMethodEnabled: false,
      isUpiCollectMethodEnabled: false,
      isCardMethodEnabled: false,
      isWalletMethodEnabled: false,
      isNetBankingMethodEnabled: false,
      isEmiMethodEnabled: false,
      isBnplMethodEnabled: false,
      isUPIOtmIntentMethodEnabled: false,
      isUPIOtmCollectMethodEnabled: false,
      isUPIOtmQRMethodEnabled: false,
      isOrderItemDetailsVisible : true,
      isSICheckboxChecked : false,
      isSICheckboxEnabled : false,
      isSubscriptionCheckout : false,
      subscriptionDetails : null
    },
  };
};

