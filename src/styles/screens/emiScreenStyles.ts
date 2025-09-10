import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    screenView : {
        flex: 1, backgroundColor: 'white' 
    },
    loadingContainer : { flex: 1, alignItems: 'center', justifyContent: 'center' },
    lottieStyle : { width: 80, height: 80 },
    availableScreenView : { flex: 1, backgroundColor: '#F5F6FB' },
    container : {
        backgroundColor: 'white',
        marginTop: 4,
        paddingBottom: 16,
    },
    insideContainer : {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    cardsContainer : { paddingHorizontal: 16, paddingTop: 12 },
    cardsText : {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14,
    },
    highlightedDivider : {
        height: 2,
        width: '120%',
        minWidth: 40,
        alignSelf: 'center',
        borderRadius: 1,
    },
    divider : {
        height: 1,
        backgroundColor: '#DCDCDE',
    },
    searchTextLable : {
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
    },
    textInputStyle : {
        marginTop: 16,
        marginHorizontal: 16,
        backgroundColor: 'white',
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        color: '#0A090B',   
    },
    filterContainer : {
        flexDirection: 'row',
        marginHorizontal: 16,
        marginTop: 20,
    },
    filterBox : {
        borderWidth: 1,
        flexDirection: 'row',
        paddingTop: 6,
        paddingBottom: 4,
        paddingHorizontal: 12,
        alignItems: 'baseline',
        borderRadius: 20,
    },
    filterText : {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 12,
        color: '#2D2B32',
    },
    filterImage : {
        height: 10,
        width: 10,
        marginStart: 4,   
    },
    headingText : {
        marginTop: 16,
        marginBottom: 8,
        marginHorizontal: 16,
        color: '#020815B5',
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14,
    },
    listContainer : {
        backgroundColor: 'white',
        borderColor: '#F1F1F1',
        borderWidth: 1,
        borderRadius: 12,
        marginHorizontal: 16,
        marginBottom: 30,
    },
    emptyListContainer : {
        marginHorizontal: 16,
        backgroundColor: 'white',
        marginBottom: 32,
        height: 300,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyListImage : { width: 100, height: 100 },
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