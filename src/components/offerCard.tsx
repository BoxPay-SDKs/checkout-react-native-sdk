import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import RenderHTML from 'react-native-render-html';

interface Props {
  offerCode: string;
  description: string;
  minimumOrderAmount: string;
  expiryDate: string;
  applicable: string;
  terms: string;
  selectedCouponCode: string;
  selectedColor: string;
  onPress: () => void;
}

const OfferCard: React.FC<Props> = ({
  offerCode,
  description,
  minimumOrderAmount,
  expiryDate,
  applicable,
  terms,
  selectedCouponCode,
  selectedColor,
  onPress,
}) => {
  const [showMore, setShowMore] = useState(false);

  const isSelected = offerCode === selectedCouponCode;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={[
        styles.card,
        isSelected && {
          borderColor: selectedColor,
          borderWidth: 2,
        },
      ]}
    >
      <View style={styles.row}>
        {/* Left Ticket Strip */}
        <View
          style={[
            styles.sideStrip,
            { backgroundColor: selectedColor },
          ]}
        >
          <Text style={styles.verticalText}>
            {description}
          </Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.topRow}>
            <Text style={styles.code}>{offerCode}</Text>

            <Text
              style={{
                color: isSelected
                  ? '#E84142'
                  : selectedColor,
                fontWeight: 'bold',
              }}
            >
              {isSelected ? 'REMOVE' : 'APPLY'}
            </Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.info}>
            Minimum order amount {minimumOrderAmount}
          </Text>

          {expiryDate !== '' && (
            <Text style={styles.info}>
              Offer valid till {expiryDate}
            </Text>
          )}

          <Text style={styles.info}>
            {applicable
              ? `Applicable on ${applicable}`
              : 'Applicable on all transactions'}
          </Text>

          <TouchableOpacity
            onPress={() => setShowMore(!showMore)}
          >
            <Text style={styles.more}>
              {showMore ? '- LESS' : '+ MORE'}
            </Text>
          </TouchableOpacity>

          {showMore && (
            <RenderHTML
              contentWidth={300}
              source={{ html: terms }}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default OfferCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
  },
  sideStrip: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verticalText: {
    color: '#FFF',
    fontWeight: 'bold',
    transform: [{ rotate: '-90deg' }],
    width: 120,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  code: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#DDD',
    marginVertical: 12,
  },
  info: {
    fontSize: 13,
    color: '#616161',
    marginBottom: 4,
  },
  more: {
    fontWeight: 'bold',
    color: '#616161',
    marginTop: 6,
  },
});