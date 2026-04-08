import type { NavigationProp, RouteProp } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { useEffect, useRef, useState } from 'react';
import {
  BackHandler,
  Image,
  InputAccessoryView,
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { TextInput } from 'react-native-paper';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import { SvgUri } from 'react-native-svg';
import Toast from 'react-native-toast-message';
import CheckBoxContainer from '../components/checkboxContainer';
import CvvInfoBottomSheet from '../components/cvvInfoBottomSheet';
import Header from '../components/header';
import KnowMoreBottomSheet from '../components/knowMoreBottomSheet';
import PaymentFailed from '../components/paymentFailed';
import PaymentSuccess from '../components/paymentSuccess';
import SessionExpire from '../components/sessionExpire';
import { APIStatus, TransactionStatus, type CardScreenParams, type PaymentResultObject } from '../interface';
import type { CheckoutStackParamList } from '../navigation';
import cardPostRequest from '../postRequest/cardPostRequest';
import emiPostRequest from '../postRequest/emiPostRequest';
import fetchCardDetails from '../postRequest/fetchCardDetails';
import fetchStatus from '../postRequest/fetchStatus';
import { checkoutDetailsHandler, setCheckOutDetailsHandlerToDefault } from '../sharedContext/checkoutDetailsHandler';
import { handleFetchStatusResponseHandler, handlePaymentResponse } from '../sharedContext/handlePaymentResponseHandler';
import { paymentHandler } from '../sharedContext/paymentStatusHandler';
import { setUserDataHandlerToDefault } from '../sharedContext/userdataHandler';
import styles from '../styles/screens/cardScreenStyles';
import WebViewScreen from './webViewScreen';
import SubscriptionRow from '../components/subscriptionRow';
import { getTextInputTheme } from '../sharedContext/getTextInputTheme';

type CardScreenRouteProp = RouteProp<CheckoutStackParamList, 'CardScreen'>;

// Define the screen's navigation properties
type CardScreenNavigationProp = NavigationProp<CheckoutStackParamList, 'CardScreen'>;

interface Props {
  route: CardScreenRouteProp;
  navigation: CardScreenNavigationProp;
}

const CardScreen = ({ route, navigation }: Props) => {
  const {
    duration,
    bankName,
    bankUrl,
    offerCode,
    amount,
    percent,
    cardType,
    issuerBrand,
    isAutoNavigationEnabled
  } = route.params as CardScreenParams || {}; 
  const durationNumber = Array.isArray(duration) ? duration[0] : duration;
  const bankNameStr = Array.isArray(bankName) ? bankName[0] : bankName;
  const bankUrlStr = Array.isArray(bankUrl) ? bankUrl[0] : bankUrl;
  const offerCodeStr = Array.isArray(offerCode) ? offerCode[0] : offerCode;
  const amountStr = Array.isArray(amount) ? amount[0] : amount;
  const percentNumber = Array.isArray(percent) ? percent[0] : percent;
  const cardTypeStr = Array.isArray(cardType) ? cardType[0] : cardType;

  const { checkoutDetails } = checkoutDetailsHandler;

  const [cardNumberText, setCardNumberText] = useState<string | null>(null);
  const [cardExpiryText, setCardExpiryText] = useState<string | null>(null);
  const [cardCvvText, setCardCvvText] = useState<string | null>(null);
  const [cardHolderNameText, setCardHolderNameText] = useState<string | null>(
    null
  );
  const [cardNickNameText, setCardNickNameText] = useState<string | null>(null);

  const [cardSelectedIcon, setCardSelectedIcon] = useState(
    require('../../assets/images/ic_card.png')
  );
  const [maxCvvLength, setMaxCvvLength] = useState(4);
  const [maxCardNumberLength, setMaxCardNumberLength] = useState(19);
  const [loading, setLoading] = useState(false);

  const [cardNumberError, setCardNumberError] = useState(false);
  const [cardExpiryError, setCardExpiryError] = useState(false);
  const [cardCvvError, setCardCvvError] = useState(false);
  const [cardHolderNameError, setCardHolderNameError] = useState(false);

  const [cardNumberErrorText, setCardNumberErrorText] = useState<string>(
    'This card number is invalid'
  );
  const [cardExpiryErrorText, setCardExpiryErrorText] =
    useState<string>('Expiry is invalid');
  const [cardCvvErrorText, setCardCvvErrorText] =
    useState<string>('CVV is invalid');
  const [cardHolderNameErrorText, setCardHolderNameErrorText] =
    useState<string>('This card name is invalid');

  const [cardNumberValid, setCardNumberValid] = useState(true);
  const [cardExpiryValid, setCardExpiryValid] = useState(true);
  const [methodEnabled, setMethodEnabled] = useState(true);

  const [cardNumberFocused, setCardNumberFocused] = useState(false);
  const [cardExpiryFocused, setCardExpiryFocused] = useState(false);
  const [cardCvvFocused, setCardCvvFocused] = useState(false);
  const [cardHolderNameFocused, setCardHolderNameFocused] = useState(false);
  const [cardNickNameFocused, setCardNickNameFocused] = useState(false);

  const [cardValid, setCardValid] = useState(false);
  const [showCvvInfo, setShowCvvInfo] = useState(false);
  const [showKnowMoreDialog, setKnowMoreDialog] = useState(false);
  const [isSavedCardCheckBoxClicked, setIsSavedCardCheckBoxClicked] =
    useState(false);
  
  const [isSICheckBoxClicked, setIsSICheckBoxClicked] = useState(false)
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

  const [status, setStatus] = useState<string>(TransactionStatus.NoAction);
  const [transactionId, setTransactionId] = useState<string | null>(null);

  const backgroundApiInterval = useRef<NodeJS.Timeout | null>(null);

  const [imageLoad, setImageLoad] = useState(true);
  const [imageError, setImageError] = useState(false);

  const [emiIssuerExist, setEmiIssuerExist] = useState(true);
  const [emiIssuer, setEmiIssuer] = useState('');
  const [shopperToken, setShopperToken] = useState<string | null>(null);

  const cardNumberAccessoryID = "cardNumberAccessoryID";
  const cardExpiryAccessoryID = "cardExpiryAccessoryID";
  const cardCvvAccessoryID = "cardCvvAccessoryID";
  const cardHolderNameAccessoryID = "cardHolderNameAccessoryID";
  const cardNickNameAccessoryID = "cardNickNameAccessoryID";

  const handleCardNumberTextChange = async (text: string) => {
    if (text == '') {
      setCardNumberText(text);
    } else {
      const cleaned = text.replace(/[^\d]/g, '');

      // Add space every 4 digits
      const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || '';

      setCardNumberText(formatted);
      if (formatted.length > 10) {
        if (
          (formatted.length == 18 && maxCardNumberLength == 18) ||
          formatted.length == 19
        ) {
          if (!isValidCardNumberByLuhn(formatted.replace(/ /g, ''))) {
            setCardNumberValid(false);
          } else {
            setCardNumberValid(true);
          }
        }
        if(cleaned.length >= 9) {
          await fetchCardDetails(cleaned.slice(0,9)).then((response) => {
            switch (response.apiStatus) {
              case APIStatus.Success : {
                const data = response.data
                if('paymentMethod' in data) {
                  if (durationNumber != undefined && durationNumber != '') {
                    setEmiIssuerExist(data.issuerName != '' && data.issuerName != null);
                    setEmiIssuer(data.issuerName ?? "");
                  }
                  setMethodEnabled(data.methodEnabled);
                  if (data.paymentMethod.brand == 'VISA') {
                    setCardSelectedIcon(require('../../assets/images/ic_visa.png'));
                    setMaxCvvLength(3);
                    setMaxCardNumberLength(19);
                  } else if (data.paymentMethod.brand == 'Mastercard') {
                    setCardSelectedIcon(require('../../assets/images/ic_masterCard.png'));
                    setMaxCvvLength(3);
                    setMaxCardNumberLength(19);
                  } else if (data.paymentMethod.brand == 'RUPAY') {
                    setCardSelectedIcon(require('../../assets/images/ic_rupay.png'));
                    setMaxCvvLength(3);
                    setMaxCardNumberLength(19);
                  } else if (data.paymentMethod.brand == 'AmericanExpress') {
                    setCardSelectedIcon(require('../../assets/images/ic_amex.png'));
                    setMaxCvvLength(4);
                    setMaxCardNumberLength(checkoutDetails.env === 'test' ? 19 : 18);
                  } else if (data.paymentMethod.brand == 'Maestro') {
                    setCardSelectedIcon(require('../../assets/images/ic_maestro.png'));
                    setMaxCvvLength(3);
                    setMaxCardNumberLength(19);
                  } else {
                    setCardSelectedIcon(
                      require('../../assets/images/ic_card.png')
                    );
                    setMaxCvvLength(3);
                    setMaxCardNumberLength(19);
                  }
                }
                break
              }
              case APIStatus.Failed : {
                Toast.show({
                  type: 'error',
                  text1: 'Oops!',
                  text2: 'Something went wrong. Please try again.',
              });
                break 
              }
              default : {
                break
              }
            }
          });
        }
      } else {
        setCardSelectedIcon(require('../../assets/images/ic_card.png'));
        setMaxCvvLength(3);
        setMaxCardNumberLength(19);
      }
    }
  };

  const isSubscriptionDetailsVisible =
  checkoutDetails.isSubscriptionCheckout &&
  (isSICheckBoxClicked || !checkoutDetails.isSICheckboxVisible);

  const isValidCardNumberByLuhn = (stringInputCardNumber: string): boolean => {
    const minCardLength = 13;

    if (stringInputCardNumber.length < minCardLength) {
      return false;
    }

    let sum = 0;
    let isSecondDigit = false;

    for (let i = stringInputCardNumber.length - 1; i >= 0; i--) {
      let d = parseInt(stringInputCardNumber[i] as string, 10);

      if (isSecondDigit) {
        d *= 2;
      }

      sum += Math.floor(d / 10);
      sum += d % 10;

      isSecondDigit = !isSecondDigit;
    }

    const result = sum % 10 === 0;

    return result;
  };

  const handleCardNumberBlur = () => {
    const cleaned = cardNumberText?.replace(/ /g, '') || '';
    const cleanedLength = maxCardNumberLength == 19 ? 16 : 15;
    setCardNumberErrorText(
      cleaned.length < 1
        ? 'Card Number is required'
        : checkoutDetails.env === 'test'
          ? ''
          : cleaned.length < cleanedLength
            ? 'This card number is invalid'
            : !methodEnabled
              ? 'This card is not supported for the payment'
              : !cardNumberValid
                ? 'This card number is invalid'
                : !emiIssuerExist
                  ? "We couldn't find any EMI plans for this card. Please try using a different card number"
                  : emiIssuer != issuerBrand
                    ? `The card is ${emiIssuer} ${cardType}. Please enter a card number that belongs to ${issuerBrand} ${cardType}`
                    : ''
    );
    setCardNumberError(
      cleaned.length < 1 ||
      (checkoutDetails.env !== 'test' && (
        !methodEnabled ||
        !cardNumberValid ||
        !emiIssuerExist ||
        (emiIssuer != issuerBrand &&
          durationNumber != undefined &&
          durationNumber != '')
      ))
    )
    setCardNumberFocused(false);
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

  useEffect(() => {
    setShopperToken(checkoutDetails.shopperToken);
  }, []);

  const handleCardExpiryTextChange = (text: string) => {
    setCardExpiryText(text);

    if (text === '') {
      return;
    }

    const isDeleting = text.length < (cardExpiryText?.length || 0);

    // Remove all non-digits
    let cleaned = text.replace(/\D/g, '');

    // Handle backspace on slash
    if (isDeleting && text.endsWith('/')) {
      cleaned = cleaned.slice(0, -1);
    }

    // Limit to 4 digits (MMYY)
    cleaned = cleaned.slice(0, 4);

    // Add leading zero for single-digit month
    if (cleaned.length === 1 && parseInt(cleaned, 10) > 1) {
      cleaned = `0${cleaned}`;
    }

    // Format as MM/YY
    let formatted = cleaned;
    if (cleaned.length > 2) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    } else if (cleaned.length === 2 && !isDeleting) {
      formatted = `${cleaned}/`;
    }

    // Set formatted text
    setCardExpiryText(formatted);

    // Validate month
    let monthError = false;
    if (cleaned.length >= 2) {
      const month = parseInt(cleaned.slice(0, 2), 10);
      monthError = month < 1 || month > 12;
    }

    // Validate year
    let yearError = false;
    if (cleaned.length === 4) {
      const currentYear = new Date().getFullYear() % 100; // Get last two digits of current year
      const currentMonth = new Date().getMonth() + 1;

      const enteredMonth = parseInt(cleaned.slice(0, 2), 10);
      const enteredYear = parseInt(cleaned.slice(2), 10);

      if (enteredYear < currentYear) {
        yearError = true; // Prevent past years
      } else if (enteredYear === currentYear && enteredMonth < currentMonth) {
        yearError = true; // Prevent past months in the current year
      }
    }

    // If invalid month or year, show error
    if (monthError || yearError) {
      setCardExpiryValid(false);
      return;
    }

    setCardExpiryValid(true);
  };

  const handleCardExpiryBlur = () => {
    const cleaned = cardExpiryText?.replace(/ /g, '') || '';
    setCardExpiryErrorText(
      cleaned.length < 1
        ? 'Expiry is required'
        : cleaned.length < 5 || !cardExpiryValid
          ? 'Expiry is invalid'
          : ''
    );
    setCardExpiryError(cleaned.length < 5 || !cardExpiryValid);
    setCardExpiryFocused(false);
  };

  const handleCardCvvBlur = () => {
    const cleaned = cardCvvText?.replace(/ /g, '') || '';
    setCardCvvErrorText(
      cleaned.length < 1
        ? 'CVV is required'
        : cleaned.length < maxCvvLength
          ? 'CVV is invalid'
          : ''
    );
    setCardCvvError(cleaned.length < maxCvvLength);
    setCardCvvFocused(false);
  };

  const handleCardHolderNameBlur = () => {
    const cleaned = cardHolderNameText?.replace(/ /g, '') || '';
    setCardHolderNameErrorText(cleaned.length < 1 ? 'Name is required' : '');
    setCardHolderNameFocused(false);
    setCardHolderNameError(cleaned.length < 1);
  };

  const handleCardCvvTextChange = (text: string) => {
    setCardCvvText(text);
    if (text == '') {
      setCardCvvErrorText('CVV is required');
      setCardCvvError(true);
    } else {
      setCardCvvError(false);
    }
  };

  const handleCardHolderNameTextChange = (text: string) => {
    setCardHolderNameText(text);
    if (text != '') {
      setCardHolderNameError(false);
    }
  };
  const checkCardValid = () => {
    if (durationNumber != undefined && durationNumber != '') {
      if (
        cardNumberError ||
        cardExpiryError ||
        cardCvvError ||
        cardHolderNameError ||
        (cardNumberText?.length != maxCardNumberLength && checkoutDetails.env !== 'test') ||
        cardExpiryText?.length != 5 ||
        cardCvvText?.length != maxCvvLength ||
        (cardHolderNameText?.length ?? 0) < 1 ||
        !cardNumberValid ||
        !emiIssuerExist
      ) {
        setCardValid(false);
      } else {
        setCardValid(true);
      }
    } else {
      if (
        cardNumberError ||
        cardExpiryError ||
        cardCvvError ||
        cardHolderNameError ||
        (cardNumberText?.length != maxCardNumberLength && checkoutDetails.env !== 'test') ||
        cardExpiryText?.length != 5 ||
        cardCvvText?.length != maxCvvLength ||
        (cardHolderNameText?.length ?? 0) < 1 
      ) {
        setCardValid(false);
      } else {
        setCardValid(true);
      }
    }
  };

  const onProceedBack = () => {
    if (isAutoNavigationEnabled) {
      onExitCheckout();
      return true;
    } else {
      navigation.goBack()
      return true;
    }
  };

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

  const onProceedForward = async () => {
    let response;
    setLoading(true);
    if (durationNumber !== undefined && durationNumber !== '') {
      response = await emiPostRequest({
        cardNumber:cardNumberText || '',
        expiryDate:cardExpiryText || '',
        cvv:cardCvvText || '',
        holderName:cardHolderNameText || '',
        cardType:cardTypeStr || '',
        offerCode:offerCodeStr || '',
        duration:durationNumber
      });
    } else {
      response = await cardPostRequest(
        cardNumberText || '',
        cardExpiryText || '',
        cardCvvText || '',
        cardHolderNameText || '',
        cardNickNameText || '',
        isSavedCardCheckBoxClicked,
        isSICheckBoxClicked
      );
    }
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

  useEffect(() => {

    const backAction = () => {
      if (showWebView) {
        setShowWebView(false);
        paymentFailedMessage.current = checkoutDetails.errorMessage;
        setStatus(TransactionStatus.Failed);
        setFailedModalState(true);
        setLoading(false);
        return true;
      } else if (loading) {
        return true; // Prevent default back action
      }
      return onProceedBack();
    }
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [navigation]);

  useEffect(() => {
    checkCardValid();
  }, [cardNumberText, cardExpiryText, cardCvvText, cardHolderNameText]);

  const onExitCheckout = () => {
    setSuccessModalState(false)
    setSessionExppireModalState(false)
    setFailedModalState(false)
    const mockPaymentResult: PaymentResultObject = {
      status: status || '',
      transactionId: transactionId || '',
    };
    setCheckOutDetailsHandlerToDefault()
    setUserDataHandlerToDefault()
    paymentHandler.onPaymentResult(mockPaymentResult);
  };

  useEffect(() => {
    if (paymentHtml) {
      setShowWebView(true);
    }
  }, [paymentHtml]);

  return (
    <>
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
      ) : (
          <View style= {{flex:1}}>
            <ScrollView 
            contentContainerStyle={styles.screenView}
            keyboardShouldPersistTaps="handled" 
          >
          <Header
            onBackPress={onProceedBack}
            showDesc={true}
            showSecure={true}
            text="Pay via Card"
          />
          <View
            style={styles.divider}
          />
          {bankNameStr != '' && bankName != undefined && (
            <View
              style={styles.container}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View
                  style={styles.imageContainer}
                >
                  {imageLoad && !imageError && (
                    <ShimmerPlaceHolder
                      visible={false} // Keep shimmer until loading is done
                      style={{ width: 32, height: 32, borderRadius: 8 }}
                    />
                  )}
                  {!imageError ? (
                    <SvgUri
                      uri={bankUrlStr || ''}
                      width={100} // Keep original size
                      height={100}
                      style={{ transform: [{ scale: 0.4 }] }}
                      onLoad={() => setImageLoad(false)}
                      onError={() => {
                        setImageError(true);
                        setImageLoad(false);
                      }}
                    />
                  ) : (
                    <Image
                      source={require('../../assets/images/ic_netbanking_semi_bold.png')}
                      style={{ transform: [{ scale: 0.4 }] }}
                    />
                  )}
                </View>
                <Text
                  style={[styles.nameText, {fontFamily: checkoutDetails.fontFamily.semiBold,}]}
                >
                  {bankNameStr}
                </Text>
              </View>
              <View
                style={styles.thickBorder}
              >
                <Text
                  style={[styles.durationText, {fontFamily: checkoutDetails.fontFamily.semiBold,}]}
                >
                  {duration} months x
                  <Text
                    style={styles.currencyText}
                  >
                    {' '}
                    {checkoutDetails.currencySymbol}
                  </Text>
                  {amountStr}
                </Text>
                <Text
                  style={[styles.percentText, {fontFamily: checkoutDetails.fontFamily.regular,}]}
                >
                  @{percentNumber}% p.a.
                </Text>
              </View>
            </View>
          )}
          <TextInput
            mode="outlined"
            label={
              <Text
                style={[styles.textFieldLabel,{
                  color: cardNumberFocused
                    ? '#2D2B32'
                    : cardNumberText != '' && cardNumberText != null
                      ? '#2D2B32'
                      : '#ADACB0',
                      fontFamily: checkoutDetails.fontFamily.regular,
                }]}
              >
                Card Number*
              </Text>
            }
            value={cardNumberText || ''}
            onChangeText={(it) => {
              handleCardNumberTextChange(it);
            }}
            theme={getTextInputTheme()}
            inputAccessoryViewID={Platform.OS === 'ios' ? cardNumberAccessoryID : undefined}
            style={[styles.textInput, { marginTop: 28, marginHorizontal: 16, fontFamily: checkoutDetails.fontFamily.regular, }]}
            error={cardNumberError}
            returnKeyType="done"
            right={
              <TextInput.Icon
                icon={() => (
                  <Image
                    source={cardSelectedIcon}
                    style={{ width: 32, height: 20,tintColor:
                      cardSelectedIcon === require('../../assets/images/ic_card.png')
                        ? '#6B7280' // Cool Grey 500
                        : undefined, }}
                  />
                )}
              />
            }
            outlineStyle={{
              borderRadius: 8, // Add this
              borderWidth: 1.5,
            }}
            keyboardType="number-pad"
            maxLength={maxCardNumberLength}
            onFocus={() => {
              setCardNumberFocused(true);
              setCardNumberError(false);
            }}
            onBlur={handleCardNumberBlur}
          />
          {cardNumberError && (
            <Text
              style={[styles.errorText, { fontFamily: checkoutDetails.fontFamily.regular,marginHorizontal : 16}]}
            >
              {cardNumberErrorText}
            </Text>
          )}
          <TextInput
            mode="outlined"
            label={
              <Text
                style={[styles.textFieldLabel,{
                  color: cardHolderNameFocused
                    ? '#2D2B32'
                    : cardHolderNameText != '' && cardHolderNameText != null
                      ? '#2D2B32'
                      : '#ADACB0',
                      fontFamily: checkoutDetails.fontFamily.regular,
                }]}
              >
                Cardholder Name*
              </Text>
            }
            value={cardHolderNameText || ''}
            onChangeText={(it) => {
              handleCardHolderNameTextChange(it);
            }}
            theme={getTextInputTheme()}
            style={[styles.textInput, { marginHorizontal: 16, marginTop: 16, fontFamily: checkoutDetails.fontFamily.regular, }]}
            error={cardHolderNameError}
            inputAccessoryViewID={Platform.OS === 'ios' ? cardHolderNameAccessoryID : undefined}
            returnKeyType="done"
            outlineStyle={{
              borderRadius: 8, // Add this
              borderWidth: 1.5,
            }}
            onBlur={handleCardHolderNameBlur}
            onFocus={() => {
              setCardHolderNameFocused(true);
              setCardHolderNameError(false);
            }}
          />
          {cardHolderNameError && (
            <Text
              style={[styles.errorText, { fontFamily: checkoutDetails.fontFamily.regular,marginHorizontal : 16}]}
            >
              {cardHolderNameErrorText}
            </Text>
          )}
          <View
            style={styles.expiryCvvContainer}
          >
            <View style={{ flex: 1, flexDirection: 'column' }}>
              <TextInput
                mode="outlined"
                label={
                  <Text
                    style={[styles.textFieldLabel,{
                      color: cardExpiryFocused
                        ? '#2D2B32'
                        : cardExpiryText != '' && cardExpiryText != null
                          ? '#2D2B32'
                          : '#ADACB0',
                          fontFamily: checkoutDetails.fontFamily.regular,
                    }]}
                  >
                    Expiry (MM/YY)*
                  </Text>
                }
                value={cardExpiryText || ''}
                onChangeText={(it) => {
                  handleCardExpiryTextChange(it);
                }}
                theme={getTextInputTheme()}
                inputAccessoryViewID={Platform.OS === 'ios' ? cardExpiryAccessoryID : undefined}
                style={[styles.textInput, {fontFamily: checkoutDetails.fontFamily.regular,}]}
                error={cardExpiryError}
                returnKeyType="done"
                outlineStyle={{
                  borderRadius: 8, // Add this
                  borderWidth: 1.5,
                }}
                keyboardType="number-pad"
                maxLength={5}
                onFocus={() => {
                  setCardExpiryFocused(true);
                  setCardExpiryError(false);
                }}
                onBlur={handleCardExpiryBlur}
              />
              {cardExpiryError && (
                <Text
                  style={[styles.errorText, { fontFamily: checkoutDetails.fontFamily.regular,}]}
                >
                  {cardExpiryErrorText}
                </Text>
              )}
            </View>
            <View style={{ flex: 1, flexDirection: 'column', marginStart: 16 }}>
              <TextInput
                mode="outlined"
                label={
                  <Text
                    style={[styles.textFieldLabel,{
                      color: cardCvvFocused
                        ? '#2D2B32'
                        : cardCvvText != '' && cardCvvText != null
                          ? '#2D2B32'
                          : '#ADACB0',
                          fontFamily: checkoutDetails.fontFamily.regular,
                    }]}
                  >
                    CVV*
                  </Text>
                }
                value={cardCvvText || ''}
                onChangeText={(it) => {
                  handleCardCvvTextChange(it);
                }}
                theme={getTextInputTheme()}
                inputAccessoryViewID={Platform.OS === 'ios' ? cardCvvAccessoryID : undefined}
                style={[styles.textInput, {fontFamily: checkoutDetails.fontFamily.regular,}]}
                error={cardCvvError}
                returnKeyType="done"
                right={
                  <TextInput.Icon
                    icon={() => (
                      <Image
                        source={require('../../assets/images/ic_info.png')}
                        style={{ width: 24, height: 24, tintColor : checkoutDetails.buttonColor }}
                      />
                    )}
                    onPress={() => {
                      setShowCvvInfo(true);
                    }}
                  />
                }
                outlineStyle={{
                  borderRadius: 8, // Add this
                  borderWidth: 1.5,
                }}
                keyboardType="number-pad"
                maxLength={maxCvvLength}
                secureTextEntry={true}
                onBlur={handleCardCvvBlur}
                onFocus={() => {
                  setCardCvvFocused(true);
                  setCardCvvError(false);
                }}
              />
              {cardCvvError && (
                <Text
                  style={[styles.errorText, { fontFamily: checkoutDetails.fontFamily.regular,}]}
                >
                  {cardCvvErrorText}
                </Text>
              )}
            </View>
          </View>
          {shopperToken != null && shopperToken != '' && (
            <>
            <TextInput
              mode="outlined"
              label={
                <Text
                  style={[styles.textFieldLabel,{
                    color: cardNickNameFocused
                      ? '#2D2B32'
                      : cardNickNameText != '' && cardNickNameText != null
                        ? '#2D2B32'
                        : '#ADACB0',
                        fontFamily: checkoutDetails.fontFamily.regular,
                  }]}
                >
                  Card NickName (for easy identification)
                </Text>
              }
              value={cardNickNameText || ''}
              onChangeText={(it) => {
                setCardNickNameText(it);
              }}
              inputAccessoryViewID={Platform.OS === 'ios' ? cardNickNameAccessoryID : undefined}
              theme={getTextInputTheme()}
              style={[
                styles.textInput,
                { marginHorizontal: 16, marginTop: 16 , fontFamily: checkoutDetails.fontFamily.regular,},
              ]}
              returnKeyType="done"
              outlineStyle={{
                borderRadius: 8, // Add this
                borderWidth: 1.5,
              }}
              onBlur={() => {
                setCardNickNameFocused(false);
              }}
              onFocus={() => {
                setCardNickNameFocused(true);
              }}
            />
            <View
              style={styles.infoContainer}
            >
              <Image
                source={require('../../assets/images/ic_info.png')}
                style={styles.infoIcon}
              />
              <Text
                style={[styles.infoText, {fontFamily: checkoutDetails.fontFamily.regular,}]}
              >
                CVV will not be stored
              </Text>
              </View>

              <View
              style={styles.checkBoxContainer}
            >
              <TouchableOpacity
                onPress={() => setIsSavedCardCheckBoxClicked(!isSavedCardCheckBoxClicked)}
              >
                <View style={[
                  styles.checkboxBox,
                  { borderColor: checkoutDetails.buttonColor },
                  isSavedCardCheckBoxClicked && { backgroundColor: checkoutDetails.buttonColor }
                ]}>
                  {isSavedCardCheckBoxClicked && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </View>
              </TouchableOpacity>
              <Text
                style={[styles.checkBoxText, {fontFamily: checkoutDetails.fontFamily.regular,}]}
              >
                Save this card as per RBI guidelines.
              </Text>
              <Pressable
                onPress={() => {
                  setKnowMoreDialog(true);
                }}
                style={{ marginLeft: 4 }}
              >
                <Text
                  style={[styles.clickableText,{
                    color: checkoutDetails.buttonColor,
                    fontFamily: checkoutDetails.fontFamily.semiBold,
                  }]}
                >
                  Know more
                </Text>
              </Pressable>
              </View>
            </>
          )}

          {(checkoutDetails.isSICheckboxVisible && checkoutDetails.isSubscriptionCheckout) && (
             <CheckBoxContainer
             text = {"Set up Standing Instructions (SI) for this payment."}
             isCheckBoxSelected = {isSICheckBoxClicked}
             onCheckBoxClicked = {() => {
              setIsSICheckBoxClicked(!isSICheckBoxClicked)
             }}
             />
          )}

          {isSubscriptionDetailsVisible && (
            <View style = {styles.subscriptionContainer}>
              {checkoutDetails.subscriptionDetails && checkoutDetails.subscriptionDetails.map((item) => item.value && (
                <SubscriptionRow
                key={item.label}
                checkoutDetails={checkoutDetails}
                heading={item.label}
                value={item.value}
              />
              ))}
            </View>
          )}

          </ScrollView>
          <View>
            {cardValid ? (
              <Pressable
                style={[
                  styles.buttonContainer,
                  { backgroundColor: checkoutDetails.buttonColor,borderRadius: checkoutDetails.ctaBorderRadius, },
                ]}
                onPress={() => {
                  onProceedForward();
                }}
              >
                  <Text style={[styles.buttonText, {fontFamily: checkoutDetails.fontFamily.semiBold,}]}>
              Pay{' '}
              <Text
                style={{
                  fontFamily: 'Inter-SemiBold',
                  fontSize: 16,
                  color: 'white',
                }}
              >
                {' '}
                {checkoutDetails.currencySymbol}
              </Text>
              {checkoutDetails.amount}
                  </Text>              
                </Pressable>
            ) : (
              <Pressable
                style={[styles.buttonContainer, { backgroundColor: '#E6E6E6' , borderRadius: checkoutDetails.ctaBorderRadius,}]}
              >
                <Text style={[styles.buttonText, {fontFamily: checkoutDetails.fontFamily.semiBold,}]}>
            Pay{' '}
            <Text
              style={{
                fontFamily: 'Inter-SemiBold',
                fontSize: 16,
                color: 'white',
              }}
            >
              {' '}
              {checkoutDetails.currencySymbol}
            </Text>
            {checkoutDetails.amount}
                </Text>
              </Pressable>
            )}
          </View>
          </View>
      )}
      {failedModalOpen && (
        <PaymentFailed
          onClick={() => setFailedModalState(false)}
          onExit={onExitCheckout}
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

      {showCvvInfo && (
        <CvvInfoBottomSheet
          onClick={() => {
            setShowCvvInfo(false);
          }}
        />
      )}

      {showKnowMoreDialog && (
        <KnowMoreBottomSheet
          onClick={() => {
            setKnowMoreDialog(false);
          }}
        />
      )}

      {showWebView && (
        <View
          style={styles.webViewContainer}
        >
          <WebViewScreen
            url={paymentUrl}
            html={paymentHtml}
            onBackPress={() => {
              startBackgroundApiTask();
              setLoading(true);
              setShowWebView(false);
            }}
          />
        </View>
      )}
    </View>
    {Platform.OS === 'ios' && (
  <>
    {[
      cardNumberAccessoryID,
      cardExpiryAccessoryID,
      cardCvvAccessoryID,
      cardHolderNameAccessoryID,
      cardNickNameAccessoryID,
    ].map((id) => (
      <InputAccessoryView key={id} nativeID={id}>
        <View style={{ backgroundColor: '#f1f1f1', padding: 10, alignItems: 'flex-end' }}>
          <TouchableOpacity onPress={() => Keyboard.dismiss()}>
            <Text style={{ fontSize: 16, fontFamily: checkoutDetails.fontFamily.semiBold }}>
              Done
            </Text>
          </TouchableOpacity>
        </View>
      </InputAccessoryView>
    ))}
  </>
)}
    </>
  );
};

export default CardScreen;
