import { View, Text, StyleSheet, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import Modal from 'react-native-modal'
import LottieView from 'lottie-react-native'
import { checkoutDetailsHandler } from '../sharedContext/checkoutDetailsHandler';

interface PaymentSuccessProps {
    onClick: () => void,
    transactionId: string,
    method: string,
    localDateTime: string
}

const PaymentSuccess: React.FC<PaymentSuccessProps> = ({ onClick, transactionId, localDateTime }) => {
    const { checkoutDetails } = checkoutDetailsHandler;
    const [date, setDate] = useState("")
    const [time, setTime] = useState("")
    useEffect(() => {
        const formatTransactionTimestamp = () => {
            const parts = localDateTime.split(" ");
            const date = parts[0] || "";
            const time = parts[1] || "";
            
            const dateParts = date.split("/");
            const day = dateParts[0] || "";
            const month = dateParts[1] || "";
            const year = dateParts[2] || "";
            
            const timeParts = time.split(":");
            const hour = timeParts[0] || "0";
            const minute = timeParts[1] || "0";

            // Map month number to short month name
            const monthNames: { [key: string]: string } = {
                "01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr",
                "05": "May", "06": "Jun", "07": "Jul", "08": "Aug",
                "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dec"
            };

            const formattedDate = `${monthNames[month] || "Jan"} ${day}, ${year}`; // e.g., "Feb 25, 2025"

            // Convert 24-hour to 12-hour format
            const hourInt = parseInt(hour, 10);
            const amPm = hourInt >= 12 ? "PM" : "AM";
            const formattedHour = (hourInt % 12 || 12).toString().padStart(2, '0') // Convert "13" to "1"
            const formattedTime = `${formattedHour}:${minute} ${amPm}`;

            setDate(formattedDate);
            setTime(formattedTime);
        };

        formatTransactionTimestamp()
    },);
    return (
        <View>

            <Modal
                isVisible={true}
                style={styles.modal}
            >
                <View style={styles.sheet}>
                    <LottieView
                        source={require('../../../assets/animations/payment_successful.json')}
                        autoPlay
                        loop={false}
                        speed={0.6}
                        style={{ width: 90, height: 90, alignSelf: 'center' }}
                    />
                    <Text style={styles.successfulHeading}>Payment Successful!</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 24 }}>
                        <Text style={{ fontSize: 14, color: '#000000', fontFamily: 'Poppins-Regular' }}>Transaction ID</Text>
                        <Text style={{ fontSize: 14, color: '#000000', fontFamily: 'Poppins-SemiBold' }}>{transactionId}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 14 }}>
                        <Text style={{ fontSize: 14, color: '#000000', fontFamily: 'Poppins-Regular' }}>Date</Text>
                        <Text style={{ fontSize: 14, color: '#000000', fontFamily: 'Poppins-SemiBold' }}>{date}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 14 }}>
                        <Text style={{ fontSize: 14, color: '#000000', fontFamily: 'Poppins-Regular' }}>Time</Text>
                        <Text style={{ fontSize: 14, color: '#000000', fontFamily: 'Poppins-SemiBold' }}>{time}</Text>
                    </View>
                    {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 14 }}>
                        <Text style={{ fontSize: 14, color: '#000000', fontFamily: 'Poppins-Regular' }}>Payment Method</Text>
                        <Text style={{ fontSize: 14, color: '#000000', fontFamily: 'Poppins-SemiBold' }}>{method}</Text>
                    </View> */}
                    <View style={styles.dashedLine} />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10 }}>
                        <Text style={{ fontSize: 14, color: '#000000', fontFamily: 'Poppins-SemiBold' }}>Total Amount</Text>
                        <Text style={{ fontSize: 18, color: '#000000', fontFamily: 'Poppins-SemiBold' }}><Text style={{ fontSize: 16, color: '#000000', fontFamily: 'Inter-SemiBold' }}>{checkoutDetails.currencySymbol}</Text>{checkoutDetails.amount}</Text>
                    </View>
                    <View style={styles.dashedLine} />
                    {/* <Text
                        style={{
                            fontSize: 12, fontFamily: 'Poppins-Regular',
                            color: '#4F4D55', alignSelf: 'center', paddingBottom: 16, paddingTop: 12
                        }}
                    >You will be redirected to the merchant's page</Text> */}
                    <Pressable style={[styles.buttonContainer, { backgroundColor: checkoutDetails.brandColor }]} onPress={onClick}>
                        <Text style={styles.buttonText}>Done</Text>
                    </Pressable>
                </View>
            </Modal>
        </View>
    );
}

export default PaymentSuccess

const styles = StyleSheet.create({
    openButton: {
        fontSize: 18,
        color: 'blue',
        fontFamily: 'Poppins-Bold'
    },
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    sheet: {
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    closeButton: {
        marginTop: 10,
        fontSize: 16,
        color: 'red',
        fontFamily: 'Poppins-Regular'
    },
    successfulHeading: {
        color: '#019939',
        fontSize: 20,
        alignSelf: 'center',
        paddingTop: 8,
        fontFamily: 'Poppins-SemiBold'
    },
    buttonContainer: {
        flexDirection: 'row',
        borderRadius: 8,
        justifyContent: 'center',
        marginTop: 12,
        backgroundColor: '#1CA672',
        paddingVertical: 14
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold'
    },
    dashedLine: {
        borderBottomWidth: 2, // Thickness of the line
        borderBottomColor: '#E6E6E6', // Color of the line
        borderStyle: 'dashed', // Makes it dashed
        width: '100%', // Full width
        marginVertical: 10, // Some spacing
        marginTop: 16
    }
});