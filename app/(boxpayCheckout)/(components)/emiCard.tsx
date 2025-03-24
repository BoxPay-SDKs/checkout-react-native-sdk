import { View, Text } from 'react-native'
import React from 'react'

interface EmiCardProps {
    duration: string,
    emiAmount: string,
    interestAmount: string,
    discountAmount: string,
    totalAmount: string,
    processingFee: string,
    isNoCostApplied: boolean,
    isLowCostApplied: boolean
}

const EmiCard = () => {
    return (
        <View>
            <Text>EmiCard</Text>
        </View>
    )
}

export default EmiCard