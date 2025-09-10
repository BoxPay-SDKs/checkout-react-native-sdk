import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    screenView : {
        flex: 1, 
        backgroundColor: 'white'
    },
    divider : {
        flexDirection: 'row', 
        height: 1, 
        backgroundColor: '#ECECED' 
    },
    textInput: {
        backgroundColor: 'white',
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        color: '#0A090B',
        height: 56,
    },
    buttonContainer: {
        flexDirection: 'row',
        borderRadius: 8,
        justifyContent: 'center',
        marginTop: 20,
        marginHorizontal: 16,
        paddingTop: 14,
        paddingBottom: 12,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
    },
    textFieldLable : {
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
    },
    imageStyle : {
        alignSelf: 'center',
        height: 6,
        width: 14,
        marginEnd: 8
    },
    errorText : {
        fontSize: 12,
        fontFamily: 'Poppins-Regular',
        color: '#E12121',
        marginHorizontal: 16,
    },
    container : {
        flex: 1,
        flexDirection: 'row',
        marginTop: 20,
        marginHorizontal: 16
    },
    bottomContainer : {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingBottom: 16,
    }
})

export default styles