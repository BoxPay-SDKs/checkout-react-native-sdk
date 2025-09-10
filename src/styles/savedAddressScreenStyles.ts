import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    screenView : {
        flex: 1, backgroundColor: 'white' 
    },
    loaderView : {
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center'
    },
    lottieStyle : {
        width: 80, height: 80
    },
    divider : {
        flexDirection: 'row',
        height: 1,
        backgroundColor: '#ECECED',
    },
})

export default styles