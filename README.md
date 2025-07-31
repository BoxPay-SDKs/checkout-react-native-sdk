# checkout-react-native-sdk

Welcome to your Boxpay Checkout React Native SDK 👋

## Installation


```sh
npm install checkout-react-native-sdk
```


## Usage


```js
import BoxpayCheckout from 'checkout-react-native-sdk';
import { ConfigurationOptions, PaymentResult } from 'checkout-react-native-sdk/interface';


// ...
const handlePaymentResult = (result: PaymentResult) => {
    alert(`Payment ${result.status} :  + ${result.transactionId}`);
};

<BoxpayCheckout
    token={token}
    onPaymentResult={handlePaymentResult}
    configurationOptions={{
    [ConfigurationOptions.ShowBoxpaySuccessScreen]: true,
    [ConfigurationOptions.EnableSandboxEnv]: true
    }}
    shopperToken={shopperToken}
/>
```
