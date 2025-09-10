import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    screenView : { flex: 1, backgroundColor: '#F5F6FB' },
    outerContainer : {
        backgroundColor: 'white',
        borderColor: '#E6E6E6',
        borderWidth: 1,
        marginTop: 8,
        marginHorizontal: 16,
        borderRadius: 12,
    },
    shimmer : { width: 32, height: 32, borderRadius: 8 },
    container :  {
        flexDirection: 'row',
        paddingHorizontal: 12,
        paddingVertical: 16,
        alignItems: 'center',
    },
    insideContainer : {
        width: 28,
        height: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text : {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14,
        paddingStart: 8,
    },
    insideContainerDivider : {
        flexDirection: 'row',
        height: 1,
        backgroundColor: '#ECECED',
    }
})

export default styles