import {
  NativeModules, NativeEventEmitter, requireNativeComponent,
  UIManager, findNodeHandle,
  type NativeSyntheticEvent,
  type ViewProps,
  type HostComponent,
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

export const BoxPayElements: HostComponent<BoxPayElementsNativeProps> =
  requireNativeComponent<BoxPayElementsNativeProps>('BoxPayElementsView');

// UIManager.getViewManagerConfig is typed to return a loose `Object`,
// so we cast to the shape RN actually returns at runtime (Commands map).
interface ViewManagerConfig {
  Commands?: Record<string, number>;
}

export const payElements = (
  ref: React.ElementRef<typeof BoxPayElements> | null
) => {
  const node = findNodeHandle(ref);
  if (node == null) {
    console.warn('BoxPayElements: unable to resolve native node handle');
    return;
  }

  const config = UIManager.getViewManagerConfig(
    'BoxPayElementsView'
  ) as ViewManagerConfig;
  const commandId = config?.Commands?.pay;

  if (commandId == null) {
    console.warn('BoxPayElements: "pay" command not found on native view manager');
    return;
  }

  UIManager.dispatchViewManagerCommand(node, commandId, []);
};