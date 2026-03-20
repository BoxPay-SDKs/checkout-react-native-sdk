"use strict";

import { View, Text, Image } from 'react-native';
import { useState } from 'react';
import Header from "../components/header.js";
import { checkoutDetailsHandler } from "../sharedContext/checkoutDetailsHandler.js";
import { SvgUri } from 'react-native-svg';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import SelectTenureCard from "../components/selectTenureCard.js";
import styles from "../styles/screens/selectTenureScreenStyles.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const SelectTenureScreen = ({
  bankName,
  cardType,
  emiModel,
  bankUrl,
  onbackPress,
  onProceedForward
}) => {
  const {
    checkoutDetails
  } = checkoutDetailsHandler;
  const [error, setImageError] = useState(false);
  const [load, setLoad] = useState(true);
  const [selectedEmi, setSelectedEmi] = useState('');
  const [selectedDuration, setSelectedDuration] = useState(0);
  return /*#__PURE__*/_jsxs(View, {
    style: styles.screenView,
    children: [/*#__PURE__*/_jsx(Header, {
      onBackPress: onbackPress,
      showDesc: true,
      showSecure: false,
      text: "Select Tenure"
    }), /*#__PURE__*/_jsxs(View, {
      style: styles.outerContainer,
      children: [/*#__PURE__*/_jsxs(View, {
        style: styles.container,
        children: [/*#__PURE__*/_jsxs(View, {
          style: styles.insideContainer,
          children: [load && !error && /*#__PURE__*/_jsx(ShimmerPlaceHolder, {
            visible: false // Keep shimmer until loading is done
            ,
            style: styles.shimmer
          }), !error ? /*#__PURE__*/_jsx(SvgUri, {
            uri: bankUrl,
            width: 100 // Keep original size
            ,
            height: 100,
            style: {
              transform: [{
                scale: 0.4
              }]
            },
            onLoad: () => setLoad(false),
            onError: () => {
              setImageError(true);
              setLoad(false);
            }
          }) : /*#__PURE__*/_jsx(Image, {
            source: require('../../assets/images/ic_netbanking_semi_bold.png'),
            style: {
              transform: [{
                scale: 0.4
              }]
            }
          })]
        }), /*#__PURE__*/_jsxs(Text, {
          style: [styles.text, {
            fontFamily: checkoutDetails.fontFamily.semiBold
          }],
          children: [bankName, " | ", cardType, " EMI"]
        })]
      }), /*#__PURE__*/_jsx(View, {
        style: styles.insideContainerDivider
      }), emiModel.map((item, index) => /*#__PURE__*/_jsxs(View, {
        children: [/*#__PURE__*/_jsx(SelectTenureCard, {
          duration: item.duration,
          monthlyEmiAmount: item.amount,
          interest: item.percent || 0,
          discount: item.discount || '',
          totalAmount: item.totalAmount,
          debiitedAmount: item.netAmount || '',
          isLowCostOffer: item.lowCostApplied,
          isNoCostOffer: item.noCostApplied,
          interestCharged: item.interestCharged || '',
          onProceedForward: () => {
            onProceedForward(item.duration, bankName, bankUrl, item.code || '', item.amount, item.percent);
          },
          isSelected: selectedEmi === item.amount && selectedDuration === item.duration,
          brandColor: checkoutDetails.buttonColor,
          onRadioClick: (duration, amount) => {
            setSelectedDuration(duration);
            setSelectedEmi(amount);
          },
          currencySymbol: checkoutDetails.currencySymbol,
          processingFee: item.processingFee
        }), index !== emiModel.length - 1 && /*#__PURE__*/_jsx(View, {
          style: styles.insideContainerDivider
        })]
      }, index))]
    })]
  });
};
export default SelectTenureScreen;
//# sourceMappingURL=selectTenureScreen.js.map