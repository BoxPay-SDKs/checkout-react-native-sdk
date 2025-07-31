import { View, Text, Pressable, StyleSheet, Image } from 'react-native'
import type { ImageSourcePropType } from 'react-native'
import { useState } from 'react'
import { RadioButton } from 'react-native-paper';
import { checkoutDetailsHandler } from '../sharedContext/checkoutDetailsHandler';
import { SvgUri } from 'react-native-svg';
import ShimmerPlaceHolder from "react-native-shimmer-placeholder";
import type {PaymentClass} from '../interface';

interface PaymentSelectorViewProps {
    providerList : PaymentClass[], 
    onProceedForward: (instrumentType: string, instrumentValue : string, type:string) => void;
    isLastUsed?: boolean | null,
    errorImage: ImageSourcePropType,
    onClickRadio : (selctedInstrumentValue : string) => void
}

const PaymentSelectorView = ({
    providerList,
    onProceedForward,
    isLastUsed,
    errorImage,
    onClickRadio
}: PaymentSelectorViewProps) => {
    const { checkoutDetails } = checkoutDetailsHandler;

    return (
        <View>
            {providerList.map((provider, index) => (
                <View key={provider.id}>
                    <PaymentSelector
                        id={provider.id}
                        title={provider.displayValue}
                        image={provider.iconUrl}
                        errorImage={errorImage}
                        isSelected={provider.isSelected}
                        instrumentTypeValue={provider.instrumentTypeValue}
                        isLastUsed={isLastUsed && provider.isLastUsed}
                        onPress={onClickRadio}
                        onProceedForward={(displayValue, instrumentValue) => {
                            onProceedForward(displayValue, instrumentValue, provider.type)
                        }}
                        brandColor={checkoutDetails.brandColor || '#1CA672'}
                        currencySymbol={checkoutDetails.currencySymbol || '₹'}
                        amount={checkoutDetails.amount}
                    />
                    {index !== providerList.length - 1 && (
                        <View style={{ flexDirection: 'row', height: 1, backgroundColor: '#ECECED' }} />
                    )}
                </View>
            ))}
        </View>
    );
};


interface PaymentSelectorProps{
    id: string,
    title: string,
    image: string,
    errorImage: ImageSourcePropType,
    isSelected: boolean | null,
    instrumentTypeValue: string,
    isLastUsed?: boolean | null,
    onPress: (id: string) => void,
    onProceedForward: (instrumentType: string, instrumentValue : string) => void,
    brandColor : string,
    currencySymbol : string,
    amount : string
}

const PaymentSelector = ({id, title, image, errorImage , isSelected, instrumentTypeValue, isLastUsed, onPress, onProceedForward, brandColor, currencySymbol, amount} : PaymentSelectorProps) => {
    const [error, setImageError] = useState(false)
    const [load, setLoad] = useState(true)
    return (
        <View style={{ paddingVertical: 16, paddingHorizontal: 12, backgroundColor: isSelected ? "#EDF8F4" : "white", borderRadius: isSelected ? 0 : 12 }}>
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
                            width="100%" // Keep original size
                            height="100%"
                            style={{ transform: [{ scale: 1 }] }}
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

                <View style={{ paddingStart: 12, flex: 1 }}>
                    <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 14, color: "#4F4D55" }} onPress={() => onPress(id)} numberOfLines={1} ellipsizeMode='tail'>{title}</Text>
                    {isLastUsed && (
                        <View style={styles.tag}>
                            <Text style={styles.tagText}>Last Used</Text>
                        </View>
                    )}
                </View>
                <RadioButton
                    value={id}
                    status={isSelected ? 'checked' : 'unchecked'}
                    onPress={() => onPress(id)}
                    color={brandColor}
                    uncheckedColor={"#01010273"}
                />
            </View>
            {isSelected && (
                <Pressable style={[styles.buttonContainer, { backgroundColor: brandColor }]} onPress={() => {
                    onProceedForward(title, instrumentTypeValue)
                }}>
                    <Text style={styles.buttonText}>Proceed to Pay <Text style={{
                        fontFamily: 'Inter-SemiBold',
                        fontSize: 16,
                        color: 'white'
                    }}> {currencySymbol}</Text>{amount}</Text>
                </Pressable>
            )}
        </View>
    )
}

export default PaymentSelectorView

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
    },
    tag: {
        borderColor: '#1CA672',
        borderRadius: 6,
        backgroundColor: '#1CA67214',
        borderWidth: 0.5,
        paddingHorizontal: 4,
        marginTop: 4,
        alignSelf: 'flex-start'
    },
    tagText: {
        fontSize: 10,
        fontFamily: 'Poppins-Medium',
        color: '#1CA672',
    }
})
