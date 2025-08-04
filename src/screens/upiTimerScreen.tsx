import {
  View,
  Text,
  Image,
  BackHandler,
  StyleSheet,
  StatusBar,
} from 'react-native'; // Import Modal
import { useEffect, useRef, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import Header from '../components/header';
import fetchStatus from '../postRequest/fetchStatus';
import PaymentFailed from '../components/paymentFailed';
import PaymentSuccess from '../components/paymentSuccess';
import SessionExpire from '../components/sessionExpire';
import CancelPaymentModal from '../components/cancelPaymentModal';
import { paymentHandler } from '../sharedContext/paymentStatusHandler';
import CircularProgressBar from '../components/circularProgress';
import type { PaymentResult } from '../interface';
import { checkoutDetailsHandler } from '../sharedContext/checkoutDetailsHandler';

const UpiTimerScreen = () => {
  const { upiId } = useLocalSearchParams();
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
    const mockPaymentResult: PaymentResult = {
      status: status,
      transactionId: transactionId,
    };
    paymentHandler.onPaymentResult(mockPaymentResult);
    router.dismissAll();
  };

  const onProceedBack = () => {
    if (cancelClicked) {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
      stopBackgroundApiTask();
      router.back();
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
    router.back();
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      onProceedBack
    );
    return () => {
      backHandler.remove();
    };
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
    const response = await fetchStatus(
      checkoutDetails.token,
      checkoutDetails.env
    );
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
        stopBackgroundApiTask();
      } else if (['APPROVED', 'SUCCESS', 'PAID'].includes(status)) {
        setSuccessfulTimeStamp(response.transactionTimestampLocale);
        setSuccessModalState(true);
        setStatus('Success');
        stopBackgroundApiTask();
      } else if (['EXPIRED'].includes(status)) {
        setSessionExppireModalState(true);
        setStatus('Expired');
        stopBackgroundApiTask();
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
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F6FB' }}>
      <StatusBar barStyle="dark-content" />
      <Header
        onBackPress={onProceedBack}
        showDesc={true}
        showSecure={true}
        text="Payment Details"
      />

      <View
        style={{
          flex: 1,
          justifyContent: 'flex-start',
          alignItems: 'center',
          paddingHorizontal: 16,
          marginTop: 32,
        }}
      >
        <Text
          style={{
            color: '#2D2B32',
            fontSize: 18,
            textAlign: 'center',
            fontFamily: 'Poppins-SemiBold',
          }}
        >
          Complete your payment
        </Text>
        <Text
          style={{
            color: '#2D2B32',
            fontSize: 14,
            paddingTop: 12,
            textAlign: 'center',
            lineHeight: 24,
            fontFamily: 'Poppins-Regular',
          }}
        >
          Open your UPI application and confirm the payment before the time
          expires
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: '#BABABA',
            borderWidth: 2,
            borderRadius: 8,
            paddingVertical: 6,
            paddingHorizontal: 8,
            marginTop: 12,
          }}
        >
          <Image
            source={require('../../../assets/images/upi-timer-sheet-upi-icon.png')}
            style={{ height: 16, width: 16, marginRight: 4 }}
          />
          <Text
            style={{
              color: '#1D1C20',
              fontSize: 12,
              fontFamily: 'Poppins-Regular',
            }}
          >
            UPI Id : {upiIdStr}
          </Text>
        </View>
        <Text
          style={{
            color: '#1D1C20',
            fontSize: 16,
            textAlign: 'center',
            marginTop: 32,
            fontFamily: 'Poppins-Medium',
          }}
        >
          Expires in
        </Text>
        <View style={{ marginTop: 14, alignItems: 'center' }}>
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
          style={{
            flexDirection: 'row',
            borderColor: '#ECECED',
            borderWidth: 2,
            borderRadius: 8,
            paddingVertical: 16,
            paddingHorizontal: 16,
            marginTop: 32,
          }}
        >
          <Image
            source={require('../../../assets/images/ic_info.png')}
            style={{ height: 26, width: 26 }}
          />
          <Text
            style={{
              color: '#1D1C20',
              fontSize: 12,
              paddingStart: 16,
              lineHeight: 18,
              fontFamily: 'Poppins-Regular',
            }}
          >
            Kindly avoid using the back button until the transaction process is
            complete
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          height: 2,
          backgroundColor: '#ECECED',
          marginBottom: 48,
        }}
      />
      <View style={styles.cancelPaymentContainer}>
        <Text
          style={{
            fontSize: 16,
            color: checkoutDetails.brandColor,
            fontFamily: 'Poppins-SemiBold',
          }}
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

const styles = StyleSheet.create({
  cancelPaymentContainer: {
    alignItems: 'center',
    paddingBottom: 10,
    paddingHorizontal: 16,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
