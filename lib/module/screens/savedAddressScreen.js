"use strict";

import { View, Text, BackHandler, ScrollView, Image, Pressable } from 'react-native';
import styles from "../styles/screens/savedAddressScreenStyles.js";
import { useEffect, useState } from 'react';
import ShimmerView from "../components/shimmerView.js";
import LottieView from 'lottie-react-native';
import Header from "../components/header.js";
import { APIStatus } from "../interface.js";
import fetchSavedAddress from "../postRequest/fetchSavedAddress.js";
import Toast from 'react-native-toast-message';
import deleteSavedAddress from "../postRequest/deleteSavedAddress.js";
import SavedAddressComponent from "../components/savedAddressCard.js";
import { checkoutDetailsHandler } from "../sharedContext/checkoutDetailsHandler.js";
import SavedAddressBottomSheet from "../components/savedAddressBottomSheet.js";
import { setUserDataHandler, userDataHandler } from "../sharedContext/userdataHandler.js";
import { extractNames, formatAddress, getPhoneNumberCodeAndCountryName } from "../utility.js";
import DeleteAddressModal from "../components/deleteAddressModal.js";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
const SavedAddressScreen = ({
  navigation
}) => {
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isEditClicked, setIsEditClicked] = useState(false);
  const [savedAddressList, setSavedAddresList] = useState([]);
  const {
    checkoutDetails
  } = checkoutDetailsHandler;
  const [isOptionsClicked, setIsOptionsClicked] = useState(false);
  const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState();
  const [updateAddress, setUpdateAddress] = useState(false);
  const icons = {
    home: require('../../assets/images/ic_home.png'),
    work: require('../../assets/images/ic_work.png'),
    other: require('../../assets/images/ic_other.png')
  };
  const onProceedBack = () => {
    if (!loading) {
      navigation.goBack();
      return true;
    }
    return false;
  };
  useEffect(() => {
    const fetchAddress = async () => {
      const apiResponse = await fetchSavedAddress();
      switch (apiResponse.apiStatus) {
        case APIStatus.Success:
          {
            setSavedAddresList(apiResponse.data);
            setIsFirstLoad(false);
            break;
          }
        case APIStatus.Failed:
          {
            Toast.show({
              type: 'error',
              text1: 'Oops!',
              text2: 'Something went wrong. Please try again.'
            });
            setIsFirstLoad(false);
            break;
          }
        default:
          {
            break;
          }
      }
    };
    fetchAddress();
  }, []);
  const onClickDeleteAddress = async selectedAddressRef => {
    const response = await deleteSavedAddress(selectedAddressRef);
    switch (response.apiStatus) {
      case APIStatus.Success:
        {
          setSavedAddresList(prevList => prevList.filter(address => address.addressRef !== selectedAddressRef));
          setLoading(false);
          break;
        }
      case APIStatus.Failed:
        {
          Toast.show({
            type: 'error',
            text1: 'Oops!',
            text2: 'Something went wrong. Please try again.'
          });
          setLoading(false);
          break;
        }
      default:
        {
          break;
        }
    }
  };
  useEffect(() => {
    const backAction = () => {
      if (loading) {
        return true;
      }
      return onProceedBack();
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [navigation]);
  useEffect(() => {
    if (updateAddress || isEditClicked) {
      setIsEditClicked(false);
      const {
        firstName,
        lastName
      } = extractNames(selectedAddress?.name ?? "");
      const selectedCountry = getPhoneNumberCodeAndCountryName(selectedAddress?.countryCode ?? "");
      setUserDataHandler({
        userData: {
          email: selectedAddress?.email ?? "",
          firstName: firstName,
          lastName: lastName,
          completePhoneNumber: selectedAddress?.phoneNumber ?? "",
          phoneCode: selectedCountry.isdCode ?? "",
          uniqueId: userDataHandler.userData.uniqueId,
          dob: userDataHandler.userData.dob,
          pan: userDataHandler.userData.pan,
          address1: selectedAddress?.address1 ?? "",
          address2: selectedAddress?.address2 ?? "",
          city: selectedAddress?.city ?? "",
          state: selectedAddress?.state ?? "",
          pincode: selectedAddress?.postalCode ?? "",
          countryCode: selectedAddress?.countryCode ?? "",
          countryName: selectedCountry.fullName ?? "",
          labelType: selectedAddress?.labelType ?? "",
          labelName: selectedAddress?.labelName ?? ""
        }
      });
      if (isEditClicked) {
        navigation.navigate("AddressScreen", {
          isNewAddress: false
        });
      } else {
        navigation.goBack();
      }
    }
  }, [updateAddress, isEditClicked]);
  return /*#__PURE__*/_jsxs(View, {
    style: styles.screenView,
    children: [isFirstLoad ? /*#__PURE__*/_jsx(ShimmerView, {}) : loading ? /*#__PURE__*/_jsxs(View, {
      style: styles.loaderView,
      children: [/*#__PURE__*/_jsx(LottieView, {
        source: require('../../assets/animations/boxpayLogo.json'),
        autoPlay: true,
        loop: true,
        style: styles.lottieStyle
      }), /*#__PURE__*/_jsx(Text, {
        children: "Loading..."
      })]
    }) : /*#__PURE__*/_jsxs(View, {
      style: {
        flex: 1,
        backgroundColor: '#F5F6FB'
      },
      children: [/*#__PURE__*/_jsx(Header, {
        onBackPress: onProceedBack,
        showDesc: false,
        showSecure: false,
        text: "Your Addresses"
      }), /*#__PURE__*/_jsx(View, {
        style: styles.divider
      }), /*#__PURE__*/_jsxs(Pressable, {
        style: styles.pressableContainer,
        onPress: () => {
          if (checkoutDetails.isShippingAddressEditable) {
            navigation.navigate("AddressScreen", {
              isNewAddress: true
            });
          }
        },
        children: [/*#__PURE__*/_jsx(Image, {
          source: require('../../assets/images/add_icon.png'),
          style: [styles.imageStyle, {
            tintColor: checkoutDetails.buttonColor
          }]
        }), /*#__PURE__*/_jsx(Text, {
          numberOfLines: 1,
          ellipsizeMode: "tail",
          style: [styles.insideContainerClickableText, {
            color: checkoutDetails.buttonColor,
            paddingTop: 4,
            fontFamily: checkoutDetails.fontFamily.semiBold
          }],
          children: "Add new address"
        }), /*#__PURE__*/_jsx(Image, {
          source: require('../../assets/images/chervon-down.png'),
          style: {
            alignSelf: 'center',
            height: 6,
            width: 14,
            marginTop: 6,
            marginRight: 10,
            marginLeft: 'auto',
            transform: [{
              rotate: '270deg'
            }]
          }
        })]
      }), savedAddressList.length !== 0 && /*#__PURE__*/_jsxs(_Fragment, {
        children: [/*#__PURE__*/_jsx(Text, {
          style: [styles.mainHeadingText, {
            fontFamily: checkoutDetails.fontFamily.semiBold
          }],
          children: "Saved Addresses"
        }), /*#__PURE__*/_jsx(ScrollView, {
          contentContainerStyle: {
            flexGrow: 1
          },
          keyboardShouldPersistTaps: "handled",
          children: /*#__PURE__*/_jsx(SavedAddressComponent, {
            savedAddressList: savedAddressList,
            onClickAddress: address => {
              setSelectedAddress(address);
              setUpdateAddress(true);
            },
            onClickOtherOptions: address => {
              setSelectedAddress(address);
              setIsOptionsClicked(true);
            }
          })
        })]
      })]
    }), /*#__PURE__*/_jsx(SavedAddressBottomSheet, {
      visible: isOptionsClicked,
      onClose: () => setIsOptionsClicked(false),
      onEdit: () => setIsEditClicked(true),
      onSetDefault: () => setUpdateAddress(true),
      onDelete: () => {
        setIsOptionsClicked(false);
        setIsDeleteConfirmationVisible(true);
      },
      label: selectedAddress?.labelName ? selectedAddress?.labelName ?? "" : selectedAddress?.labelType ?? "",
      address: formatAddress({
        address1: selectedAddress?.address1 ?? "",
        address2: selectedAddress?.address2 ?? "",
        city: selectedAddress?.city ?? "",
        state: selectedAddress?.state ?? "",
        postalCode: selectedAddress?.postalCode ?? "",
        countryCode: selectedAddress?.countryCode ?? "",
        labelName: selectedAddress?.labelName ?? "",
        labelType: selectedAddress?.labelType ?? ""
      }),
      icon: icons[selectedAddress?.labelType.toLowerCase()] || icons.other
    }), /*#__PURE__*/_jsx(DeleteAddressModal, {
      visible: isDeleteConfirmationVisible,
      onCancel: () => setIsDeleteConfirmationVisible(false),
      onDelete: () => {
        setIsDeleteConfirmationVisible(false);
        onClickDeleteAddress(selectedAddress?.addressRef ?? "");
      },
      address: formatAddress({
        address1: selectedAddress?.address1 ?? "",
        address2: selectedAddress?.address2 ?? "",
        city: selectedAddress?.city ?? "",
        state: selectedAddress?.state ?? "",
        postalCode: selectedAddress?.postalCode ?? "",
        countryCode: selectedAddress?.countryCode ?? "",
        labelName: selectedAddress?.labelName ?? "",
        labelType: selectedAddress?.labelType ?? ""
      })
    })]
  });
};
export default SavedAddressScreen;
//# sourceMappingURL=savedAddressScreen.js.map