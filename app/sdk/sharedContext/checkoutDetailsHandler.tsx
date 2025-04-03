import CheckoutDetails from '../../../interface/checkoutDetails'

export type CheckoutDetailsHandler = {
    checkoutDetails: CheckoutDetails
};

export let checkoutDetailsHandler: CheckoutDetailsHandler = {
    checkoutDetails: {
        currencySymbol: "",
        amount: "",
        token: "",
        brandColor: "",
        env: "",
        itemsLength: 0,
        errorMessage: "",
        shopperToken: null
    }
};

export const setCheckoutDetailsHandler = (handler: CheckoutDetailsHandler) => {
    checkoutDetailsHandler = handler;
};