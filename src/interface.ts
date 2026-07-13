export interface PaymentResultObject {
  status: string;
  transactionId: string;
  inquiryToken: string
}

export enum SICheckboxState {
  CHECKED_AND_DISABLED = "CHECKED_AND_DISABLED",
  CHECKED_AND_ENABLED = "CHECKED_AND_ENABLED",
  UNCHECKED_AND_ENABLED = "UNCHECKED_AND_ENABLED",
}

export enum ConfigurationOptions {
  ShowBoxpaySuccessScreen = 'SHOW_BOXPAY_SUCCESS_SCREEN',
  ShowBoxpayFailedScreen = 'SHOW_BOXPAY_FAILED_SCREEN',
  EnableSandboxEnv = 'ENABLE_SANDBOX_ENV',
  ShowUPIQROnLoad = 'SHOW_UPI_QR_ON_LOAD',
  SICheckBoxState = 'SI_CHECKBOX_STATE'
}

export enum UIConfigurationOptions {
  FontFamily = 'FONT_FAMILY',
  CTABorderRadius = 'CTA_BORDER_RADIUS',
  TextInputFields = 'TEXT_INPUT_FIELDS'
}

// 👇 Each key has its own strict type
export interface TextInputFields {
  focusedTextInputBorderColor?: string;
  unfocusedTextInputBorderColor?: string;
}

// Mirrors Android's UIConfiguration, keyed by the UIConfigurationOptions enum
export interface UIConfiguration {
  [UIConfigurationOptions.FontFamily]?: string;
  [UIConfigurationOptions.CTABorderRadius]?: number;
  [UIConfigurationOptions.TextInputFields]?: TextInputFields;
}

export interface BoxpayCheckoutProps {
  token: string;
  configurationOptions?:
  | Partial<Record<ConfigurationOptions, boolean | SICheckboxState | null>>
  | null;
  onPaymentResult?: (result: any) => void;
  shopperToken?: string | null;
  uiConfiguration?: UIConfiguration | null;
}

export interface BoxpayElementsProps extends BoxpayCheckoutProps {
  paymentMethodList: string[];   // ['UPI', 'CARDS', ...]
}