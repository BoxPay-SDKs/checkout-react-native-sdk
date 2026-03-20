"use strict";

import { View, Text, Pressable, Image, TouchableOpacity } from 'react-native';
import { formatAddress } from "../utility.js";
import styles from "../styles/components/savedAddressCardStyles.js";
import { userDataHandler } from "../sharedContext/userdataHandler.js";
import { checkoutDetailsHandler } from "../sharedContext/checkoutDetailsHandler.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const SavedAddressComponent = ({
  savedAddressList,
  onClickAddress,
  onClickOtherOptions
}) => {
  const {
    userData
  } = userDataHandler;
  return /*#__PURE__*/_jsx(View, {
    style: {
      paddingBottom: 12,
      paddingHorizontal: 16
    },
    children: savedAddressList.map(address => /*#__PURE__*/_jsxs(View, {
      children: [/*#__PURE__*/_jsx(SavedAddressCard, {
        isSelected: address.labelName ? address.labelName === userData.labelName : address.labelType === userData.labelType,
        labelName: address.labelName ? address.labelName : address.labelType,
        labelType: address.labelType,
        address: formatAddress({
          address1: address.address1,
          address2: address.address2,
          city: address.city,
          state: address.state,
          postalCode: address.postalCode,
          countryCode: address.countryCode,
          labelName: address.labelName,
          labelType: address.labelType
        }),
        onClickOtherOptions: () => {
          onClickOtherOptions(address);
        },
        onClickAddress: () => onClickAddress(address),
        phone: address.phoneNumber
      }), /*#__PURE__*/_jsx(View, {
        style: {
          flexDirection: 'row',
          height: 1,
          backgroundColor: '#ECECED'
        }
      })]
    }, address.addressRef))
  });
};
const SavedAddressCard = ({
  isSelected,
  labelType,
  address,
  onClickAddress,
  onClickOtherOptions,
  labelName,
  phone
}) => {
  const {
    checkoutDetails
  } = checkoutDetailsHandler;
  const icons = {
    home: require('../../assets/images/ic_home.png'),
    work: require('../../assets/images/ic_work.png'),
    other: require('../../assets/images/ic_other.png')
  };
  const addressIcon = icons[labelType.toLowerCase()] || icons.other;
  return /*#__PURE__*/_jsxs(Pressable, {
    style: [styles.card, isSelected && styles.cardSelected],
    onPress: onClickAddress,
    children: [/*#__PURE__*/_jsxs(View, {
      style: styles.headerRow,
      children: [/*#__PURE__*/_jsxs(View, {
        style: [styles.labelContainer, {
          marginBottom: 10
        }],
        children: [/*#__PURE__*/_jsx(Image, {
          source: addressIcon,
          style: styles.imageStyle
        }), /*#__PURE__*/_jsx(Text, {
          style: [styles.labelName, {
            fontFamily: checkoutDetails.fontFamily.semiBold
          }],
          children: labelName
        }), isSelected && /*#__PURE__*/_jsx(View, {
          style: styles.selectedTag,
          children: /*#__PURE__*/_jsx(Text, {
            style: [styles.selectedTagText, {
              fontFamily: checkoutDetails.fontFamily.medium
            }],
            children: "CURRENTLY SELECTED"
          })
        })]
      }), /*#__PURE__*/_jsx(TouchableOpacity, {
        onPress: onClickOtherOptions,
        children: /*#__PURE__*/_jsx(Image, {
          source: require('../../assets/images/ic_more.png'),
          style: styles.imageStyle
        })
      })]
    }), /*#__PURE__*/_jsx(Text, {
      style: [styles.addressText, {
        fontFamily: checkoutDetails.fontFamily.regular
      }],
      children: address
    }), /*#__PURE__*/_jsxs(Text, {
      style: [styles.addressText, {
        fontFamily: checkoutDetails.fontFamily.regular
      }],
      children: ["Mobile: ", phone]
    })]
  });
};
export default SavedAddressComponent;
//# sourceMappingURL=savedAddressCard.js.map