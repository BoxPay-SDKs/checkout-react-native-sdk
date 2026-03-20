"use strict";

import { View, Text, Image, BackHandler, StatusBar } from 'react-native'; // Import Modal
import { useEffect, useRef, useState } from 'react';
import Header from "../components/header.js";
import fetchStatus from "../postRequest/fetchStatus.js";
import PaymentFailed from "../components/paymentFailed.js";
import PaymentSuccess from "../components/paymentSuccess.js";
import SessionExpire from "../components/sessionExpire.js";
import CancelPaymentModal from "../components/cancelPaymentModal.js";
import { paymentHandler } from "../sharedContext/paymentStatusHandler.js";
import CircularProgressBar from "../components/circularProgress.js";
import styles from "../styles/screens/upiTimerScreenStyle.js";
import { checkoutDetailsHandler, setCheckOutDetailsHandlerToDefault } from "../sharedContext/checkoutDetailsHandler.js";
import { handleFetchStatusResponseHandler } from "../sharedContext/handlePaymentResponseHandler.js";
import { useCountdown, formatTime } from "../utility.js";
import { setUserDataHandlerToDefault } from "../sharedContext/userdataHandler.js";

// Define the screen's navigation properties
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const UpiTimerScreen = ({
  route,
  navigation
}) => {
  const {
    upiId
  } = route.params || {};
  const {
    checkoutDetails
  } = checkoutDetailsHandler;
  const upiIdStr = Array.isArray(upiId) ? upiId[0] : upiId;
  const [cancelClicked, setCancelClicked] = useState(false);
  const [failedModalOpen, setFailedModalState] = useState(false);
  const [successModalOpen, setSuccessModalState] = useState(false);
  const paymentFailedMessage = useRef('You may have cancelled the payment or there was a delay in response. Please retry.');
  const [sessionExpireModalOpen, setSessionExppireModalState] = useState(false);
  const [successfulTimeStamp, setSuccessfulTimeStamp] = useState('');
  const [status, setStatus] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const {
    timeRemaining: upiCollectTimerValue,
    start: startCollectTimer,
    stop: stopCollectTimer
  } = useCountdown(300);
  useEffect(() => {
    const isUPICollectTimerRunning = upiCollectTimerValue < 300;
    if (isUPICollectTimerRunning && upiCollectTimerValue > 0 && upiCollectTimerValue % 4 === 0) {
      callFetchStatusApi();
    }
  }, [upiCollectTimerValue]);
  useEffect(() => {
    if (failedModalOpen || successModalOpen || sessionExpireModalOpen) {
      stopCollectTimer();
    } else {
      startCollectTimer();
    }
  }, [failedModalOpen, successModalOpen, sessionExpireModalOpen]);
  const onExitCheckout = () => {
    setSuccessModalState(false);
    setSessionExppireModalState(false);
    const mockPaymentResult = {
      status: status,
      transactionId: transactionId
    };
    setUserDataHandlerToDefault();
    setCheckOutDetailsHandlerToDefault();
    paymentHandler.onPaymentResult(mockPaymentResult);
  };
  const onProceedBack = () => {
    if (cancelClicked) {
      stopCollectTimer();
      navigation.goBack();
    } else {
      setCancelClicked(true);
    }
    return true;
  };
  const onPaymentFailed = () => {
    setFailedModalState(true);
    stopCollectTimer();
    navigation.goBack();
  };
  useEffect(() => {
    const backAction = () => {
      return onProceedBack();
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [navigation]);
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
      isFromUPIIntentFlow: false
    });
  };
  return /*#__PURE__*/_jsxs(View, {
    style: styles.screenView,
    children: [/*#__PURE__*/_jsx(StatusBar, {
      barStyle: "dark-content"
    }), /*#__PURE__*/_jsx(Header, {
      onBackPress: onProceedBack,
      showDesc: true,
      showSecure: true,
      text: "Payment Details"
    }), /*#__PURE__*/_jsxs(View, {
      style: styles.mainContainer,
      children: [/*#__PURE__*/_jsx(Text, {
        style: [styles.headingText, {
          fontFamily: checkoutDetails.fontFamily.semiBold
        }],
        children: "Complete your payment"
      }), /*#__PURE__*/_jsx(Text, {
        style: [styles.descText, {
          fontFamily: checkoutDetails.fontFamily.regular
        }],
        children: "Open your UPI application and confirm the payment before the time expires"
      }), /*#__PURE__*/_jsxs(View, {
        style: styles.container,
        children: [/*#__PURE__*/_jsx(Image, {
          source: require('../../assets/images/upi-timer-sheet-upi-icon.png'),
          style: styles.imageStyle
        }), /*#__PURE__*/_jsxs(Text, {
          style: [styles.text, {
            fontFamily: checkoutDetails.fontFamily.regular
          }],
          children: ["UPI Id : ", upiIdStr]
        })]
      }), /*#__PURE__*/_jsx(Text, {
        style: [styles.expireInTextStyle, {
          fontFamily: checkoutDetails.fontFamily.medium
        }],
        children: "Expires in"
      }), /*#__PURE__*/_jsx(View, {
        style: styles.progressBarContainer,
        children: /*#__PURE__*/_jsx(CircularProgressBar, {
          size: 150,
          strokeWidth: 10,
          progressColor: upiCollectTimerValue <= 30 ? '#FAA4A4' : checkoutDetails.buttonColor,
          progress: upiCollectTimerValue,
          formatTime: formatTime(upiCollectTimerValue),
          textColor: upiCollectTimerValue <= 30 ? '#F53535' : checkoutDetails.buttonColor
        })
      }), /*#__PURE__*/_jsxs(View, {
        style: styles.infoContainer,
        children: [/*#__PURE__*/_jsx(Image, {
          source: require('../../assets/images/ic_info.png'),
          style: [styles.infoImageStyle, {
            tintColor: checkoutDetails.buttonColor
          }]
        }), /*#__PURE__*/_jsx(Text, {
          style: [styles.infoText, {
            fontFamily: checkoutDetails.fontFamily.regular
          }],
          children: "Kindly avoid using the back button until the transaction process is complete"
        })]
      })]
    }), /*#__PURE__*/_jsx(View, {
      style: styles.thickDivider
    }), /*#__PURE__*/_jsx(View, {
      style: styles.cancelPaymentContainer,
      children: /*#__PURE__*/_jsx(Text, {
        style: [styles.cancelTextStyle, {
          color: checkoutDetails.buttonColor,
          fontFamily: checkoutDetails.fontFamily.semiBold
        }],
        onPress: () => {
          setCancelClicked(true);
        },
        children: "Cancel Payment"
      })
    }), failedModalOpen && /*#__PURE__*/_jsx(PaymentFailed, {
      onClick: () => {
        onPaymentFailed();
      },
      errorMessage: paymentFailedMessage.current
    }), successModalOpen && /*#__PURE__*/_jsx(PaymentSuccess, {
      onClick: onExitCheckout,
      transactionId: transactionId,
      method: "UPI",
      localDateTime: successfulTimeStamp
    }), sessionExpireModalOpen && /*#__PURE__*/_jsx(SessionExpire, {
      onClick: onExitCheckout
    }), cancelClicked && /*#__PURE__*/_jsx(CancelPaymentModal, {
      onNoClick: () => {
        setCancelClicked(false);
      },
      onYesClick: () => {
        setCancelClicked(false);
        onProceedBack();
      }
    })]
  });
};
export default UpiTimerScreen;
//# sourceMappingURL=upiTimerScreen.js.map