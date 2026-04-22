# checkout-react-native-sdk

Welcome to your Boxpay Checkout React Native SDK 👋

## Installation

```sh
npm install boxpay-checkout-reactnative-sdk
```

## Usage

```js
import BoxpayCheckout from 'boxpay-checkout-react-native-sdk';
import { ConfigurationOptions, PaymentResultObject, UIConfigurationOptions } from 'boxpay-checkout-react-native-sdk/interface';



// ...
const handlePaymentResult = (result: PaymentResultObject) => {
    alert(`Payment ${result.status} :  + ${result.transactionId} + ${result.inquiryToken}`);
};

<BoxpayCheckout
    token={token}
    onPaymentResult={handlePaymentResult}
    uiConfiguration={{
        // **Optional** — Controls the border radius (in dp) of the primary CTA (Call-To-Action) buttons.
        // Use 2 for sharp corners, or higher values (e.g., 20) for pill-shaped buttons.
        // Omit this field to use the default border radius.
        [UIConfigurationOptions.CTABorderRadius]: 20,

        // **Optional** — Customize the font family used throughout the checkout UI.
        // IMPORTANT: Fonts must be pre-loaded in your app before passing them here,
        // otherwise they will not render correctly.
        // Example using expo-font:
        //
        //   import * as Font from 'expo-font';
        //   await Font.loadAsync({
        //     'YourFont-Regular':   require('./assets/fonts/YourFont-Regular.ttf'),
        //     'YourFont-Medium':    require('./assets/fonts/YourFont-Medium.ttf'),
        //     'YourFont-SemiBold':  require('./assets/fonts/YourFont-SemiBold.ttf'),
        //     'YourFont-Bold':      require('./assets/fonts/YourFont-Bold.ttf'),
        //     'YourFont-ExtraBold': require('./assets/fonts/YourFont-ExtraBold.ttf'),
        //   });
        //
        // Once fonts are loaded, pass the font family names below:
        // [UIConfigurationOptions.FontFamily]: {
        //   regular:   'YourFont-Regular',
        //   medium:    'YourFont-Medium',
        //   semiBold:  'YourFont-SemiBold',
        //   bold:      'YourFont-Bold',
        //   extraBold: 'YourFont-ExtraBold',
        // },

        // **Optional** — Customize the appearance of text input fields throughout the checkout UI.
        // Allows you to control border color.
        // Omit this field to use the default text input field styles.
        // Example:
        //
        // [UIConfigurationOptions.TextInputFields]: {
        //   borderColor: '#CCCCCC',
        //   focusedBorderColor: '#0066FF',
        // },
    }}
    configurationOptions={{
        // Flag to control whether BoxPay Success screen should be displayed before executing the callback.
        // It enables merchants to control whether they want to leverage their own success screens.
        // Default value is false meaning merchants should navigate shoppers to their success screen on successful payments.
        [ConfigurationOptions.ShowBoxpaySuccessScreen]: true,

        // Flag to control whether BoxPay Failure screen should be displayed before executing the callback.
        // It enables merchants to control whether they want to leverage their own failure screens.
        // Default value is false meaning merchants should navigate shoppers to their failure screen on failure payments.
        [ConfigurationOptions.ShowBoxpayFailedScreen]: true,

        // Flag to control whether BoxPay Sandbox/test env should be used.
        // It is primarily available for testing purposes.
        // Default value is set to false meaning prod environment will be used to process the payments.
        [ConfigurationOptions.EnableSandboxEnv]: true,

        // Flag to control whether UPI QR should be loaded by default.
        // Default value is set to false to ensure maximum success rate as enabling this flag
        // will result into transactions even though shopper doesn't make UPI payments.
        [ConfigurationOptions.ShowUPIQROnLoad]: true,

        // Flag to control SI (Standing Instructions) checkbox should be visible or not in Cards Screen.
        // Default value is set to false 
        // This checkbox will be visible when this flag is true and subscription object is present in checkout token.
        [ConfigurationOptions.ShowSICheckbox]: true,
    }}
    shopperToken={shopperToken}
/>
```
