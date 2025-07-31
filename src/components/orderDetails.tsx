import { View, Text, Image, Pressable, ScrollView } from 'react-native'
import { useState } from 'react'
import { SvgUri } from 'react-native-svg';
import { checkoutDetailsHandler } from '../sharedContext/checkoutDetailsHandler'

export interface OrderDetailsProps {
    totalAmount: string,
    itemsArray: ItemsProp[],
    subTotalAmount: string,
    shippingAmount: string,
    taxAmount: string
}

export interface ItemsProp {
    imageUrl: string,
    imageTitle: string,
    imageOty: number,
    imageAmount: string
}

const OrderDetails = ({ totalAmount, itemsArray, subTotalAmount, shippingAmount, taxAmount }: OrderDetailsProps) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const { checkoutDetails } = checkoutDetailsHandler
    const itemHeight = 70; // Approximate height of each row
    const maxVisibleItems = 3;
    const scrollHeight = Math.min(itemsArray.length, maxVisibleItems) * itemHeight;

    const MyImage = ({ uri }: { uri: string }) => {
        const isSvg = uri?.endsWith('.svg');

        return isSvg ? (
            <View style={{
                width: 44,
                height: 44,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <SvgUri
                    uri={uri}
                    width={100} // Keep original size
                    height={100}
                    style={{ transform: [{ scale: 0.4 }] }}
                />
            </View>
        ) : (
            <Image source={{ uri }} style={{ width: 44, height: 44, }} resizeMode="contain" />
        );
    };

    return (
        <View>
            {isExpanded ? (
                <View style={{
                    borderColor: '#F1F1F1',
                    borderWidth: 1,
                    marginHorizontal: 16,
                    marginVertical: 8,
                    paddingVertical: 16,
                    backgroundColor: "white",
                    borderRadius: 12,
                }}>
                    <Pressable onPress={() => setIsExpanded(false)}>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingHorizontal: 12
                        }}>
                            <Text style={{
                                fontSize: 14, color: "#363840",
                                fontFamily: 'Poppins-SemiBold'
                            }}>Price Details</Text>
                            <Image source={require('../assets/images/chervon-down.png')} style={{
                                height: 6,
                                width: 14,
                                marginHorizontal: 6, // Space between price and arrow
                                alignSelf: 'center',
                                transform: [{
                                    rotate: "180deg"
                                }]
                            }} />
                        </View>
                    </Pressable>
                    <View style={{ height: scrollHeight, overflow: 'hidden', marginTop: 12 }}>
                        <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={true} style={{ paddingHorizontal: 12, }}>
                            {itemsArray.map((item, index) => (
                                <View key={index} style={{ flexDirection: 'row', marginBottom: 8, alignItems: 'flex-start' }}>
                                    {/* Image */}
                                    {item.imageUrl !== "" && (
                                        <View style={{ borderColor: '#DCDEE3', borderWidth: 1, borderRadius: 8, width: 54, height: 54, padding: 4 }}>
                                            <MyImage uri={item.imageUrl} />
                                        </View>
                                    )}

                                    {/* Title & Quantity - Stays attached to the image */}
                                    <View style={{ flexGrow: 1, flexShrink: 1, paddingHorizontal: 8 }}>
                                        <Text
                                            style={{ fontFamily: 'Poppins-Regular', fontSize: 12, color: '#2D2B32' }}
                                            numberOfLines={2}
                                            ellipsizeMode={'tail'}
                                        >
                                            {item.imageTitle}
                                        </Text>
                                        <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 12, color: '#2D2B32' }}>
                                            Qty: {item.imageOty}
                                        </Text>
                                    </View>

                                    {/* Amount - Stays at the right */}
                                    <View style={{ alignSelf: 'flex-start' }}>
                                        <Text style={{
                                            fontFamily: 'Poppins-Regular',
                                            fontSize: 12,
                                            color: '#2D2B32',
                                            textAlign: 'right'
                                        }}>
                                            <Text style={{
                                                fontFamily: 'Inter-Regular',
                                                fontSize: 12,
                                                color: '#2D2B32'
                                            }}> {checkoutDetails.currencySymbol}</Text>{item.imageAmount}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </ScrollView>
                    </View>

                    {(subTotalAmount != "" || taxAmount != "" || shippingAmount != "") && (
                        <View style={{
                            borderBottomWidth: 1.5, // Thickness of the line
                            borderBottomColor: '#E6E6E6', // Color of the line
                            borderStyle: 'dashed', // Makes it dashed
                            width: '100%', // Full width
                            marginVertical: 10,
                            marginTop: 4,
                        }} />
                    )}


                    {subTotalAmount != "" && (
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, paddingHorizontal: 12, }}>
                            <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 14, color: "#2D2B32" }}>Subtotal</Text>
                            <Text style={{
                                fontFamily: 'Poppins-SemiBold',
                                fontSize: 14,
                                color: '#2D2B32'
                            }}>
                                <Text style={{
                                    fontFamily: 'Inter-SemiBold',
                                    fontSize: 14,
                                    color: '#2D2B32'
                                }}> {checkoutDetails.currencySymbol}</Text>{subTotalAmount}
                            </Text>
                        </View>
                    )}
                    {taxAmount != "" && (
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, paddingHorizontal: 12, }}>
                            <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 14, color: "#2D2B32" }}>Tax</Text>
                            <Text style={{
                                fontFamily: 'Poppins-SemiBold',
                                fontSize: 14,
                                color: '#2D2B32'
                            }}>
                                <Text style={{
                                    fontFamily: 'Inter-SemiBold',
                                    fontSize: 14,
                                    color: '#2D2B32'
                                }}> {checkoutDetails.currencySymbol}</Text>{taxAmount}
                            </Text>
                        </View>
                    )}
                    {shippingAmount != "" && (
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, paddingHorizontal: 12, }}>
                            <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 14, color: "#2D2B32" }}>Shipping Amount</Text>
                            <Text style={{
                                fontFamily: 'Poppins-SemiBold',
                                fontSize: 14,
                                color: '#2D2B32'
                            }}>
                                <Text style={{
                                    fontFamily: 'Inter-SemiBold',
                                    fontSize: 14,
                                    color: '#2D2B32'
                                }}> {checkoutDetails.currencySymbol}</Text>{shippingAmount}
                            </Text>
                        </View>
                    )}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F1F1F1', paddingHorizontal: 8, paddingVertical: 12, borderRadius: 8, marginHorizontal: 12, }}>
                        <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 16, color: "#1D1C20" }}>Total</Text>
                        <Text style={{
                            fontFamily: 'Poppins-SemiBold',
                            fontSize: 16,
                            color: '#1D1C20'
                        }}>
                            <Text style={{
                                fontFamily: 'Inter-SemiBold',
                                fontSize: 16,
                                color: '#1D1C20'
                            }}> {checkoutDetails.currencySymbol}</Text>{totalAmount}
                        </Text>
                    </View>
                </View>
            ) : (
                <Pressable onPress={() => setIsExpanded(true)}>
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

                            <Image source={require('../assets/images/chervon-down.png')} style={{
                                height: 6,
                                width: 14,
                                marginHorizontal: 6, // Space between price and arrow
                                alignSelf: 'center'
                            }} />
                        </View>
                    </View>
                </Pressable>
            )}
        </View>
    )
}

export default OrderDetails