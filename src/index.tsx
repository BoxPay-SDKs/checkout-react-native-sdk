import type { BoxpayCheckoutProps} from './interface';
import styles from './styles/indexStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import CheckoutContainer from './navigation';

const BoxpayCheckout = ({
  token,
  configurationOptions = null,
  onPaymentResult,
  shopperToken = null,
  uiConfiguration = null
}: BoxpayCheckoutProps) => {
  return (
    <SafeAreaView style={styles.screenView}>
      <CheckoutContainer
      token={token}
      configurationOptions={configurationOptions}
      onPaymentResult={onPaymentResult}
      shopperToken={shopperToken}
      uiConfiguration={uiConfiguration}
      />
    </SafeAreaView>
  );
};

export default BoxpayCheckout;
