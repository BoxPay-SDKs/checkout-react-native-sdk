import { View, Text, StyleSheet, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import Modal from 'react-native-modal';
import LottieView from 'lottie-react-native';
import { checkoutDetailsHandler } from '../sharedContext/checkoutDetailsHandler';
import callUIAnalytics from '../postRequest/callUIAnalytics';
import { AnalyticsEvents } from '../interface';

interface PaymentSuccessProps {
  onClick: () => void;
  transactionId: string;
  method: string;
  localDateTime: string;
}

const PaymentSuccess: React.FC<PaymentSuccessProps> = ({
  onClick,
  transactionId,
  localDateTime,
}) => {
  const { checkoutDetails } = checkoutDetailsHandler;
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  useEffect(() => {
    const formatTransactionTimestamp = () => {
      const parts = localDateTime.split(' ');
      const localDate = parts[0] || '';
      const localTime = parts[1] || '';

      const dateParts = localDate.split('/');
      const day = dateParts[0] || '';
      const month = dateParts[1] || '';
      const year = dateParts[2] || '';

      const timeParts = localTime.split(':');
      const hour = timeParts[0] || '0';
      const minute = timeParts[1] || '0';

      // Map month number to short month name
      const monthNames: { [key: string]: string } = {
        '01': 'Jan',
        '02': 'Feb',
        '03': 'Mar',
        '04': 'Apr',
        '05': 'May',
        '06': 'Jun',
        '07': 'Jul',
        '08': 'Aug',
        '09': 'Sep',
        '10': 'Oct',
        '11': 'Nov',
        '12': 'Dec',
      };

      const formattedDate = `${monthNames[month] || 'Jan'} ${day}, ${year}`; // e.g., "Feb 25, 2025"

      // Convert 24-hour to 12-hour format
      const hourInt = parseInt(hour, 10);
      const amPm = hourInt >= 12 ? 'PM' : 'AM';
      const formattedHour = (hourInt % 12 || 12).toString().padStart(2, '0'); // Convert "13" to "1"
      const formattedTime = `${formattedHour}:${minute} ${amPm}`;

      setDate(formattedDate);
      setTime(formattedTime);
    };
    
    if(!checkoutDetails.isSuccessScreenVisible) {
      callUIAnalytics(AnalyticsEvents.PAYMENT_RESULT_SCREEN_DISPLAYED, "Success Screen skipped because merchant does not require", "")
      onClick()
    }
    formatTransactionTimestamp();
  });
  return (
    <View>
      <Modal isVisible={true} style={styles.modal}>
        <View style={styles.sheet}>
          <LottieView
            source={require('../../assets/animations/payment_successful.json')}
            autoPlay
            loop={false}
            speed={0.6}
            style={{ width: 90, height: 90, alignSelf: 'center' }}
          />
          <Text style={[styles.successfulHeading, {fontFamily: checkoutDetails.fontFamily.semiBold,}]}>Payment Successful!</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingTop: 24,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: '#000000',
                fontFamily: checkoutDetails.fontFamily.regular,
              }}
            >
              Transaction ID
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: '#000000',
                fontFamily: checkoutDetails.fontFamily.semiBold,
              }}
            >
              {transactionId}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingTop: 14,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: '#000000',
                fontFamily: checkoutDetails.fontFamily.regular,
              }}
            >
              Date
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: '#000000',
                fontFamily: checkoutDetails.fontFamily.semiBold,
              }}
            >
              {date}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingTop: 14,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: '#000000',
                fontFamily: checkoutDetails.fontFamily.regular,
              }}
            >
              Time
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: '#000000',
                fontFamily: checkoutDetails.fontFamily.semiBold,
              }}
            >
              {time}
            </Text>
          </View>
          {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 14 }}>
                        <Text style={{ fontSize: 14, color: '#000000', fontFamily: checkoutDetails.fontFamily.regular }}>Payment Method</Text>
                        <Text style={{ fontSize: 14, color: '#000000', fontFamily: checkoutDetails.fontFamily.semiBold }}>{method}</Text>
                    </View> */}
          <View style={styles.dashedLine} />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingTop: 10,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: '#000000',
                fontFamily: checkoutDetails.fontFamily.semiBold,
              }}
            >
              Total Amount
            </Text>
            <Text
              style={{
                fontSize: 18,
                color: '#000000',
                fontFamily: checkoutDetails.fontFamily.semiBold,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: '#000000',
                  fontFamily: 'Inter-SemiBold',
                }}
              >
                {checkoutDetails.currencySymbol}
              </Text>
              {checkoutDetails.amount}
            </Text>
          </View>
          <View style={styles.dashedLine} />
          {/* <Text
                        style={{
                            fontSize: 12, fontFamily: checkoutDetails.fontFamily.regular,
                            color: '#4F4D55', alignSelf: 'center', paddingBottom: 16, paddingTop: 12
                        }}
                    >You will be redirected to the merchant's page</Text> */}
          <Pressable
            style={[
              styles.buttonContainer,
              { backgroundColor: checkoutDetails.buttonColor, borderRadius: checkoutDetails.ctaBorderRadius, },
            ]}
            onPress={() => {
              callUIAnalytics(AnalyticsEvents.PAYMENT_RESULT_SCREEN_DISPLAYED, "Success Screen button clicked", "")
              onClick()
            }}
          >
            <Text style={[styles.buttonText, {fontFamily: checkoutDetails.fontFamily.semiBold,}]}>Done</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
};

export default PaymentSuccess;

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  sheet: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  successfulHeading: {
    color: '#019939',
    fontSize: 20,
    alignSelf: 'center',
    paddingTop: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
    backgroundColor: '#1CA672',
    paddingVertical: 14,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  dashedLine: {
    backgroundColor: '#E6E6E6', // Color of the line
    width: '100%', // Full width
    marginVertical: 10,
    height : 2
  },
});
