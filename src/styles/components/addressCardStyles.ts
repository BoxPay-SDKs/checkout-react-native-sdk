import { StyleSheet } from 'react-native';
import { checkoutDetailsHandler } from '../../sharedContext/checkoutDetailsHandler';

const {brandColor} = checkoutDetailsHandler.checkoutDetails
const styles = StyleSheet.create({
  titleText: {
    marginStart: 16,
    marginTop: 20,
    fontSize: 14,
    color: '#020815B5',
    fontFamily: 'Poppins-SemiBold'
  },
  pressableContainer : {
    borderColor: '#F1F1F1',
    borderWidth: 1,
    marginHorizontal: 16,
    marginTop: 8,
    paddingBottom: 16,
    backgroundColor: 'white',
    flexDirection: 'row',
    borderRadius: 12,
  },
  imageStyle : {
    height: 20,
    width: 20,
    marginStart: 12,
    marginTop: 20,
  },
  insideContainer : {
    flexDirection: 'column',
    marginStart: 8,
    marginTop: 12,
    marginEnd: 8,
    flex: 1,
  },
  insideContainerNormalText : {
    fontSize: 12,
    color: '#4F4D55',
    fontFamily: 'Poppins-Regular',
  },
  insideContainerHighlighedText : {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    color: '#4F4D55',
  },
  insideContainerDesc : {
    fontSize: 14,
    color: '#4F4D55',
    fontFamily: 'Poppins-SemiBold',
    flexShrink: 1,
    marginTop: -4,
  },
  insideContainerClickableText : {
    fontSize: 14,
    color: brandColor,
    fontFamily: 'Poppins-SemiBold',
    flexShrink: 1,
    marginTop: -4,
  }
});

export default styles
