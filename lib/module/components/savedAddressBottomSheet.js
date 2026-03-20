"use strict";

import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import Modal from "react-native-modal";
import { checkoutDetailsHandler } from "../sharedContext/checkoutDetailsHandler.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const SavedAddressBottomSheet = ({
  visible,
  onClose,
  onEdit,
  onSetDefault,
  onDelete,
  label,
  address,
  icon
}) => {
  const {
    checkoutDetails
  } = checkoutDetailsHandler;
  return /*#__PURE__*/_jsx(Modal, {
    isVisible: visible,
    onBackdropPress: onClose,
    style: styles.modal,
    backdropOpacity: 0.4,
    children: /*#__PURE__*/_jsxs(View, {
      style: styles.container,
      children: [/*#__PURE__*/_jsxs(View, {
        children: [/*#__PURE__*/_jsxs(View, {
          style: styles.headerContainer,
          children: [/*#__PURE__*/_jsx(Image, {
            source: icon,
            style: styles.icon
          }), /*#__PURE__*/_jsx(Text, {
            style: [styles.label, {
              fontFamily: checkoutDetails.fontFamily.semiBold
            }],
            children: label
          })]
        }), /*#__PURE__*/_jsx(Text, {
          style: [styles.address, {
            fontFamily: checkoutDetails.fontFamily.regular
          }],
          numberOfLines: 1,
          ellipsizeMode: "tail",
          children: address
        })]
      }), /*#__PURE__*/_jsx(TouchableOpacity, {
        style: styles.option,
        onPress: onEdit,
        children: /*#__PURE__*/_jsx(Text, {
          style: [styles.optionText, {
            fontFamily: checkoutDetails.fontFamily.regular
          }],
          children: "Edit"
        })
      }), /*#__PURE__*/_jsx(TouchableOpacity, {
        style: styles.option,
        onPress: onSetDefault,
        children: /*#__PURE__*/_jsx(Text, {
          style: [styles.optionText, {
            fontFamily: checkoutDetails.fontFamily.regular
          }],
          children: "Set as Default"
        })
      }), /*#__PURE__*/_jsx(TouchableOpacity, {
        style: styles.deleteOption,
        onPress: onDelete,
        children: /*#__PURE__*/_jsx(Text, {
          style: [styles.deleteText, {
            fontFamily: checkoutDetails.fontFamily.regular
          }],
          children: "Delete address"
        })
      })]
    })
  });
};
const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0
  },
  container: {
    backgroundColor: "#F5F6FB",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16
  },
  headerContainer: {
    flexDirection: "row"
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 12,
    tintColor: "#2D2B32"
  },
  label: {
    fontSize: 16,
    color: "#2D2B32"
  },
  address: {
    fontSize: 14,
    color: "#4F4D55",
    marginTop: 4,
    marginBottom: 20
  },
  option: {
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ECECED"
  },
  optionText: {
    fontSize: 16,
    color: "#2D2B32"
  },
  deleteOption: {
    paddingVertical: 14,
    alignItems: "center"
  },
  deleteText: {
    fontSize: 16,
    color: "#FF4D4F"
  }
});
export default SavedAddressBottomSheet;
//# sourceMappingURL=savedAddressBottomSheet.js.map