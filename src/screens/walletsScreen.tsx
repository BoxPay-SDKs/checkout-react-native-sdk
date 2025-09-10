import {
  View,
  Text,
  BackHandler,
  Image,
  ScrollView,
  Dimensions,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { router } from 'expo-router';
import { checkoutDetailsHandler } from '../sharedContext/checkoutDetailsHandler';
import LottieView from 'lottie-react-native';
import Header from '../components/header';
import { TextInput } from 'react-native-paper';
import type { PaymentClass, PaymentResultObject } from '../interface';
import PaymentSelectorView from '../components/paymentSelector';
import PaymentSuccess from '../components/paymentSuccess';
import SessionExpire from '../components/sessionExpire';
import PaymentFailed from '../components/paymentFailed';
import { paymentHandler } from '../sharedContext/paymentStatusHandler';
import methodsPostRequest from '../postRequest/methodsPostRequest';
import fetchStatus from '../postRequest/fetchStatus';
import WebViewScreen from './webViewScreen';
import { fetchPaymentMethodHandler, handleFetchStatusResponseHandler, handlePaymentResponse } from '../sharedContext/handlePaymentResponseHandler';
import ShimmerView from '../components/shimmerView';
import styles from '../styles/screens/walletScreenStyles';

const WalletScreen = () => {
  const [walletList, setWalletList] = useState<PaymentClass[]>([]);
  const screenHeight = Dimensions.get('window').height;
  const [defaultWalletList, setDefaultWalletList] = useState<PaymentClass[]>(
    []
  );
  const [searchText, setSearchText] = useState<string>('');
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

  const [searchTextFocused, setSearchTextFocused] = useState(false);

  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [checkedOnce, setCheckedOnce] = useState(false);

  const onProceedBack = () => {
    if (!loading) {
      router.back();
      return true;
    }
    return false;
  };

  const handleSearchTextChange = (text: string) => {
    setSearchText(text);
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
        paymentType: "Wallet",
        setList: (list) => {
          setWalletList(list)
          setDefaultWalletList(list);
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
    const response = await methodsPostRequest(instrumentType, 'wallet');
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
    const updatedWalletList = walletList.map((walletItem) => ({
      ...walletItem,
      isSelected: walletItem.id === id,
    }));
    setWalletList(updatedWalletList);
  };

  const onExitCheckout = () => {
    const mockPaymentResult: PaymentResultObject = {
      status: status || '',
      transactionId: transactionId || '',
    };
    paymentHandler.onPaymentResult(mockPaymentResult);
    router.dismissAll();
  };

  useEffect(() => {
    if (walletList.length > 0) {
      setIsFirstLoad(false);
    }
  }, [walletList]);

  useEffect(() => {
    if (searchText.length > 0) {
      const filteredWalletList = defaultWalletList.filter((item) => {
        const words = item.displayValue.toLowerCase().split(/\s+/); // Split title into words
        return words.some((word) => word.startsWith(searchText.toLowerCase())); // Check if any word starts with searchText
      });

      setWalletList(filteredWalletList);
    } else {
      setWalletList(defaultWalletList);
    }
  }, [searchText]);

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
        <ShimmerView/>
      ) : (
        <View style={{ flex: 1, backgroundColor: '#F5F6FB' }}>
          <Header
            onBackPress={onProceedBack}
            showDesc={true}
            showSecure={false}
            text="Choose Wallet"
          />
          <View
            style={styles.searchContainer}
          />
          {isSearchVisible && (
            <View style={{ backgroundColor: 'white', paddingBottom: 20 }}>
              <TextInput
                mode="outlined"
                label={
                  <Text
                    style={[styles.textFieldLabel,{
                      color: searchTextFocused
                        ? '#2D2B32'
                        : searchText != '' && searchText != null
                          ? '#2D2B32'
                          : '#ADACB0',
                    }]}
                  >
                    Search for wallet
                  </Text>
                }
                value={searchText}
                onChangeText={(it) => {
                  handleSearchTextChange(it);
                }}
                theme={{
                  colors: {
                    primary: '#2D2B32',
                    outline: '#E6E6E6',
                  },
                }}
                style={styles.textFieldStyle}
                left={
                  <TextInput.Icon
                    icon={() => (
                      <Image
                        source={require('../../assets/images/ic_search.png')}
                        style={{ width: 20, height: 20 }}
                      />
                    )}
                  />
                }
                outlineStyle={{
                  borderRadius: 6,
                  borderWidth: 1,
                }}
                onFocus={() => setSearchTextFocused(true)}
                onBlur={() => setSearchTextFocused(false)}
              />
            </View>
          )}
          <Text
            style={styles.mainHeadingText}
          >
            All Wallets
          </Text>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={(_, contentHeight) => {
              if (!checkedOnce) {
                if (contentHeight > screenHeight) {
                  setIsSearchVisible(true);
                }
                setCheckedOnce(true);
              }
            }}
          >
            {walletList.length > 0 ? (
              <View
                style={styles.listContainer}
              >
                <PaymentSelectorView
                  providerList={walletList}
                  onProceedForward={onProceedForward}
                  errorImage={require('../../assets/images/ic_wallet_semi_bold.png')}
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

export default WalletScreen;
