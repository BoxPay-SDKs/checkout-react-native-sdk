import {
  View,
  Text,
  StyleSheet,
  Image,
  BackHandler,
  Pressable,
  StatusBar,
} from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import Header from '../components/header';
import { Checkbox, TextInput } from 'react-native-paper';
import LottieView from 'lottie-react-native';
import fetchCardDetails from '../postRequest/fetchCardDetails';
import { checkoutDetailsHandler } from '../sharedContext/checkoutDetailsHandler';
import cardPostRequest from '../postRequest/cardPostRequest';
import PaymentFailed from '../components/paymentFailed';
import PaymentSuccess from '../components/paymentSuccess';
import SessionExpire from '../components/sessionExpire';
import type { PaymentResult } from '../interface';
import { paymentHandler } from '../sharedContext/paymentStatusHandler';
import CvvInfoBottomSheet from '../components/cvvInfoBottomSheet';
import WebViewScreen from './webViewScreen';
import fetchStatus from '../postRequest/fetchStatus';
import { SvgUri } from 'react-native-svg';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import emiPostRequest from '../postRequest/emiPostRequest';
import { SafeAreaView } from 'react-native-safe-area-context';
import KnowMoreBottomSheet from '../components/knowMoreBottomSheet';

const CardScreen = () => {
  const {
    duration,
    bankName,
    bankUrl,
    offerCode,
    amount,
    percent,
    cardType,
    issuerBrand,
  } = useLocalSearchParams();
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
    require('../assets/images/ic_default_card.png')
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

  const [imageLoad, setImageLoad] = useState(true);
  const [imageError, setImageError] = useState(false);

  const [emiIssuerExist, setEmiIssuerExist] = useState(true);
  const [emiIssuer, setEmiIssuer] = useState('');
  const [shopperToken, setShopperToken] = useState<string | null>(null);

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
        await fetchCardDetails(
          formatted.replace(/ /g, '')
        ).then((data) => {
          if('paymentMethod' in data) {
            if (durationNumber != undefined && durationNumber != '') {
              setEmiIssuerExist(data.issuerName != '' && data.issuerName != null);
              setEmiIssuer(data.issuerName ?? "");
            }
            setMethodEnabled(data.methodEnabled);
            if (data.paymentMethod.brand == 'VISA') {
              setCardSelectedIcon(require('../assets/images/ic_visa.png'));
              setMaxCvvLength(3);
              setMaxCardNumberLength(19);
            } else if (data.paymentMethod.brand == 'Mastercard') {
              setCardSelectedIcon(require('../assets/images/ic_masterCard.png'));
              setMaxCvvLength(3);
              setMaxCardNumberLength(19);
            } else if (data.paymentMethod.brand == 'RUPAY') {
              setCardSelectedIcon(require('../assets/images/ic_rupay.png'));
              setMaxCvvLength(3);
              setMaxCardNumberLength(19);
            } else if (data.paymentMethod.brand == 'AmericanExpress') {
              setCardSelectedIcon(require('../assets/images/ic_amex.png'));
              setMaxCvvLength(4);
              setMaxCardNumberLength(18);
            } else if (data.paymentMethod.brand == 'Maestro') {
              setCardSelectedIcon(require('../assets/images/ic_maestro.png'));
              setMaxCvvLength(3);
              setMaxCardNumberLength(19);
            } else {
              setCardSelectedIcon(
                require('../assets/images/ic_default_card.png')
              );
              setMaxCvvLength(3);
              setMaxCardNumberLength(19);
            }
          }
        });
      } else {
        setCardSelectedIcon(require('../assets/images/ic_default_card.png'));
        setMaxCvvLength(3);
        setMaxCardNumberLength(19);
      }
    }
  };

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
        ? 'Required'
        : cleaned.length < cleanedLength && methodEnabled
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
      cleaned.length < cleanedLength ||
        !methodEnabled ||
        !cardNumberValid ||
        !emiIssuerExist ||
        (emiIssuer != issuerBrand &&
          durationNumber != undefined &&
          durationNumber != '')
    );
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
        ? 'Required'
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
        ? 'Required'
        : cleaned.length < maxCvvLength
          ? 'CVV is invalid'
          : ''
    );
    setCardCvvError(cleaned.length < maxCvvLength);
    setCardCvvFocused(false);
  };

  const handleCardHolderNameBlur = () => {
    const cleaned = cardHolderNameText?.replace(/ /g, '') || '';
    setCardHolderNameErrorText(cleaned.length < 1 ? 'Required' : '');
    setCardHolderNameFocused(false);
    setCardHolderNameError(cleaned.length < 1);
  };

  const handleCardCvvTextChange = (text: string) => {
    setCardCvvText(text);
    if (text == '') {
      setCardCvvErrorText('Required');
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
        cardNumberText?.length != maxCardNumberLength ||
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
        cardNumberText?.length != maxCardNumberLength ||
        cardExpiryText?.length != 5 ||
        cardCvvText?.length != maxCvvLength ||
        (cardHolderNameText?.length ?? 0) < 1 ||
        !cardNumberValid
      ) {
        setCardValid(false);
      } else {
        setCardValid(true);
      }
    }
  };

  const onProceedBack = () => {
    router.back();
    return true;
  };

  const callFetchStatusApi = async () => {
    const response = await fetchStatus();
    if ('status' in response && 'transactionId' in response) {
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
            ? reason.split(':')[1]?.trim() ?? checkoutDetails.errorMessage
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
    } else {
      const reason = response.status.reason;
      const reasonCode = response.status.reasonCode;
      if (!reasonCode?.startsWith('UF')) {
        paymentFailedMessage.current = checkoutDetails.errorMessage;
      } else {
        paymentFailedMessage.current = reason?.includes(':')
          ? reason.split(':')[1]?.trim() ?? checkoutDetails.errorMessage
          : reason || checkoutDetails.errorMessage;
      }
      setFailedModalState(true);
      setLoading(false);
    }
  };

  const onProceedForward = async () => {
    let response;
    setLoading(true);
    if (durationNumber !== undefined && durationNumber !== '') {
      response = await emiPostRequest(
        cardNumberText || '',
        cardExpiryText || '',
        cardCvvText || '',
        cardHolderNameText || '',
        cardTypeStr || '',
        offerCodeStr || '',
        durationNumber
      );
    } else {
      response = await cardPostRequest(
        cardNumberText || '',
        cardExpiryText || '',
        cardCvvText || '',
        cardHolderNameText || '',
        cardNickNameText || '',
        isSavedCardCheckBoxClicked
      );
    }
    if ('status' in response && 'transactionId' in response) {
      setStatus(response.status.status);
    setTransactionId(response.transactionId);

    const status = response.status.status.toUpperCase();

    if (status === 'REQUIRESACTION') {
      if (Array.isArray(response.actions) && response.actions.length > 0) {
        if (response.actions[0].type === 'html') {
          setPaymentHtml(response.actions[0].htmlPageString);
        } else {
          setPaymentUrl(response.actions[0].url);
          if (
            Array.isArray(response.actions) &&
            response.actions.length > 0
          ) {
            if (response.actions[0].type === 'html') {
              setPaymentHtml(response.actions[0].htmlPageString);
            } else {
              setPaymentUrl(response.actions[0].url);
            }
          }
        }
      } else {
        paymentFailedMessage.current = checkoutDetails.errorMessage;
        setFailedModalState(true);
        setStatus('Failed');
        setLoading(false);
      }
    } else if (['FAILED', 'REJECTED'].includes(status)) {
      const reason = response.status.reason || '';
      const reasonCode = response.status.reasonCode || '';

      if (!reasonCode.startsWith('UF')) {
        paymentFailedMessage.current = checkoutDetails.errorMessage;
      } else {
        paymentFailedMessage.current = reason.includes(':')
          ? reason.split(':')[1]?.trim() ?? checkoutDetails.errorMessage
          : reason || checkoutDetails.errorMessage;
      }

      setFailedModalState(true);
      setStatus('Failed');
      setLoading(false);
    } else if (['APPROVED', 'SUCCESS', 'PAID'].includes(status)) {
      setSuccessfulTimeStamp(response.transactionTimestampLocale);
      setSuccessModalState(true);
      setStatus('Success');
      setLoading(false);
    } else if (status === 'EXPIRED') {
      setSessionExppireModalState(true);
      setLoading(false);
    } else if (status === 'EXPIRED') {
      setSessionExppireModalState(true);
      setStatus('Expired');
      setLoading(false);
    }
    } else {
      const reasonCode = response.status.reasonCode || '';
    const reason = response.status.reason || '';
    if (!reasonCode.startsWith('UF')) {
      paymentFailedMessage.current = checkoutDetails.errorMessage;
    } else {
      paymentFailedMessage.current = reason.includes(':')
        ? reason.split(':')[1]?.trim() ?? checkoutDetails.errorMessage
        : reason || checkoutDetails.errorMessage;
    }
    setFailedModalState(true);
    setStatus('Failed');
    setLoading(false);
    }
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
    checkCardValid();
  }, [cardNumberText, cardExpiryText, cardCvvText, cardHolderNameText]);

  const onExitCheckout = () => {
    const mockPaymentResult: PaymentResult = {
      status: status || '',
      transactionId: transactionId || '',
    };
    paymentHandler.onPaymentResult(mockPaymentResult);
    while (router.canGoBack()) {
      router.back();
    }
  };

  useEffect(() => {
    if (paymentHtml) {
      setShowWebView(true);
    }
  }, [paymentHtml]);

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
      ) : (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <Header
            onBackPress={onProceedBack}
            showDesc={true}
            showSecure={true}
            text="Pay via Card"
          />
          <View
            style={{
              flexDirection: 'row',
              height: 1,
              backgroundColor: '#ECECED',
            }}
          />
          {bankNameStr != '' && bankName != undefined && (
            <View
              style={{
                borderColor: '#E6E6E6',
                borderWidth: 1,
                borderRadius: 8,
                padding: 12,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginHorizontal: 16,
                marginTop: 8,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View
                  style={{
                    width: 32,
                    height: 32,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
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
                      source={require('../assets/images/ic_netbanking_semi_bold.png')}
                      style={{ transform: [{ scale: 0.4 }] }}
                    />
                  )}
                </View>
                <Text
                  style={{
                    paddingStart: 8,
                    fontFamily: 'Poppins-SemiBold',
                    fontSize: 14,
                  }}
                >
                  {bankNameStr}
                </Text>
              </View>
              <View
                style={{
                  borderWidth: 1.5,
                  borderStartColor: '#E6E6E6',
                  borderTopColor: 'white',
                  borderEndColor: 'white',
                  borderBottomColor: 'white',
                  paddingStart: 8,
                }}
              >
                <Text
                  style={{
                    fontFamily: 'Poppins-SemiBold',
                    fontSize: 12,
                    color: '#2D2B32',
                  }}
                >
                  {duration} months x
                  <Text
                    style={{
                      fontFamily: 'Inter-SemiBold',
                      fontSize: 12,
                      color: '#2D2B32',
                    }}
                  >
                    {' '}
                    {checkoutDetails.currencySymbol}
                  </Text>
                  {amountStr}
                </Text>
                <Text
                  style={{
                    fontFamily: 'Poppins-Regular',
                    fontSize: 12,
                    color: '#2D2B32',
                  }}
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
                style={{
                  fontSize: 16,
                  fontFamily: 'Poppins-Regular',
                  color: cardNumberFocused
                    ? '#2D2B32'
                    : cardNumberText != '' && cardNumberText != null
                      ? '#2D2B32'
                      : '#ADACB0',
                }}
              >
                Card Number
              </Text>
            }
            value={cardNumberText || ''}
            onChangeText={(it) => {
              handleCardNumberTextChange(it);
            }}
            theme={{
              colors: {
                primary: '#2D2B32',
                outline: '#E6E6E6',
              },
            }}
            style={[styles.textInput, { marginTop: 28, marginHorizontal: 16 }]}
            error={cardNumberError}
            right={
              cardNumberError ? (
                <TextInput.Icon
                  icon={() => (
                    <Image
                      source={require('../assets/images/ic_upi_error.png')}
                      style={{ width: 24, height: 24 }}
                    />
                  )}
                />
              ) : (
                <TextInput.Icon
                  icon={() => (
                    <Image
                      source={cardSelectedIcon}
                      style={{ width: 35, height: 20 }}
                    />
                  )}
                />
              )
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
              style={{
                color: '#B3261E',
                fontSize: 12,
                fontFamily: 'Poppins-Regular',
                marginHorizontal: 16,
                marginTop: 4,
              }}
            >
              {cardNumberErrorText}
            </Text>
          )}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginHorizontal: 16,
              marginTop: 16,
            }}
          >
            <View style={{ flex: 1, flexDirection: 'column' }}>
              <TextInput
                mode="outlined"
                label={
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: 'Poppins-Regular',
                      color: cardExpiryFocused
                        ? '#2D2B32'
                        : cardExpiryText != '' && cardExpiryText != null
                          ? '#2D2B32'
                          : '#ADACB0',
                    }}
                  >
                    Expiry (MM/YY)
                  </Text>
                }
                value={cardExpiryText || ''}
                onChangeText={(it) => {
                  handleCardExpiryTextChange(it);
                }}
                theme={{
                  colors: {
                    primary: '#2D2B32',
                    outline: '#E6E6E6',
                  },
                }}
                style={styles.textInput}
                error={cardExpiryError}
                right={
                  cardExpiryError ? (
                    <TextInput.Icon
                      icon={() => (
                        <Image
                          source={require('../assets/images/ic_upi_error.png')}
                          style={{ width: 24, height: 24 }}
                        />
                      )}
                    />
                  ) : null
                }
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
                  style={{
                    color: '#B3261E',
                    fontSize: 12,
                    fontFamily: 'Poppins-Regular',
                    marginTop: 4,
                  }}
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
                    style={{
                      fontSize: 16,
                      fontFamily: 'Poppins-Regular',
                      color: cardCvvFocused
                        ? '#2D2B32'
                        : cardCvvText != '' && cardCvvText != null
                          ? '#2D2B32'
                          : '#ADACB0',
                    }}
                  >
                    CVV
                  </Text>
                }
                value={cardCvvText || ''}
                onChangeText={(it) => {
                  handleCardCvvTextChange(it);
                }}
                theme={{
                  colors: {
                    primary: '#2D2B32',
                    outline: '#E6E6E6',
                  },
                }}
                style={styles.textInput}
                error={cardCvvError}
                right={
                  cardCvvError ? (
                    <TextInput.Icon
                      icon={() => (
                        <Image
                          source={require('../assets/images/ic_upi_error.png')}
                          style={{ width: 24, height: 24 }}
                        />
                      )}
                    />
                  ) : (
                    <TextInput.Icon
                      icon={() => (
                        <Image
                          source={require('../assets/images/ic_cvv_info.png')}
                          style={{ width: 24, height: 24 }}
                        />
                      )}
                      onPress={() => {
                        setShowCvvInfo(true);
                      }}
                    />
                  )
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
                  style={{
                    color: '#B3261E',
                    fontSize: 12,
                    fontFamily: 'Poppins-Regular',
                    marginTop: 4,
                  }}
                >
                  {cardCvvErrorText}
                </Text>
              )}
            </View>
          </View>
          <TextInput
            mode="outlined"
            label={
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'Poppins-Regular',
                  color: cardHolderNameFocused
                    ? '#2D2B32'
                    : cardHolderNameText != '' && cardHolderNameText != null
                      ? '#2D2B32'
                      : '#ADACB0',
                }}
              >
                Name on the Card
              </Text>
            }
            value={cardHolderNameText || ''}
            onChangeText={(it) => {
              handleCardHolderNameTextChange(it);
            }}
            theme={{
              colors: {
                primary: '#2D2B32',
                outline: '#E6E6E6',
              },
            }}
            style={[styles.textInput, { marginHorizontal: 16, marginTop: 16 }]}
            error={cardHolderNameError}
            right={
              cardHolderNameError ? (
                <TextInput.Icon
                  icon={() => (
                    <Image
                      source={require('../assets/images/ic_upi_error.png')}
                      style={{ width: 24, height: 24 }}
                    />
                  )}
                />
              ) : null
            }
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
              style={{
                color: '#B3261E',
                fontSize: 12,
                fontFamily: 'Poppins-Regular',
                marginHorizontal: 16,
                marginTop: 4,
              }}
            >
              {cardHolderNameErrorText}
            </Text>
          )}
          {shopperToken != null && shopperToken != '' && (
            <TextInput
              mode="outlined"
              label={
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: 'Poppins-Regular',
                    color: cardNickNameFocused
                      ? '#2D2B32'
                      : cardNickNameText != '' && cardNickNameText != null
                        ? '#2D2B32'
                        : '#ADACB0',
                  }}
                >
                  Card NickName (for easy identification)
                </Text>
              }
              value={cardNickNameText || ''}
              onChangeText={(it) => {
                setCardNickNameText(it);
              }}
              theme={{
                colors: {
                  primary: '#2D2B32',
                  outline: '#E6E6E6',
                },
              }}
              style={[
                styles.textInput,
                { marginHorizontal: 16, marginTop: 16 },
              ]}
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
          )}
          {
            <View
              style={{
                flexDirection: 'row',
                marginHorizontal: 16,
                marginTop: 16,
                backgroundColor: '#E8F6F1',
                borderRadius: 4,
                padding: 4,
                alignItems: 'center',
              }}
            >
              <Image
                source={require('../assets/images/ic_info.png')}
                style={{ width: 20, height: 20, tintColor: '#2D2B32' }}
              />
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: 'Poppins-Regular',
                  color: '#2D2B32',
                  marginStart: 8,
                }}
              >
                CVV will not be stored
              </Text>
            </View>
          }
          {shopperToken != null && shopperToken != '' && (
            <View
              style={{
                flexDirection: 'row',
                marginTop: 10,
                alignItems: 'center',
                paddingLeft: 10,
              }}
            >
              <Checkbox
                status={isSavedCardCheckBoxClicked ? 'checked' : 'unchecked'}
                onPress={() => {
                  setIsSavedCardCheckBoxClicked(!isSavedCardCheckBoxClicked);
                }}
                color={checkoutDetails.brandColor}
              />
              <Text
                style={{
                  color: '#2D2B32',
                  fontSize: 14,
                  fontFamily: 'Poppins-Regular',
                  marginLeft: 8,
                }}
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
                  style={{
                    color: checkoutDetails.brandColor,
                    fontSize: 12,
                    fontFamily: 'Poppins-SemiBold',
                    textDecorationLine: 'underline',
                  }}
                >
                  Know more
                </Text>
              </Pressable>
            </View>
          )}
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              paddingBottom: 16,
            }}
          >
            {cardValid ? (
              <Pressable
                style={[
                  styles.buttonContainer,
                  { backgroundColor: checkoutDetails.brandColor },
                ]}
                onPress={() => {
                  onProceedForward();
                }}
              >
                <Text style={styles.buttonText}>Make Payment</Text>
              </Pressable>
            ) : (
              <Pressable
                style={[styles.buttonContainer, { backgroundColor: '#E6E6E6' }]}
              >
                <Text style={[styles.buttonText, { color: '#ADACB0' }]}>
                  Make Payment
                </Text>
              </Pressable>
            )}
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
              setLoading(true);
              setLoading(true);
              setShowWebView(false);
            }}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default CardScreen;

const styles = StyleSheet.create({
  textInput: {
    backgroundColor: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#0A090B',
    height: 60,
  },
  buttonContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    justifyContent: 'center',
    marginTop: 20,
    marginHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
});
