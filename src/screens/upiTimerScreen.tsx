import {
  View,
  Text,
  Image,
  BackHandler,
  StatusBar,
} from 'react-native'; // Import Modal
import { useEffect, useRef, useState } from 'react';
import Header from '../components/header';
import fetchStatus from '../postRequest/fetchStatus';
import PaymentFailed from '../components/paymentFailed';
import PaymentSuccess from '../components/paymentSuccess';
import SessionExpire from '../components/sessionExpire';
import CancelPaymentModal from '../components/cancelPaymentModal';
import { paymentHandler } from '../sharedContext/paymentStatusHandler';
import CircularProgressBar from '../components/circularProgress';
import type { PaymentResultObject, UPITimerScreenParams } from '../interface';
import styles from '../styles/screens/upiTimerScreenStyle';
import { checkoutDetailsHandler } from '../sharedContext/checkoutDetailsHandler';
import { handleFetchStatusResponseHandler } from '../sharedContext/handlePaymentResponseHandler';
import type { CheckoutStackParamList } from '../navigation';
import type {RouteProp, NavigationProp} from '@react-navigation/native'

type UpiTimerScreenRouteProp = RouteProp<CheckoutStackParamList, 'UpiTimerScreen'>;

// Define the screen's navigation properties
type UpiTimercreenNavigationProp = NavigationProp<CheckoutStackParamList, 'UpiTimerScreen'>;

interface Props {
  route: UpiTimerScreenRouteProp;
  navigation: UpiTimercreenNavigationProp;
}

const UpiTimerScreen = ({ route, navigation }: Props) => {
  const {
    upiId
  } = route.params as UPITimerScreenParams || {}; 
  const { checkoutDetails } = checkoutDetailsHandler;

  const upiIdStr = Array.isArray(upiId) ? upiId[0] : upiId;

  const [timerValue, setTimerValue] = useState(5 * 60);
  const [cancelClicked, setCancelClicked] = useState(false);
  const [failedModalOpen, setFailedModalState] = useState(false);
  const [successModalOpen, setSuccessModalState] = useState(false);
  const paymentFailedMessage = useRef<string>(
    'You may have cancelled the payment or there was a delay in response. Please retry.'
  );
  const [sessionExpireModalOpen, setSessionExppireModalState] = useState(false);
  const [successfulTimeStamp, setSuccessfulTimeStamp] = useState('');
  const [status, setStatus] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const backgroundApiInterval = useRef<NodeJS.Timeout | null>(null);
  const timerInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isTimerRunning) {
      timerInterval.current = setInterval(() => {
        setTimerValue((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerInterval.current!);
            stopBackgroundApiTask();
            setFailedModalState(true);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
    };
  }, [isTimerRunning]);

  useEffect(() => {
    if (failedModalOpen || successModalOpen || sessionExpireModalOpen) {
      setIsTimerRunning(false);
    } else {
      setIsTimerRunning(true);
    }
  }, [failedModalOpen, successModalOpen, sessionExpireModalOpen]);

  const onExitCheckout = () => {
    const mockPaymentResult: PaymentResultObject = {
      status: status,
      transactionId: transactionId,
    };
    paymentHandler.onPaymentResult(mockPaymentResult);
  };

  const onProceedBack = () => {
    if (cancelClicked) {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
      stopBackgroundApiTask();
      navigation.goBack()
    } else {
      setCancelClicked(true);
    }
    return true;
  };

  const onPaymentFailed = () => {
    setFailedModalState(true);
    stopBackgroundApiTask();
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
    }
    navigation.goBack()
  };

  useEffect(() => {
    BackHandler.addEventListener(
      'hardwareBackPress',
      onProceedBack
    );
  }, []);

  const formatTime = () => {
    const minutes = Math.floor(timerValue / 60);
    const seconds = timerValue % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  useEffect(() => {
    const startBackgroundApiTask = () => {
      backgroundApiInterval.current = setInterval(() => {
        callFetchStatusApi();
      }, 4000);
    };
    startBackgroundApiTask();
  }, []);

  const stopBackgroundApiTask = () => {
    if (backgroundApiInterval.current) {
      clearInterval(backgroundApiInterval.current);
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
      stopBackgroundApiTask: stopBackgroundApiTask
    });
  };

  return (
    <View style={styles.screenView}>
      <StatusBar barStyle="dark-content" />
      <Header
        onBackPress={onProceedBack}
        showDesc={true}
        showSecure={true}
        text="Payment Details"
      />

      <View
        style={styles.mainContainer}
      >
        <Text
          style={styles.headingText}
        >
          Complete your payment
        </Text>
        <Text
          style={styles.descText}
        >
          Open your UPI application and confirm the payment before the time
          expires
        </Text>
        <View
          style={styles.container}
        >
          <Image
            source={require('../../assets/images/upi-timer-sheet-upi-icon.png')}
            style={styles.imageStyle}
          />
          <Text
            style={styles.text}
          >
            UPI Id : {upiIdStr}
          </Text>
        </View>
        <Text
          style={styles.expireInTextStyle}
        >
          Expires in
        </Text>
        <View style={styles.progressBarContainer}>
          <CircularProgressBar
            size={150}
            strokeWidth={10}
            progressColor={
              timerValue <= 30 ? '#FAA4A4' : checkoutDetails.brandColor
            }
            progress={timerValue}
            formatTime={formatTime()}
            textColor={
              timerValue <= 30 ? '#F53535' : checkoutDetails.brandColor
            }
          />
        </View>
        <View
          style={styles.infoContainer}
        >
          <Image
            source={require('../../assets/images/ic_info.png')}
            style={styles.infoImageStyle}
          />
          <Text
            style={styles.infoText}
          >
            Kindly avoid using the back button until the transaction process is
            complete
          </Text>
        </View>
      </View>

      <View
        style={styles.thickDivider}
      />
      <View style={styles.cancelPaymentContainer}>
        <Text
          style={[styles.cancelTextStyle,{
            color: checkoutDetails.brandColor
          }]}
          onPress={() => {
            setCancelClicked(true);
          }}
        >
          Cancel Payment
        </Text>
      </View>
      {failedModalOpen && (
        <PaymentFailed
          onClick={() => {
            onPaymentFailed();
          }}
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

      {cancelClicked && (
        <CancelPaymentModal
          onNoClick={() => {
            setCancelClicked(false);
          }}
          onYesClick={() => {
            setCancelClicked(false);
            onProceedBack();
          }}
        />
      )}
    </View>
  );
};

export default UpiTimerScreen;
