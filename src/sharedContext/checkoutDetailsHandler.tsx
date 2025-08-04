import type { CheckoutDetails } from '../interface';

export type CheckoutDetailsHandler = {
  checkoutDetails: CheckoutDetails;
};

export let checkoutDetailsHandler: CheckoutDetailsHandler = {
  checkoutDetails: {
    currencySymbol: '',
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
    showSuccessScreen: false,
  },
};

export const setCheckoutDetailsHandler = (handler: CheckoutDetailsHandler) => {
  checkoutDetailsHandler = handler;
};
