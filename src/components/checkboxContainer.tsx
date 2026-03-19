import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { checkoutDetailsHandler } from '../sharedContext/checkoutDetailsHandler';

interface CheckBoxContainerProps {
    text : string,
    isSelected : boolean,
    setIsSelected : () => void
}

const CheckBoxContainer = ({text, isSelected, setIsSelected} : CheckBoxContainerProps) =>{
    const {checkoutDetails} = checkoutDetailsHandler
    return(
        <View
        style={styles.checkBoxContainer}>
          <TouchableOpacity
            onPress={() => setIsSelected()}
          >
            <View style={[
              styles.checkboxBox,
              { borderColor: checkoutDetails.buttonColor },
              isSelected && { backgroundColor: checkoutDetails.buttonColor }
            ]}>
              {isSelected && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </View>
          </TouchableOpacity>
          <Text
            style={[styles.checkBoxText, {fontFamily: checkoutDetails.fontFamily.regular,}]}
          >
            {text}
          </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    checkBoxContainer : {
      flexDirection: 'row',
      marginTop: 10,
      alignItems: 'center'
  },
  checkBoxText : {
      color: '#2D2B32',
      fontSize: 14,
      marginLeft: 6,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  checkmark: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
    lineHeight: 16,
  }
  });


export default CheckBoxContainer