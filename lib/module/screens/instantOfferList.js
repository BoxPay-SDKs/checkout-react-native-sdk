"use strict";

import { useMemo, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import OfferCard from "../components/offerCard.js";
import { TextInput } from 'react-native-paper';
import Header from "../components/header.js";
import styles from "../styles/screens/instantOfferScreenStyles.js";
import { checkoutDetailsHandler } from "../sharedContext/checkoutDetailsHandler.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const InstantOfferScreen = ({
  route,
  navigation
}) => {
  const {
    couponList,
    selectedCouponCode,
    selectedColor,
    onClickCoupon,
    onClickRemoveCoupon
  } = route.params || {};
  const [searchTextFocused, setSearchTextFocused] = useState(false);
  const [searchText, setSearchText] = useState('');
  const {
    checkoutDetails
  } = checkoutDetailsHandler;
  const sortedCoupons = useMemo(() => {
    return [...couponList].sort(c => c.code === selectedCouponCode ? -1 : 1);
  }, [couponList, selectedCouponCode]);
  const onProceedBack = () => {
    navigation.goBack();
    return true;
  };
  const handleSearchTextChange = text => {
    setSearchText(text);
  };
  return /*#__PURE__*/_jsxs(View, {
    style: styles.screenView,
    children: [/*#__PURE__*/_jsx(Header, {
      onBackPress: onProceedBack,
      showDesc: true,
      showSecure: true,
      text: "Pay via Card"
    }), /*#__PURE__*/_jsx(View, {
      style: styles.divider
    }), /*#__PURE__*/_jsxs(View, {
      style: {
        backgroundColor: 'white',
        paddingBottom: 20
      },
      children: [/*#__PURE__*/_jsx(TextInput, {
        mode: "outlined",
        label: /*#__PURE__*/_jsx(Text, {
          style: [styles.searchTextInputLabel, {
            color: searchTextFocused ? '#2D2B32' : searchText != '' && searchText != null ? '#2D2B32' : '#ADACB0',
            fontFamily: checkoutDetails.fontFamily.regular
          }],
          children: "Enter Coupon Code"
        }),
        value: searchText,
        onChangeText: it => {
          handleSearchTextChange(it);
        },
        theme: {
          colors: {
            primary: '#2D2B32',
            outline: '#E6E6E6'
          }
        },
        style: [styles.searchTextInput, {
          fontFamily: checkoutDetails.fontFamily.regular
        }],
        left: /*#__PURE__*/_jsx(TextInput.Icon, {
          icon: () => /*#__PURE__*/_jsx(Image, {
            source: require('../../assets/images/ic_search.png'),
            style: {
              width: 20,
              height: 20
            }
          })
        }),
        outlineStyle: {
          borderRadius: 6,
          borderWidth: 1
        },
        onFocus: () => setSearchTextFocused(true),
        onBlur: () => setSearchTextFocused(false)
      }), /*#__PURE__*/_jsx(TouchableOpacity, {
        onPress: () => onClickCoupon(searchText),
        children: /*#__PURE__*/_jsx(Text, {
          style: [styles.applyText, {
            color: searchText.length > 0 ? selectedColor : '#7F7D83'
          }],
          children: "APPLY"
        })
      })]
    }), /*#__PURE__*/_jsx(FlatList, {
      data: sortedCoupons,
      keyExtractor: (item, index) => item.code ?? index.toString(),
      renderItem: ({
        item
      }) => /*#__PURE__*/_jsx(OfferCard, {
        offerCode: item.code ?? '',
        description: item.description ?? '',
        terms: item.terms ?? '',
        selectedColor: selectedColor,
        selectedCouponCode: selectedCouponCode,
        minimumOrderAmount: item.criteria?.minMoney?.currencyCode ? `${item.criteria.minMoney.currencyCode} ${item.criteria.minMoney.amount}` : '0',
        expiryDate: item.criteria?.endDate ?? '',
        applicable: item.criteria?.applicableTo?.paymentMethods?.[0]?.type ?? '',
        onPress: () => item.code === selectedCouponCode ? onClickRemoveCoupon() : onClickCoupon(item.code ?? '')
      })
    })]
  });
};
export default InstantOfferScreen;
//# sourceMappingURL=instantOfferList.js.map