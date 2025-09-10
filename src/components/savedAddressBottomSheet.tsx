import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  type ImageSourcePropType,
} from "react-native";
import Modal from "react-native-modal";

interface Props {
  visible: boolean;
  onClose: () => void;
  onEdit: () => void;
  onSetDefault: () => void;
  onDelete: () => void;
  label: string;
  address: string;
  icon: ImageSourcePropType;
}

const SavedAddressBottomSheet = ({
  visible,
  onClose,
  onEdit,
  onSetDefault,
  onDelete,
  label,
  address,
  icon,
}: Props) => {
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      style={styles.modal}
      backdropOpacity={0.4}
    >
      <View style={styles.container}>
        {/* Address Info */}
        <View>
          <View style={styles.headerContainer}>
            <Image source={icon} style={styles.icon} />
            <Text style={styles.label}>{label}</Text>
          </View>
          <Text style={styles.address} numberOfLines={1} ellipsizeMode="tail">
              {address}
            </Text>
        </View>

        {/* Options */}
        <TouchableOpacity style={styles.option} onPress={onEdit}>
          <Text style={styles.optionText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={onSetDefault}>
          <Text style={styles.optionText}>Set as Default</Text>
        </TouchableOpacity>

        {/* Delete Option */}
        <TouchableOpacity style={styles.deleteOption} onPress={onDelete}>
          <Text style={styles.deleteText}>Delete address</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  container: {
    backgroundColor: "#F5F6FB",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  headerContainer: {
    flexDirection: "row",
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 12,
    tintColor: "#2D2B32",
  },
  label: {
    fontSize: 16,
    fontFamily:"Poppins-SemiBold",
    color: "#2D2B32",
  },
  address: {
    fontSize: 14,
    color: "#4F4D55",
    fontFamily:"Poppins-Regular",
    marginTop:4,
    marginBottom:20
  },
  option: {
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ECECED",
  },
  optionText: {
    fontSize: 16,
    color: "#2D2B32",
    fontFamily:"Poppins-Regular"
  },
  deleteOption: {
    paddingVertical: 14,
    alignItems: "center",
  },
  deleteText: {
    fontSize: 16,
    color: "#FF4D4F",
    fontFamily:"Poppins-Regular"
  },
});

export default SavedAddressBottomSheet;
