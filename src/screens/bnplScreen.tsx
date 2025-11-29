import {
  View,
  Text,
  BackHandler,
  Image,
  ScrollView,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { checkoutDetailsHandler } from '../sharedContext/checkoutDetailsHandler';
import LottieView from 'lottie-react-native';
import Header from '../components/header';
import type { PaymentClass, PaymentResultObject } from '../interface';
import ShimmerView from '../components/shimmerView';
import PaymentSuccess from '../components/paymentSuccess';
import SessionExpire from '../components/sessionExpire';
import PaymentFailed from '../components/paymentFailed';
import { paymentHandler } from '../sharedContext/paymentStatusHandler';
import methodsPostRequest from '../postRequest/methodsPostRequest';
import fetchStatus from '../postRequest/fetchStatus';
import WebViewScreen from './webViewScreen';
import PaymentSelectorView from '../components/paymentSelector';
import styles from '../styles/screens/bnplScreenStyles';
import { fetchPaymentMethodHandler, handleFetchStatusResponseHandler, handlePaymentResponse } from '../sharedContext/handlePaymentResponseHandler';
import type { CheckoutStackParamList } from '../navigation';
import type { NavigationProp } from '@react-navigation/native';

type BNPLScreenNavigationProp = NavigationProp<CheckoutStackParamList, 'BNPLScreen'>;

interface Props {
  navigation: BNPLScreenNavigationProp;
}

const BNPLScreen = ({ navigation }: Props) => {
  const [bnplList, setBnplList] = useState<PaymentClass[]>([]);
  const { checkoutDetails } = checkoutDetailsHandler;
  const [loading, setLoading] = useState(false);

  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [paymentHtml, setPaymentHtml] = useState<string | null>(null);
  const [showWebView, setShowWebView] = useState(false);

  const [failedModalOpen, setFailedModalState] = useState(false);
  const [successModalOpen, setSuccessModalState] = useState(false);
  const paymentFailedMessage = useRef<string>(
    'You may have cancelled the payment or there was a delay in response. Please retry.'
  );
  const [sessionExpireModalOpen, setSessionExppireModalState] = useState(false);
  const [successfulTimeStamp, setSuccessfulTimeStamp] = useState('');

  const [status, setStatus] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);

  const backgroundApiInterval = useRef<NodeJS.Timeout | null>(null);

  const onProceedBack = () => {
    if (!loading) {
      navigation.goBack();
      return true;
    }
    return false;
  };

  useEffect(() => {
    BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (showWebView) {
          setShowWebView(false);
          paymentFailedMessage.current = checkoutDetails.errorMessage;
          setStatus('Failed');
          setFailedModalState(true);
          setLoading(false);
          return true;
        } else if (loading) {
          return true; // Prevent default back action
        }
        return onProceedBack(); // Allow back navigation if not loading
      }
    );
  });

  useEffect(() => {
    const fetchData = async () => {
      fetchPaymentMethodHandler({
        paymentType: "BuyNowPayLater",
        setList: (list) => {
          setBnplList(list);
        }
      });
    };
  
    fetchData();
  }, []);
  
  const callFetchStatusApi = async () => {
    const response = await fetchStatus();
    handleFetchStatusResponseHandler({
      response: response,
      checkoutDetailsErrorMessage: checkoutDetailsHandler.checkoutDetails.errorMessage,
      onSetStatus: setStatus,
      onSetTransactionId: setTransactionId,
      onSetFailedMessage: (msg) => {
        paymentFailedMessage.current = msg
      },
      onShowFailedModal: () => {
        setFailedModalState(true)
      },
      onShowSuccessModal: (ts) => {
        setSuccessfulTimeStamp(ts);
        setSuccessModalState(true);
      },
      onShowSessionExpiredModal: () => {
        setSessionExppireModalState(true)
      },
      setLoading: setLoading,
      stopBackgroundApiTask: stopBackgroundApiTask,
      isFromUPIIntentFlow : false
    });
  };

  const startBackgroundApiTask = () => {
    backgroundApiInterval.current = setInterval(() => {
      callFetchStatusApi();
    }, 4000);
  };

  const stopBackgroundApiTask = () => {
    if (backgroundApiInterval.current) {
      clearInterval(backgroundApiInterval.current);
    }
  };

  useEffect(() => {
    if (paymentUrl || paymentHtml) {
      setShowWebView(true);
    }
  }, [paymentUrl, paymentHtml]);

  const onProceedForward = async (_: string, instrumentType: string) => {
    setLoading(true);
    const response = await methodsPostRequest(instrumentType, 'buynowpaylater');
    handlePaymentResponse({
      response: response,
      checkoutDetailsErrorMessage: checkoutDetails.errorMessage,
      onSetStatus: setStatus,
      onSetTransactionId: setTransactionId,
      onSetPaymentHtml: setPaymentHtml,
      onSetPaymentUrl: setPaymentUrl,
      onSetFailedMessage: (msg) => (paymentFailedMessage.current = msg),
      onShowFailedModal: () => setFailedModalState(true),
      onShowSuccessModal: (ts) => {
        setSuccessfulTimeStamp(ts);
        setSuccessModalState(true);
      },
      onShowSessionExpiredModal: () => setSessionExppireModalState(true),
      setLoading: setLoading
    });
  };

  const onClickRadioButton = (id: string) => {
    const updatedBnplList = bnplList.map((bnplItem) => ({
      ...bnplItem,
      isSelected: bnplItem.id === id,
    }));
    setBnplList(updatedBnplList);
  };

  const onExitCheckout = () => {
    const mockPaymentResult: PaymentResultObject = {
      status: status || '',
      transactionId: transactionId || '',
    };
    paymentHandler.onPaymentResult(mockPaymentResult);
  };

  useEffect(() => {
    if (bnplList.length > 0) {
      setIsFirstLoad(false);
    }
  }, [bnplList]);

  return (
    <SafeAreaView style={styles.screenView}>
      <StatusBar barStyle="dark-content" />
      {loading ? (
        <View
          style={styles.loaderView}
        >
          <LottieView
            source={require('../../assets/animations/boxpayLogo.json')}
            autoPlay
            loop
            style={styles.lottieStyle}
          />
          <Text>Loading...</Text>
        </View>
      ) : isFirstLoad ? (
        <ShimmerView />
      ) : (
        <View style={{ flex: 1, backgroundColor: '#F5F6FB' }}>
          <Header
            onBackPress={onProceedBack}
            showDesc={true}
            showSecure={false}
            text="Select BNPL"
          />
          <View
            style={styles.divider}
          />
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            {bnplList.length > 0 ? (
              <View
                style={styles.listContainer}
              >
                <PaymentSelectorView
                  providerList={bnplList}
                  onProceedForward={onProceedForward}
                  errorImage={require('../../assets/images/ic_bnpl_semi_bold.png')}
                  onClickRadio={(selectedInstrumentValue) =>
                    onClickRadioButton(selectedInstrumentValue)
                  }
                />
              </View>
            ) : (
              <View
                style={styles.emptyListContainer}
              >
                <Image
                  source={require('../../assets/images/no_results_found.png')}
                  style={styles.imageStyle}
                />
                <Text
                  style={styles.headingText}
                >
                  Oops!! No result found
                </Text>
                <Text
                  style={styles.subHeadingText}
                >
                  Please try another search
                </Text>
              </View>
            )}
          </ScrollView>
          <View
            style={styles.bottomContainer}
          >
            <Text
              style={styles.bottomText}
            >
              Secured by
            </Text>
            <Image
              source={require('../../assets/images/splash-icon.png')}
              style={styles.bottomImage}
            />
          </View>
        </View>
      )}
      {failedModalOpen && (
        <PaymentFailed
          onClick={() => setFailedModalState(false)}
          errorMessage={paymentFailedMessage.current}
        />
      )}

      {successModalOpen && (
        <PaymentSuccess
          onClick={onExitCheckout}
          transactionId={transactionId || ''}
          method="Card"
          localDateTime={successfulTimeStamp}
        />
      )}

      {sessionExpireModalOpen && <SessionExpire onClick={onExitCheckout} />}

      {showWebView && (
        <View
          style={styles.webViewContainer}
        >
          <WebViewScreen
            url={paymentUrl}
            html={paymentHtml}
            onBackPress={() => {
              startBackgroundApiTask();
              setShowWebView(false);
            }}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default BNPLScreen;
