import { StyleSheet } from 'react-native';


const styles = StyleSheet.create({
  titleText: {
    marginStart: 16,
    marginTop: 20,
    fontSize: 14,
    color: '#020815B5'
  },
  pressableContainer : {
    borderColor: '#F1F1F1',
    borderWidth: 1,
    marginHorizontal: 16,
    marginTop: 8,
    paddingBottom: 16,
    backgroundColor: 'white',
    flexDirection: 'row',
  },
  imageStyle : {
    height: 14,
    width: 14,
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
    color: '#4F4D55'
  },
  insideContainerHighlighedText : {
    fontSize: 12,
    color: '#4F4D55',
  },
  insideContainerDesc : {
    fontSize: 14,
    color: '#4F4D55',
    flexShrink: 1,
    marginTop: -4,
  },
  insideContainerClickableText : {
    fontSize: 14,
    flexShrink: 1,
    marginTop: 16,
    marginStart : 8
  }
});

export default styles
