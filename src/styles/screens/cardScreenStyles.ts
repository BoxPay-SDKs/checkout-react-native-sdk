import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    textInput: {
        backgroundColor: 'white',
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        color: '#0A090B',
        height: 60,
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
    screenView : {
        flex: 1, backgroundColor: 'white' 
    },
    loadingContainer : { flex: 1, alignItems: 'center', justifyContent: 'center' },
    lottieStyle : { width: 80, height: 80 },
    divider : {
        flexDirection: 'row',
        height: 1,
        backgroundColor: '#ECECED',
    },
    container : {
        borderColor: '#E6E6E6',
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 16,
        marginTop: 8,
    },
    imageContainer : {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    nameText : {
        paddingStart: 8,
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14,
    },
    thickBorder : {
        borderWidth: 1.5,
        borderStartColor: '#E6E6E6',
        borderTopColor: 'white',
        borderEndColor: 'white',
        borderBottomColor: 'white',
        paddingStart: 8,
    },
    durationText : {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 12,
        color: '#2D2B32',
    },
    currencyText : {
        fontFamily: 'Inter-SemiBold',
        fontSize: 12,
        color: '#2D2B32',
    },
    percentText : {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        color: '#2D2B32',
    },
    textFieldLabel : {
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
    },
    errorText : {
        color: '#B3261E',
        fontSize: 12,
        fontFamily: 'Poppins-Regular',
        marginHorizontal: 16,
        marginTop: 4,
    },
    expiryCvvContainer : {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 16,
        marginTop: 16,
    },
    infoContainer : {
        flexDirection: 'row',
        marginHorizontal: 16,
        marginTop: 16,
        backgroundColor: '#E8F6F1',
        borderRadius: 4,
        padding: 4,
        alignItems: 'center',
    },
    infoIcon : {
        width: 20, height: 20, tintColor: '#2D2B32'
    },
    infoText : {
        fontSize: 12,
        fontFamily: 'Poppins-Regular',
        color: '#2D2B32',
        marginStart: 8,
    },
    checkBoxContainer : {
        flexDirection: 'row',
        marginTop: 10,
        alignItems: 'center',
        paddingLeft: 10,
    },
    checkBoxText : {
        color: '#2D2B32',
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        marginLeft: 8,
    },
    clickableText : {
        fontSize: 12,
        fontFamily: 'Poppins-SemiBold',
        textDecorationLine: 'underline',
    },
    pressableContainer : {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingBottom: 16,
    },
    webViewContainer : {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'white',
    }
})

export default styles