"use strict";

import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import Modal from 'react-native-modal';
import { checkoutDetailsHandler } from "../sharedContext/checkoutDetailsHandler.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const KnowMoreBottomSheet = ({
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
          children: "RBI Guidelines"
        }), /*#__PURE__*/_jsx(Text, {
          style: [styles.subHeadingText, {
            fontFamily: checkoutDetails.fontFamily.regular
          }],
          children: "As per the new RBI guidelines, we can no longer store your card information with us."
        }), /*#__PURE__*/_jsxs(View, {
          style: styles.container,
          children: [/*#__PURE__*/_jsx(Image, {
            source: require('../../assets/images/ic_card_lock.png'),
            style: styles.imageStyle
          }), /*#__PURE__*/_jsx(Text, {
            style: [styles.subHeadingText, {
              fontFamily: checkoutDetails.fontFamily.regular
            }],
            children: "Your bank/card network will securely save your card information via tokenization if you consent for the same."
          })]
        }), /*#__PURE__*/_jsxs(View, {
          style: styles.container,
          children: [/*#__PURE__*/_jsx(Image, {
            source: require('../../assets/images/ic_card_add.png'),
            style: styles.imageStyle
          }), /*#__PURE__*/_jsx(Text, {
            style: [styles.subHeadingText, {
              fontFamily: checkoutDetails.fontFamily.regular
            }],
            children: "In case you choose to not tokenize, you\u2019ll have to enter card details every time you pay."
          })]
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
export default KnowMoreBottomSheet;
const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0
  },
  sheet: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 28,
    backgroundColor: '#1CA672'
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    paddingVertical: 12
  },
  headingText: {
    fontSize: 20,
    color: '#2D2B32'
  },
  subHeadingText: {
    fontSize: 14,
    color: '#2D2B32',
    paddingTop: 12
  },
  imageStyle: {
    width: 28,
    height: 28,
    alignSelf: 'flex-start'
  },
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 28,
    marginEnd: 16
  }
});
//# sourceMappingURL=knowMoreBottomSheet.js.map