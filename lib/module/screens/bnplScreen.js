"use strict";

import { View, Text, BackHandler, Image, ScrollView } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { checkoutDetailsHandler, setCheckOutDetailsHandlerToDefault } from "../sharedContext/checkoutDetailsHandler.js";
import LottieView from 'lottie-react-native';
import Header from "../components/header.js";
import ShimmerView from "../components/shimmerView.js";
import PaymentSuccess from "../components/paymentSuccess.js";
import SessionExpire from "../components/sessionExpire.js";
import PaymentFailed from "../components/paymentFailed.js";
import { paymentHandler } from "../sharedContext/paymentStatusHandler.js";
import methodsPostRequest from "../postRequest/methodsPostRequest.js";
import fetchStatus from "../postRequest/fetchStatus.js";
import WebViewScreen from "./webViewScreen.js";
import PaymentSelectorView from "../components/paymentSelector.js";
import styles from "../styles/screens/bnplScreenStyles.js";
import { fetchPaymentMethodHandler, handleFetchStatusResponseHandler, handlePaymentResponse } from "../sharedContext/handlePaymentResponseHandler.js";
import { setUserDataHandlerToDefault } from "../sharedContext/userdataHandler.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const BNPLScreen = ({
  navigation
}) => {
  const [bnplList, setBnplList] = useState([]);
  const {
    checkoutDetails
  } = checkoutDetailsHandler;
  const [loading, setLoading] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [paymentHtml, setPaymentHtml] = useState(null);
  const [showWebView, setShowWebView] = useState(false);
  const [failedModalOpen, setFailedModalState] = useState(false);
  const [successModalOpen, setSuccessModalState] = useState(false);
  const paymentFailedMessage = useRef('You may have cancelled the payment or there was a delay in response. Please retry.');
  const [sessionExpireModalOpen, setSessionExppireModalState] = useState(false);
  const [successfulTimeStamp, setSuccessfulTimeStamp] = useState('');
  const [status, setStatus] = useState(null);
  const [transactionId, setTransactionId] = useState(null);
  const backgroundApiInterval = useRef(null);
  const onProceedBack = () => {
    if (!loading) {
      navigation.goBack();
      return true;
    }
    return false;
  };
  useEffect(() => {
    const backAction = () => {
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
      return onProceedBack();
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [navigation]);
  useEffect(() => {
    const fetchData = async () => {
      fetchPaymentMethodHandler({
        paymentType: "BuyNowPayLater",
        setList: list => {
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
      onSetFailedMessage: msg => {
        paymentFailedMessage.current = msg;
      },
      onShowFailedModal: () => {
        setFailedModalState(true);
      },
      onShowSuccessModal: ts => {
        setSuccessfulTimeStamp(ts);
        setSuccessModalState(true);
      },
      onShowSessionExpiredModal: () => {
        setSessionExppireModalState(true);
      },
      setLoading: setLoading,
      stopBackgroundApiTask: stopBackgroundApiTask,
      isFromUPIIntentFlow: false
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
  const onProceedForward = async (_, instrumentType) => {
    setLoading(true);
    const response = await methodsPostRequest(instrumentType, 'buynowpaylater');
    handlePaymentResponse({
      response: response,
      checkoutDetailsErrorMessage: checkoutDetails.errorMessage,
      onSetStatus: setStatus,
      onSetTransactionId: setTransactionId,
      onSetPaymentHtml: setPaymentHtml,
      onSetPaymentUrl: setPaymentUrl,
      onSetFailedMessage: msg => paymentFailedMessage.current = msg,
      onShowFailedModal: () => setFailedModalState(true),
      onShowSuccessModal: ts => {
        setSuccessfulTimeStamp(ts);
        setSuccessModalState(true);
      },
      onShowSessionExpiredModal: () => setSessionExppireModalState(true),
      setLoading: setLoading
    });
  };
  const onClickRadioButton = id => {
    const updatedBnplList = bnplList.map(bnplItem => ({
      ...bnplItem,
      isSelected: bnplItem.id === id
    }));
    setBnplList(updatedBnplList);
  };
  const onExitCheckout = () => {
    setSuccessModalState(false);
    setSessionExppireModalState(false);
    const mockPaymentResult = {
      status: status || '',
      transactionId: transactionId || ''
    };
    setCheckOutDetailsHandlerToDefault();
    setUserDataHandlerToDefault();
    paymentHandler.onPaymentResult(mockPaymentResult);
  };
  useEffect(() => {
    if (bnplList.length > 0) {
      setIsFirstLoad(false);
    }
  }, [bnplList]);
  return /*#__PURE__*/_jsxs(View, {
    style: styles.screenView,
    children: [loading ? /*#__PURE__*/_jsxs(View, {
      style: styles.loaderView,
      children: [/*#__PURE__*/_jsx(LottieView, {
        source: require('../../assets/animations/boxpayLogo.json'),
        autoPlay: true,
        loop: true,
        style: styles.lottieStyle
      }), /*#__PURE__*/_jsx(Text, {
        children: "Loading..."
      })]
    }) : isFirstLoad ? /*#__PURE__*/_jsx(ShimmerView, {}) : /*#__PURE__*/_jsxs(View, {
      style: {
        flex: 1,
        backgroundColor: '#F5F6FB'
      },
      children: [/*#__PURE__*/_jsx(Header, {
        onBackPress: onProceedBack,
        showDesc: true,
        showSecure: false,
        text: "Select BNPL"
      }), /*#__PURE__*/_jsx(View, {
        style: styles.divider
      }), /*#__PURE__*/_jsx(ScrollView, {
        contentContainerStyle: {
          flexGrow: 1
        },
        keyboardShouldPersistTaps: "handled",
        children: bnplList.length > 0 ? /*#__PURE__*/_jsx(View, {
          style: styles.listContainer,
          children: /*#__PURE__*/_jsx(PaymentSelectorView, {
            providerList: bnplList,
            onProceedForward: onProceedForward,
            errorImage: require('../../assets/images/ic_bnpl_semi_bold.png'),
            onClickRadio: selectedInstrumentValue => onClickRadioButton(selectedInstrumentValue)
          })
        }) : /*#__PURE__*/_jsxs(View, {
          style: styles.emptyListContainer,
          children: [/*#__PURE__*/_jsx(Image, {
            source: require('../../assets/images/no_results_found.png'),
            style: styles.imageStyle
          }), /*#__PURE__*/_jsx(Text, {
            style: [styles.headingText, {
              fontFamily: checkoutDetails.fontFamily.semiBold
            }],
            children: "Oops!! No result found"
          }), /*#__PURE__*/_jsx(Text, {
            style: [styles.subHeadingText, {
              fontFamily: checkoutDetails.fontFamily.regular
            }],
            children: "Please try another search"
          })]
        })
      }), /*#__PURE__*/_jsxs(View, {
        style: styles.bottomContainer,
        children: [/*#__PURE__*/_jsx(Text, {
          style: [styles.bottomText, {
            fontFamily: checkoutDetails.fontFamily.regular
          }],
          children: "Secured by"
        }), /*#__PURE__*/_jsx(Image, {
          source: require('../../assets/images/splash-icon.png'),
          style: styles.bottomImage
        })]
      })]
    }), failedModalOpen && /*#__PURE__*/_jsx(PaymentFailed, {
      onClick: () => setFailedModalState(false),
      errorMessage: paymentFailedMessage.current
    }), successModalOpen && /*#__PURE__*/_jsx(PaymentSuccess, {
      onClick: onExitCheckout,
      transactionId: transactionId || '',
      method: "Card",
      localDateTime: successfulTimeStamp
    }), sessionExpireModalOpen && /*#__PURE__*/_jsx(SessionExpire, {
      onClick: onExitCheckout
    }), showWebView && /*#__PURE__*/_jsx(View, {
      style: styles.webViewContainer,
      children: /*#__PURE__*/_jsx(WebViewScreen, {
        url: paymentUrl,
        html: paymentHtml,
        onBackPress: () => {
          startBackgroundApiTask();
          setShowWebView(false);
        }
      })
    })]
  });
};
export default BNPLScreen;
//# sourceMappingURL=bnplScreen.js.map