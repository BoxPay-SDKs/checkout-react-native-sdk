import { useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import OfferCard from '../components/offerCard';
import { TextInput } from 'react-native-paper';
import type { GetInstantOffersResponse } from '../interface';
import type { CheckoutStackParamList } from '../navigation';
import type { RouteProp, NavigationProp } from '@react-navigation/native';
import Header from '../components/header';
import styles from '../styles/screens/instantOfferScreenStyles';

export interface InstantOfferProps {
  couponList: GetInstantOffersResponse[];
  selectedCouponCode: string;
  selectedColor: string;
  onClickCoupon: (code: string) => void;
  onClickRemoveCoupon: () => void;
}

type InstantOfferNavigationProp = NavigationProp<CheckoutStackParamList, 'InstantOfferScreen'>;

type InstantOfferRouteProp = RouteProp<CheckoutStackParamList, 'InstantOfferScreen'>;

interface Props {
  route: InstantOfferRouteProp;
  navigation: InstantOfferNavigationProp;
}


const InstantOfferScreen = ({ route, navigation } : Props) => {

  const {
    couponList,
    selectedCouponCode,
    selectedColor,
    onClickCoupon,
    onClickRemoveCoupon
  } = route.params as InstantOfferProps || {}; 
  const [searchTextFocused, setSearchTextFocused] = useState(false);


  const [searchText, setSearchText] = useState('');
  

  const sortedCoupons = useMemo(() => {
    return [...couponList].sort(
      c => (c.code === selectedCouponCode ? -1 : 1),
    );
  }, [couponList, selectedCouponCode]);

  const onProceedBack = () => {
    navigation.goBack()
    return true;
  };

  const handleSearchTextChange = (text: string) => {
    setSearchText(text);
  };

  return (
    <View style={styles.screenView}>

          <Header
            onBackPress={onProceedBack}
            showDesc={true}
            showSecure={true}
            text="Pay via Card"
          />
          <View
            style={styles.divider}
          />
      {/* Search Field */}
      <View style={{ backgroundColor: 'white', paddingBottom: 20 }}>
              <TextInput
                mode="outlined"
                label={
                  <Text
                    style={[styles.searchTextInputLabel,{
                      color: searchTextFocused
                        ? '#2D2B32'
                        : searchText != '' && searchText != null
                          ? '#2D2B32'
                          : '#ADACB0',
                    }]}
                  >
                    Enter Coupon Code
                  </Text>
                }
                value={searchText}
                onChangeText={(it) => {
                  handleSearchTextChange(it);
                }}
                theme={{
                  colors: {
                    primary: '#2D2B32',
                    outline: '#E6E6E6',
                  },
                }}
                style={styles.searchTextInput}
                left={
                  <TextInput.Icon
                    icon={() => (
                      <Image
                        source={require('../../assets/images/ic_search.png')}
                        style={{ width: 20, height: 20 }}
                      />
                    )}
                  />
                }
                outlineStyle={{
                  borderRadius: 6,
                  borderWidth: 1,
                }}
                onFocus={() => setSearchTextFocused(true)}
                onBlur={() => setSearchTextFocused(false)}
              />

        <TouchableOpacity
          onPress={() => onClickCoupon(searchText)}
        >
          <Text
            style={[
              styles.applyText,
              {
                color:
                  searchText.length > 0
                    ? selectedColor
                    : '#7F7D83',
              },
            ]}
          >
            APPLY
          </Text>
        </TouchableOpacity>
      </View>

      {/* Coupon List */}
      <FlatList
        data={sortedCoupons}
        keyExtractor={(item, index) =>
          item.code ?? index.toString()
        }
        renderItem={({ item }) => (
          <OfferCard
            offerCode={item.code ?? ''}
            description={item.description ?? ''}
            terms={item.terms ?? ''}
            selectedColor={selectedColor}
            selectedCouponCode={selectedCouponCode}
            minimumOrderAmount={
              item.criteria?.minMoney?.currencyCode
                ? `${item.criteria.minMoney.currencyCode} ${item.criteria.minMoney.amount}`
                : '0'
            }
            expiryDate={item.criteria?.endDate ?? ''}
            applicable={
              item.criteria?.applicableTo?.paymentMethods?.[0]
                ?.type ?? ''
            }
            onPress={() =>
              item.code === selectedCouponCode
                ? onClickRemoveCoupon()
                : onClickCoupon(item.code ?? '')
            }
          />
        )}
      />
    </View>
  );
};

export default InstantOfferScreen;