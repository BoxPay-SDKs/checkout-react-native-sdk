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
import type { BoxpayCheckoutProps, CardScreenParams, UPITimerScreenParams } from "./interface";
import { NavigationIndependentTree } from "@react-navigation/native";

export type CheckoutStackParamList = {
  MainScreen : BoxpayCheckoutProps,
  CardScreen: CardScreenParams;
  EmiScreen: {};
  UpiTimerScreen: UPITimerScreenParams;
  AddressScreen : {},
  BNPLScreen : {},
  SavedAddressScreen : {},
  NetBankingScreen : {},
  WalletScreen : {},
};

const Stack = createNativeStackNavigator<CheckoutStackParamList>();

const CheckoutNavigator = ({
  token,
  configurationOptions = null,
  onPaymentResult,
  shopperToken = null
}: BoxpayCheckoutProps) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainScreen" component={MainScreen} initialParams={{
        token,
        configurationOptions,
        onPaymentResult,
        shopperToken
      }}/>
      <Stack.Screen name="CardScreen" component={CardScreen} />
      <Stack.Screen name="EmiScreen" component={EmiScreen} />
      <Stack.Screen name="UpiTimerScreen" component={UpiTimerScreen} />
      <Stack.Screen name="AddressScreen" component={AddressScreen}/>
      <Stack.Screen name="BNPLScreen" component={BNPLScreen}/>
      <Stack.Screen name="NetBankingScreen" component={NetBankingScreen}/>
      <Stack.Screen name="WalletScreen" component={WalletScreen}/>
      <Stack.Screen name="SavedAddressScreen" component={SavedAddressScreen}/>
    </Stack.Navigator>
  );
};

const CheckoutContainer = ({
  token,
  configurationOptions = null,
  onPaymentResult,
  shopperToken = null
}: BoxpayCheckoutProps)=> {
  return (
    <NavigationIndependentTree>
      <CheckoutNavigator 
      token={token}
      configurationOptions={configurationOptions}
      onPaymentResult={onPaymentResult}
      shopperToken={shopperToken}
      />
    </NavigationIndependentTree>
  );
};

export default CheckoutContainer;