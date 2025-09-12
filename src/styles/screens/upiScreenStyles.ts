import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    headingContainer : {
        flex: 1, flexDirection: 'row', alignItems: 'center' 
    },
    headingText: {
        marginStart: 14,
        marginTop: 20,
        fontSize: 14,
        color: '#020815B5',
        fontFamily: 'Poppins-SemiBold',
    },
    divider : {
        flexDirection: 'row',
        height: 1,
        backgroundColor: '#ECECED'
    },
    pressableCollectContainer : {
        flexDirection: 'row',
        alignItems: 'center', // Ensures vertical alignment of items
        paddingTop: 16,
        paddingStart: 16,
        marginEnd: 16,
        justifyContent: 'space-between',
    },
    upiIntentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 24,
    },
    textInput: {
        marginHorizontal: 16,
        borderRadius: 8,
        backgroundColor: 'white',
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: '#0A090B',
    },
    labeltextInput: {
        fontSize: 20,
    },
    intentIcon: {
        height: 28,
        width: 30,
    },
    intentIconBorder: {
        height: 56,
        width: 56,
        borderWidth: 1,
        borderColor: '#DCDEE3',
        borderRadius: 7,
        justifyContent: 'center',
        alignItems: 'center',
    },
    intentContainer: {
        alignItems: 'center',
        marginEnd: 22,
    },
    intentTitle: {
        color: '#363840',
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        marginTop: 4,
    },
    intentBackground: {
        borderColor: '#F1F1F1',
        borderWidth: 1,
        marginHorizontal: 16,
        marginVertical: 8,
        backgroundColor: 'white',
        flexDirection: 'column',
        borderRadius: 12,
    },
    buttonContainer: {
        flexDirection: 'row',
        borderRadius: 8,
        justifyContent: 'center',
        marginTop: 20,
        marginHorizontal: 16,
        paddingVertical: 14,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
    },
    currencySymbol: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Inter-SemiBold',
    },
    errorText : {
        fontSize: 12,
        color: '#E12121',
        marginStart: 16,
        marginHorizontal: 16,
        fontFamily: 'Poppins-Regular',
    },
    errorIcon : {
        width: 24, height: 24
    },
    labelText : {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
    },
    container: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingTop: 12,
    },
    qrContainer: {
        position: "relative",
        width: 300,
        height: 300,
        marginRight: 12,
    },
    qrImage: {
        width: 300,
        height: 300,
        resizeMode: "cover",
        borderRadius: 8,
    },
    retryButton: {
        position: "absolute",
        top: "40%",
        left: "30%",
        backgroundColor: "#fff",
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    retryText: {
        fontSize: 20,
        fontWeight: "600",
    },
    textContainer: {
        flexDirection: "column",
        justifyContent: "center",
        marginLeft: 16,
    },
    label: {
        fontSize: 12,
        fontWeight: "500",
        color: "#2D2B32",
    },
    timer: {
        fontSize: 20,
        fontWeight: "600",
    },
    imageStyle : {
        height: 14,
        width: 14,
    },
    subHeaderText : {
        fontSize: 14,
        paddingStart: 10,
        fontFamily: 'Poppins-SemiBold',
    },
    animatedIcon : {
        alignSelf: 'center',
        height: 6,
        width: 14,
    },
    subContainerDivider : {
        flexDirection: 'row',
        height: 1,
        backgroundColor: '#F1F1F1',
        marginTop: 20,
    }
})

export default styles