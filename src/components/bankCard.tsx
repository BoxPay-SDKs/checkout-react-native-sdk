import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { SvgUri } from 'react-native-svg';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import styles from '../styles/components/bankCardStyles';

interface BankCardProps {
  name: string;
  iconUrl: string;
  hasNoCostEmi: boolean;
  hasLowCostEmi: boolean;
  onPress: () => void;
}

const BankCard: React.FC<BankCardProps> = ({
  name,
  iconUrl,
  hasNoCostEmi,
  hasLowCostEmi,
  onPress,
}) => {
  const [error, setImageError] = useState(false);
  const [load, setLoad] = useState(true);
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {/* Bank Icon */}
      <View
        style={styles.imageContainer}
      >
        {load && !error && (
          <ShimmerPlaceHolder
            visible={false} // Keep shimmer until loading is done
            style={styles.shimmer}
          />
        )}
        {!error ? (
          <SvgUri
            uri={iconUrl}
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
            style={styles.errorImage}
          />
        )}
      </View>

      {/* Bank Name & Offers */}
      <View style={styles.detailsContainer}>
        <Text style={styles.bankName}>{name}</Text>
        <View style={styles.tagsContainer}>
          {hasNoCostEmi && (
            <View style={styles.tag}>
              <Text style={styles.tagText}>NO COST EMI</Text>
            </View>
          )}
          {hasLowCostEmi && (
            <View style={styles.tag}>
              <Text style={styles.tagText}>LOW COST EMI</Text>
            </View>
          )}
        </View>
      </View>

      <Image
        source={require('../../assets/images/chervon-down.png')}
        style={styles.chervonImage}
      />
    </TouchableOpacity>
  );
};

export default BankCard;
