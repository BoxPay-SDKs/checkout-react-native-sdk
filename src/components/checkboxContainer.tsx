import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { checkoutDetailsHandler } from '../sharedContext/checkoutDetailsHandler';

interface CheckBoxContainerProps {
    text : string,
    isCheckBoxSelected : boolean,
    onCheckBoxClicked : () => void
}

const CheckBoxContainer = ({text, isCheckBoxSelected, onCheckBoxClicked} : CheckBoxContainerProps) =>{
    const {checkoutDetails} = checkoutDetailsHandler
    return(
        <View
        style={styles.checkBoxContainer}>
          <TouchableOpacity
            onPress={() => onCheckBoxClicked()}
          >
            <View style={[
              styles.checkboxBox,
              { borderColor: checkoutDetails.buttonColor },
              isCheckBoxSelected && { backgroundColor: checkoutDetails.buttonColor }
            ]}>
              {isCheckBoxSelected && (
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
    marginLeft: 16,
  },
  checkmark: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
    lineHeight: 16,
  }
  });


export default CheckBoxContainer