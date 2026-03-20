"use strict";

import { View, Text, Image } from 'react-native';
import { checkoutDetailsHandler } from "../sharedContext/checkoutDetailsHandler.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const MorePaymentContainer = ({
  title,
  image,
  surchargeFee,
  currencySymbol
}) => {
  const {
    checkoutDetails
  } = checkoutDetailsHandler;
  return /*#__PURE__*/_jsxs(View, {
    style: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: 'white',
      alignItems: 'center'
    },
    children: [/*#__PURE__*/_jsx(Image, {
      source: image,
      style: [{
        width: 32,
        height: 32
      }, title === 'EMI' && {
        transform: [{
          scaleX: -1
        }]
      }]
    }), /*#__PURE__*/_jsxs(View, {
      style: {
        flexDirection: 'column',
        marginLeft: 12
      },
      children: [/*#__PURE__*/_jsx(Text, {
        style: {
          fontSize: 14,
          fontFamily: checkoutDetails.fontFamily.medium
        },
        children: title
      }), surchargeFee != "" && /*#__PURE__*/_jsxs(Text, {
        style: {
          fontSize: 14,
          fontFamily: checkoutDetails.fontFamily.medium,
          color: '#32CD32'
        },
        children: [currencySymbol, surchargeFee, " extra applied as surcharge"]
      })]
    }), /*#__PURE__*/_jsx(Image, {
      source: require('../../assets/images/chervon-down.png'),
      style: {
        alignSelf: 'center',
        height: 6,
        width: 14,
        marginLeft: 'auto',
        transform: [{
          rotate: '270deg'
        }]
      }
    })]
  });
};
export default MorePaymentContainer;
//# sourceMappingURL=morePaymentContainer.js.map