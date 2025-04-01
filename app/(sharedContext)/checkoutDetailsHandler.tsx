import CheckoutDetails from "../../(dataClass)/checkoutDetails";

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
        errorMessage: ""
    }
};

export const setCheckoutDetailsHandler = (handler: CheckoutDetailsHandler) => {
    checkoutDetailsHandler = handler;
};