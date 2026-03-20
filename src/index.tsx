import type { BoxpayCheckoutProps} from './interface';
import { View } from 'react-native';
import styles from './styles/indexStyles';
import CheckoutContainer from './navigation';

const BoxpayCheckout = ({
  token,
  configurationOptions = null,
  onPaymentResult,
  shopperToken = null,
  uiConfiguration = null
}: BoxpayCheckoutProps) => {
  return (
    <View style={styles.screenView}>
      <CheckoutContainer
      token={token}
      configurationOptions={configurationOptions}
      onPaymentResult={onPaymentResult}
      shopperToken={shopperToken}
      uiConfiguration={uiConfiguration}
      />
    </View>
  );
};

export default BoxpayCheckout;
