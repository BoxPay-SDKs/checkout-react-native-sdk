import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    screenView : {
        flex: 1, backgroundColor: '#F5F6FB'
    },
    cancelPaymentContainer: {
        alignItems: 'center',
        paddingBottom: 10,
        paddingHorizontal: 16,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    mainContainer : {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginTop: 32,
    },
    headingText : {
        color: '#2D2B32',
        fontSize: 18,
        textAlign: 'center',
        fontFamily: 'Poppins-SemiBold',
    },
    descText : {
        color: '#2D2B32',
        fontSize: 14,
        paddingTop: 12,
        textAlign: 'center',
        lineHeight: 24,
        fontFamily: 'Poppins-Regular',
    },
    container : {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#BABABA',
        borderWidth: 2,
        borderRadius: 8,
        paddingVertical: 6,
        paddingHorizontal: 8,
        marginTop: 12,
    },
    imageStyle : {
        height: 16, width: 16, marginRight: 4
    },
    text : {
        color: '#1D1C20',
        fontSize: 12,
        fontFamily: 'Poppins-Regular',
    },
    expireInTextStyle : {
        color: '#1D1C20',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 32,
        fontFamily: 'Poppins-Medium',
    },
    progressBarContainer : {
        marginTop: 14, alignItems: 'center' 
    },
    infoContainer : {
        flexDirection: 'row',
        borderColor: '#ECECED',
        borderWidth: 2,
        borderRadius: 8,
        paddingVertical: 16,
        paddingHorizontal: 16,
        marginTop: 32,
    },
    infoImageStyle : {
        height: 26, width: 26
    },
    infoText : {
        color: '#1D1C20',
        fontSize: 12,
        paddingStart: 16,
        lineHeight: 18,
        fontFamily: 'Poppins-Regular',
    },
    thickDivider : {
        flexDirection: 'row',
        height: 2,
        backgroundColor: '#ECECED',
        marginBottom: 48, 
    },
    cancelTextStyle : {
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
    }
})

export default styles