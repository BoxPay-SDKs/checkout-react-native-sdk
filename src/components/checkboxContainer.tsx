import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { checkoutDetailsHandler } from '../sharedContext/checkoutDetailsHandler';

interface CheckBoxContainerProps {
    text : string,
    isCheckBoxSelected : boolean,
    onCheckBoxClicked : () => void
}

const CheckBoxContainer = ({text, isCheckBoxSelected, onCheckBoxClicked} : CheckBoxContainerProps) =>{
    const {checkoutDetails} = checkoutDetailsHandler
    const {isSICheckboxEnabled} = checkoutDetails
    return(
        <View
        style={styles.checkBoxContainer}>
          <TouchableOpacity
            onPress={() => onCheckBoxClicked()}
            disabled={!isSICheckboxEnabled}
          >
            <View style={[
              styles.checkboxBox,
              { borderColor: checkoutDetails.buttonColor },
              !isSICheckboxEnabled && styles.disabledBox,
              isCheckBoxSelected && { backgroundColor: checkoutDetails.buttonColor }
            ]}>
              {isCheckBoxSelected && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </View>
          </TouchableOpacity>
          <Text
            style={[styles.checkBoxText, {fontFamily: checkoutDetails.fontFamily.regular},!isSICheckboxEnabled && styles.disabledText]}
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
      alignItems: 'center',
      marginHorizontal: 16
  },
  checkBoxText : {
      color: '#2D2B32',
      fontSize: 14,
      marginLeft: 6
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center'
  },
  checkmark: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
    lineHeight: 16,
  },
  disabledBox: {
    opacity: 0.4
  },
  disabledText: {
    opacity: 0.4
  }
  });


export default CheckBoxContainer