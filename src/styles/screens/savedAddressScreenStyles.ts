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
    mainHeadingText  :{
        marginTop: 16,
        marginHorizontal: 16,
        color: '#020815B5',
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14,
    },
    pressableContainer : {
        borderColor: '#F1F1F1',
        borderWidth: 1,
        marginHorizontal: 16,
        marginTop: 8,
        paddingTop:12,
        paddingBottom: 16,
        backgroundColor: 'white',
        flexDirection: 'row',
        borderRadius: 12,
        alignItems:'center'
      },
      imageStyle : {
        height: 20,
        width: 20,
        marginStart: 12
      },
      insideContainerClickableText : {
        fontSize: 14,
        fontFamily: 'Poppins-SemiBold',
        paddingLeft:12
      }
})

export default styles