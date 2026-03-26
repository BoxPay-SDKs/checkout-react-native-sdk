// src/navigation/CheckoutNavigator.tsx
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CardScreen from "./screens/cardScreen";
import EmiScreen from "./screens/emiScreen";
import UpiTimerScreen from "./screens/upiTimerScreen";
import AddressScreen from "./screens/addressScreen";
import BNPLScreen from "./screens/bnplScreen";
import NetBankingScreen from "./screens/netBankingScreen";
import SavedAddressScreen from "./screens/savedAddressScreen";
import WalletScreen from "./screens/walletScreen";
import MainScreen from "./screens/mainScreen";
import type { AddressScreenParams, BoxpayCheckoutProps, CardScreenParams, UPITimerScreenParams } from "./interface";
import { ScreenRouteMap } from "./interface";
import { NavigationIndependentTree } from "@react-navigation/native";
import type { InstantOfferProps } from "./screens/instantOfferList";
import InstantOfferScreen from "./screens/instantOfferList";

export type CheckoutStackParamList = {
  MainScreen : BoxpayCheckoutProps,
  CardScreen: CardScreenParams;
  EmiScreen: {};
  UpiTimerScreen: UPITimerScreenParams;
  AddressScreen : AddressScreenParams,
  BNPLScreen : {},
  SavedAddressScreen : {},
  NetBankingScreen : {},
  WalletScreen : {},
  InstantOfferScreen : InstantOfferProps
};

const Stack = createNativeStackNavigator<CheckoutStackParamList>();

const CheckoutNavigator = ({
  token,
  configurationOptions = null,
  onPaymentResult,
  shopperToken = null,
  uiConfiguration = null
}: BoxpayCheckoutProps) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ScreenRouteMap.MAIN} component={MainScreen} initialParams={{
        token,
        configurationOptions,
        onPaymentResult,
        shopperToken,
        uiConfiguration
      }}/>
      <Stack.Screen name={ScreenRouteMap.CARD} component={CardScreen} />
      <Stack.Screen name={ScreenRouteMap.EMI} component={EmiScreen} />
      <Stack.Screen name={ScreenRouteMap.UPITIMER} component={UpiTimerScreen} />
      <Stack.Screen name={ScreenRouteMap.ADDRESS} component={AddressScreen}/>
      <Stack.Screen name={ScreenRouteMap.BNPL} component={BNPLScreen}/>
      <Stack.Screen name={ScreenRouteMap.NETBANKING} component={NetBankingScreen}/>
      <Stack.Screen name={ScreenRouteMap.WALLET} component={WalletScreen}/>
      <Stack.Screen name={ScreenRouteMap.SAVEDADDRESS} component={SavedAddressScreen}/>
      <Stack.Screen name={ScreenRouteMap.INSTANTOFFER} component={InstantOfferScreen}/>
    </Stack.Navigator>
  );
};

const CheckoutContainer = ({
  token,
  configurationOptions = null,
  onPaymentResult,
  shopperToken = null,
  uiConfiguration = null
}: BoxpayCheckoutProps)=> {
  return (
    <NavigationIndependentTree>
      <CheckoutNavigator 
      token={token}
      configurationOptions={configurationOptions}
      onPaymentResult={onPaymentResult}
      shopperToken={shopperToken}
      uiConfiguration={uiConfiguration}
      />
    </NavigationIndependentTree>
  );
};

export default CheckoutContainer;