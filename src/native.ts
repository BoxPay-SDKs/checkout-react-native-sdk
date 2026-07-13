import {
  NativeModules, NativeEventEmitter, requireNativeComponent,
  UIManager, findNodeHandle,
  type NativeSyntheticEvent,
  type ViewProps,
} from 'react-native';

const { CrossPlatform } = NativeModules;

export const startCheckout = (token: string, options: object = {}) =>
  CrossPlatform.startCheckout(token, options);

export const onPaymentResult = (cb: (r: any) => void) => {
  const emitter = new NativeEventEmitter(CrossPlatform);
  return emitter.addListener('BoxPayPaymentResult', cb);
};

interface BoxPayElementsConfig {
  token: string;
  isTestEnv?: boolean;
  shopperToken?: string | null;
  paymentMethodList?: string[];
  fontFamily?: string;
  ctaBorderRadius?: number;
  focusedTextInputBorderColor?: string;
  unfocusedTextInputBorderColor?: string;
}

interface BoxPayElementsNativeProps extends ViewProps {   // ViewProps gives it `style`
  config: BoxPayElementsConfig;
  onPayableChanged?: (e: NativeSyntheticEvent<{ payable: boolean }>) => void;
}

export const BoxPayElements =
  requireNativeComponent<BoxPayElementsNativeProps>('BoxPayElementsView');
export const payElements = (ref: any) =>
  UIManager.dispatchViewManagerCommand(findNodeHandle(ref), 'pay', []);