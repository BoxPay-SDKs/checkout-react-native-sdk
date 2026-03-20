"use strict";

export let ConfigurationOptions = /*#__PURE__*/function (ConfigurationOptions) {
  ConfigurationOptions["ShowBoxpaySuccessScreen"] = "SHOW_BOXPAY_SUCCESS_SCREEN";
  ConfigurationOptions["EnableSandboxEnv"] = "ENABLE_SANDBOX_ENV";
  ConfigurationOptions["ShowUPIQROnLoad"] = "SHOW_UPI_QR_ON_LOAD";
  ConfigurationOptions["ShowSICheckbox"] = "SHOW_SI_CHECKBOX";
  return ConfigurationOptions;
}({});
export let UIConfigurationOptions = /*#__PURE__*/function (UIConfigurationOptions) {
  UIConfigurationOptions["FontFamily"] = "FONT_FAMILY";
  UIConfigurationOptions["CTABorderRadius"] = "CTA_BORDER_RADIUS";
  return UIConfigurationOptions;
}({});

// 👇 Each key has its own strict type

export let TransactionStatus = /*#__PURE__*/function (TransactionStatus) {
  TransactionStatus["RequiresAction"] = "REQUIRESACTION";
  TransactionStatus["Failed"] = "FAILED";
  TransactionStatus["Rejected"] = "REJECTED";
  TransactionStatus["Approved"] = "APPROVED";
  TransactionStatus["Success"] = "SUCCESS";
  TransactionStatus["Paid"] = "PAID";
  TransactionStatus["Expired"] = "EXPIRED";
  return TransactionStatus;
}({});
export let APIStatus = /*#__PURE__*/function (APIStatus) {
  APIStatus["Success"] = "SUCCESS";
  APIStatus["Failed"] = "FAILED";
  return APIStatus;
}({});
export let AnalyticsEvents = /*#__PURE__*/function (AnalyticsEvents) {
  AnalyticsEvents["CHECKOUT_LOADED"] = "CHECKOUT_LOADED";
  AnalyticsEvents["ADDRESS_UPDATED"] = "ADDRESS_UPDATED";
  AnalyticsEvents["PAYMENT_CATEGORY_SELECTED"] = "PAYMENT_CATEGORY_SELECTED";
  AnalyticsEvents["PAYMENT_METHOD_SELECTED"] = "PAYMENT_METHOD_SELECTED";
  AnalyticsEvents["PAYMENT_INITIATED"] = "PAYMENT_INITIATED";
  AnalyticsEvents["PAYMENT_INSTRUMENT_PROVIDED"] = "PAYMENT_INSTRUMENT_PROVIDED";
  AnalyticsEvents["UPI_APP_NOT_FOUND"] = "UPI_APP_NOT_FOUND";
  AnalyticsEvents["FAILED_TO_LAUNCH_UPI_INTENT"] = "FAILED_TO_LAUNCH_UPI_INTENT";
  AnalyticsEvents["ERROR_GETTING_UPI_URL"] = "ERROR_GETTING_UPI_URL";
  AnalyticsEvents["SDK_CRASH"] = "SDK_CRASH";
  AnalyticsEvents["PAYMENT_RESULT_SCREEN_DISPLAYED"] = "PAYMENT_RESULT_SCREEN_DISPLAYED";
  return AnalyticsEvents;
}({});
//# sourceMappingURL=interface.js.map