import { View, Text, Image, SafeAreaView } from 'react-native';
import { useState } from 'react';
import type { Emi } from '../interface';
import Header from '../components/header';
import { checkoutDetailsHandler } from '../sharedContext/checkoutDetailsHandler';
import { SvgUri } from 'react-native-svg';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import SelectTenureCard from '../components/selectTenureCard';

interface SelectTenureProps {
  bankName: string;
  cardType: string;
  emiModel: Emi[];
  bankUrl: string;
  onbackPress: () => void;
  onProceedForward: (
    duration: number,
    bankName: string,
    bankUrl: string,
    offerCode: string,
    amount: string,
    percent: number
  ) => void;
}

const SelectTenureScreen = ({
  bankName,
  cardType,
  emiModel,
  bankUrl,
  onbackPress,
  onProceedForward,
}: SelectTenureProps) => {
  const { checkoutDetails } = checkoutDetailsHandler;
  const [error, setImageError] = useState(false);
  const [load, setLoad] = useState(true);
  const [selectedEmi, setSelectedEmi] = useState('');
  const [selectedDuration, setSelectedDuration] = useState(0);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F6FB' }}>
      <Header
        onBackPress={onbackPress}
        showDesc={true}
        showSecure={false}
        text="Select Tenure"
      />
      <View
        style={{
          backgroundColor: 'white',
          borderColor: '#E6E6E6',
          borderWidth: 1,
          marginTop: 8,
          marginHorizontal: 16,
          borderRadius: 12,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 12,
            paddingVertical: 16,
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: 28,
              height: 28,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {load && !error && (
              <ShimmerPlaceHolder
                visible={false} // Keep shimmer until loading is done
                style={{ width: 32, height: 32, borderRadius: 8 }}
              />
            )}
            {!error ? (
              <SvgUri
                uri={bankUrl}
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
              <Image
                source={require('../assets/images/ic_netbanking_semi_bold.png')}
                style={{ transform: [{ scale: 0.4 }] }}
              />
            )}
          </View>
          <Text
            style={{
              fontFamily: 'Poppins-SemiBold',
              fontSize: 14,
              paddingStart: 8,
            }}
          >
            {bankName} | {cardType} EMI
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            height: 1,
            backgroundColor: '#ECECED',
          }}
        />
        {emiModel.map((item, index) => (
          <View key={index}>
            <SelectTenureCard
              duration={item.duration}
              monthlyEmiAmount={item.amount}
              interest={item.percent || 0}
              discount={item.discount || ''}
              totalAmount={item.totalAmount}
              debiitedAmount={item.netAmount || ''}
              isLowCostOffer={item.lowCostApplied}
              isNoCostOffer={item.noCostApplied}
              interestCharged={item.interestCharged || ''}
              onProceedForward={() => {
                onProceedForward(
                  item.duration,
                  bankName,
                  bankUrl,
                  item.code || '',
                  item.amount,
                  item.percent
                );
              }}
              isSelected={
                selectedEmi === item.amount &&
                selectedDuration === item.duration
              }
              brandColor={checkoutDetails.brandColor}
              onRadioClick={(duration, amount) => {
                setSelectedDuration(duration);
                setSelectedEmi(amount);
              }}
              currencySymbol={checkoutDetails.currencySymbol}
              processingFee={item.processingFee}
            />
            {index !== emiModel.length - 1 && (
              <View
                style={{
                  flexDirection: 'row',
                  height: 1,
                  backgroundColor: '#ECECED',
                }}
              />
            )}
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default SelectTenureScreen;
