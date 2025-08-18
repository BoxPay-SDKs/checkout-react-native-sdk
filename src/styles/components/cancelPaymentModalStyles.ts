import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modal: {
      margin: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    modalContent: {
      backgroundColor: '#F5F6FB',
      borderRadius: 16,
      padding: 16,
      width: '80%',
      margin: 'auto',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    iconContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    iconImage: {
      height: 20,
      width: 20,
      tintColor: '#DB7C1D',
    },
    modalTitle: {
      fontSize: 16,
      color: '#2D2B32',
      marginLeft: 8,
      fontFamily: 'Poppins-SemiBold',
    },
    modalText: {
      fontSize: 14,
      color: '#555',
      marginBottom: 20,
      lineHeight: 24,
      fontFamily: 'Poppins-Regular',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    cancelButton: {
      backgroundColor: '#fff',
      borderRadius: 7,
      paddingVertical: 10,
      paddingHorizontal: 20,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    confirmButton: {
      borderRadius: 7,
      paddingVertical: 10,
      paddingHorizontal: 20,
      flex: 1,
      marginLeft: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      color: '#333',
      fontSize: 16,
      textAlign: 'center',
      fontFamily: 'Poppins-Regular',
    },
    confirmButtonText: {
      color: 'white',
      fontSize: 16,
      textAlign: 'center',
      fontFamily: 'Poppins-SemiBold',
    },
});

export default styles