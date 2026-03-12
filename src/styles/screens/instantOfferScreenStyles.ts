import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    searchContainer: {
      flexDirection: 'row',
      borderWidth: 1,
      borderColor: '#D9D9D9',
      margin: 16,
      borderRadius: 8,
      height: 48,
      alignItems: 'center',
      paddingHorizontal: 12,
    },
    input: {
      flex: 1,
      fontSize: 14,
    },
    applyText: {
      fontWeight: 'bold',
      fontSize: 16,
    },
    divider : {
      flexDirection: 'row',
      height: 1,
      backgroundColor: '#ECECED',
    },
    screenView : {
      flex: 1, backgroundColor: 'white' 
    },
    searchTextInputLabel : {
      fontSize: 16
    },
    searchTextInput : {
      marginTop: 16,
      marginHorizontal: 16,
      backgroundColor: 'white',
      fontSize: 16,
      color: '#0A090B',
      height: 60,
    }
  });

  export default styles