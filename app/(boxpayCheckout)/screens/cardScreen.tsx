import { View, Text, StyleSheet, Image, BackHandler, Pressable } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router';
import Header from '../components/header';
import { TextInput } from 'react-native-paper';
import LottieView from 'lottie-react-native';

const CardScreen = () => {
    const { currencySymbol, amount, token, brandColor, env } = useLocalSearchParams();

    const amountStr = Array.isArray(amount) ? amount[0] : amount;
    const currencySymbolStr = Array.isArray(currencySymbol) ? currencySymbol[0] : currencySymbol
    const tokenStr = Array.isArray(token) ? token[0] : token;
    const brandColorStr = Array.isArray(brandColor) ? brandColor[0] : brandColor;
    const envStr = Array.isArray(env) ? env[0] : env;

    const [cardNumberText, setCardNumberText] = useState<string | null>(null);
    const [cardExpiryText, setCardExpiryText] = useState<string | null>(null);
    const [cardCvvText, setCardCvvText] = useState<string | null>(null);
    const [cardHolderNameText, setCardHolderNameText] = useState<string | null>(null);

    const [cardSelectedIcon, setCardSelectedIcon] = useState(require("../../../assets/images/ic_default_card.png"));
    const [maxCvvLength, setMaxCvvLength] = useState(4);
    const [loading, setLoading] = useState(false);

    const [cardNumberError, setCardNumberError] = useState(false);
    const [cardExpiryError, setCardExpiryError] = useState(false);
    const [cardCvvError, setCardCvvError] = useState(false);
    const [cardHolderNameError, setCardHolderNameError] = useState(false);

    const [cardValid, setCardValid] = useState(false);

    const handleCardNumberTextChange = (text: string) => {
        if (text == "") {
            setCardNumberError(true);
            setCardNumberText(text);
        } else {
            setCardNumberError(false);
            const cleaned = text.replace(/[^\d]/g, '');

            // Add space every 4 digits
            const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || '';

            setCardNumberText(formatted);
        }
    };
    const handleCardNumberBlur = () => {
        const cleaned = cardNumberText?.replace(/ /g, '') || '';
        setCardNumberError(cleaned.length < 16);
    };

    // In expiry input focus handler
    const moveToExpiry = () => {
        const cleaned = cardNumberText?.replace(/ /g, '') || '';
        if (cleaned.length != 16) {
            setCardNumberError(true);
        }
    };

    const handleCardExpiryTextChange = (text: string) => {
        setCardExpiryText(text);
        if (text == "") {
            setCardExpiryError(true);
            setCardExpiryText(text);
        } else {
            setCardExpiryError(false);
            const isDeleting = text.length < (cardExpiryText?.length || 0);

            // Remove all non-digits
            let cleaned = text.replace(/\D/g, '');

            // Handle backspace on slash
            if (isDeleting && text.endsWith('/')) {
                cleaned = cleaned.slice(0, -1);
            }

            // Limit to 4 digits
            cleaned = cleaned.slice(0, 4);

            // Add leading zero for single-digit month
            if (cleaned.length === 1 && parseInt(cleaned) > 1) {
                cleaned = `0${cleaned}`;
            }

            // Validate month
            let monthError = false;
            if (cleaned.length >= 2) {
                const month = parseInt(cleaned.slice(0, 2));
                monthError = month < 1 || month > 12;
            }

            // Format as MM/YY with proper deletion handling
            let formatted = cleaned;
            if (cleaned.length > 2) {
                formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
            } else if (cleaned.length === 2 && !isDeleting) {
                formatted = `${cleaned}/`;
            }

            setCardExpiryText(formatted);
        }
    };

    const handleCardExpiryBlur = () => {
        const cleaned = cardExpiryText?.replace(/ /g, '') || '';
        setCardExpiryError(cleaned.length < 5);
    };

    // In expiry input focus handler
    const moveToCvv = () => {
        const cleaned = cardExpiryText?.replace(/ /g, '') || '';
        if (cleaned.length != 5) {
            setCardExpiryError(true);
        }
    };

    const handleCardCvvBlur = () => {
        const cleaned = cardCvvText?.replace(/ /g, '') || '';
        setCardCvvError(cleaned.length < maxCvvLength);
    };

    const moveToHolderName = () => {
        const cleaned = cardCvvText?.replace(/ /g, '') || '';
        if (cleaned.length != maxCvvLength) {
            setCardCvvError(true);
        }
    };

    const handleCardCvvTextChange = (text: string) => {
        setCardCvvText(text);
        if (text == "") {
            setCardCvvError(true);
        } else {
            setCardCvvError(false);
        }
    };

    const handleCardHolderNameTextChange = (text: string) => {
        setCardHolderNameText(text);
        if (text == "") {
            setCardHolderNameError(true);
        } else {
            setCardHolderNameError(false);
        }
    };

    const checkCardValid = () => {
        if (cardNumberError || cardExpiryError || cardCvvError || cardHolderNameError) {
            setCardValid(false);
        } else {
            setCardValid(true);
        }
    }

    const onProceedBack = () => {
        router.back();
        return true;
    };

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', onProceedBack);
        return () => {
            backHandler.remove();
        };
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            {loading ? (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <LottieView source={require('../../../assets/animations/boxpayLogo.json')} autoPlay loop style={{ width: 80, height: 80 }} />
                    <Text>Loading...</Text>
                </View>
            ) : (
                <View style={{ flex: 1, backgroundColor: 'white' }}>
                    <Header onBackPress={onProceedBack} items={0} amount='' currencySymbol='' showDesc={false} showSecure={true} text='Add a new Card' />
                    <View style={{ flexDirection: 'row', height: 1, backgroundColor: '#ECECED' }} />
                    <TextInput
                        mode='outlined'
                        label='Card Number'
                        value={cardNumberText || ''}
                        onChangeText={(it) => {
                            handleCardNumberTextChange(it)
                        }}
                        theme={{
                            colors: {
                                primary: brandColorStr,
                                outline: '#E6E6E6'
                            }
                        }}
                        style={[styles.textInput, { marginTop: 28, marginHorizontal: 16 }]}
                        error={cardNumberError}
                        right={
                            cardNumberError ? (
                                <TextInput.Icon
                                    icon={() => <Image source={require("../../../assets/images/ic_upi_error.png")} style={{ width: 24, height: 24 }} />}
                                />
                            ) : (
                                <TextInput.Icon
                                    icon={() => <Image source={cardSelectedIcon} style={{ width: 40, height: 40 }} />}
                                />
                            )

                        }
                        outlineStyle={{
                            borderRadius: 8,  // Add this
                            borderWidth: 1.5
                        }}
                        keyboardType='number-pad'
                        maxLength={19}
                        onBlur={handleCardNumberBlur}
                        onSubmitEditing={moveToExpiry}
                    />
                    {(cardNumberText == "" || cardNumberError) && (
                        <Text style={{ color: '#B3261E', fontSize: 12, fontFamily: 'Poppins-Regular', marginHorizontal: 16, marginTop: 4 }}>This card number is invalid</Text>
                    )}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 16, marginTop: 16 }}>
                        <View style={{ flex: 1, flexDirection: 'column' }}>
                            <TextInput
                                mode='outlined'
                                label='Expiry (MM/YY)'
                                value={cardExpiryText || ''}
                                onChangeText={(it) => {
                                    handleCardExpiryTextChange(it)
                                }}
                                theme={{
                                    colors: {
                                        primary: brandColorStr,
                                        outline: '#E6E6E6'
                                    }
                                }}
                                style={styles.textInput}
                                error={cardExpiryError}
                                right={
                                    cardExpiryError ? (
                                        <TextInput.Icon
                                            icon={() => <Image source={require("../../../assets/images/ic_upi_error.png")} style={{ width: 24, height: 24 }} />}
                                        />
                                    ) : null
                                }
                                outlineStyle={{
                                    borderRadius: 8,  // Add this
                                    borderWidth: 1.5
                                }}
                                keyboardType='number-pad'
                                maxLength={5}
                                onBlur={handleCardExpiryBlur}
                                onSubmitEditing={moveToCvv}
                            />
                            {(cardExpiryText == "" || cardExpiryError) && (
                                <Text style={{ color: '#B3261E', fontSize: 12, fontFamily: 'Poppins-Regular', marginTop: 4 }}>Expiry is invalid</Text>
                            )}
                        </View>
                        <View style={{ flex: 1, flexDirection: 'column', marginStart: 32 }}>
                            <TextInput
                                mode='outlined'
                                label='CVV'
                                value={cardCvvText || ''}
                                onChangeText={(it) => {
                                    handleCardCvvTextChange(it)
                                }}
                                theme={{
                                    colors: {
                                        primary: brandColorStr,
                                        outline: '#E6E6E6'
                                    }
                                }}
                                style={styles.textInput}
                                error={cardCvvError}
                                right={
                                    cardCvvError ? (
                                        <TextInput.Icon
                                            icon={() => <Image source={require("../../../assets/images/ic_upi_error.png")} style={{ width: 24, height: 24 }} />}
                                        />
                                    ) : (
                                        <TextInput.Icon
                                            icon={() => <Image source={require("../../../assets/images/ic_cvv_info.png")} style={{ width: 24, height: 24 }} />}
                                            onPress={() => {
                                                console.log("CVV Info");
                                            }}
                                        />
                                    )
                                }
                                outlineStyle={{
                                    borderRadius: 8,  // Add this
                                    borderWidth: 1.5
                                }}
                                keyboardType='number-pad'
                                maxLength={maxCvvLength}
                                secureTextEntry={true}
                                onBlur={handleCardCvvBlur}
                                onSubmitEditing={moveToHolderName}
                            />
                            {(cardCvvText == "" || cardCvvError) && (
                                <Text style={{ color: '#B3261E', fontSize: 12, fontFamily: 'Poppins-Regular', marginTop: 4 }}>CVV is invalid</Text>
                            )}
                        </View>
                    </View>
                    <TextInput
                        mode='outlined'
                        label='Name on the Card'
                        value={cardHolderNameText || ''}
                        onChangeText={(it) => {
                            handleCardHolderNameTextChange(it)
                        }}
                        theme={{
                            colors: {
                                primary: brandColorStr,
                                outline: '#E6E6E6'
                            }
                        }}
                        style={[styles.textInput, { marginHorizontal: 16, marginTop: 16 }]}
                        error={cardHolderNameError}
                        right={
                            cardHolderNameError ? (
                                <TextInput.Icon
                                    icon={() => <Image source={require("../../../assets/images/ic_upi_error.png")} style={{ width: 24, height: 24 }} />}
                                />
                            ) : null

                        }
                        outlineStyle={{
                            borderRadius: 8,  // Add this
                            borderWidth: 1.5
                        }}
                    />
                    {(cardHolderNameText == "" || cardHolderNameError) && (
                        <Text style={{ color: '#B3261E', fontSize: 12, fontFamily: 'Poppins-Regular', marginHorizontal: 16, marginTop: 4 }}>This card name is invalid</Text>
                    )}
                    <View style={{ flexDirection: 'row', marginHorizontal: 16, marginTop: 16, backgroundColor: '#E8F6F1', borderRadius: 4, padding: 4, alignItems: 'center' }}>
                        <Image source={require("../../../assets/images/ic_info.png")} style={{ width: 20, height: 20, tintColor: '#2D2B32' }} />
                        <Text style={{ fontSize: 12, fontFamily: 'Poppins-Regular', color: '#2D2B32', marginStart: 8 }}>CVV will not be stored</Text>
                    </View>
                    <View style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        paddingBottom: 16
                    }}>
                        {cardValid ? (
                            <Pressable style={[styles.buttonContainer, { backgroundColor: brandColorStr }]} onPress={() => {

                            }}>
                                <Text style={styles.buttonText}>Make Payment</Text>
                            </Pressable>
                        ) : (
                            <Pressable style={[styles.buttonContainer, { backgroundColor: '#E6E6E6' }]}>
                                <Text style={[styles.buttonText, { color: '#ADACB0' }]}>Make Payment</Text>
                            </Pressable>
                        )}
                    </View>
                </View>
            )
            }
        </View>
    )
}

export default CardScreen

const styles = StyleSheet.create({
    textInput: {
        backgroundColor: 'white',
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: '#0A090B',
        height: 60
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
    }
})
