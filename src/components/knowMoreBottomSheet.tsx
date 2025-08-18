import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import Modal from 'react-native-modal';
import { checkoutDetailsHandler } from '../sharedContext/checkoutDetailsHandler';

interface KnowMoreBottomSheetProps {
  onClick: () => void;
}

const KnowMoreBottomSheet = ({ onClick }: KnowMoreBottomSheetProps) => {
  const { checkoutDetails } = checkoutDetailsHandler;
  return (
    <View>
      <Modal isVisible={true} style={styles.modal} onBackdropPress={onClick}>
        <View style={styles.sheet}>
          <Text
            style={styles.headingText}
          >
            RBI Guidelines
          </Text>

          <Text
            style={styles.subHeadingText}
          >
            As per the new RBI guidelines, we can no longer store your card
            information with us.
          </Text>

          <View
            style={styles.container}
          >
            <Image
              source={require('../../assets/images/ic_card_lock.png')}
              style={styles.imageStyle}
            />
            <Text
              style={styles.subHeadingText}
            >
              Your bank/card network will securely save your card information
              via tokenization if you consent for the same.
            </Text>
          </View>
          <View
            style={styles.container}
          >
            <Image
              source={require('../../assets/images/ic_card_add.png')}
              style={styles.imageStyle}
            />
            <Text
              style={styles.subHeadingText}
            >
              In case you choose to not tokenize, you’ll have to enter card
              details every time you pay.
            </Text>
          </View>
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

export default KnowMoreBottomSheet;

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
    marginTop: 28,
    backgroundColor: '#1CA672',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    paddingVertical: 12,
    fontFamily: 'Poppins-SemiBold',
  },
  headingText : {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#2D2B32',
  },
  subHeadingText : {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#2D2B32',
    paddingTop: 12
  },
  imageStyle : { width: 28, height: 28, alignSelf: 'flex-start' },
  container : {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 28,
    marginEnd: 16,
  }
});
