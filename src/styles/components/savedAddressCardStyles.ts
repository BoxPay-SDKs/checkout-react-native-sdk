import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    card: {
      backgroundColor: "#fff",
      borderRadius: 12,
      padding: 14,
      marginVertical: 8,
      marginHorizontal: 4,
      borderWidth: 1,
      borderColor: "#E0E0E0",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    cardSelected: {
      borderColor: "#FF2E92",
      shadowOpacity: 0.2,
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    labelContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    labelName: {
      fontSize: 14,
      fontFamily: 'Poppins-SemiBold',
      color: "#2D2B32"
    },
    selectedTag: {
      backgroundColor: "#FFF0F6",
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 6,
      marginLeft: 8,
      borderColor:"#FFADD2",
      borderWidth:1
    },
    selectedTagText: {
      fontSize: 10,
      fontFamily: 'Poppins-Medium',
      color: "#EB2F96",
    },
    addressText: {
      fontSize: 12,
      fontFamily: 'Poppins-Regular',
      color: "#7F7D83",
    },
    imageStyle : {
      width : 20,
      height : 20
    }
});

export default styles