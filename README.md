# checkout-react-native-sdk

Welcome to your Boxpay Checkout React Native SDK 👋

## Installation

```sh
npm install boxpay-checkout-reactnative-sdk
```

## Usage

```js
import BoxpayCheckout from 'boxpay-checkout-reactnative-sdk';
import { ConfigurationOptions, PaymentResultObject } from 'boxpay-checkout-reactnative-sdk/interface';



// ...
const handlePaymentResult = (result: PaymentResultObject) => {
    alert(`Payment ${result.status} :  + ${result.transactionId}`);
};

<BoxpayCheckout
    token={token}
    onPaymentResult={handlePaymentResult}
    configurationOptions={{
    [ConfigurationOptions.ShowBoxpaySuccessScreen]: true,
    [ConfigurationOptions.EnableSandboxEnv]: true,
    [ConfigurationOptions.ShowUPIQROnLoad] : false
    }}
    shopperToken={shopperToken}
/>
```
