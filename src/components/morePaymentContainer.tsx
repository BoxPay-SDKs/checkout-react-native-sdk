import { View, Text, Image } from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import { checkoutDetailsHandler } from '../sharedContext/checkoutDetailsHandler';

interface MorePaymentContainerProps {
  title: string;
  image: ImageSourcePropType;
  surchargeFee : string,
  currencySymbol : string
}

const MorePaymentContainer = ({ title, image, surchargeFee, currencySymbol }: MorePaymentContainerProps) => {
  const {checkoutDetails} = checkoutDetailsHandler
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'white',
        alignItems: 'center',
      }}
    >
      <Image 
        source={image} 
        style={[
          { width: 32, height: 32 }, 
          title === 'EMI' && { transform: [{ scaleX: -1 }] }
          ]} 
      />
      <View
      style={{
        flexDirection: 'column',
        marginLeft: 12 
      }}>
      <Text
        style={{ fontSize: 14, fontFamily: checkoutDetails.fontFamily.medium}}
      >
        {title}
      </Text>
      {surchargeFee != "" && (
        <Text
        style={{ fontSize: 14, fontFamily: checkoutDetails.fontFamily.medium, color : '#32CD32' }}
      >
        {currencySymbol}{surchargeFee} extra applied as surcharge
      </Text>
      )}
      </View>
      <Image
        source={require('../../assets/images/chervon-down.png')}
        style={{
          alignSelf: 'center',
          height: 6,
          width: 14,
          marginLeft: 'auto',
          transform: [
            {
              rotate: '270deg',
            },
          ],
        }}
      />
    </View>
  );
};

export default MorePaymentContainer;
