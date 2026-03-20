"use strict";

import { View } from 'react-native';
import styles from "./styles/indexStyles.js";
import CheckoutContainer from "./navigation.js";
import { jsx as _jsx } from "react/jsx-runtime";
const BoxpayCheckout = ({
  token,
  configurationOptions = null,
  onPaymentResult,
  shopperToken = null,
  uiConfiguration = null
}) => {
  return /*#__PURE__*/_jsx(View, {
    style: styles.screenView,
    children: /*#__PURE__*/_jsx(CheckoutContainer, {
      token: token,
      configurationOptions: configurationOptions,
      onPaymentResult: onPaymentResult,
      shopperToken: shopperToken,
      uiConfiguration: uiConfiguration
    })
  });
};
export default BoxpayCheckout;
//# sourceMappingURL=index.js.map