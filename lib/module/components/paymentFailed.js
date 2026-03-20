"use strict";

import { View, Text, StyleSheet, Pressable } from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
import LottieView from 'lottie-react-native';
import { checkoutDetailsHandler } from "../sharedContext/checkoutDetailsHandler.js";
import callUIAnalytics from "../postRequest/callUIAnalytics.js";
import { AnalyticsEvents } from "../interface.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const PaymentFailed = ({
  onClick,
  errorMessage
}) => {
  const {
    checkoutDetails
  } = checkoutDetailsHandler;
  return /*#__PURE__*/_jsx(View, {
    children: /*#__PURE__*/_jsx(Modal, {
      isVisible: true,
      style: styles.modal,
      children: /*#__PURE__*/_jsxs(View, {
        style: styles.sheet,
        children: [/*#__PURE__*/_jsx(LottieView, {
          source: require('../../assets/animations/payment_failed.json'),
          autoPlay: true,
          loop: false,
          style: {
            width: 90,
            height: 90,
            alignSelf: 'center'
          }
        }), /*#__PURE__*/_jsx(Text, {
          style: [styles.successfulHeading, {
            fontFamily: checkoutDetails.fontFamily.semiBold
          }],
          children: "Payment Failed"
        }), /*#__PURE__*/_jsx(Text, {
          style: {
            fontSize: 14,
            fontFamily: checkoutDetails.fontFamily.regular,
            color: '#000000D9',
            textAlign: 'center',
            alignSelf: 'center',
            paddingTop: 8,
            paddingBottom: 16,
            lineHeight: 20
          },
          children: errorMessage
        }), /*#__PURE__*/_jsx(Pressable, {
          style: [styles.buttonContainer, {
            backgroundColor: checkoutDetails.buttonColor,
            borderRadius: checkoutDetails.ctaBorderRadius
          }],
          onPress: () => {
            callUIAnalytics(AnalyticsEvents.PAYMENT_RESULT_SCREEN_DISPLAYED, "Payment Failed Screen button clicked", errorMessage);
            onClick();
          },
          children: /*#__PURE__*/_jsx(Text, {
            style: styles.buttonText,
            children: "Retry Payment"
          })
        })]
      })
    })
  });
};
export default PaymentFailed;
const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0
  },
  sheet: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  successfulHeading: {
    color: '#E84142',
    fontSize: 20,
    alignSelf: 'center',
    paddingTop: 8
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
    backgroundColor: '#1CA672'
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    paddingVertical: 12
  }
});
//# sourceMappingURL=paymentFailed.js.map