"use strict";

import { View, Text, Pressable, Image } from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
import { checkoutDetailsHandler } from "../sharedContext/checkoutDetailsHandler.js";
import styles from "../styles/components/cvvInfoBottomSheetStyles.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const CvvInfoBottomSheet = ({
  onClick
}) => {
  const {
    checkoutDetails
  } = checkoutDetailsHandler;
  return /*#__PURE__*/_jsx(View, {
    children: /*#__PURE__*/_jsx(Modal, {
      isVisible: true,
      style: styles.modal,
      onBackdropPress: onClick,
      children: /*#__PURE__*/_jsxs(View, {
        style: styles.sheet,
        children: [/*#__PURE__*/_jsx(Text, {
          style: [styles.headingText, {
            fontFamily: checkoutDetails.fontFamily.semiBold
          }],
          children: "Where to find CVV?"
        }), /*#__PURE__*/_jsx(Image, {
          source: require('../../assets/images/cvv_info_image.png'),
          style: styles.imageStyle
        }), /*#__PURE__*/_jsx(Text, {
          style: [styles.secondaryHeading, {
            fontFamily: checkoutDetails.fontFamily.semiBold
          }],
          children: "Generic position for CVV"
        }), /*#__PURE__*/_jsx(Text, {
          style: [styles.desc, {
            fontFamily: checkoutDetails.fontFamily.regular
          }],
          children: "3 digit numeric code on the back side of card"
        }), /*#__PURE__*/_jsx(View, {
          style: styles.divider
        }), /*#__PURE__*/_jsx(Image, {
          source: require('../../assets/images/cvv_info_image_amex.png'),
          style: styles.imageStyle
        }), /*#__PURE__*/_jsx(Text, {
          style: [styles.secondaryHeading, {
            fontFamily: checkoutDetails.fontFamily.semiBold
          }],
          children: "CVV for American Express Card"
        }), /*#__PURE__*/_jsx(Text, {
          style: [styles.desc, {
            fontFamily: checkoutDetails.fontFamily.regular
          }],
          children: "4 digit numeric code on the front side of the card, just above the card number"
        }), /*#__PURE__*/_jsx(Pressable, {
          style: [styles.buttonContainer, {
            backgroundColor: checkoutDetails.buttonColor,
            borderRadius: checkoutDetails.ctaBorderRadius
          }],
          onPress: onClick,
          children: /*#__PURE__*/_jsx(Text, {
            style: [styles.buttonText, {
              fontFamily: checkoutDetails.fontFamily.semiBold
            }],
            children: "Got it!"
          })
        })]
      })
    })
  });
};
export default CvvInfoBottomSheet;
//# sourceMappingURL=cvvInfoBottomSheet.js.map