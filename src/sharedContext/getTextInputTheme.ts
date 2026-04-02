import { checkoutDetailsHandler } from "./checkoutDetailsHandler";


export const getTextInputTheme = () => {
    const { checkoutDetails } = checkoutDetailsHandler;
    return {
      colors: {
        primary: checkoutDetails.textInputFieldFocusedOutlineColor,
        outline: checkoutDetails.textInputFieldUnFocusedOutlineColor,
      },
    };
};