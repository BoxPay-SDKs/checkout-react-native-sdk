"use strict";

import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import React from 'react';
import { checkoutDetailsHandler } from "../sharedContext/checkoutDetailsHandler.js";
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
const Header = ({
  onBackPress,
  showDesc,
  showSecure,
  text
}) => {
  const {
    checkoutDetails
  } = checkoutDetailsHandler;
  return /*#__PURE__*/_jsx(View, {
    style: styles.header,
    children: /*#__PURE__*/_jsxs(View, {
      style: styles.headerTitleRow,
      children: [/*#__PURE__*/_jsx(Pressable, {
        onPress: () => {
          onBackPress(); // Trigger the passed function
        },
        children: /*#__PURE__*/_jsx(Image, {
          source: require('../../assets/images/arrow-left.png'),
          style: styles.backArrow
        })
      }), /*#__PURE__*/_jsxs(View, {
        style: styles.headerColumn,
        children: [/*#__PURE__*/_jsx(Text, {
          style: [styles.headerTitle, {
            fontFamily: checkoutDetails.fontFamily.semiBold
          }],
          children: text
        }), showDesc && /*#__PURE__*/_jsxs(Text, {
          style: [styles.headerDesc, {
            fontFamily: checkoutDetails.fontFamily.regular
          }],
          children: [checkoutDetails.itemsLength > 0 && /*#__PURE__*/_jsxs(_Fragment, {
            children: [checkoutDetails.itemsLength, ' ', checkoutDetails.itemsLength === 1 ? 'item' : 'items', " ."]
          }), "Total:", /*#__PURE__*/_jsxs(Text, {
            style: [styles.amount, {
              fontFamily: checkoutDetails.fontFamily.semiBold
            }],
            children: [/*#__PURE__*/_jsxs(Text, {
              style: styles.currencySymbol,
              children: [' ', checkoutDetails.currencySymbol]
            }), checkoutDetails.amount]
          })]
        })]
      }), showSecure && /*#__PURE__*/_jsx(View, {
        style: styles.btnContainer,
        children: /*#__PURE__*/_jsxs(View, {
          style: styles.headerSecure,
          children: [/*#__PURE__*/_jsx(Image, {
            source: require('../../assets/images/Lock.png'),
            style: styles.lockIcon
          }), /*#__PURE__*/_jsx(Text, {
            style: [styles.secureText, {
              fontFamily: checkoutDetails.fontFamily.semiBold
            }],
            children: "100% Secure"
          })]
        })
      })]
    })
  });
};
export default Header;
const styles = StyleSheet.create({
  header: {
    backgroundColor: 'white',
    padding: 16
  },
  headerTitleRow: {
    flexDirection: 'row'
  },
  headerColumn: {
    flex: 1
  },
  backArrow: {
    height: 24,
    width: 24,
    marginRight: 8
  },
  headerTitle: {
    fontSize: 16,
    color: '#363840'
  },
  headerDesc: {
    marginTop: -4,
    fontSize: 12,
    color: '#4F4D55'
  },
  headerSecure: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 2,
    backgroundColor: '#E8F6F1',
    borderRadius: 6
  },
  lockIcon: {
    height: 14,
    width: 14,
    marginRight: 4
  },
  secureText: {
    fontSize: 12,
    color: '#1CA672',
    marginBottom: -2
  },
  amount: {
    fontSize: 12,
    color: '#4F4D55'
  },
  btnContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  currencySymbol: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#4F4D55'
  }
});
//# sourceMappingURL=header.js.map