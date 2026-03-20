import type { AddressScreenParams, BoxpayCheckoutProps, CardScreenParams, UPITimerScreenParams } from "./interface";
import type { InstantOfferProps } from "./screens/instantOfferList";
export type CheckoutStackParamList = {
    MainScreen: BoxpayCheckoutProps;
    CardScreen: CardScreenParams;
    EmiScreen: {};
    UpiTimerScreen: UPITimerScreenParams;
    AddressScreen: AddressScreenParams;
    BNPLScreen: {};
    SavedAddressScreen: {};
    NetBankingScreen: {};
    WalletScreen: {};
    InstantOfferScreen: InstantOfferProps;
};
declare const CheckoutContainer: ({ token, configurationOptions, onPaymentResult, shopperToken, uiConfiguration }: BoxpayCheckoutProps) => import("react/jsx-runtime").JSX.Element;
export default CheckoutContainer;
//# sourceMappingURL=navigation.d.ts.map