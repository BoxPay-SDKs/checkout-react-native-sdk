"use strict";

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import RenderHTML from 'react-native-render-html';
import { checkoutDetailsHandler } from "../sharedContext/checkoutDetailsHandler.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const OfferCard = ({
  offerCode,
  description,
  minimumOrderAmount,
  expiryDate,
  applicable,
  terms,
  selectedCouponCode,
  selectedColor,
  onPress
}) => {
  const [showMore, setShowMore] = useState(false);
  const {
    checkoutDetails
  } = checkoutDetailsHandler;
  const isSelected = offerCode === selectedCouponCode;
  return /*#__PURE__*/_jsx(TouchableOpacity, {
    onPress: onPress,
    activeOpacity: 0.9,
    style: [styles.card, isSelected && {
      borderColor: selectedColor,
      borderWidth: 2
    }],
    children: /*#__PURE__*/_jsxs(View, {
      style: styles.row,
      children: [/*#__PURE__*/_jsx(View, {
        style: [styles.sideStrip, {
          backgroundColor: selectedColor
        }],
        children: /*#__PURE__*/_jsx(Text, {
          style: [styles.verticalText, {
            fontFamily: checkoutDetails.fontFamily.regular
          }],
          children: description
        })
      }), /*#__PURE__*/_jsxs(View, {
        style: styles.content,
        children: [/*#__PURE__*/_jsxs(View, {
          style: styles.topRow,
          children: [/*#__PURE__*/_jsx(Text, {
            style: styles.code,
            children: offerCode
          }), /*#__PURE__*/_jsx(Text, {
            style: {
              color: isSelected ? '#E84142' : selectedColor,
              fontFamily: checkoutDetails.fontFamily.bold
            },
            children: isSelected ? 'REMOVE' : 'APPLY'
          })]
        }), /*#__PURE__*/_jsx(View, {
          style: styles.divider
        }), /*#__PURE__*/_jsxs(Text, {
          style: [styles.info, {
            fontFamily: checkoutDetails.fontFamily.medium
          }],
          children: ["Minimum order amount ", minimumOrderAmount]
        }), expiryDate !== '' && /*#__PURE__*/_jsxs(Text, {
          style: [styles.info, {
            fontFamily: checkoutDetails.fontFamily.medium
          }],
          children: ["Offer valid till ", expiryDate]
        }), /*#__PURE__*/_jsx(Text, {
          style: [styles.info, {
            fontFamily: checkoutDetails.fontFamily.medium
          }],
          children: applicable ? `Applicable on ${applicable}` : 'Applicable on all transactions'
        }), /*#__PURE__*/_jsx(TouchableOpacity, {
          onPress: () => setShowMore(!showMore),
          children: /*#__PURE__*/_jsx(Text, {
            style: [styles.more, {
              fontFamily: checkoutDetails.fontFamily.semiBold
            }],
            children: showMore ? '- LESS' : '+ MORE'
          })
        }), showMore && /*#__PURE__*/_jsx(RenderHTML, {
          contentWidth: 300,
          source: {
            html: terms
          }
        })]
      })]
    })
  });
};
export default OfferCard;
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 4,
    overflow: 'hidden'
  },
  row: {
    flexDirection: 'row'
  },
  sideStrip: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  verticalText: {
    color: '#FFF',
    fontWeight: 'bold',
    transform: [{
      rotate: '-90deg'
    }],
    width: 120,
    textAlign: 'center'
  },
  content: {
    flex: 1,
    padding: 16
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  code: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#333'
  },
  divider: {
    height: 1,
    backgroundColor: '#DDD',
    marginVertical: 12
  },
  info: {
    fontSize: 13,
    color: '#616161',
    marginBottom: 4
  },
  more: {
    fontWeight: 'bold',
    color: '#616161',
    marginTop: 6
  }
});
//# sourceMappingURL=offerCard.js.map