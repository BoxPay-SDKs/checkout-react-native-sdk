"use strict";

import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import Modal from 'react-native-modal';
import { checkoutDetailsHandler } from "../sharedContext/checkoutDetailsHandler.js";
import styles from "../styles/components/cancelPaymentModalStyles.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const CancelPaymentModal = ({
  onYesClick,
  onNoClick
}) => {
  const {
    checkoutDetails
  } = checkoutDetailsHandler;
  return /*#__PURE__*/_jsx(View, {
    style: styles.modalContainer,
    children: /*#__PURE__*/_jsx(Modal, {
      isVisible: true,
      style: styles.modal,
      children: /*#__PURE__*/_jsxs(View, {
        style: styles.modalContent,
        children: [/*#__PURE__*/_jsxs(View, {
          style: styles.iconContainer,
          children: [/*#__PURE__*/_jsx(Image, {
            source: require('../../assets/images/ic_info.png'),
            style: styles.iconImage
          }), /*#__PURE__*/_jsx(Text, {
            style: [styles.modalTitle, {
              fontFamily: checkoutDetails.fontFamily.semiBold
            }],
            children: "Cancel Transaction?"
          })]
        }), /*#__PURE__*/_jsx(Text, {
          style: [styles.modalText, {
            fontFamily: checkoutDetails.fontFamily.regular
          }],
          children: "Are you sure you want to cancel the transaction?"
        }), /*#__PURE__*/_jsxs(View, {
          style: styles.buttonContainer,
          children: [/*#__PURE__*/_jsx(Pressable, {
            style: [styles.cancelButton, {
              borderColor: '#E6E6E6',
              borderWidth: 1,
              borderRadius: checkoutDetails.ctaBorderRadius
            }],
            onPress: onNoClick,
            children: /*#__PURE__*/_jsx(Text, {
              style: [styles.buttonText, {
                color: checkoutDetails.buttonColor,
                fontFamily: checkoutDetails.fontFamily.regular
              }],
              children: "Not now"
            })
          }), /*#__PURE__*/_jsx(Pressable, {
            style: [styles.confirmButton, {
              backgroundColor: checkoutDetails.buttonColor,
              borderRadius: checkoutDetails.ctaBorderRadius
            }],
            onPress: onYesClick,
            children: /*#__PURE__*/_jsx(Text, {
              style: [styles.confirmButtonText, {
                fontFamily: checkoutDetails.fontFamily.semiBold
              }],
              children: "Yes"
            })
          })]
        })]
      })
    })
  });
};
export default CancelPaymentModal;
//# sourceMappingURL=cancelPaymentModal.js.map