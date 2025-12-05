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
    brandColor: '',
    env: '',
    itemsLength: 0,
    errorMessage: '',
    shopperToken: null,
    isSuccessScreenVisible: false,
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
    isBnplMethodEnabled : false
  },
};

export const setCheckoutDetailsHandler = (handler: CheckoutDetailsHandler) => {
  checkoutDetailsHandler = handler;
};
