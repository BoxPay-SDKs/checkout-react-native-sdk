import { View, Text, Image } from 'react-native'
import type { ImageSourcePropType } from 'react-native'

interface MorePaymentContainerProps {
    title: string
    image: ImageSourcePropType
}

const MorePaymentContainer = ({ title, image }: MorePaymentContainerProps) => {
    return (
        <View style={{ flex: 1, flexDirection: 'row', backgroundColor: 'white', alignItems: 'center' }}>
            <Image source={image} style={{ width: 32, height: 32 }} />
            <Text style={{ fontSize: 14, fontFamily: 'Poppins-Medium', marginLeft: 12 }}>{title}</Text>
            <Image source={require('../assets/images/chervon-down.png')} style={{
                alignSelf: 'center', height: 6, width: 14, marginLeft: 'auto', transform: [{
                    rotate: "270deg"
                }]
            }} />
        </View>
    )
}

export default MorePaymentContainer