import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    screenView : { flex: 1, backgroundColor: '#F5F6FB' },
    loadingContainer : { flex: 1, alignItems: 'center', justifyContent: 'center' },
    lottieStyle : { width: 80, height: 80 },
    container : {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    headingText : {
        marginStart: 14,
        marginTop: 20,
        fontSize: 14,
        color: '#020815B5',
        fontFamily: 'Poppins-SemiBold',
    },
    paymentContainer : {
        borderColor: '#F1F1F1',
        borderWidth: 1,
        marginHorizontal: 16,
        marginVertical: 8,
        backgroundColor: 'white',
        flexDirection: 'column',
        borderRadius: 12,
    },
    footerContainer : {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
        backgroundColor: '#F5F6FB',
        flexDirection: 'row',
    },
    footerText : {
        fontSize: 12,
        color: '#888888',
        marginBottom: 15,
        fontFamily: 'Poppins-Medium',
    },
    footerImage : { height: 50, width: 50 },
    webViewScreenStyle : {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'white',
    }
})

export default styles