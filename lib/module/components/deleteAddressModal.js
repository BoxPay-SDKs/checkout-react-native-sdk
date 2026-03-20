"use strict";

import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import Modal from "react-native-modal";
import { checkoutDetailsHandler } from "../sharedContext/checkoutDetailsHandler.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const DeleteAddressModal = ({
  visible,
  onCancel,
  onDelete,
  address
}) => {
  const {
    checkoutDetails
  } = checkoutDetailsHandler;
  return /*#__PURE__*/_jsx(Modal, {
    isVisible: visible,
    animationIn: "zoomIn",
    animationOut: "zoomOut",
    backdropOpacity: 0.5,
    onBackdropPress: onCancel,
    useNativeDriver: true,
    children: /*#__PURE__*/_jsxs(View, {
      style: styles.modalContainer,
      children: [/*#__PURE__*/_jsx(Image, {
        source: require("../../assets/images/ic_trash.png"),
        style: styles.deleteIcon
      }), /*#__PURE__*/_jsx(Text, {
        style: [styles.title, {
          fontFamily: checkoutDetails.fontFamily.semiBold
        }],
        children: "Proceed to delete this address?"
      }), /*#__PURE__*/_jsx(Text, {
        style: [styles.address, {
          fontFamily: checkoutDetails.fontFamily.regular
        }],
        children: address
      }), /*#__PURE__*/_jsxs(View, {
        style: styles.buttonRow,
        children: [/*#__PURE__*/_jsx(TouchableOpacity, {
          style: styles.cancelButton,
          onPress: onCancel,
          children: /*#__PURE__*/_jsx(Text, {
            style: [styles.cancelText, {
              color: checkoutDetails.buttonColor,
              fontFamily: checkoutDetails.fontFamily.regular
            }],
            children: "Cancel"
          })
        }), /*#__PURE__*/_jsx(TouchableOpacity, {
          style: [styles.deleteButton, {
            backgroundColor: checkoutDetails.buttonColor
          }],
          onPress: onDelete,
          children: /*#__PURE__*/_jsx(Text, {
            style: [styles.deleteText, {
              fontFamily: checkoutDetails.fontFamily.semiBold
            }],
            children: "Yes, delete"
          })
        })]
      })]
    })
  });
};
const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    width: "90%",
    alignSelf: "center"
  },
  deleteIcon: {
    width: 28,
    height: 28,
    marginBottom: 10
  },
  title: {
    fontSize: 16,
    color: "#2D2B32",
    marginBottom: 4
  },
  address: {
    fontSize: 12,
    color: "#4F4D55",
    marginBottom: 20
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
    paddingVertical: 12,
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    alignItems: "center"
  },
  deleteButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center"
  },
  cancelText: {
    fontSize: 16
  },
  deleteText: {
    fontSize: 16,
    color: "#fff"
  }
});
export default DeleteAddressModal;
//# sourceMappingURL=deleteAddressModal.js.map