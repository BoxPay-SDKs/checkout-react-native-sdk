import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import Modal from 'react-native-modal';
import { checkoutDetailsHandler } from '../sharedContext/checkoutDetailsHandler';
import styles from '../styles/components/cancelPaymentModalStyles';

interface CancelPaymentModalProps {
  onYesClick: () => void;
  onNoClick: () => void;
}

const CancelPaymentModal: React.FC<CancelPaymentModalProps> = ({
  onYesClick,
  onNoClick,
}) => {
  const { checkoutDetails } = checkoutDetailsHandler;

  return (
    <View style={styles.modalContainer}>
      <Modal isVisible={true} style={styles.modal}>
        <View style={styles.modalContent}>
          <View style={styles.iconContainer}>
            <Image
              source={require('../../assets/images/ic_info.png')}
              style={styles.iconImage}
            />
            <Text style={styles.modalTitle}>Cancel Transaction?</Text>
          </View>
          <Text style={styles.modalText}>
            Are you sure you want to cancel the transaction?
          </Text>

          <View style={styles.buttonContainer}>
            <Pressable
              style={[
                styles.cancelButton,
                { borderColor: '#E6E6E6', borderWidth: 1 },
              ]}
              onPress={onNoClick}
            >
              <Text
                style={[
                  styles.buttonText,
                  { color: checkoutDetails.brandColor },
                ]}
              >
                Not now
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.confirmButton,
                { backgroundColor: checkoutDetails.brandColor },
              ]}
              onPress={onYesClick}
            >
              <Text style={styles.confirmButtonText}>Yes</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CancelPaymentModal;
