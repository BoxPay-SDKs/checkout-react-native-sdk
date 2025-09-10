import { StyleSheet } from "react-native";

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
    headingText : {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 20,
        color: '#2D2B32'
    },
    divider : {
        flexDirection: 'row',
        height: 2,
        backgroundColor: '#ECECED',
        marginTop: 28,  
    },
    imageStyle : {
        width: 120, height: 58, marginTop: 28
    }
});

export default styles