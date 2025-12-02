import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from '../styles/components/bankCardStyles';
import ImageLoader from './imageLoader';

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
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <ImageLoader image={iconUrl} errorImage={require('../../assets/images/ic_netbanking_semi_bold.png')}/>
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
