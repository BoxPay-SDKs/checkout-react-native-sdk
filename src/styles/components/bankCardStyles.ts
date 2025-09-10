import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    imageContainer : {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    shimmer : {
        width: 32, height: 32, borderRadius: 8
    },
    errorImage : {
        transform: [{ scale: 0.4 }]
    },
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
    },
    detailsContainer: {
      flex: 1,
      marginStart: 8,
    },
    bankName: {
      fontSize: 14,
      fontFamily: 'Poppins-SemiBold',
      color: '#4F4D55',
    },
    tagsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    tag: {
      borderColor: '#FFADD2',
      borderRadius: 6,
      backgroundColor: '#FFF0F6',
      borderWidth: 1,
      paddingHorizontal: 4,
      marginRight: 6,
    },
    tagText: {
      fontSize: 10,
      fontFamily: 'Poppins-Medium',
      color: '#EB2F96',
    },
    chervonImage : {
        alignSelf: 'center',
        height: 6,
        width: 14,
        marginLeft: 'auto',
        transform: [
        {
            rotate: '270deg',
        },
        ],
    }
  });

  export default styles