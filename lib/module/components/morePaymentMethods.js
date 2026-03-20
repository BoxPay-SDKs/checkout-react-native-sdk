"use strict";

import { View, Text, Pressable } from 'react-native';
import { checkoutDetailsHandler } from "../sharedContext/checkoutDetailsHandler.js";
import MorePaymentContainer from "./morePaymentContainer.js";
import { useNavigation } from "@react-navigation/native";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const MorePaymentMethods = ({
  savedCards,
  stopTimer,
  setSelectedPaymentMethod,
  surchargeDetails
}) => {
  const navigation = useNavigation();
  const {
    checkoutDetails
  } = checkoutDetailsHandler;
  const {
    isCardMethodEnabled: isCardVisible,
    isWalletMethodEnabled: isWalletVisible,
    isNetBankingMethodEnabled: isNetBankingVisible,
    isBnplMethodEnabled: isBNPLVisible,
    isEmiMethodEnabled: isEmiVisible,
    isUpiCollectMethodEnabled: isUpiCollectVisible,
    isUpiIntentMethodEnabled: isUpiIntentVisibile
  } = checkoutDetails;
  return /*#__PURE__*/_jsx(View, {
    children: (isCardVisible || isWalletVisible || isNetBankingVisible || isBNPLVisible || isEmiVisible) && /*#__PURE__*/_jsxs(View, {
      children: [isUpiCollectVisible || isUpiIntentVisibile ? /*#__PURE__*/_jsx(Text, {
        style: {
          marginStart: 16,
          marginTop: 12,
          fontSize: 14,
          color: '#020815B5',
          fontFamily: checkoutDetails.fontFamily.semiBold
        },
        children: "More Payment Options"
      }) : /*#__PURE__*/_jsx(Text, {
        style: {
          marginStart: 16,
          marginTop: 12,
          fontSize: 14,
          color: '#020815B5',
          fontFamily: checkoutDetails.fontFamily.semiBold
        },
        children: "Payment Options"
      }), /*#__PURE__*/_jsxs(View, {
        style: {
          flex: 1,
          backgroundColor: 'white',
          marginVertical: 8,
          marginHorizontal: 16,
          borderRadius: 12,
          flexDirection: 'column',
          borderColor: '#F1F1F1',
          borderWidth: 1,
          paddingBottom: 16
        },
        children: [isCardVisible && savedCards.length == 0 && /*#__PURE__*/_jsxs(Pressable, {
          style: {
            paddingHorizontal: 16,
            paddingTop: 16
          },
          onPress: () => {
            stopTimer();
            setSelectedPaymentMethod("card");
            navigation.navigate("CardScreen", {});
          },
          children: [/*#__PURE__*/_jsx(MorePaymentContainer, {
            title: "Cards",
            image: require('../../assets/images/ic_card.png'),
            surchargeFee: surchargeDetails.find(item => item.applicable?.toLowerCase() === 'card')?.amount?.toString() ?? "",
            currencySymbol: checkoutDetails.currencySymbol
          }), (isWalletVisible || isNetBankingVisible || isEmiVisible || isBNPLVisible) && /*#__PURE__*/_jsx(View, {
            style: {
              flexDirection: 'row',
              height: 1,
              backgroundColor: '#ECECED',
              marginTop: 16,
              marginHorizontal: -16
            }
          })]
        }), isWalletVisible && /*#__PURE__*/_jsxs(Pressable, {
          style: {
            paddingHorizontal: 16,
            paddingTop: 16
          },
          onPress: () => {
            stopTimer();
            setSelectedPaymentMethod("wallet");
            navigation.navigate("WalletScreen", {});
          },
          children: [/*#__PURE__*/_jsx(MorePaymentContainer, {
            title: "Wallet",
            image: require('../../assets/images/ic_wallet.png'),
            surchargeFee: surchargeDetails.find(item => item.applicable?.toLowerCase() === 'wallet')?.amount?.toString() ?? "",
            currencySymbol: checkoutDetails.currencySymbol
          }), (isNetBankingVisible || isEmiVisible || isBNPLVisible) && /*#__PURE__*/_jsx(View, {
            style: {
              flexDirection: 'row',
              height: 1,
              backgroundColor: '#ECECED',
              marginTop: 16,
              marginHorizontal: -16
            }
          })]
        }), isNetBankingVisible && /*#__PURE__*/_jsxs(Pressable, {
          style: {
            paddingHorizontal: 16,
            paddingTop: 16
          },
          onPress: () => {
            stopTimer();
            setSelectedPaymentMethod("netbanking");
            navigation.navigate("NetBankingScreen", {});
          },
          children: [/*#__PURE__*/_jsx(MorePaymentContainer, {
            title: "Netbanking",
            image: require('../../assets/images/ic_netbanking.png'),
            surchargeFee: surchargeDetails.find(item => item.applicable?.toLowerCase() === 'netbanking')?.amount?.toString() ?? "",
            currencySymbol: checkoutDetails.currencySymbol
          }), (isEmiVisible || isBNPLVisible) && /*#__PURE__*/_jsx(View, {
            style: {
              flexDirection: 'row',
              height: 1,
              backgroundColor: '#ECECED',
              marginTop: 16,
              marginHorizontal: -16
            }
          })]
        }), isEmiVisible && /*#__PURE__*/_jsxs(Pressable, {
          style: {
            paddingHorizontal: 16,
            paddingTop: 16
          },
          onPress: () => {
            stopTimer();
            setSelectedPaymentMethod("emi");
            navigation.navigate("EmiScreen", {});
          },
          children: [/*#__PURE__*/_jsx(MorePaymentContainer, {
            title: "EMI",
            image: require('../../assets/images/ic_emi.png'),
            surchargeFee: surchargeDetails.find(item => item.applicable?.toLowerCase() === 'emi')?.amount?.toString() ?? "",
            currencySymbol: checkoutDetails.currencySymbol
          }), isBNPLVisible && /*#__PURE__*/_jsx(View, {
            style: {
              flexDirection: 'row',
              height: 1,
              backgroundColor: '#ECECED',
              marginTop: 16,
              marginHorizontal: -16
            }
          })]
        }), isBNPLVisible && /*#__PURE__*/_jsx(Pressable, {
          style: {
            paddingHorizontal: 16,
            paddingTop: 16
          },
          onPress: () => {
            stopTimer();
            setSelectedPaymentMethod("buynowpaylater");
            navigation.navigate("BNPLScreen", {});
          },
          children: /*#__PURE__*/_jsx(MorePaymentContainer, {
            title: "Pay Later",
            image: require('../../assets/images/ic_bnpl.png'),
            surchargeFee: surchargeDetails.find(item => item.applicable?.toLowerCase() === 'buynowpaylater')?.amount?.toString() ?? "",
            currencySymbol: checkoutDetails.currencySymbol
          })
        })]
      })]
    })
  });
};
export default MorePaymentMethods;
//# sourceMappingURL=morePaymentMethods.js.map