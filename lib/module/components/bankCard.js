"use strict";

import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from "../styles/components/bankCardStyles.js";
import ImageLoader from "./imageLoader.js";
import { checkoutDetailsHandler } from "../sharedContext/checkoutDetailsHandler.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const BankCard = ({
  name,
  iconUrl,
  hasNoCostEmi,
  hasLowCostEmi,
  onPress
}) => {
  const {
    checkoutDetails
  } = checkoutDetailsHandler;
  return /*#__PURE__*/_jsxs(TouchableOpacity, {
    style: styles.container,
    onPress: onPress,
    children: [/*#__PURE__*/_jsx(ImageLoader, {
      image: iconUrl,
      errorImage: require('../../assets/images/ic_netbanking_semi_bold.png')
    }), /*#__PURE__*/_jsxs(View, {
      style: styles.detailsContainer,
      children: [/*#__PURE__*/_jsx(Text, {
        style: [styles.bankName, {
          fontFamily: checkoutDetails.fontFamily.semiBold
        }],
        children: name
      }), /*#__PURE__*/_jsxs(View, {
        style: styles.tagsContainer,
        children: [hasNoCostEmi && /*#__PURE__*/_jsx(View, {
          style: styles.tag,
          children: /*#__PURE__*/_jsx(Text, {
            style: [styles.tagText, {
              fontFamily: checkoutDetails.fontFamily.medium
            }],
            children: "NO COST EMI"
          })
        }), hasLowCostEmi && /*#__PURE__*/_jsx(View, {
          style: styles.tag,
          children: /*#__PURE__*/_jsx(Text, {
            style: [styles.tagText, {
              fontFamily: checkoutDetails.fontFamily.medium
            }],
            children: "LOW COST EMI"
          })
        })]
      })]
    }), /*#__PURE__*/_jsx(Image, {
      source: require('../../assets/images/chervon-down.png'),
      style: styles.chervonImage
    })]
  });
};
export default BankCard;
//# sourceMappingURL=bankCard.js.map