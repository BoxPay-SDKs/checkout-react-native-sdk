import { useEffect, useRef, useState } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import type {
  BoxpayCheckoutProps,
  BoxpayElementsProps,
  UIConfiguration,
} from './interface';
import { ConfigurationOptions, SICheckboxState, UIConfigurationOptions } from './interface';
import {
  BoxPayElements,
  payElements,
  startCheckout,
  onPaymentResult as subscribePaymentResult,
} from './native';

// ── Full-screen checkout (mirrors Android display()) ──────────────────────────
export const BoxpayCheckout = ({
  token,
  configurationOptions = null,
  onPaymentResult,
  shopperToken = null,
  uiConfiguration = null,
}: BoxpayCheckoutProps) => {
  useEffect(() => {
    const sub = subscribePaymentResult((r) => onPaymentResult?.(r));
    return () => sub.remove();
  }, [onPaymentResult]);

  useEffect(() => {
    startCheckout(token, buildOptions(configurationOptions, uiConfiguration, shopperToken));
  }, [token]);

  return <View style={styles.screenView} />;
};

// ── Embedded elements with merchant button (mirrors createElementsView) ───────
export const BoxpayElements = ({
  token,
  configurationOptions = null,
  onPaymentResult,
  shopperToken = null,
  uiConfiguration = null,
  paymentMethodList,
}: BoxpayElementsProps) => {
  const elementsRef = useRef(null);
  const [payable, setPayable] = useState(false);

  useEffect(() => {
    const sub = subscribePaymentResult((r) => onPaymentResult?.(r));
    return () => sub.remove();
  }, [onPaymentResult]);

  const textInputFields = uiConfiguration?.[UIConfigurationOptions.TextInputFields];

  return (
    <View style={styles.screenView}>
      <BoxPayElements
        ref={elementsRef}
        style={styles.elements}
        config={{
          token,
          isTestEnv: configurationOptions?.[ConfigurationOptions.EnableSandboxEnv] === true,
          shopperToken,
          paymentMethodList,
          fontFamily: uiConfiguration?.[UIConfigurationOptions.FontFamily],
          ctaBorderRadius: uiConfiguration?.[UIConfigurationOptions.CTABorderRadius],
          focusedTextInputBorderColor: textInputFields?.focusedTextInputBorderColor,
          unfocusedTextInputBorderColor: textInputFields?.unfocusedTextInputBorderColor,
        }}
        onPayableChanged={(e: any) => setPayable(e.nativeEvent.payable)}
      />
      <Button title="Pay" disabled={!payable} onPress={() => payElements(elementsRef.current)} />
    </View>
  );
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildOptions(
  config: Partial<Record<ConfigurationOptions, boolean | SICheckboxState | null>> | null,
  ui: UIConfiguration | null,
  shopperToken: string | null,
) {
  const textInputFields = ui?.[UIConfigurationOptions.TextInputFields];
  const siState = config?.[ConfigurationOptions.SICheckBoxState] as SICheckboxState | null | undefined;
  const si = siFlags(siState);

  return {
    shopperToken: shopperToken ?? '',
    enableSandboxEnv: config?.[ConfigurationOptions.EnableSandboxEnv] === true,
    showSuccessScreen: config?.[ConfigurationOptions.ShowBoxpaySuccessScreen] === true,
    showFailedScreen: config?.[ConfigurationOptions.ShowBoxpayFailedScreen] === true,
    showQROnLoad: config?.[ConfigurationOptions.ShowUPIQROnLoad] === true,
    isSICheckBoxChecked: si.checked,
    isSICheckBoxEnabled: si.enabled,
    fontFamily: ui?.[UIConfigurationOptions.FontFamily],
    ctaBorderRadius: ui?.[UIConfigurationOptions.CTABorderRadius],
    focusedTextInputBorderColor: textInputFields?.focusedTextInputBorderColor,
    unfocusedTextInputBorderColor: textInputFields?.unfocusedTextInputBorderColor,
  };
}

function siFlags(state: SICheckboxState | null | undefined): { checked: boolean; enabled: boolean } {
  switch (state) {
    case SICheckboxState.CHECKED_AND_ENABLED:   return { checked: true,  enabled: true  };
    case SICheckboxState.CHECKED_AND_DISABLED:  return { checked: true,  enabled: false };
    case SICheckboxState.UNCHECKED_AND_ENABLED: return { checked: false, enabled: true  };
    default:                                    return { checked: false, enabled: false };
  }
}

const styles = StyleSheet.create({
  screenView: {
    flex: 1,
  },
  elements: {
    flex: 1,
  },
});