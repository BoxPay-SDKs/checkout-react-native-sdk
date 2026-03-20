"use strict";

import { View, Text, Pressable, Image } from 'react-native';
import { checkoutDetailsHandler } from "../sharedContext/checkoutDetailsHandler.js";
import { userDataHandler } from "../sharedContext/userdataHandler.js";
import styles from "../styles/components/addressCardStyles.js";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
const AddressComponent = ({
  address,
  navigateToAddressScreen
}) => {
  const {
    checkoutDetails
  } = checkoutDetailsHandler;
  const {
    userData
  } = userDataHandler;
  return /*#__PURE__*/_jsxs(View, {
    children: [address != '' && checkoutDetails.isShippingAddressEnabled && /*#__PURE__*/_jsxs(View, {
      children: [/*#__PURE__*/_jsx(Text, {
        style: [styles.titleText, {
          fontFamily: checkoutDetails.fontFamily.semiBold
        }],
        children: "Address"
      }), /*#__PURE__*/_jsxs(Pressable, {
        style: [styles.pressableContainer, {
          borderRadius: checkoutDetails.ctaBorderRadius
        }],
        onPress: () => {
          if (checkoutDetails.isShippingAddressEditable) {
            navigateToAddressScreen();
          }
        },
        children: [/*#__PURE__*/_jsx(Image, {
          source: require('../../assets/images/ic_location.png'),
          style: styles.imageStyle
        }), /*#__PURE__*/_jsxs(View, {
          style: styles.insideContainer,
          children: [/*#__PURE__*/_jsxs(Text, {
            style: [styles.insideContainerNormalText, {
              fontFamily: checkoutDetails.fontFamily.regular
            }],
            children: ["Deliver at", ' ', /*#__PURE__*/_jsx(Text, {
              style: [styles.insideContainerHighlighedText, {
                fontFamily: checkoutDetails.fontFamily.semiBold
              }],
              children: userData.labelType === 'Other' ? userData.labelName : userData.labelType
            })]
          }), /*#__PURE__*/_jsx(Text, {
            numberOfLines: 1,
            ellipsizeMode: "tail",
            style: [styles.insideContainerDesc, {
              fontFamily: checkoutDetails.fontFamily.semiBold
            }],
            children: address
          })]
        }), checkoutDetails.isShippingAddressEditable && /*#__PURE__*/_jsx(Image, {
          source: require('../../assets/images/chervon-down.png'),
          style: {
            alignSelf: 'center',
            height: 6,
            width: 14,
            marginTop: 4,
            marginRight: 10,
            transform: [{
              rotate: '270deg'
            }]
          }
        })]
      })]
    }), address == '' && checkoutDetails.isShippingAddressEnabled && /*#__PURE__*/_jsxs(View, {
      children: [/*#__PURE__*/_jsx(Text, {
        style: [styles.titleText, {
          fontFamily: checkoutDetails.fontFamily.semiBold
        }],
        children: "Address"
      }), /*#__PURE__*/_jsxs(Pressable, {
        style: [styles.pressableContainer, {
          borderRadius: checkoutDetails.ctaBorderRadius
        }],
        onPress: () => {
          if (checkoutDetails.isShippingAddressEditable) {
            navigateToAddressScreen();
          }
        },
        children: [/*#__PURE__*/_jsx(Image, {
          source: require('../../assets/images/add_icon.png'),
          style: [styles.imageStyle, {
            tintColor: checkoutDetails.buttonColor
          }]
        }), /*#__PURE__*/_jsx(Text, {
          numberOfLines: 1,
          ellipsizeMode: "tail",
          style: [styles.insideContainerClickableText, {
            color: checkoutDetails.buttonColor,
            fontFamily: checkoutDetails.fontFamily.semiBold
          }],
          children: "Add new address"
        }), checkoutDetails.isShippingAddressEditable && /*#__PURE__*/_jsx(Image, {
          source: require('../../assets/images/chervon-down.png'),
          style: {
            alignSelf: 'center',
            height: 6,
            width: 14,
            marginTop: 14,
            marginRight: 10,
            marginLeft: 'auto',
            transform: [{
              rotate: '270deg'
            }]
          }
        })]
      })]
    }), (checkoutDetails.isFullNameEnabled || checkoutDetails.isPhoneEnabled || checkoutDetails.isEmailEnabled) && !checkoutDetails.isShippingAddressEnabled && /*#__PURE__*/_jsxs(View, {
      children: [/*#__PURE__*/_jsx(Text, {
        style: [styles.titleText, {
          fontFamily: checkoutDetails.fontFamily.semiBold
        }],
        children: "Personal Details"
      }), /*#__PURE__*/_jsxs(Pressable, {
        style: [styles.pressableContainer, {
          borderRadius: checkoutDetails.ctaBorderRadius
        }],
        onPress: () => {
          if (checkoutDetails.isFullNameEditable || checkoutDetails.isPhoneEditable || checkoutDetails.isEmailEditable) {
            navigateToAddressScreen();
          }
        },
        children: [(userData.firstName != '' || userData.completePhoneNumber != '' || userData.email != '') && /*#__PURE__*/_jsxs(_Fragment, {
          children: [/*#__PURE__*/_jsx(Image, {
            source: require('../../assets/images/ic_user.png'),
            style: styles.imageStyle
          }), /*#__PURE__*/_jsxs(View, {
            style: styles.insideContainer,
            children: [/*#__PURE__*/_jsxs(Text, {
              style: [styles.insideContainerHighlighedText, {
                fontFamily: checkoutDetails.fontFamily.semiBold
              }],
              children: [userData.firstName, " ", userData.lastName, " | ", ' ', /*#__PURE__*/_jsx(Text, {
                style: [styles.insideContainerHighlighedText, {
                  fontFamily: checkoutDetails.fontFamily.semiBold
                }],
                children: userData.completePhoneNumber
              })]
            }), /*#__PURE__*/_jsx(Text, {
              numberOfLines: 1,
              ellipsizeMode: "tail",
              style: [styles.insideContainerDesc, {
                fontFamily: checkoutDetails.fontFamily.semiBold
              }],
              children: userData.email
            })]
          })]
        }), (userData.firstName == '' || userData.completePhoneNumber == '' || userData.email == '') && /*#__PURE__*/_jsxs(_Fragment, {
          children: [/*#__PURE__*/_jsx(Image, {
            source: require('../../assets/images/add_icon.png'),
            style: styles.imageStyle
          }), /*#__PURE__*/_jsx(Text, {
            numberOfLines: 1,
            ellipsizeMode: "tail",
            style: [styles.insideContainerClickableText, {
              color: checkoutDetails.buttonColor,
              fontFamily: checkoutDetails.fontFamily.semiBold
            }],
            children: "Add personal details"
          })]
        }), (checkoutDetails.isFullNameEditable || checkoutDetails.isPhoneEditable || checkoutDetails.isEmailEditable) && /*#__PURE__*/_jsx(Image, {
          source: require('../../assets/images/chervon-down.png'),
          style: {
            alignSelf: 'center',
            height: 6,
            width: 14,
            marginTop: 14,
            marginRight: 4,
            marginLeft: 'auto',
            transform: [{
              rotate: '270deg'
            }]
          }
        })]
      })]
    })]
  });
};
export default AddressComponent;
//# sourceMappingURL=addressCard.js.map