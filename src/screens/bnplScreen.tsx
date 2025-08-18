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
import { router } from 'expo-router';
import { checkoutDetailsHandler } from '../sharedContext/checkoutDetailsHandler';
import LottieView from 'lottie-react-native';
import Header from '../components/header';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import type { PaymentClass, PaymentResult } from '../interface';
import PaymentSuccess from '../components/paymentSuccess';
import SessionExpire from '../components/sessionExpire';
import PaymentFailed from '../components/paymentFailed';
import { paymentHandler } from '../sharedContext/paymentStatusHandler';
import methodsPostRequest from '../postRequest/methodsPostRequest';
import fetchStatus from '../postRequest/fetchStatus';
import WebViewScreen from './webViewScreen';
import PaymentSelectorView from '../components/paymentSelector';
import { fetchPaymentMethodHandler, handleFetchStatusResponseHandler, handlePaymentResponse } from '../sharedContext/handlePaymentResponseHandler';

const BNPLScreen = () => {
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
      router.back();
      return true;
    }
    return false;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
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

    return () => backHandler.remove();
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
      stopBackgroundApiTask: stopBackgroundApiTask
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
    if (paymentUrl) {
      setShowWebView(true);
    }
  }, [paymentUrl]);

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
    const mockPaymentResult: PaymentResult = {
      status: status || '',
      transactionId: transactionId || '',
    };
    paymentHandler.onPaymentResult(mockPaymentResult);
    router.dismissAll();
  };

  useEffect(() => {
    if (bnplList.length > 0) {
      setIsFirstLoad(false);
    }
  }, [bnplList]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar barStyle="dark-content" />
      {loading ? (
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <LottieView
            source={require('../../assets/animations/boxpayLogo.json')}
            autoPlay
            loop
            style={{ width: 80, height: 80 }}
          />
          <Text>Loading...</Text>
        </View>
      ) : isFirstLoad ? (
        <View
          style={{ flex: 1, backgroundColor: 'white', marginHorizontal: 16 }}
        >
          <ShimmerPlaceHolder
            visible={false}
            style={{
              width: '100%',
              height: 50,
              borderRadius: 10,
              marginTop: 30,
            }}
          />
          <ShimmerPlaceHolder
            visible={false}
            style={{
              width: '100%',
              height: 50,
              borderRadius: 10,
              marginTop: 25,
            }}
          />
          <ShimmerPlaceHolder
            visible={false}
            style={{
              width: '100%',
              height: 50,
              borderRadius: 10,
              marginTop: 25,
            }}
          />
          <ShimmerPlaceHolder
            visible={false}
            style={{
              width: '100%',
              height: 50,
              borderRadius: 10,
              marginTop: 25,
            }}
          />
          <ShimmerPlaceHolder
            visible={false}
            style={{
              width: '100%',
              height: 50,
              borderRadius: 10,
              marginTop: 25,
            }}
          />
          <ShimmerPlaceHolder
            visible={false}
            style={{
              width: '100%',
              height: 50,
              borderRadius: 10,
              marginTop: 25,
            }}
          />
          <ShimmerPlaceHolder
            visible={false}
            style={{
              width: '100%',
              height: 50,
              borderRadius: 10,
              marginTop: 25,
            }}
          />
          <ShimmerPlaceHolder
            visible={false}
            style={{
              width: '100%',
              height: 50,
              borderRadius: 10,
              marginTop: 25,
            }}
          />
        </View>
      ) : (
        <View style={{ flex: 1, backgroundColor: '#F5F6FB' }}>
          <Header
            onBackPress={onProceedBack}
            showDesc={true}
            showSecure={false}
            text="Select BNPL"
          />
          <View
            style={{
              flexDirection: 'row',
              height: 1,
              backgroundColor: '#ECECED',
            }}
          />
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            {bnplList.length > 0 ? (
              <View
                style={{
                  marginHorizontal: 16,
                  backgroundColor: 'white',
                  borderColor: '#F1F1F1',
                  borderWidth: 1,
                  borderRadius: 12,
                  marginVertical: 16,
                }}
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
                style={{
                  marginHorizontal: 16,
                  backgroundColor: 'white',
                  borderColor: '#F1F1F1',
                  borderWidth: 1,
                  borderRadius: 12,
                  marginBottom: 32,
                  height: 300,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Image
                  source={require('../../assets/images/no_results_found.png')}
                  style={{ width: 100, height: 100 }}
                />
                <Text
                  style={{
                    fontFamily: 'Poppins-SemiBold',
                    fontSize: 16,
                    color: '#212426',
                    marginTop: 16,
                  }}
                >
                  Oops!! No result found
                </Text>
                <Text
                  style={{
                    fontFamily: 'Poppins-Regular',
                    fontSize: 14,
                    color: '#4F4D55',
                    marginTop: -4,
                  }}
                >
                  Please try another search
                </Text>
              </View>
            )}
          </ScrollView>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'flex-end',
              backgroundColor: '#F5F6FB',
              flexDirection: 'row',
            }}
          >
            <Text
              style={{
                fontSize: 12,
                color: '#888888',
                marginBottom: 15,
                fontFamily: 'Poppins-Medium',
              }}
            >
              Secured by
            </Text>
            <Image
              source={require('../../assets/images/splash-icon.png')}
              style={{ height: 50, width: 50 }}
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
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'white',
          }}
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
