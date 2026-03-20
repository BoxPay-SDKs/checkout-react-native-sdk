"use strict";

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { checkoutDetailsHandler } from "../sharedContext/checkoutDetailsHandler.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const ApplyCouponCard = ({
  selectedColor,
  code,
  description,
  discountAmount,
  currencySymbol,
  isCodeApplied,
  onClickApply,
  onClickRemove,
  onClickViewAll
}) => {
  const {
    checkoutDetails
  } = checkoutDetailsHandler;
  return /*#__PURE__*/_jsxs(View, {
    style: styles.container,
    children: [/*#__PURE__*/_jsxs(View, {
      style: styles.row,
      children: [/*#__PURE__*/_jsx(View, {
        style: styles.iconWrapper,
        children: /*#__PURE__*/_jsx(Image, {
          source: require('../../assets/images/ic_offer_tag.png'),
          style: [styles.icon, {
            transform: [{
              rotate: '180deg'
            }]
          }],
          resizeMode: "contain"
        })
      }), /*#__PURE__*/_jsxs(View, {
        style: styles.textContainer,
        children: [/*#__PURE__*/_jsx(Text, {
          style: [styles.codeText, {
            fontFamily: checkoutDetails.fontFamily.semiBold
          }],
          children: isCodeApplied ? `${code} Applied!` : code
        }), isCodeApplied ? /*#__PURE__*/_jsxs(Text, {
          style: [styles.savedText, {
            fontFamily: checkoutDetails.fontFamily.regular
          }],
          children: ["Yay! You saved", ' ', /*#__PURE__*/_jsx(Text, {
            style: [styles.currency, {
              fontFamily: checkoutDetails.fontFamily.semiBold
            }],
            children: currencySymbol
          }), discountAmount, " on this order"]
        }) : /*#__PURE__*/_jsx(Text, {
          numberOfLines: 1,
          ellipsizeMode: "tail",
          style: [styles.description, {
            fontFamily: checkoutDetails.fontFamily.regular
          }],
          children: description
        })]
      }), /*#__PURE__*/_jsx(TouchableOpacity, {
        onPress: () => isCodeApplied ? onClickRemove() : onClickApply(code),
        children: /*#__PURE__*/_jsx(Text, {
          style: [styles.actionText, {
            color: isCodeApplied ? '#E84142' : selectedColor
          }],
          children: isCodeApplied ? 'Remove' : 'Apply'
        })
      })]
    }), /*#__PURE__*/_jsx(View, {
      style: styles.divider
    }), /*#__PURE__*/_jsx(TouchableOpacity, {
      onPress: onClickViewAll,
      children: /*#__PURE__*/_jsx(Text, {
        style: [styles.viewAll, {
          color: selectedColor,
          fontFamily: checkoutDetails.fontFamily.semiBold
        }],
        children: "View All >"
      })
    })]
  });
};
export default ApplyCouponCard;
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    overflow: 'hidden'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  iconWrapper: {
    borderWidth: 1,
    borderColor: '#E6E6E6',
    borderRadius: 6,
    padding: 6
  },
  icon: {
    width: 24,
    height: 24
  },
  textContainer: {
    flex: 1,
    marginLeft: 6,
    marginRight: 18
  },
  codeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1D20'
  },
  description: {
    fontSize: 12,
    color: '#1C1D20',
    marginTop: 2
  },
  savedText: {
    fontSize: 12,
    color: '#019939',
    marginTop: 2
  },
  currency: {
    fontWeight: '600'
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600'
  },
  divider: {
    height: 1,
    backgroundColor: '#E6E6E6'
  },
  viewAll: {
    textAlign: 'center',
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: '600'
  }
});
//# sourceMappingURL=applyCouponCard.js.map