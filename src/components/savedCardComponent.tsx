import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import { useState } from 'react';
import { RadioButton } from 'react-native-paper';
import { checkoutDetailsHandler } from '../sharedContext/checkoutDetailsHandler';
import { SvgUri } from 'react-native-svg';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import type { PaymentClass } from '../interface';

interface SavedCardComponentViewProps {
  savedCards: PaymentClass[];
  onProceedForward: (instrumentValue: string) => void;
  errorImage: ImageSourcePropType;
  onClickAddCard: () => void;
  onClickRadio: (selectedInstrumentValue: string) => void;
}

const SavedCardComponentView = ({
  savedCards,
  onProceedForward,
  errorImage,
  onClickAddCard,
  onClickRadio,
}: SavedCardComponentViewProps) => {
  const { checkoutDetails } = checkoutDetailsHandler;

  return (
    <View style={{ paddingBottom: 12 }}>
      {savedCards.map((card) => (
        <View key={card.id}>
          <SavedCardRow
            id={card.id}
            nickName={card.displayName}
            cardNumber={card.displayValue}
            image={card.iconUrl}
            errorImage={errorImage}
            isSelected={card.isSelected}
            instrumentTypeValue={card.instrumentTypeValue}
            onPress={onClickRadio}
            onProceedForward={onProceedForward}
            brandColor={checkoutDetails.brandColor || '#1CA672'}
            currencySymbol={checkoutDetails.currencySymbol || '₹'}
            amount={checkoutDetails.amount}
          />
          <View
            style={{
              flexDirection: 'row',
              height: 1,
              backgroundColor: '#ECECED',
            }}
          />
        </View>
      ))}
      <Pressable
        style={{
          flexDirection: 'row',
          alignItems: 'center', // Ensures vertical alignment of items
          paddingTop: 16,
          paddingStart: 16,
          marginEnd: 16,
          justifyContent: 'space-between', // Spaces items between the start and end
        }}
        onPress={() => onClickAddCard()}
      >
        {/* Icon and Text Wrapper */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={require('../../assets/images/add_icon.png')}
            style={{
              height: 14,
              width: 14,
              tintColor: checkoutDetails.brandColor,
            }}
          />
          <Text
            style={{
              fontSize: 14,
              color: checkoutDetails.brandColor,
              paddingStart: 10,
              fontFamily: 'Poppins-SemiBold',
            }}
          >
            Add new Card
          </Text>
        </View>

        <Image
          source={require('../../assets/images/chervon-down.png')}
          style={{
            alignSelf: 'center',
            height: 6,
            width: 14,
            transform: [
              {
                rotate: '270deg',
              },
            ],
          }}
        />
      </Pressable>
    </View>
  );
};

interface SavedCardRowProps {
  id: string;
  nickName: string;
  cardNumber: string;
  image: string;
  errorImage: ImageSourcePropType;
  isSelected: boolean | null;
  instrumentTypeValue: string;
  onPress: (id: string) => void;
  onProceedForward: (instrumentValue: string) => void;
  brandColor: string;
  currencySymbol: string;
  amount: string;
}

const SavedCardRow = ({
  id,
  nickName,
  cardNumber,
  image,
  errorImage,
  isSelected,
  instrumentTypeValue,
  onPress,
  onProceedForward,
  brandColor,
  currencySymbol,
  amount,
}: SavedCardRowProps) => {
  const [error, setImageError] = useState(false);
  const [load, setLoad] = useState(true);
  return (
    <View
      style={{
        paddingVertical: 16,
        paddingHorizontal: 12,
        backgroundColor: isSelected ? '#EDF8F4' : 'white',
        borderRadius: isSelected ? 0 : 12,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View
          style={{
            width: 32,
            height: 32,
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
            <Image
              source={errorImage}
              style={{ transform: [{ scale: 0.4 }] }}
            />
          )}
        </View>

        <View style={{ paddingStart: 12, flex: 1 }}>
          <Text
            style={{
              fontFamily: 'Poppins-SemiBold',
              fontSize: 12,
              color: '#4F4D55',
            }}
            onPress={() => onPress(id)}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {nickName}
          </Text>
          <Text
            style={{
              fontFamily: 'Poppins-Regular',
              fontSize: 12,
              color: '#4F4D55',
            }}
            onPress={() => onPress(id)}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {cardNumber}
          </Text>
        </View>
        <RadioButton
          value={id}
          status={isSelected ? 'checked' : 'unchecked'}
          onPress={() => onPress(id)}
          color={brandColor}
          uncheckedColor={'#01010273'}
        />
      </View>
      {isSelected && (
        <Pressable
          style={[styles.buttonContainer, { backgroundColor: brandColor }]}
          onPress={() => {
            onProceedForward(instrumentTypeValue);
          }}
        >
          <Text style={styles.buttonText}>
            Proceed to Pay{' '}
            <Text
              style={{
                fontFamily: 'Inter-SemiBold',
                fontSize: 16,
                color: 'white',
              }}
            >
              {' '}
              {currencySymbol}
            </Text>
            {amount}
          </Text>
        </Pressable>
      )}
    </View>
  );
};

export default SavedCardComponentView;

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    justifyContent: 'center',
    marginTop: 10,
    paddingVertical: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  tag: {
    borderColor: '#1CA672',
    borderRadius: 6,
    backgroundColor: '#1CA67214',
    borderWidth: 0.5,
    paddingHorizontal: 4,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  tagText: {
    fontSize: 10,
    fontFamily: 'Poppins-Medium',
    color: '#1CA672',
  },
});
