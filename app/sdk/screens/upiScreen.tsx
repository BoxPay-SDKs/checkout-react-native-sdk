import { View, Text, StyleSheet, Pressable, Image, Animated, ImageBackground } from 'react-native'
import React, { useState } from 'react'
import { TextInput } from 'react-native-paper';
import { checkoutDetailsHandler } from '../sharedContext/checkoutDetailsHandler';
import PaymentClass from '@/interface/paymentClass';
import PaymentSelector from '../components/paymentSelector';

interface UpiScreenProps {
    isUpiIntentVisible: boolean,
    isGpayVisible: boolean,
    isPaytmVisible: boolean,
    isPhonePeVisible: boolean,
    isUpiCollectVisible: boolean,
    selectedIntent: string | null,
    setSelectedIntent: (intent: string | null) => void,
    handleUpiPayment: () => void,
    handleCollectPayment: (item: string, id: string) => void,
    upiCollectVisible: boolean,
    setUpiCollectVisible: (selected: boolean) => void,
    savedUpiArray: PaymentClass[],
    onClickRadio: (item: string) => void
}

const UpiScreen: React.FC<UpiScreenProps> = ({ isUpiIntentVisible, isGpayVisible, isPaytmVisible, isPhonePeVisible, isUpiCollectVisible, selectedIntent, setSelectedIntent, handleUpiPayment, handleCollectPayment, upiCollectVisible, setUpiCollectVisible, savedUpiArray, onClickRadio }) => {
    const [upiCollectError, setUpiCollectError] = useState(false)
    const [upiCollectValid, setUpiCollectValid] = useState(false)
    const [upiCollectTextInput, setUpiCollectTextInput] = useState("")
    const [upiIdFocused, setUpiIdFocused] = useState(false);
    const { checkoutDetails } = checkoutDetailsHandler

    const handleUpiChevronClick = () => {
        setSelectedIntent(null)
        setUpiCollectVisible(!upiCollectVisible)
    }

    const handleTextChange = (text: string) => {
        setUpiCollectTextInput(text);
        setUpiCollectError(false);
        if (text.trim() !== "" && /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{3,64}$/.test(text)) {
            setUpiCollectError(false);
            setUpiCollectValid(true)
        } else {
            if (text.includes('@') && (text.split('@')[1]?.length ?? 0) >= 2) {
                setUpiCollectError(true);
                setUpiCollectValid(false)
            }
        }
    };


    return (
        <View>
            {(isUpiIntentVisible || isUpiCollectVisible) && (
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.addressText}>Pay by any UPI</Text>
                </View>
            )}
            <View style={styles.intentBackground}>
                {savedUpiArray.map((item, index) => (
                    <View key={index}>
                        <PaymentSelector id={item.id} title={item.title} image={item.image} isSelected={item.isSelected} instrumentTypeValue={item.instrumentTypeValue} onPress={() => onClickRadio(item.id)} onProceedForward={() => handleCollectPayment(item.title, item.id)} errorImage={require("../../../assets/images/ic_upi.png")} isLastUsed={item.isLastUsed} scale={0.2} />
                        <View style={{ flexDirection: 'row', height: 1, backgroundColor: '#ECECED' }} />
                    </View>
                ))}
                {isUpiIntentVisible && (
                    <View>
                        <View style={styles.upiIntentRow}>
                            {isGpayVisible && (
                                <View style={styles.intentContainer}>
                                    <Pressable
                                        style={[
                                            styles.intentIconBorder,
                                            selectedIntent === 'GPay' && { borderColor: checkoutDetails.brandColor, borderWidth: 2 }
                                        ]}
                                        onPress={() => {
                                            setUpiCollectVisible(false)
                                            setUpiCollectError(false)
                                            setSelectedIntent("GPay")
                                        }}
                                    >
                                        <Image
                                            source={require("../../../assets/images/gpay-icon.png")}
                                            style={styles.intentIcon}
                                        />
                                    </Pressable>
                                    <Text style={[styles.intentTitle, selectedIntent === 'GPay' && { color: checkoutDetails.brandColor, fontFamily: 'Poppins-SemiBold' }]}>GPay</Text>
                                </View>
                            )}
                            {isPhonePeVisible && (
                                <View style={styles.intentContainer}>
                                    <Pressable
                                        style={[
                                            styles.intentIconBorder,
                                            selectedIntent === 'PhonePe' && { borderColor: checkoutDetails.brandColor, borderWidth: 2 },
                                        ]}
                                        onPress={() => {
                                            setUpiCollectVisible(false)
                                            setUpiCollectError(false);
                                            setSelectedIntent("PhonePe")
                                        }}
                                    >
                                        <Image
                                            source={require("../../../assets/images/phonepe-icon.png")}
                                            style={{ height: 30, width: 30 }}
                                        />
                                    </Pressable>

                                    <Text style={[styles.intentTitle, selectedIntent === 'PhonePe' && { color: checkoutDetails.brandColor, fontFamily: 'Poppins-SemiBold' }]}>PhonePe</Text>
                                </View>
                            )}
                            {isPaytmVisible && (
                                <View style={styles.intentContainer}>
                                    <Pressable
                                        style={[
                                            styles.intentIconBorder,
                                            selectedIntent === 'PayTm' && { borderColor: checkoutDetails.brandColor, borderWidth: 2 }
                                        ]}
                                        onPress={() => {
                                            setUpiCollectVisible(false)
                                            setUpiCollectError(false);
                                            setSelectedIntent("PayTm")
                                        }}
                                    >
                                        <Image
                                            source={require("../../../assets/images/paytm-icon.png")}
                                            style={{ height: 28, width: 44 }}
                                        />
                                    </Pressable>
                                    <Text style={[styles.intentTitle, selectedIntent === 'PayTm' && { color: checkoutDetails.brandColor, fontFamily: 'Poppins-SemiBold' }]}>PayTm</Text>
                                </View>
                            )}
                            <View style={styles.intentContainer}>
                                <Pressable style={styles.intentIconBorder} onPress={() => {
                                    setUpiCollectVisible(false)
                                    setUpiCollectError(false);
                                    setSelectedIntent("")
                                }}>
                                    <Image
                                        source={require("../../../assets/images/other-intent-icon.png")}
                                        style={styles.intentIcon}
                                    />
                                </Pressable>
                                <Text style={styles.intentTitle}>Others</Text>
                            </View>
                        </View>

                        {(selectedIntent !== null && selectedIntent !== "") && (
                            <Pressable style={[styles.buttonContainer, { backgroundColor: checkoutDetails.brandColor }]} onPress={handleUpiPayment}>
                                <Text style={styles.buttonText}>Pay <Text style={styles.currencySymbol}>{checkoutDetails.currencySymbol}</Text>{checkoutDetails.amount} via {selectedIntent}</Text>
                            </Pressable>
                        )}
                    </View>
                )}

                {isUpiCollectVisible && (
                    <View>
                        {upiCollectVisible ? (
                            <ImageBackground
                                source={require("../../../assets/images/add_upi_id_background.png")} // Replace with your background image
                                resizeMode="cover"
                                style={{ paddingBottom: 34, marginTop: isUpiIntentVisible ? 24 : 0 }}
                            >
                                <Pressable
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center', // Ensures vertical alignment of items
                                        paddingTop: 16,
                                        paddingStart: 16,
                                        marginEnd: 16,
                                        justifyContent: 'space-between', // Spaces items between the start and end
                                    }}
                                    onPress={() => handleUpiChevronClick()}
                                >
                                    {/* Icon and Text Wrapper */}
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Image
                                            source={require("../../../assets/images/add_icon.png")}
                                            style={{ height: 14, width: 14, tintColor: checkoutDetails.brandColor }}
                                        />
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                color: checkoutDetails.brandColor,
                                                paddingStart: 10,
                                                fontFamily: 'Poppins-SemiBold'
                                            }}
                                        >
                                            Add new UPI Id
                                        </Text>
                                    </View>

                                    <Animated.Image
                                        source={require("../../../assets/images/chervon-down.png")}
                                        style={{
                                            alignSelf: 'center', height: 6, width: 14, transform: [{
                                                rotate: upiCollectVisible ? "180deg" : "0deg"
                                            }]
                                        }}
                                    />
                                </Pressable>
                            </ImageBackground>
                        ) : (
                            <View style={{ paddingBottom: isUpiCollectVisible ? 16 : 0 }}>
                                {isUpiIntentVisible && (
                                    <View style={{ flexDirection: 'row', height: 1, backgroundColor: '#F1F1F1', marginTop: 20 }} />
                                )}
                                <Pressable
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center', // Ensures vertical alignment of items
                                        paddingTop: 16,
                                        paddingStart: 16,
                                        marginEnd: 16,
                                        justifyContent: 'space-between', // Spaces items between the start and end
                                    }}
                                    onPress={() => handleUpiChevronClick()}
                                >
                                    {/* Icon and Text Wrapper */}
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Image
                                            source={require("../../../assets/images/add_icon.png")}
                                            style={{ height: 14, width: 14, tintColor: checkoutDetails.brandColor }}
                                        />
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                color: checkoutDetails.brandColor,
                                                paddingStart: 10,
                                                fontFamily: 'Poppins-SemiBold'
                                            }}
                                        >
                                            Add new UPI Id
                                        </Text>
                                    </View>

                                    <Animated.Image
                                        source={require("../../../assets/images/chervon-down.png")}
                                        style={{
                                            alignSelf: 'center', height: 6, width: 14, transform: [{
                                                rotate: upiCollectVisible ? "180deg" : "0deg"
                                            }]
                                        }}
                                    />
                                </Pressable>
                            </View>
                        )}
                    </View>
                )}

                {upiCollectVisible && (
                    <View style={{ paddingBottom: isUpiCollectVisible ? 16 : 0 }}>
                        <TextInput
                            mode='outlined'
                            label={
                                <Text style={{ fontSize: 14, fontFamily: 'Poppins-Regular', color: upiIdFocused ? '#2D2B32' : '#ADACB0' }}>Enter UPI Id</Text>
                            }
                            value={upiCollectTextInput}
                            onChangeText={(it) => {
                                handleTextChange(it)
                            }}
                            theme={{
                                colors: {
                                    primary: "#2D2B32",
                                    outline: '#E6E6E6',
                                }
                            }}
                            style={styles.textInput}
                            error={upiCollectError}
                            right={
                                upiCollectError ? (
                                    <TextInput.Icon
                                        icon={() => <Image source={require("../../../assets/images/ic_upi_error.png")} style={{ width: 24, height: 24 }} />}
                                    />
                                ) : null
                            }
                            outlineStyle={{
                                borderRadius: 8,  // Add this
                                borderWidth: 1.5
                            }}
                            onFocus={() => setUpiIdFocused(true)}
                            onBlur={() => setUpiIdFocused(false)}
                        />
                        {upiCollectError && (
                            <Text style={{
                                fontSize: 12, color: '#E12121', marginStart: 16, marginHorizontal: 16,
                                fontFamily: 'Poppins-Regular'
                            }}>Please enter a valid UPI Id</Text>
                        )}
                        {upiCollectValid ? (
                            <Pressable style={[styles.buttonContainer, { backgroundColor: checkoutDetails.brandColor }]} onPress={() => {
                                if (upiCollectValid) {
                                    handleCollectPayment(upiCollectTextInput, "")
                                } else {
                                    setUpiCollectError(true)
                                }
                            }}>
                                <Text style={styles.buttonText}>Verify & Pay <Text style={styles.currencySymbol}>{checkoutDetails.currencySymbol}</Text>{checkoutDetails.amount}</Text>
                            </Pressable>
                        ) : (
                            <Pressable style={[styles.buttonContainer, { backgroundColor: '#E6E6E6' }]} onPress={() => {
                                if (upiCollectValid) {
                                    handleCollectPayment(upiCollectTextInput, "")
                                } else {
                                    setUpiCollectError(true)
                                }
                            }}>
                                <Text style={[styles.buttonText, { color: '#ADACB0' }]}>Verify & Pay <Text style={[styles.currencySymbol, { color: '#ADACB0' }]}>{checkoutDetails.currencySymbol}</Text>{checkoutDetails.amount}</Text>
                            </Pressable>
                        )}
                    </View>
                )}

            </View>
        </View>
    )
}

export default UpiScreen

const styles = StyleSheet.create({
    addressText: {
        marginStart: 14,
        marginTop: 20,
        fontSize: 14,
        color: '#020815B5',
        fontFamily: 'Poppins-SemiBold'
    },
    upiIntentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 14
    },
    textInput: {
        marginHorizontal: 16,
        borderRadius: 8,
        backgroundColor: 'white',
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: '#0A090B'
    },
    labeltextInput: {
        fontSize: 20
    },
    intentIcon: {
        height: 28,
        width: 30
    },
    intentIconBorder: {
        height: 56,
        width: 56,
        borderWidth: 1,
        borderColor: "#DCDEE3",
        borderRadius: 7,
        justifyContent: 'center',
        alignItems: 'center'
    },
    intentContainer: {
        alignItems: 'center',
        marginEnd: 22
    },
    intentTitle: {
        color: "#363840",
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        marginTop: 4
    },
    intentBackground: {
        borderColor: '#F1F1F1',
        borderWidth: 1,
        marginHorizontal: 16,
        marginVertical: 8,
        backgroundColor: "white",
        flexDirection: 'column',
        borderRadius: 12,
    },
    buttonContainer: {
        flexDirection: 'row',
        borderRadius: 8,
        justifyContent: 'center',
        marginTop: 20,
        marginHorizontal: 16,
        paddingVertical: 14
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold'
    },
    currencySymbol: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Inter-SemiBold'
    }
});