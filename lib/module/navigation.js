"use strict";

// src/navigation/CheckoutNavigator.tsx
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CardScreen from "./screens/cardScreen.js";
import EmiScreen from "./screens/emiScreen.js";
import UpiTimerScreen from "./screens/upiTimerScreen.js";
import AddressScreen from "./screens/addressScreen.js";
import BNPLScreen from "./screens/bnplScreen.js";
import NetBankingScreen from "./screens/netBankingScreen.js";
import SavedAddressScreen from "./screens/savedAddressScreen.js";
import WalletScreen from "./screens/walletScreen.js";
import MainScreen from "./screens/mainScreen.js";
import { NavigationIndependentTree } from "@react-navigation/native";
import InstantOfferScreen from "./screens/instantOfferList.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const Stack = createNativeStackNavigator();
const CheckoutNavigator = ({
  token,
  configurationOptions = null,
  onPaymentResult,
  shopperToken = null,
  uiConfiguration = null
}) => {
  return /*#__PURE__*/_jsxs(Stack.Navigator, {
    screenOptions: {
      headerShown: false
    },
    children: [/*#__PURE__*/_jsx(Stack.Screen, {
      name: "MainScreen",
      component: MainScreen,
      initialParams: {
        token,
        configurationOptions,
        onPaymentResult,
        shopperToken,
        uiConfiguration
      }
    }), /*#__PURE__*/_jsx(Stack.Screen, {
      name: "CardScreen",
      component: CardScreen
    }), /*#__PURE__*/_jsx(Stack.Screen, {
      name: "EmiScreen",
      component: EmiScreen
    }), /*#__PURE__*/_jsx(Stack.Screen, {
      name: "UpiTimerScreen",
      component: UpiTimerScreen
    }), /*#__PURE__*/_jsx(Stack.Screen, {
      name: "AddressScreen",
      component: AddressScreen
    }), /*#__PURE__*/_jsx(Stack.Screen, {
      name: "BNPLScreen",
      component: BNPLScreen
    }), /*#__PURE__*/_jsx(Stack.Screen, {
      name: "NetBankingScreen",
      component: NetBankingScreen
    }), /*#__PURE__*/_jsx(Stack.Screen, {
      name: "WalletScreen",
      component: WalletScreen
    }), /*#__PURE__*/_jsx(Stack.Screen, {
      name: "SavedAddressScreen",
      component: SavedAddressScreen
    }), /*#__PURE__*/_jsx(Stack.Screen, {
      name: "InstantOfferScreen",
      component: InstantOfferScreen
    })]
  });
};
const CheckoutContainer = ({
  token,
  configurationOptions = null,
  onPaymentResult,
  shopperToken = null,
  uiConfiguration = null
}) => {
  return /*#__PURE__*/_jsx(NavigationIndependentTree, {
    children: /*#__PURE__*/_jsx(CheckoutNavigator, {
      token: token,
      configurationOptions: configurationOptions,
      onPaymentResult: onPaymentResult,
      shopperToken: shopperToken,
      uiConfiguration: uiConfiguration
    })
  });
};
export default CheckoutContainer;
//# sourceMappingURL=navigation.js.map