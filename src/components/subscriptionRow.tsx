import { View, Text } from "react-native"
import type { CheckoutDetails } from "../interface"

interface SubscriptionArgs{
    checkoutDetails : CheckoutDetails, 
    heading: string, 
    value : string
}

const SubscriptionRow = ({checkoutDetails, heading, value} : SubscriptionArgs) => {
    return (
        <View style={{ flexDirection : 'row', justifyContent : 'space-between', marginHorizontal : 16, paddingTop : 4}}>
            <Text style={{fontFamily :checkoutDetails.fontFamily.regular, color : '#2D2B32'}}>{heading}</Text>
            <Text style={{fontFamily :checkoutDetails.fontFamily.semiBold, color : '#2D2B32'}}>{value}</Text>
        </View>
    )
}

export default SubscriptionRow