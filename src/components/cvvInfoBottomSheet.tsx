import { View, Text, Pressable, Image } from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
import { checkoutDetailsHandler } from '../sharedContext/checkoutDetailsHandler';
import styles from '../styles/components/cvvInfoBottomSheetStyles';

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
            style={styles.headingText}
          >
            Where to find CVV?
          </Text>
          <Image
            source={require('../../assets/images/cvv_info_image.png')}
            style={styles.imageStyle}
          />
          <Text style={styles.secondaryHeading}>Generic position for CVV</Text>
          <Text style={styles.desc}>
            3 digit numeric code on the back side of card
          </Text>
          <View
            style={styles.divider}
          />
          <Image
            source={require('../../assets/images/cvv_info_image_amex.png')}
            style={styles.imageStyle}
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
