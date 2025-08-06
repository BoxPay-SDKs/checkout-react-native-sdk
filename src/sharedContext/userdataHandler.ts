import type { UserData } from '../interface';

export type UserDataHandler = {
  userData: UserData;
};

export let userDataHandler: UserDataHandler = {
  userData: {
    firstName: null,
    lastName: null,
    email: null,
    phone: null,
    dob: null,
    pan: null,
    address1: null,
    address2: null,
    city: null,
    state: null,
    country: null,
    pincode: null,
    labelType: null,
    labelName: null,
    uniqueId: null,
  },
};

export const setUserDataHandler = (handler: UserDataHandler) => {
  userDataHandler = handler;
};
