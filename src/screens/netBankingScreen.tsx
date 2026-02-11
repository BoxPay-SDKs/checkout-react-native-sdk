import {
  View,
  Text,
  BackHandler,
  Image,
  ScrollView,
  Dimensions
} from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { checkoutDetailsHandler } from '../sharedContext/checkoutDetailsHandler';
import LottieView from 'lottie-react-native';
import Header from '../components/header';
import { TextInput } from 'react-native-paper';
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
import { fetchPaymentMethodHandler, handleFetchStatusResponseHandler, handlePaymentResponse } from '../sharedContext/handlePaymentResponseHandler';
import styles from '../styles/screens/netBankingScreenStyles';
import type { CheckoutStackParamList } from '../navigation';
import type { NavigationProp } from '@react-navigation/native';

type NetBankingScreenNavigationProp = NavigationProp<CheckoutStackParamList, 'NetBankingScreen'>;

interface Props {
  navigation: NetBankingScreenNavigationProp;
}

const NetBankingScreen = ({ navigation }: Props) => {
  const [netBankingList, setNetBankingList] = useState<PaymentClass[]>([]);
  const [defaultNetBankingList, setDefaultNetBankingList] = useState<
    PaymentClass[]
  >([]);
  const [searchText, setSearchText] = useState<string>('');
  const { checkoutDetails } = checkoutDetailsHandler;
  const [loading, setLoading] = useState(false);
  const screenHeight = Dimensions.get('window').height;

  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [checkedOnce, setCheckedOnce] = useState(false);

  const defaultpopularNetBankingList = [
    'HDFC Bank',
    'ICICI Bank',
    'State Bank of India',
    'Axis Bank',
    'Punjab National Bank Retail',
  ];

  const [popularNetBankingList, setPopularNetBankingList] = useState<
    PaymentClass[]
  >([]);

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

  const onProceedBack = () => {
    if (!loading) {
      navigation.goBack()
      return true;
    }
    return false;
  };

  const handleSearchTextChange = (text: string) => {
    setSearchText(text);
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
        paymentType: "NetBanking",
        setList: (list) => {
          const popularList = list.filter((item: PaymentClass) =>
            defaultpopularNetBankingList.includes(item.displayValue ?? '')
          );
          setNetBankingList(list)
          setPopularNetBankingList(popularList)
          setDefaultNetBankingList(list);
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
    const response = await methodsPostRequest(instrumentType, 'netBanking');
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
    const updatedNetBankingList = netBankingList.map((netBankingItem) => ({
      ...netBankingItem,
      isSelected: netBankingItem.id === id,
    }));
    const updatedPopularNetBankingList = popularNetBankingList.map(
      (popularNetBankingItem) => ({
        ...popularNetBankingItem,
        isSelected: false,
      })
    );
    setPopularNetBankingList(updatedPopularNetBankingList);
    setNetBankingList(updatedNetBankingList);
  };

  const onClickPopularBank = (id: string) => {
    const updatedPopularNetBankingList = popularNetBankingList.map(
      (popularNetBankingItem) => ({
        ...popularNetBankingItem,
        isSelected: popularNetBankingItem.id === id,
      })
    );
    const updatedNetBankingList = netBankingList.map((netBankingItem) => ({
      ...netBankingItem,
      isSelected: false,
    }));
    setNetBankingList(updatedNetBankingList);
    setPopularNetBankingList(updatedPopularNetBankingList);
  };

  const onExitCheckout = () => {
    setSuccessModalState(false)
    setSessionExppireModalState(false)
    const mockPaymentResult: PaymentResultObject = {
      status: status || '',
      transactionId: transactionId || '',
    };
    paymentHandler.onPaymentResult(mockPaymentResult);
  };

  useEffect(() => {
    if (netBankingList.length > 0) {
      setIsFirstLoad(false);
    }
  }, [netBankingList]);

  useEffect(() => {
    if (searchText.length > 0) {
      const filteredNetBankingList = defaultNetBankingList.filter((item) => {
        const words = item.displayValue.toLowerCase().split(/\s+/); // Split title into words
        return words.some((word) => word.startsWith(searchText.toLowerCase())); // Check if any word starts with searchText
      });

      setNetBankingList(filteredNetBankingList);
    } else {
      setNetBankingList(defaultNetBankingList);
    }
  }, [searchText]);

  return (
    <View style={styles.screenView}>
      {loading ? (
        <View
          style={styles.loadingContainer}
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
        <View style={styles.availableScreenView}>
          <Header
            onBackPress={onProceedBack}
            showDesc={true}
            showSecure={false}
            text="Select Bank"
          />
          <View
            style={styles.divider}
          />
          {isSearchVisible && (
            <View style={{ backgroundColor: 'white', paddingBottom: 20 }}>
              <TextInput
                mode="outlined"
                label={
                  <Text
                    style={[styles.searchTextInputLabel,{
                      color: searchTextFocused
                        ? '#2D2B32'
                        : searchText != '' && searchText != null
                          ? '#2D2B32'
                          : '#ADACB0',
                    }]}
                  >
                    Search for bank
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
                style={styles.searchTextInput}
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
            {popularNetBankingList.length > 0 && searchText.length === 0 && (
              <>
                <Text
                  style={styles.headingText}
                >
                  Popular Banks
                </Text>
                <View
                  style={styles.container}
                >
                  <PaymentSelectorView
                    providerList={popularNetBankingList}
                    onProceedForward={onProceedForward}
                    errorImage={require('../../assets/images/ic_netbanking_semi_bold.png')}
                    onClickRadio={(selectedInstrumentValue) =>
                      onClickPopularBank(selectedInstrumentValue)
                    }
                  />
                </View>
              </>
            )}

            <Text
              style={styles.headingText}
            >
              All Banks
            </Text>
            {netBankingList.length > 0 ? (
              <View
                style={styles.container}
              >
                <PaymentSelectorView
                  providerList={netBankingList}
                  onProceedForward={onProceedForward}
                  errorImage={require('../../assets/images/ic_netbanking_semi_bold.png')}
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
                  style={styles.emptyIcon}
                />
                <Text
                  style={styles.emptyListHeadingText}
                >
                  Oops!! No result found
                </Text>
                <Text
                  style={styles.emptyListDescText}
                >
                  Please try another search
                </Text>
              </View>
            )}
          </ScrollView>
          <View
            style={styles.footerContainer}
          >
            <Text
              style={styles.footerTextStyle}
            >
              Secured by
            </Text>
            <Image
              source={require('../../assets/images/splash-icon.png')}
              style={styles.footerIcon}
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
    </View>
  );
};

export default NetBankingScreen;
