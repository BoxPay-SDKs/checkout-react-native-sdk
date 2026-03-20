"use strict";

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { checkoutDetailsHandler } from "../sharedContext/checkoutDetailsHandler.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const CheckBoxContainer = ({
  text,
  isCheckBoxSelected,
  onCheckBoxClicked
}) => {
  const {
    checkoutDetails
  } = checkoutDetailsHandler;
  return /*#__PURE__*/_jsxs(View, {
    style: styles.checkBoxContainer,
    children: [/*#__PURE__*/_jsx(TouchableOpacity, {
      onPress: () => onCheckBoxClicked(),
      children: /*#__PURE__*/_jsx(View, {
        style: [styles.checkboxBox, {
          borderColor: checkoutDetails.buttonColor
        }, isCheckBoxSelected && {
          backgroundColor: checkoutDetails.buttonColor
        }],
        children: isCheckBoxSelected && /*#__PURE__*/_jsx(Text, {
          style: styles.checkmark,
          children: "\u2713"
        })
      })
    }), /*#__PURE__*/_jsx(Text, {
      style: [styles.checkBoxText, {
        fontFamily: checkoutDetails.fontFamily.regular
      }],
      children: text
    })]
  });
};
const styles = StyleSheet.create({
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
export default CheckBoxContainer;
//# sourceMappingURL=checkboxContainer.js.map