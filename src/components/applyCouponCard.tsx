import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

interface Props {
  selectedColor: string;
  code: string;
  description: string;
  discountAmount: string;
  currencySymbol: string;
  isCodeApplied: boolean;

  onClickApply: (code: string) => void;
  onClickRemove: () => void;
  onClickViewAll: () => void;
}

const ApplyCouponCard: React.FC<Props> = ({
  selectedColor,
  code,
  description,
  discountAmount,
  currencySymbol,
  isCodeApplied,
  onClickApply,
  onClickRemove,
  onClickViewAll,
}) => {
  return (
    <View style={styles.container}>
      {/* Top Row */}
      <View style={styles.row}>
        {/* Offer Icon */}
        <View style={styles.iconWrapper}>
          <Image
            source={require('../../assets/images/ic_offer_tag.png')}
            style={[
              styles.icon,{
                transform: [
                  {
                    rotate: '180deg',
                  },
                ],
              }
            ]}
            resizeMode="contain"
          />
        </View>

        {/* Text Section */}
        <View style={styles.textContainer}>
          <Text style={styles.codeText}>
            {isCodeApplied ? `${code} Applied!` : code}
          </Text>

          {isCodeApplied ? (
            <Text style={styles.savedText}>
              Yay! You saved{' '}
              <Text style={styles.currency}>
                {currencySymbol}
              </Text>
              {discountAmount} on this order
            </Text>
          ) : (
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.description}
            >
              {description}
            </Text>
          )}
        </View>

        {/* Apply / Remove */}
        <TouchableOpacity
          onPress={() =>
            isCodeApplied
              ? onClickRemove()
              : onClickApply(code)
          }
        >
          <Text
            style={[
              styles.actionText,
              {
                color: isCodeApplied
                  ? '#E84142'
                  : selectedColor,
              },
            ]}
          >
            {isCodeApplied ? 'Remove' : 'Apply'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* View All */}
      <TouchableOpacity onPress={onClickViewAll}>
        <Text
          style={[
            styles.viewAll,
            { color: selectedColor },
          ]}
        >
          View All &gt;
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ApplyCouponCard;

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#FFF',
      borderRadius: 10,
      overflow: 'hidden',
    },
  
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
  
    iconWrapper: {
      borderWidth: 1,
      borderColor: '#E6E6E6',
      borderRadius: 6,
      padding: 6,
    },
  
    icon: {
      width: 24,
      height: 24,
    },
  
    textContainer: {
      flex: 1,
      marginLeft: 6,
      marginRight: 18,
    },
  
    codeText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#1C1D20',
    },
  
    description: {
      fontSize: 12,
      color: '#1C1D20',
      marginTop: 2,
    },
  
    savedText: {
      fontSize: 12,
      color: '#019939',
      marginTop: 2,
    },
  
    currency: {
      fontWeight: '600',
    },
  
    actionText: {
      fontSize: 14,
      fontWeight: '600',
    },
  
    divider: {
      height: 1,
      backgroundColor: '#E6E6E6',
    },
  
    viewAll: {
      textAlign: 'center',
      paddingVertical: 10,
      fontSize: 14,
      fontWeight: '600',
    },
  });