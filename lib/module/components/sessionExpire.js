"use strict";

import { View, Text, StyleSheet, Pressable } from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
import LottieView from 'lottie-react-native';
import { checkoutDetailsHandler } from "../sharedContext/checkoutDetailsHandler.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const SessionExpire = ({
  onClick
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
          source: require('../../assets/animations/payment_status_pending.json'),
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
          children: "Payment session has expired."
        }), /*#__PURE__*/_jsx(Text, {
          style: {
            fontSize: 14,
            fontFamily: checkoutDetails.fontFamily.regular,
            color: '#000000',
            textAlign: 'center',
            alignSelf: 'center',
            paddingTop: 8,
            paddingBottom: 16,
            lineHeight: 20
          },
          children: "For your security, your session has expired due to inactivity. Please restart the payment process."
        }), /*#__PURE__*/_jsx(Pressable, {
          style: [styles.buttonContainer, {
            backgroundColor: checkoutDetails.buttonColor,
            borderRadius: checkoutDetails.ctaBorderRadius
          }],
          onPress: () => {
            onClick();
          },
          children: /*#__PURE__*/_jsx(Text, {
            style: [styles.buttonText, {
              fontFamily: checkoutDetails.fontFamily.semiBold
            }],
            children: "Go back to Home"
          })
        })]
      })
    })
  });
};
export default SessionExpire;
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
    color: '#DB7C1D',
    fontSize: 22,
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
//# sourceMappingURL=sessionExpire.js.map