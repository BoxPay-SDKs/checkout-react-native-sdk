# checkout-react-native-sdk

Boxpay Payment Gateway

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


## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
