import { View, Text, BackHandler } from 'react-native'
import React, { useEffect } from 'react'
import { router } from 'expo-router';
import { Emi } from '../../(dataClass)/emiDataClass';
import Header from '../(components)/header';

interface SelectTenureProps {
    bankName: string,
    cardType: string,
    emiModel: Emi[],
    bankUrl: string
}

const SelectTenureScreen = ({ bankName, cardType, emiModel, bankUrl }: SelectTenureProps) => {
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
        <View style={{ flex: 1, backgroundColor: '#F5F6FB' }}>
            <Header onBackPress={onProceedBack} showDesc={true} showSecure={false} text='Select Tenure' />

        </View>
    )
}

export default SelectTenureScreen