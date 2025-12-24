import { View, Text, Image } from 'react-native';
import { useState } from 'react';
import type { Emi } from '../interface';
import Header from '../components/header';
import { checkoutDetailsHandler } from '../sharedContext/checkoutDetailsHandler';
import { SvgUri } from 'react-native-svg';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import SelectTenureCard from '../components/selectTenureCard';
import styles from '../styles/screens/selectTenureScreenStyles';

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
    <View style={styles.screenView}>
      <Header
        onBackPress={onbackPress}
        showDesc={true}
        showSecure={false}
        text="Select Tenure"
      />
      <View
        style={styles.outerContainer}
      >
        <View
          style={styles.container}
        >
          <View
            style={styles.insideContainer}
          >
            {load && !error && (
              <ShimmerPlaceHolder
                visible={false} // Keep shimmer until loading is done
                style={styles.shimmer}
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
                source={require('../../assets/images/ic_netbanking_semi_bold.png')}
                style={{ transform: [{ scale: 0.4 }] }}
              />
            )}
          </View>
          <Text
            style={styles.text}
          >
            {bankName} | {cardType} EMI
          </Text>
        </View>
        <View
          style={styles.insideContainerDivider}
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
                style={styles.insideContainerDivider}
              />
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

export default SelectTenureScreen;
