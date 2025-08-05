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
import fetchPaymentMethods from '../postRequest/fetchPaymentMethods';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import type { PaymentClass, PaymentResult } from '../interface';
import PaymentSelectorView from '../components/paymentSelector';
import PaymentSuccess from '../components/paymentSuccess';
import SessionExpire from '../components/sessionExpire';
import PaymentFailed from '../components/paymentFailed';
import { paymentHandler } from '../sharedContext/paymentStatusHandler';
import methodsPostRequest from '../postRequest/methodsPostRequest';
import fetchStatus from '../postRequest/fetchStatus';
import WebViewScreen from './webViewScreen';
import { transformAndFilterList } from '../utils/listAndObjectUtils';

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
    fetchPaymentMethods(checkoutDetails.token, checkoutDetails.env).then(
      (data) => {
        const walletList = transformAndFilterList(data, 'Wallet');
        setWalletList(walletList);
        setDefaultWalletList(walletList);
      }
    );
  }, []);

  const callFetchStatusApi = async () => {
    const response = await fetchStatus();
    try {
      setStatus(response.status);
      setTransactionId(response.transactionId);
      const reasonCode = response.reasonCode;
      const status = response.status.toUpperCase();
      if (['FAILED', 'REJECTED'].includes(status)) {
        const reason = response.reason;
        if (!reasonCode?.startsWith('UF')) {
          paymentFailedMessage.current = checkoutDetails.errorMessage;
        } else {
          paymentFailedMessage.current = reason?.includes(':')
            ? reason.split(':')[1]?.trim()
            : reason || checkoutDetails.errorMessage;
        }
        setStatus('Failed');
        setFailedModalState(true);
        setLoading(false);
        stopBackgroundApiTask();
      } else if (['APPROVED', 'SUCCESS', 'PAID'].includes(status)) {
        setSuccessfulTimeStamp(response.transactionTimestampLocale);
        setSuccessModalState(true);
        setStatus('Success');
        stopBackgroundApiTask();
        setLoading(false);
      } else if (['EXPIRED'].includes(status)) {
        setSessionExppireModalState(true);
        setStatus('Expired');
        stopBackgroundApiTask();
        setLoading(false);
      }
    } catch (error) {
      const reason = response.status.reason;
      const reasonCode = response.status.reasonCode;
      if (!reasonCode?.startsWith('UF')) {
        paymentFailedMessage.current = checkoutDetails.errorMessage;
      } else {
        paymentFailedMessage.current = reason?.includes(':')
          ? reason.split(':')[1]?.trim()
          : reason || checkoutDetails.errorMessage;
      }
      setFailedModalState(true);
      setLoading(false);
    }
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
    try {
      setStatus(response.status.status);
      setTransactionId(response.transactionId);
      const reason = response.status.statusReason;
      const reasonCode = response.status.reasonCode;
      const status = response.status.status.toUpperCase();
      if (status === 'REQUIRESACTION') {
        if (Array.isArray(response.actions)) {
          if (response.actions.length > 0) {
            if (response.actions[0].type == 'html') {
              setPaymentHtml(response.actions[0].htmlPageString);
            } else {
              setPaymentUrl(response.actions[0].url);
            }
          }
        }
      } else if (['FAILED', 'REJECTED'].includes(status)) {
        if (!reasonCode?.startsWith('UF')) {
          paymentFailedMessage.current = checkoutDetails.errorMessage;
        } else {
          paymentFailedMessage.current = reason?.includes(':')
            ? reason.split(':')[1]?.trim()
            : reason || checkoutDetails.errorMessage;
        }
        setStatus('Failed');
        setFailedModalState(true);
        setLoading(false);
      } else if (['APPROVED', 'SUCCESS', 'PAID'].includes(status)) {
        setSuccessfulTimeStamp(response.transactionTimestampLocale);
        setSuccessModalState(true);
        setStatus('Success');
        setLoading(false);
      } else if (['EXPIRED'].includes(status)) {
        setSessionExppireModalState(true);
        setStatus('Expired');
        setLoading(false);
      }
    } catch (error) {
      setFailedModalState(true);
      setLoading(false);
    }
  };

  const onClickRadioButton = (id: string) => {
    const updatedWalletList = walletList.map((walletItem) => ({
      ...walletItem,
      isSelected: walletItem.id === id,
    }));
    setWalletList(updatedWalletList);
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
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar barStyle="dark-content" />
      {loading ? (
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <LottieView
            source={require('../../../assets/animations/boxpayLogo.json')}
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
            text="Choose Wallet"
          />
          <View
            style={{
              flexDirection: 'row',
              height: 1,
              backgroundColor: '#ECECED',
            }}
          />
          {isSearchVisible && (
            <View style={{ backgroundColor: 'white', paddingBottom: 20 }}>
              <TextInput
                mode="outlined"
                label={
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: 'Poppins-Regular',
                      color: searchTextFocused
                        ? '#2D2B32'
                        : searchText != '' && searchText != null
                          ? '#2D2B32'
                          : '#ADACB0',
                    }}
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
                style={{
                  marginTop: 16,
                  marginHorizontal: 16,
                  backgroundColor: 'white',
                  fontSize: 16,
                  fontFamily: 'Poppins-Regular',
                  color: '#0A090B',
                  height: 60,
                }}
                left={
                  <TextInput.Icon
                    icon={() => (
                      <Image
                        source={require('../../../assets/images/ic_search.png')}
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
            style={{
              marginTop: 16,
              marginBottom: 8,
              marginHorizontal: 16,
              color: '#020815B5',
              fontFamily: 'Poppins-SemiBold',
              fontSize: 14,
            }}
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
                style={{
                  marginHorizontal: 16,
                  backgroundColor: 'white',
                  borderColor: '#F1F1F1',
                  borderWidth: 1,
                  borderRadius: 12,
                  marginBottom: 32,
                }}
              >
                <PaymentSelectorView
                  providerList={walletList}
                  onProceedForward={onProceedForward}
                  errorImage={require('../../../assets/images/ic_wallet_semi_bold.png')}
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
                  source={require('../../../assets/images/no_results_found.png')}
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
              source={require('../../../assets/images/splash-icon.png')}
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

export default WalletScreen;
