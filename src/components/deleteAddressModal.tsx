import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import Modal from "react-native-modal";
import { checkoutDetailsHandler } from "../sharedContext/checkoutDetailsHandler";

interface DeletePros {
    visible : boolean,
    onCancel : () => void,
    onDelete : () => void,
    address : string
}

const DeleteAddressModal = ({ visible, onCancel, onDelete, address } : DeletePros) => {
  return (
    <Modal
      isVisible={visible}
      animationIn="zoomIn"
      animationOut="zoomOut"
      backdropOpacity={0.5}
      onBackdropPress={onCancel}
      useNativeDriver
    >
      <View style={styles.modalContainer}>
        {/* Delete Icon */}
        <Image
          source={require("../../assets/images/ic_trash.png")}
          style={styles.deleteIcon}
        />

        {/* Title */}
        <Text style={styles.title}>Proceed to delete this address?</Text>

        {/* Address Info */}
        <Text style={styles.address}>{address}</Text>

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
            <Text style={styles.deleteText}>Yes, delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
const {brandColor} = checkoutDetailsHandler.checkoutDetails
const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    width: "90%",
    alignSelf: "center",
  },
  deleteIcon: {
    width: 28,
    height: 28,
    marginBottom: 10
  },
  title: {
    fontSize: 16,
    fontFamily:"Poppins-SemiBold",
    color: "#2D2B32",
    marginBottom: 4,
  },
  address: {
    fontSize: 12,
    color: "#4F4D55",
    marginBottom: 20,
    fontFamily:"Poppins-Regular"
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
    paddingVertical: 12,
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    alignItems: "center",
  },
  deleteButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: brandColor,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelText: {
    fontSize: 16,
    color: brandColor,
    fontFamily:"Poppins-Regular"
  },
  deleteText: {
    fontSize: 16,
    color: "#fff",
    fontFamily:"Poppins-SemiBold"
  },
});

export default DeleteAddressModal;
