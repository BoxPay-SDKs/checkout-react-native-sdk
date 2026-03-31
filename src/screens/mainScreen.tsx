import { useEffect, useRef, useState } from 'react';
import { View, Text, BackHandler, AppState, Image, ScrollView, Alert, type AppStateStatus } from 'react-native'; // Added ScrollView
import Header from '../components/header';
import upiPostRequest from '../postRequest/upiPostRequest';
import { decode as atob } from 'base-64';
import { Linking } from 'react-native';
import LottieView from 'lottie-react-native';
import PaymentSuccess from '../components/paymentSuccess';
import SessionExpire from '../components/sessionExpire';
import PaymentFailed from '../components/paymentFailed';
import fetchStatus from '../postRequest/fetchStatus';
import UpiScreen from '../screens/upiScreen';
import { useIsFocused, type NavigationProp, type RouteProp } from "@react-navigation/native";
import type { CheckoutStackParamList } from '../navigation';
import { paymentHandler, setPaymentHandler } from "../sharedContext/paymentStatusHandler";
import { loadBoxpayFonts } from '../components/fontFamily';
import { setUserDataHandler, setUserDataHandlerToDefault, userDataHandler } from '../sharedContext/userdataHandler';
import { type PaymentResultObject, type PaymentClass, type InstrumentDetails, type PaymentMethod, type OrderItem, APIStatus, AnalyticsEvents, type DeliveryAddress, type BoxpayCheckoutProps, type GetInstantOffersResponse, UIConfigurationOptions, TransactionStatus, type SubscriptionDetails } from '../interface';
import { checkoutDetailsHandler, setCheckoutDetailsHandler, setCheckOutDetailsHandlerToDefault } from '../sharedContext/checkoutDetailsHandler';
import WebViewScreen from '../screens/webViewScreen';
import styles from '../styles/indexStyles';
import getSymbolFromCurrency from 'currency-symbol-map';
import type { ItemsProp, SurchargeProp } from '../components/orderDetails';
import OrderDetails from '../components/orderDetails';
import PaymentSelectorView from '../components/paymentSelector';
import SavedCardComponentView from '../components/savedCardComponent';
import ShimmerView from '../components/shimmerView';
import AddressComponent from '../components/addressCard';
import fetchSessionDetails from '../postRequest/fetchSessionDetails';
import MorePaymentMethods from '../components/morePaymentMethods';
import { fetchSavedInstrumentsHandler, handleFetchStatusResponseHandler, handlePaymentResponse } from '../sharedContext/handlePaymentResponseHandler';
import callUIAnalytics from '../postRequest/callUIAnalytics';
import { formatAddress, formatDate, getPhoneNumberCodeAndCountryName, isEmpty, useCountdown } from '../utility';
import fetchSurCharge from '../postRequest/fetchSurcharge';
import fetchInstantOffer from '../postRequest/fetchInstantOffer';
import ApplyCouponCard from '../components/applyCouponCard';
import { handleAutoNavigation } from '../sharedContext/handleAutoNavigation';

type MainScreenRouteProp = RouteProp<CheckoutStackParamList, 'MainScreen'>;

// Define the screen's navigation properties
type MainScreenNavigationProp = NavigationProp<CheckoutStackParamList, 'MainScreen'>;

interface MainScreenProps {
  route: MainScreenRouteProp;
  navigation: MainScreenNavigationProp;
}


const MainScreen = ({route, navigation} : MainScreenProps) => {
  const {
    token,
    configurationOptions = null,
    onPaymentResult,
    shopperToken = null,
    uiConfiguration = null
  } = route.params as BoxpayCheckoutProps || {}; 
  const [status, setStatus] = useState('NOACTION');
  const [transactionId, setTransactionId] = useState('');
  const isScreenFocused = useIsFocused()
  const appStateListenerRef = useRef<any>(null);
  const [loadingState, setLoadingState] = useState(false);
  const [isFirstLoading, setIsFirstLoading] = useState(true);
  const [amount, setAmount] = useState(0);
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
  const [surchargeDetails, setSurchargeDetails] = useState<SurchargeProp[]>([])
  const subTotalAmountRef = useRef('');
  const orderItemsArrayRef = useRef<ItemsProp[]>([]);
  const [recommendedInstrumentsArray, setRecommendedInstruments] = useState<PaymentClass[]>([]);
  const [savedCardArray, setSavedCardArray] = useState<PaymentClass[]>([]);
  const [savedUpiArray, setSavedUpiArray] = useState<PaymentClass[]>([]);
  const { 
    timeRemaining: qrTimerValue, 
    start: startQRTimer, 
    stop: stopQRTimer 
  } = useCountdown(300)

  let isFirstTimeLoadRef = useRef(true);

  const [appliedOffer, setAppliedOffer] = useState<GetInstantOffersResponse | null>(null)
  const [appliedSurchargeAmount, setAppliedSurchargeAmount] = useState<number>(0)
  const [instantOfferList , setInstantOfferList] = useState<GetInstantOffersResponse[]>([])
  const [isOfferApplied, setIsOfferApplied] = useState(false)

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('')

  const handlePaymentIntent = async (selectedIntent: string) => {
    setLoadingState(true);
    const response = await upiPostRequest({
      type: checkoutDetailsHandler.checkoutDetails.isUPIOtmIntentMethodEnabled ? "upiotm/intent" : 'upi/intent',
      ...(selectedIntent && { upiAppDetails: { upiApp: selectedIntent } }), // Conditionally add upiAppDetails only if upiIntent is present
    }, false);
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
      onNavigateToTimer: (id:string)=> navigation.navigate("UpiTimerScreen", {upiId : id}),
      onOpenUpiIntent : (url) => {
        urlToBase64(url);
      },
      setLoading: setLoadingState
    });
  };

  const handleUpiCollectPayment = async (
    upiId: string,
    instrumentRef: string,
    type: string,
    isSICheckBoxClicked : boolean
  ) => {
    const requestPayload: InstrumentDetails =
      type === 'Card'
        ? {
            type: 'card/token',
            savedCard: { instrumentRef: instrumentRef },
          }
        : {
            type: checkoutDetailsHandler.checkoutDetails.isUPIOtmCollectMethodEnabled ? "upiotm/collect" : 'upi/collect',
            upi: instrumentRef
              ? { instrumentRef: instrumentRef }
              : { shopperVpa: upiId },
          };
    setLoadingState(true);
    const response = await upiPostRequest(requestPayload, isSICheckBoxClicked);
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
      onNavigateToTimer: (id:string)=> navigation.navigate("UpiTimerScreen", {upiId : id}),
      onOpenUpiIntent : (url) => {
        urlToBase64(url);
      },
      setLoading: setLoadingState
    });
  };

  useEffect(() => {
    if (isFirstTimeLoadRef.current) {
      isFirstTimeLoadRef.current = false;
      return;
    }
    const refreshData = () => {
      const deliveryAddress : DeliveryAddress = {
        address1 : userDataHandler.userData.address1,
        address2 : userDataHandler.userData.address2,
        city : userDataHandler.userData.city,
        state :  userDataHandler.userData.state,
        postalCode : userDataHandler.userData.pincode,
        countryCode: userDataHandler.userData.countryCode,
        labelName : userDataHandler.userData.labelName,
        labelType : userDataHandler.userData.labelType
      }
      setAddress(formatAddress(deliveryAddress))
    };

    refreshData();
  }, [isScreenFocused]);

  useEffect(() => {
    const isQRTimerRunning = qrTimerValue < 300

    if(isQRTimerRunning && qrTimerValue > 0 && qrTimerValue % 4 === 0) {
      callFetchStatusApi()
    }
  }, [qrTimerValue])

  const urlToBase64 = (base64String: string) => {
    try {
      const decodedString = atob(base64String);
      lastOpenendUrl.current = decodedString;
      openUPIIntent(decodedString);
    } catch (error) {
      setFailedModalState(true);
      callUIAnalytics(AnalyticsEvents.FAILED_TO_LAUNCH_UPI_INTENT,"Index Screen UrlToBase64 failed",`${error}`)
      setLoadingState(false);
    }
  };

  const getRecommendedInstruments = async () => {
    fetchSavedInstrumentsHandler({
      setRecommendedList: setRecommendedInstruments,
      setUpiInstrumentList : setSavedUpiArray,
      setCardInstrumentList : setSavedCardArray
    });
  };

  useEffect(() => {
    if (paymentUrl || paymentHtml) {
      setShowWebView(true);
    }
  }, [paymentUrl, paymentHtml]);

  const openUPIIntent = async (url: string) => {
    try {
      appStateListenerRef.current?.remove?.();
      appStateListenerRef.current = AppState.addEventListener(
        "change",
        handleAppStateChange
      );
  
      isUpiOpeningRef.current = true;
  
      await Linking.openURL(url);
  
    } catch (error) {
      isUpiOpeningRef.current = false;
      callUIAnalytics(
        AnalyticsEvents.FAILED_TO_LAUNCH_UPI_INTENT,
        "Index Screen open UPI Intent failed",
        `${error}`
      );
      setFailedModalState(true);
      setLoadingState(false);
    }
  };

  const handleAppStateChange = (nextState: AppStateStatus) => {
  
    if (nextState === "active" && isUpiOpeningRef.current) {
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
        setLoading: setLoadingState,
        isFromUPIIntentFlow : isUpiOpeningRef.current
      });
      appStateListenerRef.current?.remove();
      isUpiOpeningRef.current = false;
  };

  const onExitCheckout = () => {
    if (!loadingState) {
      stopExpireTimerCountDown();
      setSessionExppireModalState(false)
      setSuccessModalState(false)
      const mockPaymentResult: PaymentResultObject = {
        status: status,
        transactionId: transactionId,
      };
      setUserDataHandlerToDefault()
      setCheckOutDetailsHandlerToDefault()
      paymentHandler.onPaymentResult(mockPaymentResult);
      return true;
    }
    return false;
  };

  useEffect(() => {

    const backAction = () => {
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
      return onExitCheckout();
    }
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [navigation]);

  useEffect(() => {
    async function loadFonts() {
      await loadBoxpayFonts()
    }
    loadFonts()

    async function loadSession() {
      if(token != "") {        
        checkoutDetailsHandler.checkoutDetails.token = token
        checkoutDetailsHandler.checkoutDetails.env = configurationOptions?.ENABLE_SANDBOX_ENV ? 'test' : 'prod'
        const response = await fetchSessionDetails()
        try {
          switch(response.apiStatus) {
            case APIStatus.Success : {
              const paymentMethods = response.data.configs.paymentMethods;
                const enabledFields = response.data.configs.enabledFields;
                const paymentDetails = response.data.paymentDetails;
                const methodFlags = {
                  isUPIIntentVisible: false,
                  isUPICollectVisible: false,
                  isUPIQRVisible : false,
                  isCardsVisible: false,
                  isWalletVisible: false,
                  isNetbankingVisible: false,
                  isEMIVisible: false,
                  isBNPLVisible: false,
                  isUPIOtmIntentVisible : false,
                  isUPIOtmCollectVisible :false,
                  isUPIOtmQRVisible : false
                };
                
                paymentMethods.forEach((method: PaymentMethod) => {
                  switch (method.type) {
                    case 'Upi':
                      setSelectedPaymentMethod('upi')
                      switch (method.brand) {
                        case 'UpiIntent':
                          methodFlags.isUPIIntentVisible = true;
                          break;
                        case 'UpiCollect':
                          methodFlags.isUPICollectVisible = true;
                          break;
                        case 'UpiQr':
                          methodFlags.isUPIQRVisible = true;
                          break;
                      }
                      break;

                    case 'UpiOneTimeMandate':
                      switch (method.brand) {
                        case 'UpiIntentOtm':
                          methodFlags.isUPIOtmIntentVisible = true;
                          break;
                        case 'UpiCollectOtm':
                          methodFlags.isUPIOtmCollectVisible = true;
                          break;
                        case 'UpiQrOtm':
                          methodFlags.isUPIOtmQRVisible = true;
                          break;
                      }
                      break;
                
                    case 'Card':
                      methodFlags.isCardsVisible = true;
                      break;
                
                    case 'Wallet':
                      methodFlags.isWalletVisible = true;
                      break;
                
                    case 'NetBanking':
                      methodFlags.isNetbankingVisible = true;
                      break;
                
                    case 'Emi':
                      methodFlags.isEMIVisible = true;
                      break;
                
                    case 'BuyNowPayLater':
                      methodFlags.isBNPLVisible = true;
                      break;
                  }
                });
                
            
                setAmount(paymentDetails.money.amount);
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
                let countryCodeRef = "IN";
                if (paymentDetails.shopper.deliveryAddress != null) {
                  const deliveryObject = paymentDetails.shopper.deliveryAddress;
                  labelTypeRef = deliveryObject.labelType;
                  labelNameRef = deliveryObject.labelName;
                  address1Ref = deliveryObject.address1;
                  address2Ref = deliveryObject.address2;
                  cityRef = deliveryObject.city;
                  stateRef = deliveryObject.state;
                  postalCodeRef = deliveryObject.postalCode;
                  countryCodeRef = deliveryObject.countryCode ?? "IN";
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
                  setStatus(TransactionStatus.Success);
                  setSuccessModalState(true);
                } else if (['EXPIRED'].includes(response.data.status)) {
                  setStatus(TransactionStatus.Expired);
                  setSessionExppireModalState(true);
                }

                const selectedCountry = getPhoneNumberCodeAndCountryName(countryCodeRef)
                setUserDataHandler({
                  userData: {
                    email: emailRef,
                    firstName: firstNameRef,
                    lastName: lastNameRef,
                    completePhoneNumber: phoneRef,
                    phoneCode : selectedCountry?.isdCode ?? "+91",
                    uniqueId: uniqueIdRef,
                    dob: dobRef,
                    pan: panRef,
                    address1: address1Ref,
                    address2: address2Ref,
                    city: cityRef,
                    state: stateRef,
                    pincode: postalCodeRef,
                    countryCode: countryCodeRef,
                    countryName : selectedCountry?.fullName ?? "India",
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
                    (field: { field: string; editable: boolean }) =>
                      field.field === fieldName
                  );
                  return field?.editable === true;
                };
         
                setCheckoutDetailsHandler({
                  checkoutDetails: {
                    currencySymbol: symbol,
                    currencyCode : currencyCode,
                    amount: paymentDetails.money.amountLocaleFull,
                    token: token,
                    fontFamily: uiConfiguration?.[UIConfigurationOptions.FontFamily] 
                    ? {
                      regular:  uiConfiguration[UIConfigurationOptions.FontFamily]?.regular  ?? 'Poppins-Regular',
                      medium:   uiConfiguration[UIConfigurationOptions.FontFamily]?.medium   ?? 'Poppins-Medium',
                      semiBold: uiConfiguration[UIConfigurationOptions.FontFamily]?.semiBold ?? 'Poppins-SemiBold',
                      bold:     uiConfiguration[UIConfigurationOptions.FontFamily]?.bold     ?? 'Poppins-Bold',
                      extraBold : uiConfiguration[UIConfigurationOptions.FontFamily]?.extraBold   ?? 'Poppins-ExtraBold'
                    } 
                    : {
                      regular:  'Poppins-Regular',
                      medium:   'Poppins-Medium',
                      semiBold: 'Poppins-SemiBold',
                      bold:     'Poppins-Bold',
                      extraBold: 'Poppins-ExtraBold'
                    },
                    ctaBorderRadius : uiConfiguration?.[UIConfigurationOptions.CTABorderRadius] ? uiConfiguration[UIConfigurationOptions.CTABorderRadius] : 12, 
                    buttonColor: response.data.merchantDetails.checkoutTheme.primaryButtonColor,
                    textInputFieldFocusedOutlineColor: uiConfiguration?.[UIConfigurationOptions.TextInputFields]?.focusedBorderColor ? uiConfiguration[UIConfigurationOptions.TextInputFields].focusedBorderColor : '#2D2B32',
                    textInputFieldUnFocusedOutlineColor : uiConfiguration?.[UIConfigurationOptions.TextInputFields]?.borderColor ? uiConfiguration[UIConfigurationOptions.TextInputFields].borderColor : '#E6E6E6',
                    buttonTextColor : response.data.merchantDetails.checkoutTheme.buttonTextColor,
                    headerColor : response.data.merchantDetails.checkoutTheme.headerColor,
                    headerTextColor : response.data.merchantDetails.checkoutTheme.headerTextColor,
                    env: checkoutDetailsHandler.checkoutDetails.env,
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
                    isUpiQRMethodEnabled : methodFlags.isUPIQRVisible,
                    isCardMethodEnabled : methodFlags.isCardsVisible,
                    isWalletMethodEnabled : methodFlags.isWalletVisible,
                    isNetBankingMethodEnabled : methodFlags.isNetbankingVisible,
                    isEmiMethodEnabled : methodFlags.isEMIVisible,
                    isBnplMethodEnabled : methodFlags.isBNPLVisible,
                    isUPIOtmCollectMethodEnabled : methodFlags.isUPIOtmCollectVisible,
                    isUPIOtmIntentMethodEnabled : methodFlags.isUPIOtmIntentVisible,
                    isUPIOtmQRMethodEnabled : methodFlags.isUPIOtmQRVisible,
                    isOrderItemDetailsVisible : isFieldEnabled('ORDER_ITEM_DETAILS'),
                    isSICheckboxVisible : configurationOptions?.SHOW_SI_CHECKBOX ? true : false,
                    isSubscriptionCheckout : paymentDetails.subscriptionDetails != null ? true : false,
                    subscriptionDetails : getSubscriptionDetails(paymentDetails.subscriptionDetails, paymentDetails.money.amountLocaleFull, symbol)
                  },
                });
                setPaymentHandler({
                  onPaymentResult: onPaymentResult,
                });
                handleSurchargeDetails()
                callUIAnalytics(AnalyticsEvents.CHECKOUT_LOADED,"Index Screen Session Loaded","")
              break;
            }
            case APIStatus.Failed : {
              Alert.alert('Error', response.data.status.reason);
              break
            }
            default : {
              break
            }
          }
        } catch(error) {
          Alert.alert('Error', `${error}`);
        }
      } else {
        Alert.alert('Error', `Token is empty`);
      }
    }
    loadSession()
  }, []);

  const getSubscriptionDetails = (data: SubscriptionDetails | null, amount : string, currencySymbol : string) => {
    if (isEmpty(data)) return null;

    const { billingCycle } = data!;
  
    // Frequency
    let frequency: string | null = null;
    if (!isEmpty(billingCycle)) {
      const { billingCycleValue, count, billingTimeUnit } = billingCycle!;
  
      if (count === 1) {
        frequency = billingTimeUnit;
      } else {
        frequency = `Every ${count} ${billingCycleValue}`;
      }
    }
  
    // Validity
    let validity: string | null = null;
    if (!isEmpty(data!.expiryDateLocale)) {
      const date = formatDate(data!.expiryDateLocale!.split(' ')[0] ?? "");
      validity = `${date}`;
    } else if (!isEmpty(data!.recurringExpiryDateLocale)) {
      const date = formatDate(data!.recurringExpiryDateLocale!.split(' ')[0] ?? "");
      validity = `${date}`;
    }
  
    const rows = [
      {
        label: 'To be paid now',
        value: !isEmpty(amount) ? `${currencySymbol}${amount}` : null,
      },
      {
        label: 'Recurring Amount',
        value: !isEmpty(data!.maxAmountLocaleFull) ? `Up to ${currencySymbol}${data!.maxAmountLocaleFull}` : null,
      },
      {
        label: 'Frequency',
        value: frequency,
      },
      {
        label: 'Expiry Date',
        value: validity,
      },
    ];
    return rows.filter(row => !isEmpty(row.value));
};

  const handleSurchargeDetails = async() => {
    const response = await fetchSurCharge()
    switch (response.apiStatus) {
      case APIStatus.Success : {
        const data = response.data
        try {
          if(data.appliedSurcharges.length != 0 ) {
            const surcharge = data.appliedSurcharges.map(item => ({
              title: item.surchargeDetails.title,
              amount: item.calculatedSurchargeFee,
              applicable : item.surchargeDetails.applicableOn
            }))
  
            let sum = 0
            surcharge.map((item) => {
              if (item.applicable === 'Upi' || item.applicable === '') {
                sum += item.amount;
              }
            }, 0);
            setAppliedSurchargeAmount((sum + amount))
            setSurchargeDetails(surcharge)
            getInstantOfferDetails((sum + amount).toString())
          } else {
            getInstantOfferDetails("")
          }
        }catch(e) {
          getInstantOfferDetails("")
        }
        break
      }
      case APIStatus.Failed : {
        getInstantOfferDetails("")
        break
      }

      default : {
        getInstantOfferDetails("")
        break
      }
    }
  }

  const getInstantOfferDetails = async(amount : string) => {
    const response = await fetchInstantOffer(amount)
    switch (response.apiStatus) {
      case APIStatus.Success : {
        const data = response.data
        try {
          const offer =
          appliedOffer == null
          ? data?.[0] ?? null
          : data.find((it: GetInstantOffersResponse) => it.code === appliedOffer.code) ?? null;
        setAppliedOffer(offer)
        setInstantOfferList(data)
        } catch(e) {
          
        }
        
        callRecommendedOrStopLoding()
        break
      }
      case APIStatus.Failed : {
        callRecommendedOrStopLoding()
        break
      }

      default : {
        callRecommendedOrStopLoding()
        break
      }
    }
  }

  const callRecommendedOrStopLoding =async() => {
    if(shopperToken != null && shopperToken != "") {
      await getRecommendedInstruments()
      checkAutoNavigation()
    } else {
      checkAutoNavigation()
    }
  }

  const checkAutoNavigation = () => {
    const targetScreen = handleAutoNavigation(
      status,
      savedCardArray
    )
    if (!targetScreen) {
      setIsFirstLoading(false)
    } else {
      navigation.navigate(targetScreen, {isAutoNavigationEnabled : true})
    }
  }


  const onClickCoupon = (code : string) => {
    console.log(`selected code is ${code}`)
  }
  const onClickRemoveCoupon = () => {
    console.log("onclide removed coipon is clided")
  }

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
    <View style={styles.screenView}>
      {/* <StatusBar barStyle="dark-content" /> */}
      {isFirstLoading ? (
        <ShimmerView />
      ) : (
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
              <AddressComponent address={address} navigateToAddressScreen= {() => {
                if(checkoutDetailsHandler.checkoutDetails.shopperToken != null && checkoutDetailsHandler.checkoutDetails.shopperToken != "") {
                  navigation.navigate("SavedAddressScreen", {})
                } else {
                  navigation.navigate("AddressScreen", {isNewAddress : address == ""})
                }
              }}/>

              {recommendedInstrumentsArray.length > 0 && (
                <>
                  <View
                    style={styles.container}
                  >
                    <Text
                      style={[styles.headingText, {fontFamily: checkoutDetailsHandler.checkoutDetails.fontFamily.semiBold,}]}
                    >
                      Recommended
                    </Text>
                  </View>
                  <View
                    style={styles.paymentContainer}
                  >
                    <PaymentSelectorView
                      providerList={recommendedInstrumentsArray}
                      onProceedForward={(displayValue, instrumentValue, type) =>
                        handleUpiCollectPayment(
                          displayValue,
                          instrumentValue,
                          type,
                          false
                        )
                      }
                      errorImage={require('../../assets/images/ic_upi.png')}
                      isLastUsed={true}
                      onClickRadio={(selectedInstrumentRef) => {
                        handleRecommendedSectionClick(selectedInstrumentRef);
                      }}
                    />
                  </View>
                </>
              )}

              <UpiScreen
                handleUpiPayment={(selectedIntent : string) =>
                  handlePaymentIntent(selectedIntent)
                }
                handleCollectPayment={(displayValue : string, instrumentValue : string, type : string) =>
                  handleUpiCollectPayment(displayValue, instrumentValue, type, false)
                }
                savedUpiArray={savedUpiArray}
                onClickRadio={handleSavedUpiSectionClick}
                qrIsExpired = {qrTimerValue === 0}
                timeRemaining={qrTimerValue}
                stopTimer = {stopQRTimer}
                setLoading={setLoadingState}
                setStatus={setStatus}
                setTransaction={setTransactionId}
                onStartQRTimer={startQRTimer}
                setFailedModal={setFailedModalState}
                setFailedModalMessage={(msg) => (paymentFailedMessage.current = msg)}
              />

              {savedCardArray.length != 0 && (
                <View>
                  <Text
                    style={[styles.headingText, {fontFamily: checkoutDetailsHandler.checkoutDetails.fontFamily.semiBold,}]}
                  >
                    Credit & Debit Cards
                  </Text>
                  <View
                    style={styles.paymentContainer}
                  >
                    <SavedCardComponentView
                      savedCards={savedCardArray}
                      onProceedForward={(instrumentValue : string, isSICheckBoxClicked : boolean) => {
                        handleUpiCollectPayment('', instrumentValue, 'Card', isSICheckBoxClicked);
                      }}
                      errorImage={require('../../assets/images/ic_card.png')}
                      onClickAddCard={() => navigation.navigate("CardScreen", {})}
                      onClickRadio={(selectedInstrumentRef : string) =>{
                        stopQRTimer()
                        handleSavedCardSectionClick(selectedInstrumentRef)
                      }
                      }
                    />
                  </View>
                </View>
              )}
              <MorePaymentMethods savedCards={savedCardArray} stopTimer={stopQRTimer} setSelectedPaymentMethod={setSelectedPaymentMethod} surchargeDetails={surchargeDetails}/>
              {instantOfferList.length != 0 && (
                <View
                  style={{
                    marginVertical: 8,
                    marginHorizontal: 16,
                    paddingBottom: 16,
                  }}
                >
                  <Text
                  style={[styles.headingText, {fontFamily: checkoutDetailsHandler.checkoutDetails.fontFamily.semiBold,}]}
                >
                  Apply Coupon
                </Text>
                <ApplyCouponCard
                selectedColor = {checkoutDetailsHandler.checkoutDetails.buttonColor}
                code={appliedOffer?.code ?? ""}
                description={appliedOffer?.description ?? ""}
                discountAmount={appliedOffer?.discount?.amount?.toString() ?? ""}
                currencySymbol={checkoutDetailsHandler.checkoutDetails.currencySymbol}
                isCodeApplied = {isOfferApplied}
                onClickApply={(code : string) => {
                  const offer = instantOfferList.find((it: GetInstantOffersResponse) => it.code === code) ?? null
                  setAppliedOffer(offer)
                  setIsOfferApplied(true)
                }}
                onClickRemove={() => {
                  setAppliedOffer(instantOfferList[0] ?? null)
                  setIsOfferApplied(false)
                }}
                onClickViewAll={() => {
                  navigation.navigate("InstantOfferScreen", {
                    couponList : instantOfferList,
                    selectedCouponCode : appliedOffer?.code ?? "",
                    selectedColor : checkoutDetailsHandler.checkoutDetails.buttonColor,
                    onClickCoupon : onClickCoupon,
                    onClickRemoveCoupon: onClickRemoveCoupon
                  })
                }}
                />
                </View>
              )}
              {checkoutDetailsHandler.checkoutDetails.isOrderItemDetailsVisible && (
                <View>
                <Text
                  style={[styles.headingText, {fontFamily: checkoutDetailsHandler.checkoutDetails.fontFamily.semiBold,}]}
                >
                  Order Summary
                </Text>

                <OrderDetails
                  subTotalAmount={subTotalAmountRef.current}
                  shippingAmount={shippingAmountRef.current}
                  totalAmount={appliedSurchargeAmount != 0 ? appliedSurchargeAmount.toString() : amount.toString()}
                  itemsArray={orderItemsArrayRef.current}
                  taxAmount={taxAmountRef.current}
                  surchargeDetails={surchargeDetails}
                  selectedPaymentMethod={selectedPaymentMethod}
                />
              </View>
              )}

              {/* Secured by BoxPay - Fixed at Bottom */}
              <View
                style={styles.footerContainer}
              >
                <Text
                  style={[styles.footerText, {fontFamily: checkoutDetailsHandler.checkoutDetails.fontFamily.medium,}]}
                >
                  Secured by
                </Text>
                <Image
                  source={require('../../assets/images/splash-icon.png')}
                  style={styles.footerImage}
                />
              </View>
            </View>
        </ScrollView>
      )}

      {loadingState && (
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
          style={styles.webViewScreenStyle}
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
    </View>
  );
};

export default MainScreen;
