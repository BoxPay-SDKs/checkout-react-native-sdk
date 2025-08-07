import { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, BackHandler, AppState, Image, ScrollView, StatusBar, Alert } from 'react-native'; // Added ScrollView
import Header from './components/header';
import upiPostRequest from './postRequest/upiPostRequest';
import { decode as atob } from 'base-64';
import { Linking } from 'react-native';
import LottieView from 'lottie-react-native';
import PaymentSuccess from './components/paymentSuccess';
import SessionExpire from './components/sessionExpire';
import PaymentFailed from './components/paymentFailed';
import fetchStatus from './postRequest/fetchStatus';
import UpiScreen from './screens/upiScreen';
import { router, useFocusEffect } from 'expo-router';
import { paymentHandler, setPaymentHandler } from "./sharedContext/paymentStatusHandler";
import { loadCustomFonts, loadInterCustomFonts } from './components/fontFamily';
import { setUserDataHandler, userDataHandler } from './sharedContext/userdataHandler';
import type { PaymentResult, PaymentClass, InstrumentDetails, RecommendedInstruments, PaymentMethod, OrderItem, BoxpayCheckoutProps } from './interface';
import { checkoutDetailsHandler, setCheckoutDetailsHandler } from './sharedContext/checkoutDetailsHandler';
import WebViewScreen from './screens/webViewScreen';
import getSymbolFromCurrency from 'currency-symbol-map';
import type { ItemsProp } from './components/orderDetails';
import OrderDetails from './components/orderDetails';
import fetchRecommendedInstruments from './postRequest/fetchRecommendedInstruments';
import { SafeAreaView } from 'react-native-safe-area-context';
import PaymentSelectorView from './components/paymentSelector';
import SavedCardComponentView from './components/savedCardComponent';
import ShimmerView from './components/shimmerView';
import AddressComponent from './components/addressCard';
import { navigateToAddressScreen, navigateToCardScreen, navigateToUpiTimerModal } from './navigation';
import fetchSessionDetails from './postRequest/fetchSessionDetails';
import MorePaymentMethods from './components/morePaymentMethods';
import { handleFetchStatusResponseHandler, handlePaymentResponse } from './sharedContext/handlePaymentResponseHandler';

const BoxpayCheckout = ({
  token,
  configurationOptions = {},
  onPaymentResult,
  shopperToken = null,
}: BoxpayCheckoutProps) => {
  const [status, setStatus] = useState('NOACTION');
  const [transactionId, setTransactionId] = useState('');
  const env = configurationOptions?.ENABLE_SANDBOX_ENV ? 'test' : 'prod';
  const appStateListenerRef = useRef<any>(null);
  const [appState] = useState(AppState.currentState);
  const [loadingState, setLoadingState] = useState(false);
  const [isFirstLoading, setIsFirstLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const totalItemsRef = useRef(0);
  const [address, setAddress] = useState('');
  const [failedModalOpen, setFailedModalState] = useState(false);
  const [successModalOpen, setSuccessModalState] = useState(false);
  const lastOpenendUrl = useRef<string>('');
  const paymentFailedMessage = useRef<string>(
    'You may have cancelled the payment or there was a delay in response. Please retry.'
  );
  const [sessionExpireModalOpen, setSessionExppireModalState] = useState(false);
  const [successfulTimeStamp, setSuccessfulTimeStamp] = useState('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [showWebView, setShowWebView] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [paymentHtml, setPaymentHtml] = useState<string | null>(null);
  const isUpiOpeningRef = useRef(false);
  const shippingAmountRef = useRef('');
  const taxAmountRef = useRef('');
  const subTotalAmountRef = useRef('');
  const orderItemsArrayRef = useRef<ItemsProp[]>([]);
  const [recommendedInstrumentsArray, setRecommendedInstruments] = useState<PaymentClass[]>([]);
  const [savedCardArray, setSavedCardArray] = useState<PaymentClass[]>([]);
  const [savedUpiArray, setSavedUpiArray] = useState<PaymentClass[]>([]);

  let isFirstTimeLoadRef = true;

  const handlePaymentIntent = async (selectedIntent: string) => {
    setLoadingState(true);
    const response = await upiPostRequest({
      type: 'upi/intent',
      ...(selectedIntent && { upiAppDetails: { upiApp: selectedIntent } }), // Conditionally add upiAppDetails only if upiIntent is present
    });
    handlePaymentResponse({
      response: response,
      checkoutDetailsErrorMessage: checkoutDetailsHandler.checkoutDetails.errorMessage,
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
      onNavigateToTimer: navigateToUpiTimerModal,
      onOpenUpiIntent : (url) => {
        urlToBase64(url);
      },
      setLoading: setLoadingState
    });
  };

  const handleUpiCollectPayment = async (
    upiId: string,
    instrumentRef: string,
    type: string
  ) => {
    const requestPayload: InstrumentDetails =
      type === 'Card'
        ? {
            type: 'card/token',
            savedCard: { instrumentRef: instrumentRef },
          }
        : {
            type: 'upi/collect',
            upi: instrumentRef
              ? { instrumentRef: instrumentRef }
              : { shopperVpa: upiId },
          };
    setLoadingState(true);
    const response = await upiPostRequest(requestPayload);
    handlePaymentResponse({
      response: response,
      upiId: upiId,
      checkoutDetailsErrorMessage: checkoutDetailsHandler.checkoutDetails.errorMessage,
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
      onNavigateToTimer: navigateToUpiTimerModal,
      onOpenUpiIntent : (url) => {
        urlToBase64(url);
      },
      setLoading: setLoadingState
    });
  };

  useFocusEffect(
    useCallback(() => {
      if (isFirstTimeLoadRef) {
        isFirstTimeLoadRef = false;
        return;
      }

      const refreshData = () => {
        const address1Ref = userDataHandler.userData.address1;
        const address2Ref = userDataHandler.userData.address2;
        const cityRef = userDataHandler.userData.city;
        const stateRef = userDataHandler.userData.state;
        const postalCodeRef = userDataHandler.userData.pincode;

        if (address2Ref == null || address2Ref == '') {
          setAddress(
            `${address1Ref}, ${cityRef}, ${stateRef}, ${postalCodeRef}`
          );
        } else {
          setAddress(
            `${address1Ref}, ${address2Ref}, ${cityRef}, ${stateRef}, ${postalCodeRef}`
          );
        }
      };

      refreshData();
    }, [])
  );

  const urlToBase64 = (base64String: string) => {
    try {
      const decodedString = atob(base64String);
      lastOpenendUrl.current = decodedString;
      openUPIIntent(decodedString);
    } catch (error) {
      setFailedModalState(true);
      setLoadingState(false);
    }
  };

  const getRecommendedInstruments = async () => {
    try {
      const response = await fetchRecommendedInstruments();

      // Ensure response is an array; default to an empty array if null/undefined
      const instrumentsList = Array.isArray(response) ? response : [];

      const instruments = instrumentsList
        .slice(0, 2)
        .map((instrument: RecommendedInstruments, index: number) => ({
          type: instrument.type,
          id: instrument.instrumentRef,
          displayName: instrument.cardNickName ? instrument.cardNickName : '',
          displayValue: instrument.displayValue,
          iconUrl: instrument.logoUrl ? instrument.logoUrl : '///', // Add appropriate image logic if needed
          instrumentTypeValue: instrument.instrumentRef,
          isLastUsed: index === 0, // Only the first item should have isLastUsed = true
          isSelected: false,
        }));

      const upiInstruments = instrumentsList
        .filter(
          (instrument: RecommendedInstruments) => instrument.type === 'Upi'
        )
        .map((instrument: RecommendedInstruments) => ({
          type: instrument.type,
          id: instrument.instrumentRef,
          displayName: instrument.cardNickName ? instrument.cardNickName : '',
          displayValue: instrument.displayValue,
          iconUrl: instrument.logoUrl ? instrument.logoUrl : '///',
          instrumentTypeValue: instrument.instrumentRef,
          isSelected: false,
        }));

      const cardInstruments = instrumentsList
        .filter(
          (instrument: RecommendedInstruments) => instrument.type === 'Card'
        )
        .map((instrument: RecommendedInstruments) => ({
          type: instrument.type,
          id: instrument.instrumentRef,
          displayName: instrument.cardNickName,
          displayValue: instrument.displayValue,
          iconUrl: instrument.logoUrl ? instrument.logoUrl : '///',
          instrumentTypeValue: instrument.instrumentRef,
          isSelected: false,
        }));

      setRecommendedInstruments(instruments);
      setSavedUpiArray(upiInstruments);
      setSavedCardArray(cardInstruments);
    } catch (error) {
      setRecommendedInstruments([]); // Ensure the list is explicitly set to empty
    } finally {
      setIsFirstLoading(false);
    }
  };

  useEffect(() => {
    if (paymentUrl || paymentHtml) {
      setShowWebView(true);
    }
  }, [paymentUrl, paymentHtml]);

  const openUPIIntent = async (url: string) => {
    try {
      await Linking.openURL(url); // Open the UPI app
      appStateListenerRef.current = AppState.addEventListener(
        'change',
        handleAppStateChange
      );
      isUpiOpeningRef.current = true;
    } catch (error) {
      isUpiOpeningRef.current = false;
      setFailedModalState(true);
      setLoadingState(false);
    }
  };

  const handleAppStateChange = () => {
    if (AppState.currentState === 'active' && isUpiOpeningRef.current) {
      callFetchStatusApi();
    }
  };

  const stopExpireTimerCountDown = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const callFetchStatusApi = async () => {
    const response = await fetchStatus();
    if (appState == 'active') {
      handleFetchStatusResponseHandler({
        response: response,
        checkoutDetailsErrorMessage: checkoutDetailsHandler.checkoutDetails.errorMessage,
        onSetStatus: setStatus,
        onSetTransactionId: setTransactionId,
        onSetFailedMessage: (msg) => (paymentFailedMessage.current = msg),
        onShowFailedModal: () => setFailedModalState(true),
        onShowSuccessModal: (ts) => {
          setSuccessfulTimeStamp(ts);
          setSuccessModalState(true);
        },
        onShowSessionExpiredModal: () => setSessionExppireModalState(true),
        setLoading: setLoadingState
      });
      appStateListenerRef.current?.remove();
      isUpiOpeningRef.current = false;
    }
  };

  const onExitCheckout = () => {
    if (!loadingState) {
      stopExpireTimerCountDown();
      const mockPaymentResult: PaymentResult = {
        status: status,
        transactionId: transactionId,
      };
      paymentHandler.onPaymentResult(mockPaymentResult);
      router.dismissAll();
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
          paymentFailedMessage.current =
            checkoutDetailsHandler.checkoutDetails.errorMessage;
          setStatus('Failed');
          setFailedModalState(true);
          setLoadingState(false);
          return true;
        } else if (loadingState) {
          return true;
        }
        return onExitCheckout(); // Allow back navigation if not loading
      }
    );

    return () => backHandler.remove();
  });

  useEffect(() => {
    async function loadFonts() {
      await loadCustomFonts();
      await loadInterCustomFonts();
    }
    loadFonts()
    checkoutDetailsHandler.checkoutDetails.env = env
    checkoutDetailsHandler.checkoutDetails.token = token
    fetchSessionDetails().then(
      (response) => {
        try {
          setIsFirstLoading(true);
          const paymentMethods = response.data.configs.paymentMethods;
          const enabledFields = response.data.configs.enabledFields;
          const paymentDetails = response.data.paymentDetails;
          const methodFlags = {
            isUPIIntentVisible: false,
            isUPICollectVisible: false,
            isCardsVisible: false,
            isWalletVisible: false,
            isNetbankingVisible: false,
            isEMIVisible: false,
            isBNPLVisible: false,
          };
          
          paymentMethods.forEach((method: PaymentMethod) => {
            if (method.type === 'Upi') {
              if (method.brand === 'UpiIntent') {
                methodFlags.isUPIIntentVisible = true;
              } else if (method.brand === 'UpiCollect') {
                methodFlags.isUPICollectVisible = true;
              }
            } else if (method.type === 'Card') {
              methodFlags.isCardsVisible = true;
            } else if (method.type === 'Wallet') {
              methodFlags.isWalletVisible = true;
            } else if (method.type === 'NetBanking') {
              methodFlags.isNetbankingVisible = true;
            } else if (method.type === 'Emi') {
              methodFlags.isEMIVisible = true;
            } else if (method.type === 'BuyNowPayLater') {
              methodFlags.isBNPLVisible = true;
            }
          });
      
          setAmount(paymentDetails.money.amountLocaleFull);
          const currencyCode: string | undefined =
            paymentDetails?.money?.currencyCode;
          const symbol = currencyCode
            ? (getSymbolFromCurrency(currencyCode) ?? '₹')
            : '₹';
          if (
            paymentDetails.order != null &&
            paymentDetails.order.items != null
          ) {
            const total = paymentDetails.order.items.reduce(
              (sum: number, item: OrderItem) => sum + (item.quantity || 1),
              0
            );
            totalItemsRef.current = total;
            shippingAmountRef.current =
              paymentDetails.order.shippingAmountLocaleFull != null
                ? paymentDetails.order.shippingAmountLocaleFull
                : '';
            taxAmountRef.current =
              paymentDetails.order.taxAmountLocaleFull != null
                ? paymentDetails.order.taxAmountLocaleFull
                : '';
            subTotalAmountRef.current =
              paymentDetails.order.originalAmountLocaleFull != null
                ? paymentDetails.order.originalAmountLocaleFull
                : '';
            const formattedItemsArray: ItemsProp[] =
              paymentDetails.order.items.map((item: OrderItem) => ({
                imageUrl: item.imageUrl,
                imageTitle: item.itemName,
                imageOty: item.quantity,
                imageAmount: item.amountWithoutTaxLocaleFull,
              }));
            orderItemsArrayRef.current = formattedItemsArray;
          }
          const emailRef = paymentDetails.shopper.email;
          const firstNameRef = paymentDetails.shopper.firstName;
          const lastNameRef = paymentDetails.shopper.lastName;
          const phoneRef = paymentDetails.shopper.phoneNumber;
          const uniqueIdRef = paymentDetails.shopper.uniqueReference;
          const dobRef = paymentDetails.shopper.dateOfBirth;
          const panRef = paymentDetails.shopper.panNumber;
          startCountdown(response.data.sessionExpiryTimestamp);
          let labelTypeRef = null;
          let address1Ref = null;
          let labelNameRef = null;
          let address2Ref = null;
          let cityRef = null;
          let stateRef = null;
          let postalCodeRef = null;
          let countryCodeRef = null;
          if (paymentDetails.shopper.deliveryAddress != null) {
            const deliveryObject = paymentDetails.shopper.deliveryAddress;
            labelTypeRef = deliveryObject.labelType;
            labelNameRef = deliveryObject.labelName;
            address1Ref = deliveryObject.address1;
            address2Ref = deliveryObject.address2;
            cityRef = deliveryObject.city;
            stateRef = deliveryObject.state;
            postalCodeRef = deliveryObject.postalCode;
            countryCodeRef = deliveryObject.countryCode;
            if (address2Ref == null || address2Ref == '') {
              setAddress(
                `${address1Ref}, ${cityRef}, ${stateRef}, ${postalCodeRef}`
              );
            } else {
              setAddress(
                `${address1Ref}, ${address2Ref}, ${cityRef}, ${stateRef}, ${postalCodeRef}`
              );
            }
          }
          if (['APPROVED', 'SUCCESS', 'PAID'].includes(response.data.status)) {
            setSuccessfulTimeStamp(response.data.lastPaidAtTimestampLocale);
            setTransactionId(response.data.lastTransactionId);
            setStatus(response.data.status);
            setSuccessModalState(true);
          } else if (['EXPIRED'].includes(response.data.status)) {
            setSessionExppireModalState(true);
          }
          setUserDataHandler({
            userData: {
              email: emailRef,
              firstName: firstNameRef,
              lastName: lastNameRef,
              phone: phoneRef,
              uniqueId: uniqueIdRef,
              dob: dobRef,
              pan: panRef,
              address1: address1Ref,
              address2: address2Ref,
              city: cityRef,
              state: stateRef,
              pincode: postalCodeRef,
              country: countryCodeRef,
              labelType: labelTypeRef,
              labelName: labelNameRef,
            },
          });
          const isFieldEnabled = (fieldName: string) =>  {
            return enabledFields.some(
              (field: { field: string }) => field.field === fieldName
            );
          };
  
          const isFieldEditable = (fieldName: string) => {
            const field = enabledFields.find(
              (field: { field: string; editable?: boolean }) =>
                field.field === fieldName
            );
            return field?.editable === true;
          };
   
          setCheckoutDetailsHandler({
            checkoutDetails: {
              currencySymbol: symbol,
              amount: paymentDetails.money.amountLocaleFull,
              token: token,
              brandColor:
                response.data.merchantDetails.checkoutTheme.primaryButtonColor,
              env: env,
              itemsLength: totalItemsRef.current,
              errorMessage:
                'You may have cancelled the payment or there was a delay in response. Please retry.',
              shopperToken: shopperToken,
              isSuccessScreenVisible: configurationOptions?.SHOW_BOXPAY_SUCCESS_SCREEN ? true : false,
              isShippingAddressEnabled: isFieldEnabled('SHIPPING_ADDRESS'),
              isShippingAddressEditable: isFieldEditable('SHIPPING_ADDRESS'),
              isFullNameEnabled: isFieldEnabled('SHOPPER_NAME'),
              isFullNameEditable: isFieldEditable('SHOPPER_NAME'),
              isEmailEnabled: isFieldEnabled('SHOPPER_EMAIL'),
              isEmailEditable: isFieldEditable('SHOPPER_EMAIL'),
              isPhoneEnabled: isFieldEnabled('SHOPPER_PHONE'),
              isPhoneEditable: isFieldEditable('SHOPPER_PHONE'),
              isPanEnabled: isFieldEnabled('SHOPPER_PAN'),
              isPanEditable: isFieldEditable('SHOPPER_PAN'),
              isDOBEnabled: isFieldEnabled('SHOPPER_DOB'),
              isDOBEditable: isFieldEditable('SHOPPER_DOB'),
              isUpiIntentMethodEnabled : methodFlags.isUPIIntentVisible,
              isUpiCollectMethodEnabled : methodFlags.isUPICollectVisible,
              isCardMethodEnabled : methodFlags.isCardsVisible,
              isWalletMethodEnabled : methodFlags.isWalletVisible,
              isNetBankingMethodEnabled : methodFlags.isNetbankingVisible,
              isEmiMethodEnabled : methodFlags.isEMIVisible,
              isBnplMethodEnabled : methodFlags.isBNPLVisible
            },
          });
          setPaymentHandler({
            onPaymentResult: onPaymentResult,
          });
        } catch (error) {
          Alert.alert('Error', `${error}`);
        } finally {
          if (shopperToken != null && shopperToken != '') {
            getRecommendedInstruments();
          } else {
            setIsFirstLoading(false);
          } // Set loading to false when API request is finished
        }
      }
    );

  }, [token]);

  const handleRecommendedSectionClick = (instrumentValue: string) => {
    const updatedList = recommendedInstrumentsArray.map((item) => ({
      ...item,
      isSelected: item.id === instrumentValue,
    }));
    setRecommendedInstruments(updatedList);
    setDefaultSavedUpiList();
    setDefaultSavedCardsList();
  };

  const handleSavedUpiSectionClick = (instrumentValue: string) => {
    const updatedList = savedUpiArray.map((item) => ({
      ...item,
      isSelected: item.id === instrumentValue,
    }));
    setSavedUpiArray(updatedList);
    setDefaultRecommendedList();
    setDefaultSavedCardsList();
  };

  const handleSavedCardSectionClick = (instrumentValue: string) => {
    const updatedList = savedCardArray.map((item) => ({
      ...item,
      isSelected: item.id === instrumentValue,
    }));
    setSavedCardArray(updatedList);
    setDefaultRecommendedList();
    setDefaultSavedUpiList();
  };

  const setDefaultRecommendedList = () => {
    const updatedList = recommendedInstrumentsArray.map((item) => ({
      ...item,
      isSelected: false,
    }));
    setRecommendedInstruments(updatedList);
  };

  const setDefaultSavedCardsList = () => {
    const updatedList = savedCardArray.map((item) => ({
      ...item,
      isSelected: false,
    }));
    setSavedCardArray(updatedList);
  };

  const setDefaultSavedUpiList = () => {
    const updatedList = savedUpiArray.map((item) => ({
      ...item,
      isSelected: false,
    }));
    setSavedUpiArray(updatedList);
  };

  function startCountdown(sessionExpiryTimestamp: string) {
    if (sessionExpiryTimestamp === '') {
      return;
    }
    const expiryTime = new Date(sessionExpiryTimestamp);
    const expiryTimeIST = new Date(expiryTime.getTime() + 5.5 * 60 * 60 * 1000);

    timerRef.current = setInterval(() => {
      const currentTimeIST = new Date(
        new Date().getTime() + 5.5 * 60 * 60 * 1000
      );
      const timeDiff = expiryTimeIST.getTime() - currentTimeIST.getTime();
      if (timeDiff <= 0) {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        setStatus('EXPIRED');
        setSessionExppireModalState(true);
      }
      // const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
      // const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
      // const seconds = Math.floor((timeDiff / 1000) % 60);

      // console.log(`${hours}hr ${minutes}min ${seconds}sec`)
    }, 1000);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F6FB' }}>
      <StatusBar barStyle="dark-content" />
      {isFirstLoading ? (
        <ShimmerView />
      ) : loadingState ? (
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <LottieView
            source={require('./assets/animations/boxpayLogo.json')}
            autoPlay
            loop
            style={{ width: 80, height: 80 }}
          />
          <Text>Loading...</Text>
        </View>
      ) : (
        <View style={{ flex: 1, backgroundColor: '#F5F6FB' }}>
          <ScrollView 
            contentContainerStyle={{ flexGrow: 1 }} 
            keyboardShouldPersistTaps="handled" 
          >
            <View style={{ flex: 1 }}>
              <Header
                onBackPress={onExitCheckout}
                showDesc={true}
                showSecure={true}
                text="Payment Details"
              />
              <AddressComponent address={address} navigateToAddressScreen= {() => navigateToAddressScreen()}/>

              {recommendedInstrumentsArray.length > 0 && (
                <>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      style={{
                        marginStart: 14,
                        marginTop: 20,
                        fontSize: 14,
                        color: '#020815B5',
                        fontFamily: 'Poppins-SemiBold',
                      }}
                    >
                      Recommended
                    </Text>
                  </View>
                  <View
                    style={{
                      borderColor: '#F1F1F1',
                      borderWidth: 1,
                      marginHorizontal: 16,
                      marginVertical: 8,
                      backgroundColor: 'white',
                      flexDirection: 'column',
                      borderRadius: 12,
                    }}
                  >
                    <PaymentSelectorView
                      providerList={recommendedInstrumentsArray}
                      onProceedForward={(displayValue, instrumentValue, type) =>
                        handleUpiCollectPayment(
                          displayValue,
                          instrumentValue,
                          type
                        )
                      }
                      errorImage={require('./assets/images/ic_upi.png')}
                      isLastUsed={true}
                      onClickRadio={(selectedInstrumentRef) => {
                        handleRecommendedSectionClick(selectedInstrumentRef);
                      }}
                    />
                  </View>
                </>
              )}

              <UpiScreen
                handleUpiPayment={(selectedIntent) =>
                  handlePaymentIntent(selectedIntent)
                }
                handleCollectPayment={(displayValue, instrumentValue, type) =>
                  handleUpiCollectPayment(displayValue, instrumentValue, type)
                }
                savedUpiArray={savedUpiArray}
                onClickRadio={handleSavedUpiSectionClick}
              />

              {savedCardArray.length != 0 && (
                <View>
                  <Text
                    style={{
                      marginStart: 14,
                      marginTop: 20,
                      fontSize: 14,
                      color: '#020815B5',
                      fontFamily: 'Poppins-SemiBold',
                    }}
                  >
                    Credit & Debit Cards
                  </Text>
                  <View
                    style={{
                      borderColor: '#F1F1F1',
                      borderWidth: 1,
                      marginHorizontal: 16,
                      marginVertical: 8,
                      backgroundColor: 'white',
                      flexDirection: 'column',
                      borderRadius: 12,
                    }}
                  >
                    <SavedCardComponentView
                      savedCards={savedCardArray}
                      onProceedForward={(instrumentValue) => {
                        handleUpiCollectPayment('', instrumentValue, 'Card');
                      }}
                      errorImage={require('./assets/images/ic_card.png')}
                      onClickAddCard={navigateToCardScreen}
                      onClickRadio={(selectedInstrumentRef) =>
                        handleSavedCardSectionClick(selectedInstrumentRef)
                      }
                    />
                  </View>
                </View>
              )}
              <MorePaymentMethods savedCards={savedCardArray}/>
              <View>
                <Text
                  style={{
                    marginStart: 16,
                    marginTop: 12,
                    fontSize: 14,
                    color: '#020815B5',
                    fontFamily: 'Poppins-SemiBold',
                  }}
                >
                  Order Summary
                </Text>

                <OrderDetails
                  subTotalAmount={subTotalAmountRef.current}
                  shippingAmount={shippingAmountRef.current}
                  totalAmount={amount}
                  itemsArray={orderItemsArrayRef.current}
                  taxAmount={taxAmountRef.current}
                />
              </View>

              {/* Secured by BoxPay - Fixed at Bottom */}
              <View
                style={{
                  flex: 1,
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
                  source={require('./assets/images/splash-icon.png')}
                  style={{ height: 50, width: 50 }}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      )}

      {/* Modals for Different Payment Statuses */}
      {failedModalOpen && (
        <PaymentFailed
          onClick={() => setFailedModalState(false)}
          errorMessage={paymentFailedMessage.current}
        />
      )}

      {successModalOpen && (
        <PaymentSuccess
          onClick={onExitCheckout}
          transactionId={transactionId}
          method="UPI"
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
              callFetchStatusApi();
              setShowWebView(false);
            }}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default BoxpayCheckout;
