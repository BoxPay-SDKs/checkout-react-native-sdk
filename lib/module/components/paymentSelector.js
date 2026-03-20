"use strict";

import { View, Text, Pressable, StyleSheet } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { checkoutDetailsHandler } from "../sharedContext/checkoutDetailsHandler.js";
import ImageLoader from "./imageLoader.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const PaymentSelectorView = ({
  providerList,
  onProceedForward,
  isLastUsed,
  errorImage,
  onClickRadio
}) => {
  const {
    checkoutDetails
  } = checkoutDetailsHandler;
  return /*#__PURE__*/_jsx(View, {
    children: providerList.map((provider, index) => /*#__PURE__*/_jsxs(View, {
      children: [/*#__PURE__*/_jsx(PaymentSelector, {
        id: provider.id,
        title: provider.displayValue,
        image: provider.iconUrl,
        errorImage: errorImage,
        isSelected: provider.isSelected,
        instrumentTypeValue: provider.instrumentTypeValue,
        isLastUsed: isLastUsed && provider.isLastUsed,
        onPress: onClickRadio,
        onProceedForward: (displayValue, instrumentValue) => {
          onProceedForward(displayValue, instrumentValue, provider.type);
        },
        brandColor: checkoutDetails.buttonColor || '#1CA672',
        currencySymbol: checkoutDetails.currencySymbol || '₹',
        amount: checkoutDetails.amount
      }), index !== providerList.length - 1 && /*#__PURE__*/_jsx(View, {
        style: {
          flexDirection: 'row',
          height: 1,
          backgroundColor: '#ECECED'
        }
      })]
    }, provider.id))
  });
};
const PaymentSelector = ({
  id,
  title,
  image,
  errorImage,
  isSelected,
  instrumentTypeValue,
  isLastUsed,
  onPress,
  onProceedForward,
  brandColor,
  currencySymbol,
  amount
}) => {
  const {
    checkoutDetails
  } = checkoutDetailsHandler;
  return /*#__PURE__*/_jsxs(View, {
    style: {
      paddingVertical: 16,
      paddingHorizontal: 12,
      backgroundColor: isSelected ? '#EDF8F4' : 'white',
      borderRadius: isSelected ? 0 : 12
    },
    children: [/*#__PURE__*/_jsxs(View, {
      style: {
        flexDirection: 'row',
        alignItems: 'center'
      },
      children: [/*#__PURE__*/_jsx(ImageLoader, {
        image: image,
        errorImage: errorImage
      }), /*#__PURE__*/_jsxs(View, {
        style: {
          paddingStart: 12,
          flex: 1
        },
        children: [/*#__PURE__*/_jsx(Text, {
          style: {
            fontFamily: checkoutDetails.fontFamily.semiBold,
            fontSize: 14,
            color: '#4F4D55'
          },
          onPress: () => onPress(id),
          numberOfLines: 1,
          ellipsizeMode: "tail",
          children: title
        }), isLastUsed && /*#__PURE__*/_jsx(View, {
          style: styles.tag,
          children: /*#__PURE__*/_jsx(Text, {
            style: [styles.tagText, {
              fontFamily: checkoutDetails.fontFamily.medium
            }],
            children: "Last Used"
          })
        })]
      }), /*#__PURE__*/_jsx(RadioButton, {
        value: id,
        status: isSelected ? 'checked' : 'unchecked',
        onPress: () => onPress(id),
        color: brandColor,
        uncheckedColor: '#01010273'
      })]
    }), isSelected && /*#__PURE__*/_jsx(Pressable, {
      style: [styles.buttonContainer, {
        backgroundColor: brandColor,
        borderRadius: checkoutDetails.ctaBorderRadius
      }],
      onPress: () => {
        onProceedForward(title, instrumentTypeValue);
      },
      children: /*#__PURE__*/_jsxs(Text, {
        style: [styles.buttonText, {
          fontFamily: checkoutDetails.fontFamily.semiBold
        }],
        children: ["Proceed to Pay", ' ', /*#__PURE__*/_jsxs(Text, {
          style: {
            fontFamily: 'Inter-SemiBold',
            fontSize: 16,
            color: 'white'
          },
          children: [' ', currencySymbol]
        }), amount]
      })
    })]
  });
};
export default PaymentSelectorView;
const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    paddingVertical: 12
  },
  buttonText: {
    color: 'white',
    fontSize: 16
  },
  tag: {
    borderColor: '#1CA672',
    borderRadius: 6,
    backgroundColor: '#1CA67214',
    borderWidth: 0.5,
    paddingHorizontal: 4,
    marginTop: 4,
    alignSelf: 'flex-start'
  },
  tagText: {
    fontSize: 10,
    color: '#1CA672'
  }
});
//# sourceMappingURL=paymentSelector.js.map