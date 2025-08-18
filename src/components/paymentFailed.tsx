import { View, Text, StyleSheet, Pressable } from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
import LottieView from 'lottie-react-native';
import { checkoutDetailsHandler } from '../sharedContext/checkoutDetailsHandler';

interface PaymentFailedProps {
  onClick: () => void;
  errorMessage: string;
}
const PaymentFailed: React.FC<PaymentFailedProps> = ({
  onClick,
  errorMessage,
}) => {
  const { checkoutDetails } = checkoutDetailsHandler;
  return (
    <View>
      <Modal isVisible={true} style={styles.modal}>
        <View style={styles.sheet}>
          <LottieView
            source={require('../../assets/animations/payment_failed.json')}
            autoPlay
            loop={false}
            style={{ width: 90, height: 90, alignSelf: 'center' }}
          />
          <Text style={styles.successfulHeading}>Payment Failed</Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Poppins-Regular',
              color: '#000000D9',
              textAlign: 'center',
              alignSelf: 'center',
              paddingTop: 8,
              paddingBottom: 16,
              lineHeight: 20,
            }}
          >
            {errorMessage}
          </Text>
          <Pressable
            style={[
              styles.buttonContainer,
              { backgroundColor: checkoutDetails.brandColor },
            ]}
            onPress={onClick}
          >
            <Text style={styles.buttonText}>Retry Payment</Text>
          </Pressable>
          {/* <Pressable style={[styles.buttonContainer, {backgroundColor:'white', borderColor:'#1CA672', borderWidth:1}]} onPress={onClick}>
                        <Text style={[styles.buttonText, {color:'#1CA672'}]}>Return to Payment Options</Text>
                    </Pressable> */}
        </View>
      </Modal>
    </View>
  );
};

export default PaymentFailed;

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
    color: '#E84142',
    fontSize: 20,
    alignSelf: 'center',
    paddingTop: 8,
    fontFamily: 'Poppins-SemiBold',
  },
  buttonContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    justifyContent: 'center',
    marginTop: 12,
    backgroundColor: '#1CA672',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    paddingVertical: 12,
    fontFamily: 'Poppins-SemiBold',
  },
});
