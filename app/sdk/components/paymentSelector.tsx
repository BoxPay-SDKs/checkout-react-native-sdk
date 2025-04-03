import { View, Text, Pressable, StyleSheet, Image } from 'react-native'
import React, { useState } from 'react'
import { RadioButton } from 'react-native-paper';
import { checkoutDetailsHandler } from '../sharedContext/checkoutDetailsHandler';
import { SvgUri } from 'react-native-svg';
import ShimmerPlaceHolder from "react-native-shimmer-placeholder";

interface PaymentSelectorProps {
    id: string;
    title: string;
    image: string;
    errorImage: any;
    isSelected: boolean;
    instrumentTypeValue: string;
    onPress: (id: string) => void;
    onProceedForward: (instrumentType: string) => void;
}

const PaymentSelector = ({ id, title, image, isSelected, instrumentTypeValue, onPress, onProceedForward, errorImage }: PaymentSelectorProps) => {
    const { checkoutDetails } = checkoutDetailsHandler
    const [error, setImageError] = useState(false)
    const [load, setLoad] = useState(true)
    return (
        <View style={{ paddingVertical: 16, paddingHorizontal: 12, backgroundColor: isSelected ? "#EDF8F4" : "white" }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{
                    width: 32,
                    height: 32,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    {load && !error && (
                        <ShimmerPlaceHolder
                            visible={false} // Keep shimmer until loading is done
                            style={{ width: 32, height: 32, borderRadius: 8 }}
                        />
                    )}
                    {!error ? (
                        <SvgUri
                            uri={image}
                            width={100} // Keep original size
                            height={100}
                            style={{ transform: [{ scale: 0.4 }] }}
                            onLoad={() => setLoad(false)}
                            onError={() => {
                                setImageError(true);
                                setLoad(false);
                            }}
                        />
                    ) : (
                        <Image source={errorImage} style={{ transform: [{ scale: 0.4 }] }} />
                    )}
                </View>

                <Text style={{ paddingStart: 8, fontFamily: 'Poppins-SemiBold', fontSize: 14, color: "#4F4D55", flex: 1 }} onPress={() => onPress(id)} numberOfLines={1} ellipsizeMode='tail'>{title}</Text>
                <RadioButton
                    value={id}
                    status={isSelected ? 'checked' : 'unchecked'}
                    onPress={() => onPress(id)}
                    color={checkoutDetails.brandColor}
                    uncheckedColor={"#01010273"}
                />
            </View>
            {isSelected && (
                <Pressable style={[styles.buttonContainer, { backgroundColor: checkoutDetails.brandColor }]} onPress={() => {
                    onProceedForward(instrumentTypeValue)
                }}>
                    <Text style={styles.buttonText}>Proceed to Pay <Text style={{
                        fontFamily: 'Inter-SemiBold',
                        fontSize: 16,
                        color: 'white'
                    }}> {checkoutDetails.currencySymbol}</Text>{checkoutDetails.amount}</Text>
                </Pressable>
            )}
        </View>
    )
}

export default PaymentSelector

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        borderRadius: 8,
        justifyContent: 'center',
        marginTop: 10,
        paddingVertical: 12
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold'
    }
})
