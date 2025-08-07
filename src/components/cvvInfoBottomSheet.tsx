import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
import { checkoutDetailsHandler } from '../sharedContext/checkoutDetailsHandler';
interface CvvInfoBottomSheetProps {
  onClick: () => void;
}
const CvvInfoBottomSheet: React.FC<CvvInfoBottomSheetProps> = ({ onClick }) => {
  const { checkoutDetails } = checkoutDetailsHandler;
  return (
    <View>
      <Modal isVisible={true} style={styles.modal} onBackdropPress={onClick}>
        <View style={styles.sheet}>
          <Text
            style={{
              fontFamily: 'Poppins-SemiBold',
              fontSize: 20,
              color: '#2D2B32',
            }}
          >
            Where to find CVV?
          </Text>
          <Image
            source={require('../assets/images/cvv_info_image.png')}
            style={{ width: 120, height: 58, marginTop: 28 }}
          />
          <Text style={styles.secondaryHeading}>Generic position for CVV</Text>
          <Text style={styles.desc}>
            3 digit numeric code on the back side of card
          </Text>
          <View
            style={{
              flexDirection: 'row',
              height: 2,
              backgroundColor: '#ECECED',
              marginTop: 28,
            }}
          />
          <Image
            source={require('../assets/images/cvv_info_image_amex.png')}
            style={{ width: 120, height: 58, marginTop: 28 }}
          />
          <Text style={styles.secondaryHeading}>
            CVV for American Express Card
          </Text>
          <Text style={styles.desc}>
            4 digit numeric code on the front side of the card, just above the
            card number
          </Text>
          <Pressable
            style={[
              styles.buttonContainer,
              { backgroundColor: checkoutDetails.brandColor },
            ]}
            onPress={onClick}
          >
            <Text style={styles.buttonText}>Got it!</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
};

export default CvvInfoBottomSheet;

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
  secondaryHeading: {
    color: '#2D2B32',
    fontSize: 14,
    marginTop: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  desc: {
    color: '#4F4D55',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
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
