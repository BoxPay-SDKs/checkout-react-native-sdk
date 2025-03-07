import { View, Text, Image, Pressable, StyleSheet } from 'react-native'
import React from 'react'
import { RadioButton } from 'react-native-paper';
import { checkoutDetailsHandler } from '../(sharedContext)/checkoutDetailsHandler';
import { SvgUri } from 'react-native-svg';
import FastImage from 'react-native-fast-image';

interface PaymentSelectorProps {
    id: string;
    title: string;
    image: string;
    isSelected: boolean;
    instrumentTypeValue: string;
    onPress: (id: string) => void;
    onProceedForward: (instrumentType: string) => void;
}

const PaymentSelector = ({ id, title, image, isSelected, instrumentTypeValue, onPress, onProceedForward }: PaymentSelectorProps) => {
    const { checkoutDetails } = checkoutDetailsHandler
    return (
        <View style={{ paddingVertical: 16, paddingHorizontal: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{
                    width: 32,
                    height: 32,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <View style={{ transform: [{ scale: 0.4 }] }}>
                        <SvgUri
                            uri={image}
                            width={100} // Keep original size
                            height={100}
                        />
                    </View>
                </View>

                <Text style={{ paddingStart: 8, fontFamily: 'Poppins-SemiBold', fontSize: 14, color: "#4F4D55", flex: 1 }}>{title}</Text>
                <RadioButton
                    value={id}
                    status={isSelected ? 'checked' : 'unchecked'}
                    onPress={() => onPress(id)}
                    color={checkoutDetails.brandColor}
                />
            </View>
            {isSelected && (
                <Pressable style={[styles.buttonContainer, { backgroundColor: checkoutDetails.brandColor }]} onPress={() => {
                    onProceedForward(instrumentTypeValue)
                }}>
                    <Text style={styles.buttonText}>Make Payment</Text>
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
