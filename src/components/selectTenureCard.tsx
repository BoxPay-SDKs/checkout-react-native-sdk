import { View, Text, Pressable, StyleSheet } from 'react-native';
import React from 'react';
import { RadioButton } from 'react-native-paper';

interface SelectTenureCardProps {
  duration: number;
  monthlyEmiAmount: string;
  interest: number;
  interestCharged: string;
  discount: string;
  totalAmount: string;
  debiitedAmount: string;
  isLowCostOffer: boolean;
  isNoCostOffer: boolean;
  onProceedForward: () => void;
  isSelected: boolean;
  brandColor: string;
  onRadioClick: (duration: number, amount: string) => void;
  currencySymbol: string;
  processingFee: string;
}

const SelectTenureCard: React.FC<SelectTenureCardProps> = ({
  duration,
  monthlyEmiAmount,
  interest,
  discount,
  totalAmount,
  debiitedAmount,
  isLowCostOffer,
  isNoCostOffer,
  isSelected,
  onProceedForward,
  brandColor,
  onRadioClick,
  currencySymbol,
  interestCharged,
  processingFee,
}) => {
  return (
    <View>
      {isSelected ? (
        <View style={{ backgroundColor: '#EFF3FA' }}>
          <Pressable
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 14,
              paddingTop: 14,
            }}
            onPress={() => onRadioClick(duration, monthlyEmiAmount)}
          >
            <RadioButton
              value={monthlyEmiAmount}
              status={isSelected ? 'checked' : 'unchecked'}
              onPress={() => onRadioClick(duration, monthlyEmiAmount)}
              color={brandColor}
              uncheckedColor={'#01010273'}
            />
            <Text
              style={{
                fontFamily: 'Poppins-SemiBold',
                fontSize: 14,
                color: '#2D2B32',
              }}
            >
              {duration} months x
              <Text
                style={{
                  fontFamily: 'Inter-SemiBold',
                  fontSize: 14,
                  color: '#2D2B32',
                }}
              >
                {' '}
                {currencySymbol}
              </Text>
              {monthlyEmiAmount}
            </Text>
            {isLowCostOffer && (
              <View style={styles.tag}>
                <Text style={styles.tagText}>LOW COST EMI</Text>
              </View>
            )}

            {isNoCostOffer && (
              <View style={styles.tag}>
                <Text style={styles.tagText}>NO COST EMI</Text>
              </View>
            )}
          </Pressable>
          <View style={{ borderColor: '#F1F1F1', borderWidth: 1 }}>
            <View
              style={{
                flexDirection: 'row',
                marginHorizontal: 12,
                marginTop: 16,
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#F1F1F1',
                padding: 8,
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
              }}
            >
              <Text
                style={{
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 12,
                  color: '#2D2B32',
                  flex: 1,
                  textAlign: 'center',
                }}
                numberOfLines={2}
              >
                Monthly EMI
              </Text>
              <Text
                style={{
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 12,
                  color: '#2D2B32',
                  flex: 1,
                  textAlign: 'center',
                }}
                numberOfLines={2}
              >
                Interest @{interest}% p.a.
              </Text>
              {discount !== '0' && (
                <Text
                  style={{
                    fontFamily: 'Poppins-SemiBold',
                    fontSize: 12,
                    color: '#2D2B32',
                    flex: 1,
                    textAlign: 'center',
                  }}
                  numberOfLines={2}
                >
                  Discount
                </Text>
              )}
              <Text
                style={{
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 12,
                  color: '#2D2B32',
                  flex: 1,
                  textAlign: 'center',
                }}
                numberOfLines={2}
              >
                Total Cost
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: 'white',
                padding: 8,
                borderBottomEndRadius: 12,
                justifyContent: 'space-between',
                borderBottomStartRadius: 12,
                marginHorizontal: 12,
              }}
            >
              <Text
                style={{
                  fontFamily: 'Poppins-Medium',
                  fontSize: 12,
                  color: '#2D2B32',
                  flex: 1,
                  textAlign: 'center',
                }}
                numberOfLines={2}
              >
                <Text
                  style={{
                    fontFamily: 'Inter-Regular',
                    fontSize: 12,
                    color: '#2D2B32',
                  }}
                >
                  {' '}
                  {currencySymbol}
                </Text>
                {monthlyEmiAmount}
              </Text>
              <Text
                style={{
                  fontFamily: 'Poppins-Medium',
                  fontSize: 12,
                  color: '#2D2B32',
                  flex: 1,
                  textAlign: 'center',
                }}
                numberOfLines={2}
              >
                <Text
                  style={{
                    fontFamily: 'Inter-Regular',
                    fontSize: 12,
                    color: '#2D2B32',
                  }}
                >
                  {' '}
                  {currencySymbol}
                </Text>
                {interestCharged}
              </Text>
              {discount !== '0' && (
                <Text
                  style={{
                    fontFamily: 'Poppins-Medium',
                    fontSize: 12,
                    color: '#1CA672',
                    flex: 1,
                    textAlign: 'center',
                  }}
                  numberOfLines={2}
                >
                  <Text
                    style={{
                      fontFamily: 'Inter-Regular',
                      fontSize: 12,
                      color: '#1CA672',
                    }}
                  >
                    {' '}
                    -{currencySymbol}
                  </Text>
                  {discount}
                </Text>
              )}
              <Text
                style={{
                  fontFamily: 'Poppins-Medium',
                  fontSize: 12,
                  color: '#2D2B32',
                  flex: 1,
                  textAlign: 'center',
                }}
                numberOfLines={2}
              >
                <Text
                  style={{
                    fontFamily: 'Inter-Regular',
                    fontSize: 12,
                    color: '#2D2B32',
                  }}
                >
                  {' '}
                  {currencySymbol}
                </Text>
                {totalAmount}
              </Text>
            </View>
          </View>
          <Text
            style={{
              padding: 12,
              color: '#2D2B32',
              fontSize: 12,
              lineHeight: 18,
              fontFamily: 'Poppins-Regular',
            }}
          >
            Your card will be charged for an amount of{' '}
            <Text
              style={{
                fontFamily: 'Inter-SemiBold',
                fontSize: 12,
                color: '#2D2B32',
              }}
            >
              {' '}
              {currencySymbol}
            </Text>
            <Text
              style={{
                fontFamily: 'Poppins-SemiBold',
                fontSize: 12,
                color: '#2D2B32',
              }}
            >
              {debiitedAmount}
            </Text>{' '}
            You will be charged an interest of 
            <Text
              style={{
                fontFamily: 'Inter-SemiBold',
                fontSize: 12,
                color: '#2D2B32',
              }}
            >
              {' '}
              {currencySymbol}
            </Text>
            <Text
              style={{
                fontFamily: 'Poppins-SemiBold',
                fontSize: 12,
                color: '#2D2B32',
              }}
            >
              {interestCharged}
            </Text>{' '}
            by the bank making the total payable amount as{' '}
            <Text
              style={{
                fontFamily: 'Inter-SemiBold',
                fontSize: 12,
                color: '#2D2B32',
              }}
            >
              {' '}
              {currencySymbol}
            </Text>
            <Text
              style={{
                fontFamily: 'Poppins-SemiBold',
                fontSize: 12,
                color: '#2D2B32',
              }}
            >
              {totalAmount}
            </Text>
            .
          </Text>
          <Text
            style={{
              fontFamily: 'Poppins-Regular',
              fontSize: 12,
              color: '#2D2B32',
              paddingHorizontal: 12,
              paddingBottom: 12,
            }}
          >
            <Text
              style={{
                fontFamily: 'Inter-SemiBold',
                fontSize: 12,
                color: '#2D2B32',
              }}
            >
              {' '}
              {currencySymbol}
            </Text>
            <Text
              style={{
                fontFamily: 'Poppins-SemiBold',
                fontSize: 12,
                color: '#2D2B32',
              }}
            >
              {processingFee}
            </Text>
            +GST will be charged by HDFC bank as one-time processing fee.
          </Text>
          <Pressable
            style={{
              flexDirection: 'row',
              borderRadius: 8,
              justifyContent: 'center',
              marginBottom: 16,
              marginHorizontal: 12,
              paddingVertical: 12,
              backgroundColor: brandColor,
            }}
            onPress={() => {
              onProceedForward();
            }}
          >
            <Text
              style={{
                color: 'white',
                fontSize: 16,
                fontFamily: 'Poppins-SemiBold',
              }}
            >
              Proceed to Enter Card Details
            </Text>
          </Pressable>
        </View>
      ) : (
        <View style={{ padding: 14 }}>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            {/* Radio Button */}
            <RadioButton
              value={monthlyEmiAmount}
              status={isSelected ? 'checked' : 'unchecked'}
              onPress={() => onRadioClick(duration, monthlyEmiAmount)}
              color={brandColor}
              uncheckedColor={'#01010273'}
            />

            {/* Text Content */}
            <View style={{ flexShrink: 1 }}>
              <Text
                style={{
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 14,
                  color: '#2D2B32',
                  alignSelf: 'center',
                }}
                onPress={() => onRadioClick(duration, monthlyEmiAmount)}
              >
                {duration} months x
                <Text
                  style={{
                    fontFamily: 'Inter-SemiBold',
                    fontSize: 14,
                    color: '#2D2B32',
                  }}
                >
                  {' '}
                  {currencySymbol}
                </Text>
                {monthlyEmiAmount} | @{interest}% p.a.
              </Text>

              {/* Tag Container (Moves to next line if needed) */}
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  alignSelf: 'flex-start',
                }}
              >
                {isLowCostOffer && (
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>LOW COST EMI</Text>
                  </View>
                )}
                {isNoCostOffer && (
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>NO COST EMI</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default SelectTenureCard;

const styles = StyleSheet.create({
  tag: {
    borderColor: '#FFADD2',
    borderRadius: 6,
    backgroundColor: '#FFF0F6',
    borderWidth: 1,
    paddingHorizontal: 4,
    marginLeft: 4,
  },
  tagText: {
    fontSize: 10,
    fontFamily: 'Poppins-Medium',
    color: '#EB2F96',
  },
});
