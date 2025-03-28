import { View, Text, Image, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { checkoutDetailsHandler } from '../sharedContext/checkoutDetailsHandler'

interface OrderDetailsProps {
    totalAmount: string,
    itemsArray: ItemsProp[],
    subTotalAmount: string,
    shippingAmount: string,
    taxAmount: string
}

interface ItemsProp {
    imageUrl: string,
    imageTitle: string,
    imageOty: number,
    imageAmount: string
}

const OrderDetails = ({ totalAmount, itemsArray, subTotalAmount, shippingAmount, taxAmount }: OrderDetailsProps) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const { checkoutDetails } = checkoutDetailsHandler
    useEffect(() => {
        console.log(totalAmount);
        console.log(itemsArray);
        console.log(subTotalAmount);
        console.log(shippingAmount);
        console.log(taxAmount);
    }, [])
    return (
        <View>
            {isExpanded ? (
                <View style={{
                    borderColor: '#F1F1F1',
                    borderWidth: 1,
                    marginHorizontal: 16,
                    marginVertical: 8,
                    paddingVertical: 16,
                    paddingHorizontal: 12,
                    backgroundColor: "white",
                    flexDirection: 'row',
                    borderRadius: 12,
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Text style={{
                        fontSize: 14, color: "#363840",
                        fontFamily: 'Poppins-SemiBold'
                    }}>Price Details</Text>
                    <Pressable onPress={() => setIsExpanded(false)}>
                        <Image source={require('../../../assets/images/chervon-down.png')} style={{
                            height: 6,
                            width: 14,
                            marginHorizontal: 6, // Space between price and arrow
                            alignSelf: 'center',
                            transform: [{
                                rotate: "180deg"
                            }]
                        }} />
                    </Pressable>

                </View>
            ) : (
                <View style={{
                    borderColor: '#F1F1F1',
                    borderWidth: 1,
                    marginHorizontal: 16,
                    marginVertical: 8,
                    paddingVertical: 16,
                    paddingHorizontal: 12,
                    backgroundColor: "white",
                    flexDirection: 'row',
                    borderRadius: 12,
                    justifyContent: 'space-between',
                    alignItems: 'center' // Ensures vertical alignment
                }}>
                    {/* Price Details Text */}
                    <Text style={{
                        fontSize: 14,
                        color: "#363840",
                        fontFamily: 'Poppins-SemiBold'
                    }}>Price Details</Text>

                    {/* Wrap Price and Arrow in a Row */}
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{
                            fontSize: 14,
                            color: "#363840",
                            fontFamily: 'Poppins-SemiBold'
                        }}>
                            <Text style={{
                                fontSize: 14,
                                color: "#363840",
                                fontFamily: 'Inter-SemiBold'
                            }}>
                                {checkoutDetails.currencySymbol}
                            </Text>
                            {totalAmount}
                        </Text>

                        {/* Arrow Icon */}
                        <Pressable onPress={() => setIsExpanded(true)}>
                            <Image source={require('../../../assets/images/chervon-down.png')} style={{
                                height: 6,
                                width: 14,
                                marginHorizontal: 6, // Space between price and arrow
                                alignSelf: 'center'
                            }} />
                        </Pressable>
                    </View>
                </View>

            )}
        </View>
    )
}

export default OrderDetails