import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { SvgUri } from 'react-native-svg';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';

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
            style={{ transform: [{ scale: 0.4 }] }}
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
        style={{
          alignSelf: 'center',
          height: 6,
          width: 14,
          marginLeft: 'auto',
          transform: [
            {
              rotate: '270deg',
            },
          ],
        }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  detailsContainer: {
    flex: 1,
    marginStart: 8,
  },
  bankName: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#4F4D55',
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tag: {
    borderColor: '#FFADD2',
    borderRadius: 6,
    backgroundColor: '#FFF0F6',
    borderWidth: 1,
    paddingHorizontal: 4,
    marginRight: 6,
  },
  tagText: {
    fontSize: 10,
    fontFamily: 'Poppins-Medium',
    color: '#EB2F96',
  },
});

export default BankCard;
