import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    screenView : {
        flex: 1, backgroundColor: 'white' 
    },
    loadingContainer : { flex: 1, alignItems: 'center', justifyContent: 'center' },
    lottieStyle : { width: 80, height: 80 },
    availableScreenView : { flex: 1, backgroundColor: '#F5F6FB' },
    divider : {
        flexDirection: 'row',
        height: 1,
        backgroundColor: '#ECECED',
    },
    searchTextInputLabel : {
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
    },
    searchTextInput : {
        marginTop: 16,
        marginHorizontal: 16,
        backgroundColor: 'white',
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        color: '#0A090B',
        height: 60,
    },
    headingText : {
        marginTop: 16,
        marginBottom: 8,
        marginHorizontal: 16,
        color: '#020815B5',
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14,
    },
    container : {
        marginHorizontal: 16,
        backgroundColor: 'white',
        borderColor: '#F1F1F1',
        borderWidth: 1,
        borderRadius: 12,
    },
    emptyListContainer : {
        marginHorizontal: 16,
        backgroundColor: 'white',
        borderColor: '#F1F1F1',
        borderWidth: 1,
        borderRadius: 12,
        marginBottom: 32,
        height: 300,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyIcon : { width: 100, height: 100 },
    emptyListHeadingText : {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 16,
        color: '#212426',
        marginTop: 16,
    },
    emptyListDescText : {
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        color: '#4F4D55',
        marginTop: -4,
    },
    footerContainer : {
        justifyContent: 'center',
        alignItems: 'flex-end',
        backgroundColor: '#F5F6FB',
        flexDirection: 'row',
    },
    footerTextStyle : {
        fontSize: 12,
        color: '#888888',
        marginBottom: 15,
        fontFamily: 'Poppins-Medium',
    },
    footerIcon : { height: 50, width: 50 },
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