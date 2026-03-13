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
  const {checkoutDetails} = checkoutDetailsHandler
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
        <Text style={[styles.title, {fontFamily:checkoutDetails.fontFamily.semiBold,}]}>Proceed to delete this address?</Text>

        {/* Address Info */}
        <Text style={[styles.address, { fontFamily: checkoutDetails.fontFamily.regular}]}>{address}</Text>

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={[styles.cancelText, {color: checkoutDetails.buttonColor,
    fontFamily: checkoutDetails.fontFamily.regular}]}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.deleteButton, {backgroundColor: checkoutDetails.buttonColor,}]} onPress={onDelete}>
            <Text style={[styles.deleteText, {fontFamily: checkoutDetails.fontFamily.semiBold}]}>Yes, delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
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
    color: "#2D2B32",
    marginBottom: 4,
  },
  address: {
    fontSize: 12,
    color: "#4F4D55",
    marginBottom: 20
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
    borderRadius: 8,
    alignItems: "center",
  },
  cancelText: {
    fontSize: 16
  },
  deleteText: {
    fontSize: 16,
    color: "#fff"
  },
});

export default DeleteAddressModal;
