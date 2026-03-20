"use strict";

import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { checkoutDetailsHandler } from "../sharedContext/checkoutDetailsHandler.js";
import ImageLoader from "./imageLoader.js";
import { useState } from 'react';
import CheckBoxContainer from "./checkboxContainer.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const SavedCardComponentView = ({
  savedCards,
  onProceedForward,
  errorImage,
  onClickAddCard,
  onClickRadio
}) => {
  const {
    checkoutDetails
  } = checkoutDetailsHandler;
  return /*#__PURE__*/_jsxs(View, {
    style: {
      paddingBottom: 12
    },
    children: [savedCards.map(card => /*#__PURE__*/_jsxs(View, {
      children: [/*#__PURE__*/_jsx(SavedCardRow, {
        id: card.id,
        nickName: card.displayName,
        cardNumber: card.displayValue,
        image: card.iconUrl,
        errorImage: errorImage,
        isSelected: card.isSelected,
        instrumentTypeValue: card.instrumentTypeValue,
        onPress: onClickRadio,
        onProceedForward: onProceedForward,
        brandColor: checkoutDetails.buttonColor || '#1CA672',
        currencySymbol: checkoutDetails.currencySymbol || '₹',
        amount: checkoutDetails.amount
      }), /*#__PURE__*/_jsx(View, {
        style: {
          flexDirection: 'row',
          height: 1,
          backgroundColor: '#ECECED'
        }
      })]
    }, card.id)), /*#__PURE__*/_jsxs(Pressable, {
      style: {
        flexDirection: 'row',
        alignItems: 'center',
        // Ensures vertical alignment of items
        paddingTop: 16,
        paddingStart: 16,
        marginEnd: 16,
        justifyContent: 'space-between' // Spaces items between the start and end
      },
      onPress: () => onClickAddCard(),
      children: [/*#__PURE__*/_jsxs(View, {
        style: {
          flexDirection: 'row',
          alignItems: 'center'
        },
        children: [/*#__PURE__*/_jsx(Image, {
          source: require('../../assets/images/add_icon.png'),
          style: {
            height: 14,
            width: 14,
            tintColor: checkoutDetails.buttonColor
          }
        }), /*#__PURE__*/_jsx(Text, {
          style: {
            fontSize: 14,
            color: checkoutDetails.buttonColor,
            paddingStart: 10,
            paddingTop: 4,
            fontFamily: checkoutDetails.fontFamily.semiBold
          },
          children: "Add new Card"
        })]
      }), /*#__PURE__*/_jsx(Image, {
        source: require('../../assets/images/chervon-down.png'),
        style: {
          alignSelf: 'center',
          height: 6,
          width: 14,
          transform: [{
            rotate: '270deg'
          }]
        }
      })]
    })]
  });
};
const SavedCardRow = ({
  id,
  nickName,
  cardNumber,
  image,
  errorImage,
  isSelected,
  instrumentTypeValue,
  onPress,
  onProceedForward,
  brandColor,
  currencySymbol,
  amount
}) => {
  const {
    checkoutDetails
  } = checkoutDetailsHandler;
  const [isSICheckBoxClicked, setIsSICheckBoxClicked] = useState(false);
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
        children: [nickName != "" && /*#__PURE__*/_jsx(Text, {
          style: {
            fontFamily: checkoutDetails.fontFamily.semiBold,
            fontSize: 12,
            color: '#4F4D55'
          },
          onPress: () => onPress(id),
          numberOfLines: 1,
          ellipsizeMode: "tail",
          children: nickName
        }), /*#__PURE__*/_jsx(Text, {
          style: {
            fontFamily: checkoutDetails.fontFamily.regular,
            fontSize: 12,
            color: '#4F4D55'
          },
          onPress: () => onPress(id),
          numberOfLines: 1,
          ellipsizeMode: "tail",
          children: cardNumber
        })]
      }), /*#__PURE__*/_jsx(RadioButton, {
        value: id,
        status: isSelected ? 'checked' : 'unchecked',
        onPress: () => {
          setIsSICheckBoxClicked(false);
          onPress(id);
        },
        color: brandColor,
        uncheckedColor: '#01010273'
      })]
    }), checkoutDetails.isSICheckboxVisible && isSelected && /*#__PURE__*/_jsx(CheckBoxContainer, {
      text: "Set up Standing Instructions (SI) for this payment.",
      isCheckBoxSelected: isSICheckBoxClicked,
      onCheckBoxClicked: () => {
        setIsSICheckBoxClicked(!isSICheckBoxClicked);
      }
    }), isSelected && /*#__PURE__*/_jsx(Pressable, {
      style: [styles.buttonContainer, {
        backgroundColor: brandColor
      }],
      onPress: () => {
        onProceedForward(instrumentTypeValue, isSICheckBoxClicked);
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
export default SavedCardComponentView;
const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    borderRadius: 8,
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
  checkBoxContainer: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center'
  },
  checkBoxText: {
    color: '#2D2B32',
    fontSize: 14,
    marginLeft: 6
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8
  },
  checkmark: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
    lineHeight: 16
  }
});
//# sourceMappingURL=savedCardComponent.js.map