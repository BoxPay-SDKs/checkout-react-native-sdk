import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    screenView : {
        flex: 1, 
        backgroundColor: 'white'
    },
    loaderView : {
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center'
    },
    lottieStyle : {
        width: 80, height: 80
    },
    listContainer : {
        marginHorizontal: 16,
        backgroundColor: 'white',
        borderColor: '#F1F1F1',
        borderWidth: 1,
        borderRadius: 12,
        marginVertical: 16,
    },
    divider : {
        flexDirection: 'row',
        height: 1,
        backgroundColor: '#ECECED',
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
    imageStyle : {
        width: 100, 
        height: 100   
    },
    headingText : {
        fontSize: 16,
        color: '#212426',
        marginTop: 16,
    },
    subHeadingText : {
        fontSize: 14,
        color: '#4F4D55',
        marginTop: -4,
    },
    bottomText : {
        fontSize: 12,
        color: '#888888'
    },
    bottomContainer : {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F6FB',
        flexDirection: 'row',
    },
    bottomImage : {
        height: 50, width: 50
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