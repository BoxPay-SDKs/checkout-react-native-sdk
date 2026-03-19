import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { checkoutDetailsHandler } from '../sharedContext/checkoutDetailsHandler';
import ImageLoader from './imageLoader';
import type { PaymentClass } from '../interface';
import { useState } from 'react';
import CheckBoxContainer from './checkboxContainer';

interface SavedCardComponentViewProps {
  savedCards: PaymentClass[];
  onProceedForward: (instrumentValue: string, isSICheckBoxClicked : boolean) => void;
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
            brandColor={checkoutDetails.buttonColor || '#1CA672'}
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
              tintColor: checkoutDetails.buttonColor,
            }}
          />
          <Text
            style={{
              fontSize: 14,
              color: checkoutDetails.buttonColor,
              paddingStart: 10,
              paddingTop : 4,
              fontFamily: checkoutDetails.fontFamily.semiBold,
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
  isSelected: boolean;
  instrumentTypeValue: string;
  onPress: (id: string) => void;
  onProceedForward: (instrumentValue: string, isSICheckBoxClicked : boolean) => void;
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
  amount
}: SavedCardRowProps) => {
  const { checkoutDetails } = checkoutDetailsHandler;
  const [isSICheckBoxClicked, setIsSICheckBoxClicked] = useState(false)
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
      <ImageLoader image={image} errorImage={errorImage}/>

        <View style={{ paddingStart: 12, flex: 1 }}>
          {nickName != "" && (
            <Text
            style={{
              fontFamily: checkoutDetails.fontFamily.semiBold,
              fontSize: 12,
              color: '#4F4D55',
            }}
            onPress={() => onPress(id)}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {nickName}
          </Text>
          )}
          <Text
            style={{
              fontFamily: checkoutDetails.fontFamily.regular,
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
          onPress={() => {
            setIsSICheckBoxClicked(false)
            onPress(id)
          }}
          color={brandColor}
          uncheckedColor={'#01010273'}
        />
      </View>
      {(checkoutDetails.isSICheckboxVisible && isSelected) && (
        <CheckBoxContainer
        text = {"Set up Standing Instructions (SI) for this payment."}
        isSelected = {isSICheckBoxClicked}
        setIsSelected = {setIsSICheckBoxClicked}
        />
      )}
      {isSelected && (
        <Pressable
          style={[styles.buttonContainer, { backgroundColor: brandColor }]}
          onPress={() => {
            onProceedForward(instrumentTypeValue, isSICheckBoxClicked);
          }}
        >
          <Text style={[styles.buttonText, {fontFamily: checkoutDetails.fontFamily.semiBold,}]}>
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
  checkBoxContainer : {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center'
},
checkBoxText : {
    color: '#2D2B32',
    fontSize: 14,
    marginLeft: 6,
},
checkboxBox: {
  width: 20,
  height: 20,
  borderWidth: 2,
  borderRadius: 3,
  justifyContent: 'center',
  alignItems: 'center',
  marginLeft: 8,
},
checkmark: {
  color: '#fff',
  fontSize: 13,
  fontWeight: 'bold',
  lineHeight: 16,
}
});
