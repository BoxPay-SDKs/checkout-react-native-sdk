"use strict";

export let userDataHandler = {
  userData: {
    firstName: null,
    lastName: null,
    email: null,
    completePhoneNumber: null,
    phoneCode: "+91",
    dob: null,
    pan: null,
    address1: null,
    address2: null,
    city: null,
    state: null,
    countryCode: "IN",
    countryName: "India",
    pincode: null,
    labelType: null,
    labelName: null,
    uniqueId: null
  }
};
export const setUserDataHandler = handler => {
  userDataHandler = handler;
};
export const setUserDataHandlerToDefault = () => {
  userDataHandler = {
    userData: {
      firstName: null,
      lastName: null,
      email: null,
      completePhoneNumber: null,
      phoneCode: "+91",
      dob: null,
      pan: null,
      address1: null,
      address2: null,
      city: null,
      state: null,
      countryCode: "IN",
      countryName: "India",
      pincode: null,
      labelType: null,
      labelName: null,
      uniqueId: null
    }
  };
};
//# sourceMappingURL=userdataHandler.js.map