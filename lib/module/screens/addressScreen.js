"use strict";

import { useEffect, useRef, useState } from 'react';
import { BackHandler, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import Header from "../components/header.js";
import { checkoutDetailsHandler } from "../sharedContext/checkoutDetailsHandler.js";
import { setUserDataHandler, userDataHandler } from "../sharedContext/userdataHandler.js";
import styles from "../styles/screens/addressScreenStyles..js";
import { extractNames, getPhoneNumberCodeAndCountryName } from "../utility.js";
import CountryPicker from 'react-native-country-picker-modal';
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
const AddressScreen = ({
  route,
  navigation
}) => {
  const {
    isNewAddress
  } = route.params || {};
  const isNewAddressBool = Array.isArray(isNewAddress) ? isNewAddress[0] : isNewAddress;
  const {
    userData
  } = userDataHandler;
  const {
    checkoutDetails
  } = checkoutDetailsHandler;
  const [selectedCountryCode, setSelectedCountryCode] = useState('IN');
  const [selectedPhoneCode, setSelectedPhoneCode] = useState('');
  const [showCountryPicker, setShowContryPicker] = useState(false);
  const isShippingEnabled = checkoutDetails.isShippingAddressEnabled;
  const isFullNameEnabled = checkoutDetails.isFullNameEnabled;
  const isPhoneNumberEnabled = checkoutDetails.isPhoneEnabled;
  const isEmailEnabled = checkoutDetails.isEmailEnabled;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [countryTextFieldFocused, setCountryTextFieldFocused] = useState(false);
  const [phoneTextFieldFocused, setPhoneTextFieldFocused] = useState(false);
  const [phoneCodeTextFieldFocused, setPhoneCodeTextFieldFocused] = useState(false);
  const [nameTextFieldFocused, setNameTextFieldFocused] = useState(false);
  const [mainAddressTextFieldFocused, setMainAddressTextFieldFocused] = useState(false);
  const [emailTextFieldFocused, setEmailTextFieldFocused] = useState(false);
  const [cityTextFieldFocused, setCityTextFieldFocused] = useState(false);
  const [stateTextFieldFocused, setStateTextFieldFocused] = useState(false);
  const [pincodeTextFieldFocused, setPincodeTextFieldFocused] = useState(false);
  const [secondaryAddressTextFieldFocused, setSecondaryAddressTextFieldFocused] = useState(false);
  const [countryTextField, setCountryTextField] = useState('');
  const [fullNameTextField, setFullNameTextField] = useState('');
  const [phoneNumberTextField, setPhoneNumberTextField] = useState('');
  const [emailTextField, setEmailTextField] = useState('');
  const [pinTextField, setPinTextField] = useState('');
  const [cityTextField, setCityTextField] = useState('');
  const [stateTextField, setStateTextField] = useState('');
  const [mainAddressTextField, setMainAddressTextField] = useState('');
  const [secondaryAddressTextField, setSecondaryAddressTextField] = useState('');
  const [fullNameErrorText, setFullNameErrorText] = useState('');
  const [mobileNumberErrorText, setMobileNumberErrorText] = useState('');
  const [emailIdErrorText, setEmailIdErrorText] = useState('');
  const [pinCodeErrorText, setPinCodeErrorText] = useState('');
  const [cityErrorText, setCityErrorText] = useState('');
  const [stateErrorText, setStateErrorText] = useState('');
  const [mainAddressErrorText, setMainAddressErrorText] = useState('');
  const [isFullNameValid, setIsFullNameValid] = useState(null);
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(null);
  const [isEmailValid, setIsEmailValid] = useState(null);
  const [isPinValid, setIsPinValid] = useState(null);
  const [isCityValid, setIsCityValid] = useState(null);
  const [isStateValid, setIsStateValid] = useState(null);
  const [isMainAddressValid, setIsMainAddressValid] = useState(null);
  const phoneNumberLengthList = useRef([10]);
  const onProceedBack = () => {
    navigation.goBack();
    return true;
  };
  useEffect(() => {
    const backAction = () => {
      return onProceedBack();
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [navigation]);
  useEffect(() => {
    if (!isNewAddress) {
      setFullNameTextField(`${userData.firstName} ${userData.lastName}`);
      setEmailTextField(userData.email ?? "");
      setMainAddressTextField(userData.address1 ?? "");
      setSecondaryAddressTextField(userData.address2 ?? "");
      setCityTextField(userData.city ?? "");
      setStateTextField(userData.state ?? "");
      setSelectedCountryCode(userData.countryCode ?? 'IN');
      setCountryTextField(userData.countryName ?? "");
      setPinTextField(userData.pincode ?? "");
      const selectedCountry = getPhoneNumberCodeAndCountryName(userData.countryCode ?? "IN");
      setSelectedPhoneCode(selectedCountry.isdCode ?? "+91");
      setCountryTextField(selectedCountry.fullName ?? "");
      if (userData.completePhoneNumber?.startsWith(selectedCountry.isdCode)) {
        // 2. Remove the ISD code from the beginning
        const rawNumber = userData.completePhoneNumber.slice(selectedCountry.isdCode.length);
        setPhoneNumberTextField(rawNumber);
        phoneNumberLengthList.current = selectedCountry.phoneNumberLength;
      }
    }
  }, [userData]);
  const onChangeFullName = updatedText => {
    setFullNameTextField(updatedText);
    const trimmedText = updatedText.trim();
    if (trimmedText === '') {
      setFullNameErrorText('Required');
      setIsFullNameValid(false);
    } else {
      setFullNameErrorText('');
      setIsFullNameValid(true);
    }
  };
  const onChangePhoneNumber = updatedText => {
    setPhoneNumberTextField(updatedText);
    if (updatedText.length == 0) {
      setMobileNumberErrorText("Required");
      setIsPhoneNumberValid(false);
    } else if (!phoneNumberLengthList.current.includes(updatedText.length)) {
      setMobileNumberErrorText(`Mobile number must be ${phoneNumberLengthList.current} digits long`);
      setIsPhoneNumberValid(false);
    } else {
      setMobileNumberErrorText("");
      setIsPhoneNumberValid(true);
    }
  };
  const handleCountrySelect = country => {
    console.log(country);
    const selectedCountry = getPhoneNumberCodeAndCountryName(country?.cca2 ?? "IN");
    setSelectedPhoneCode(selectedCountry.isdCode ?? "+91");
    setCountryTextField(selectedCountry.fullName ?? "");
    phoneNumberLengthList.current = selectedCountry.phoneNumberLength;
    setShowContryPicker(false);
  };
  const onChangeEmailId = updatedText => {
    setEmailTextField(updatedText);
    const trimmedText = updatedText.trim();
    const emailRegexPattern = new RegExp(emailRegex); // emailRegex should be a string pattern

    if (trimmedText === '') {
      setEmailIdErrorText('Required');
      setIsEmailValid(false);
    } else if (!emailRegexPattern.test(trimmedText)) {
      setEmailIdErrorText('Invalid Email');
      setIsEmailValid(false);
    } else {
      setEmailIdErrorText('');
      setIsEmailValid(true);
    }
  };
  const onChangePostalCode = updatedText => {
    setPinTextField(updatedText);
    const trimmedText = updatedText.trim();
    if (trimmedText === '') {
      setPinCodeErrorText('Required');
      setIsPinValid(false);
    } else if (selectedPhoneCode === '+91' && trimmedText.length < 6) {
      setPinCodeErrorText('Zip/Postal code must be 6 digits');
      setIsPinValid(false);
    } else {
      setPinCodeErrorText('');
      setIsPinValid(true);
    }
  };
  const onChangeCity = updatedText => {
    setCityTextField(updatedText);
    const trimmedText = updatedText.trim();
    if (trimmedText === '') {
      setCityErrorText('Required');
      setIsCityValid(false);
    } else {
      setCityErrorText('');
      setIsCityValid(true);
    }
  };
  const onChangeState = updatedText => {
    setStateTextField(updatedText);
    const trimmedText = updatedText.trim();
    if (trimmedText === '') {
      setStateErrorText('Required');
      setIsStateValid(false);
    } else {
      setStateErrorText('');
      setIsStateValid(true);
    }
  };
  const onChangeMainAddress = updatedText => {
    setMainAddressTextField(updatedText);
    const trimmedText = updatedText.trim();
    if (trimmedText === '') {
      setMainAddressErrorText('Required');
      setIsMainAddressValid(false);
    } else {
      setMainAddressErrorText('');
      setIsMainAddressValid(true);
    }
  };
  const isAllDetailsValid = () => {
    let isAllValid = true;

    // Helper function to safely trim nullable strings
    const safeTrim = text => text ? text.trim() : '';

    // Full Name
    const fullNameTrimmed = safeTrim(fullNameTextField);
    const fullNameValid = fullNameTrimmed !== '' && isFullNameEnabled;
    if (!fullNameValid) {
      onChangeFullName(fullNameTextField);
      isAllValid = false;
    }

    // Email
    const emailTrimmed = safeTrim(emailTextField); // Replace with your emailRegex if defined
    const emailValid = emailTrimmed !== '' && emailRegex.test(emailTrimmed) && isEmailEnabled;
    if (!emailValid) {
      onChangeEmailId(emailTextField);
      isAllValid = false;
    }

    // Phone Number
    const phoneNumberTrimmed = safeTrim(phoneNumberTextField);
    const phoneNumberValid = phoneNumberLengthList.current.includes(phoneNumberTrimmed.length) && isPhoneNumberEnabled;
    if (!phoneNumberValid) {
      onChangePhoneNumber(phoneNumberTextField);
      isAllValid = false;
    }

    // Shipping-specific fields
    if (isShippingEnabled) {
      // Postal Code
      const postalTrimmed = safeTrim(pinTextField);
      let postalValid = false;
      if (selectedPhoneCode === '+91') {
        postalValid = postalTrimmed !== '' && postalTrimmed.length >= 6;
      } else {
        postalValid = postalTrimmed !== '';
      }
      if (!postalValid) {
        onChangePostalCode(pinTextField);
        isAllValid = false;
      }

      // City
      const cityTrimmed = safeTrim(cityTextField);
      const cityValid = cityTrimmed !== '';
      if (!cityValid) {
        onChangeCity(cityTextField);
        isAllValid = false;
      }

      // State
      const stateTrimmed = safeTrim(stateTextField);
      const stateValid = stateTrimmed !== '';
      if (!stateValid) {
        onChangeState(stateTextField);
        isAllValid = false;
      }

      // Main Address
      const addressTrimmed = safeTrim(mainAddressTextField);
      const addressValid = addressTrimmed !== '';
      if (!addressValid) {
        onChangeMainAddress(mainAddressTextField);
        isAllValid = false;
      }
    }
    return isAllValid;
  };
  return /*#__PURE__*/_jsxs(View, {
    style: styles.screenView,
    children: [/*#__PURE__*/_jsx(Header, {
      onBackPress: onProceedBack,
      showDesc: false,
      showSecure: false,
      text: isShippingEnabled && isNewAddressBool ? 'Add Address' : isShippingEnabled && !isNewAddressBool ? 'Edit Address' : !isShippingEnabled && isNewAddressBool ? 'Edit Personal Details' : 'Add Personal Details'
    }), /*#__PURE__*/_jsx(View, {
      style: styles.divider
    }), /*#__PURE__*/_jsx(ScrollView, {
      children: /*#__PURE__*/_jsxs(View, {
        children: [isShippingEnabled && /*#__PURE__*/_jsx(TextInput, {
          mode: "outlined",
          editable: true // allow focus
          ,
          showSoftInputOnFocus: false,
          label: /*#__PURE__*/_jsx(Text, {
            style: [styles.textFieldLable, {
              color: countryTextFieldFocused ? '#2D2B32' : '#ADACB0',
              fontFamily: checkoutDetails.fontFamily.regular
            }],
            children: "Country*"
          }),
          value: countryTextField || '',
          onChangeText: _ => {},
          theme: {
            colors: {
              primary: '#2D2B32',
              outline: '#E6E6E6'
            }
          },
          style: [styles.textInput, {
            marginTop: 28,
            marginHorizontal: 16,
            fontFamily: checkoutDetails.fontFamily.regular
          }],
          outlineStyle: {
            borderRadius: 8,
            borderWidth: 1.5
          },
          right: /*#__PURE__*/_jsx(TextInput.Icon, {
            icon: () => /*#__PURE__*/_jsx(Image, {
              source: require('../../assets/images/chervon-down.png'),
              style: styles.imageStyle
            })
          }),
          onFocus: () => {
            setShowContryPicker(true);
            setCountryTextFieldFocused(true);
          },
          onBlur: () => {
            setShowContryPicker(false);
            setCountryTextFieldFocused(false);
          }
        }), (isShippingEnabled || isFullNameEnabled) && /*#__PURE__*/_jsxs(_Fragment, {
          children: [/*#__PURE__*/_jsx(TextInput, {
            mode: "outlined",
            label: /*#__PURE__*/_jsx(Text, {
              style: [styles.textFieldLable, {
                color: nameTextFieldFocused && fullNameTextField != "" ? '#2D2B32' : '#ADACB0',
                fontFamily: checkoutDetails.fontFamily.regular
              }],
              children: "Full Name*"
            }),
            value: fullNameTextField || '',
            onChangeText: it => {
              onChangeFullName(it);
            },
            theme: {
              colors: {
                primary: '#2D2B32',
                outline: '#E6E6E6'
              }
            },
            style: [styles.textInput, {
              marginTop: 20,
              marginHorizontal: 16,
              fontFamily: checkoutDetails.fontFamily.regular
            }],
            error: isFullNameValid == false,
            outlineStyle: {
              borderRadius: 8,
              // Add this
              borderWidth: 1.5
            },
            onFocus: () => {
              setNameTextFieldFocused(true);
            },
            onBlur: () => {
              setNameTextFieldFocused(false);
            }
          }), isFullNameValid == false && /*#__PURE__*/_jsx(Text, {
            style: [styles.errorText, {
              fontFamily: checkoutDetails.fontFamily.regular
            }],
            children: fullNameErrorText
          })]
        }), (isShippingEnabled || isPhoneNumberEnabled) && /*#__PURE__*/_jsxs(_Fragment, {
          children: [/*#__PURE__*/_jsxs(View, {
            style: [styles.container, {
              alignItems: 'center'
            }],
            children: [/*#__PURE__*/_jsx(TextInput, {
              mode: "outlined",
              editable: true // allow focus
              ,
              showSoftInputOnFocus: false,
              label: /*#__PURE__*/_jsx(Text, {
                style: [styles.textFieldLable, {
                  color: phoneCodeTextFieldFocused && selectedPhoneCode != "" ? '#2D2B32' : '#ADACB0',
                  fontFamily: checkoutDetails.fontFamily.regular
                }],
                children: "Code*"
              }),
              value: selectedPhoneCode || '',
              onChangeText: _ => {},
              theme: {
                colors: {
                  primary: '#2D2B32',
                  outline: '#E6E6E6'
                }
              },
              style: [styles.textInput, {
                width: 100,
                marginEnd: 8,
                fontFamily: checkoutDetails.fontFamily.regular
              }],
              outlineStyle: {
                borderRadius: 8,
                borderWidth: 1.5
              },
              right: /*#__PURE__*/_jsx(TextInput.Icon, {
                icon: () => /*#__PURE__*/_jsx(Image, {
                  source: require('../../assets/images/chervon-down.png'),
                  style: styles.imageStyle
                })
              }),
              onFocus: () => {
                setShowContryPicker(true);
                setPhoneCodeTextFieldFocused(true);
              },
              onBlur: () => {
                setShowContryPicker(false);
                setPhoneCodeTextFieldFocused(false);
              }
            }), /*#__PURE__*/_jsx(TextInput, {
              mode: "outlined",
              label: /*#__PURE__*/_jsx(Text, {
                style: [styles.textFieldLable, {
                  color: phoneTextFieldFocused && phoneNumberTextField != "" ? '#2D2B32' : '#ADACB0',
                  fontFamily: checkoutDetails.fontFamily.regular
                }],
                children: "Mobile Number*"
              }),
              value: phoneNumberTextField || '',
              onChangeText: it => {
                onChangePhoneNumber(it);
              },
              theme: {
                colors: {
                  primary: '#2D2B32',
                  outline: '#E6E6E6'
                }
              },
              style: [styles.textInput, {
                flex: 1,
                fontFamily: checkoutDetails.fontFamily.regular
              }],
              error: isPhoneNumberValid == false,
              outlineStyle: {
                borderRadius: 8,
                borderWidth: 1.5
              },
              keyboardType: "number-pad",
              onFocus: () => setPhoneTextFieldFocused(true),
              onBlur: () => {
                setPhoneTextFieldFocused(false);
              }
            })]
          }), isPhoneNumberValid == false && /*#__PURE__*/_jsx(Text, {
            style: [styles.errorText, {
              fontFamily: checkoutDetails.fontFamily.regular
            }],
            children: mobileNumberErrorText
          })]
        }), (isShippingEnabled || isEmailEnabled) && /*#__PURE__*/_jsxs(_Fragment, {
          children: [/*#__PURE__*/_jsx(TextInput, {
            mode: "outlined",
            label: /*#__PURE__*/_jsx(Text, {
              style: [styles.textFieldLable, {
                color: emailTextFieldFocused && emailTextField != "" ? '#2D2B32' : '#ADACB0',
                fontFamily: checkoutDetails.fontFamily.regular
              }],
              children: "Email ID*"
            }),
            value: emailTextField || '',
            onChangeText: it => {
              onChangeEmailId(it);
            },
            theme: {
              colors: {
                primary: '#2D2B32',
                outline: '#E6E6E6'
              }
            },
            style: [styles.textInput, {
              marginTop: 20,
              marginHorizontal: 16,
              fontFamily: checkoutDetails.fontFamily.regular
            }],
            error: isEmailValid == false,
            outlineStyle: {
              borderRadius: 8,
              // Add this
              borderWidth: 1.5
            },
            onFocus: () => {
              setEmailTextFieldFocused(true);
            },
            onBlur: () => {
              setEmailTextFieldFocused(false);
            }
          }), isEmailValid == false && /*#__PURE__*/_jsx(Text, {
            style: [styles.errorText, {
              fontFamily: checkoutDetails.fontFamily.regular
            }],
            children: emailIdErrorText
          })]
        }), isShippingEnabled && /*#__PURE__*/_jsxs(_Fragment, {
          children: [/*#__PURE__*/_jsxs(View, {
            style: [styles.container, {
              alignItems: 'flex-start'
            }],
            children: [/*#__PURE__*/_jsxs(View, {
              style: {
                flex: 1
              },
              children: [/*#__PURE__*/_jsx(TextInput, {
                mode: "outlined",
                label: /*#__PURE__*/_jsx(Text, {
                  style: [styles.textFieldLable, {
                    color: pincodeTextFieldFocused && pinTextField != "" ? '#2D2B32' : '#ADACB0',
                    fontFamily: checkoutDetails.fontFamily.regular
                  }],
                  children: "ZIP/Postal code*"
                }),
                value: pinTextField || '',
                onChangeText: it => {
                  onChangePostalCode(it);
                },
                theme: {
                  colors: {
                    primary: '#2D2B32',
                    outline: '#E6E6E6'
                  }
                },
                style: [styles.textInput, {
                  fontFamily: checkoutDetails.fontFamily.regular
                }],
                error: isPinValid == false,
                outlineStyle: {
                  borderRadius: 8,
                  // Add this
                  borderWidth: 1.5
                },
                keyboardType: "number-pad",
                onFocus: () => {
                  setPincodeTextFieldFocused(true);
                },
                onBlur: () => {
                  setPincodeTextFieldFocused(false);
                }
              }), isPinValid == false && /*#__PURE__*/_jsx(Text, {
                style: [styles.errorText, {
                  fontFamily: checkoutDetails.fontFamily.regular
                }],
                children: pinCodeErrorText
              })]
            }), /*#__PURE__*/_jsxs(View, {
              style: {
                flex: 1
              },
              children: [/*#__PURE__*/_jsx(TextInput, {
                mode: "outlined",
                label: /*#__PURE__*/_jsx(Text, {
                  style: [styles.textFieldLable, {
                    color: cityTextFieldFocused ? '#2D2B32' : '#ADACB0',
                    fontFamily: checkoutDetails.fontFamily.regular
                  }],
                  children: "City*"
                }),
                value: cityTextField || '',
                onChangeText: it => {
                  onChangeCity(it);
                },
                theme: {
                  colors: {
                    primary: '#2D2B32',
                    outline: '#E6E6E6'
                  }
                },
                style: [styles.textInput, {
                  marginStart: 8,
                  fontFamily: checkoutDetails.fontFamily.regular
                }],
                error: isCityValid == false,
                outlineStyle: {
                  borderRadius: 8,
                  // Add this
                  borderWidth: 1.5
                },
                onFocus: () => {
                  setCityTextFieldFocused(true);
                },
                onBlur: () => {
                  setCityTextFieldFocused(false);
                }
              }), isCityValid == false && /*#__PURE__*/_jsx(Text, {
                style: [styles.errorText, {
                  fontFamily: checkoutDetails.fontFamily.regular
                }],
                children: cityErrorText
              })]
            })]
          }), /*#__PURE__*/_jsx(TextInput, {
            mode: "outlined",
            label: /*#__PURE__*/_jsx(Text, {
              style: [styles.textFieldLable, {
                color: stateTextFieldFocused ? '#2D2B32' : '#ADACB0',
                fontFamily: checkoutDetails.fontFamily.regular
              }],
              children: "State*"
            }),
            value: stateTextField || '',
            onChangeText: it => {
              onChangeState(it);
            },
            theme: {
              colors: {
                primary: '#2D2B32',
                outline: '#E6E6E6'
              }
            },
            style: [styles.textInput, {
              marginTop: 20,
              marginHorizontal: 16,
              fontFamily: checkoutDetails.fontFamily.regular
            }],
            error: isStateValid == false,
            outlineStyle: {
              borderRadius: 8,
              // Add this
              borderWidth: 1.5
            },
            onFocus: () => {
              setStateTextFieldFocused(true);
            },
            onBlur: () => {
              setStateTextFieldFocused(false);
            }
          }), isStateValid == false && /*#__PURE__*/_jsx(Text, {
            style: [styles.errorText, {
              fontFamily: checkoutDetails.fontFamily.regular
            }],
            children: stateErrorText
          }), /*#__PURE__*/_jsx(TextInput, {
            mode: "outlined",
            label: /*#__PURE__*/_jsx(Text, {
              style: [styles.textFieldLable, {
                color: mainAddressTextFieldFocused ? '#2D2B32' : '#ADACB0',
                fontFamily: checkoutDetails.fontFamily.regular
              }],
              children: "House number, Apartment*"
            }),
            value: mainAddressTextField || '',
            onChangeText: it => {
              onChangeMainAddress(it);
            },
            theme: {
              colors: {
                primary: '#2D2B32',
                outline: '#E6E6E6'
              }
            },
            style: [styles.textInput, {
              marginTop: 20,
              marginHorizontal: 16,
              fontFamily: checkoutDetails.fontFamily.regular
            }],
            error: isMainAddressValid == false,
            outlineStyle: {
              borderRadius: 8,
              // Add this
              borderWidth: 1.5
            },
            onFocus: () => {
              setMainAddressTextFieldFocused(true);
            },
            onBlur: () => {
              setMainAddressTextFieldFocused(false);
            }
          }), isMainAddressValid == false && /*#__PURE__*/_jsx(Text, {
            style: [styles.errorText, {
              fontFamily: checkoutDetails.fontFamily.regular
            }],
            children: mainAddressErrorText
          }), /*#__PURE__*/_jsx(TextInput, {
            mode: "outlined",
            label: /*#__PURE__*/_jsx(Text, {
              style: [styles.textFieldLable, {
                color: secondaryAddressTextFieldFocused ? '#2D2B32' : '#ADACB0',
                fontFamily: checkoutDetails.fontFamily.regular
              }],
              children: "Area,Colony,Street, Sector"
            }),
            value: secondaryAddressTextField || '',
            onChangeText: it => {
              setSecondaryAddressTextField(it);
            },
            theme: {
              colors: {
                primary: '#2D2B32',
                outline: '#E6E6E6'
              }
            },
            style: [styles.textInput, {
              marginTop: 20,
              marginHorizontal: 16,
              fontFamily: checkoutDetails.fontFamily.regular
            }],
            outlineStyle: {
              borderRadius: 8,
              // Add this
              borderWidth: 1.5
            },
            onFocus: () => {
              setSecondaryAddressTextFieldFocused(true);
            },
            onBlur: () => {
              setSecondaryAddressTextFieldFocused(false);
            }
          })]
        })]
      })
    }), /*#__PURE__*/_jsx(CountryPicker, {
      visible: showCountryPicker,
      withFilter: true,
      withCallingCode: true,
      withAlphaFilter: true,
      withFlag: true,
      withEmoji: true,
      countryCode: selectedCountryCode,
      onSelect: handleCountrySelect
    }), /*#__PURE__*/_jsx(View, {
      style: styles.bottomContainer,
      children: /*#__PURE__*/_jsx(Pressable, {
        style: [styles.buttonContainer, {
          backgroundColor: checkoutDetails.buttonColor,
          borderRadius: checkoutDetails.ctaBorderRadius
        }],
        onPress: () => {
          // Todo add functon call
          if (isAllDetailsValid()) {
            const {
              firstName,
              lastName
            } = extractNames(fullNameTextField);
            setUserDataHandler({
              userData: {
                email: emailTextField,
                firstName: firstName,
                lastName: lastName,
                completePhoneNumber: `${selectedPhoneCode}${phoneNumberTextField}`,
                phoneCode: selectedPhoneCode,
                uniqueId: userData.uniqueId,
                dob: userData.dob,
                pan: userData.pan,
                address1: mainAddressTextField,
                address2: secondaryAddressTextField,
                city: cityTextField,
                state: stateTextField,
                pincode: pinTextField,
                countryCode: selectedCountryCode,
                countryName: countryTextField,
                labelType: userData.labelType,
                labelName: userData.labelName
              }
            });
            onProceedBack();
          }
        },
        children: /*#__PURE__*/_jsx(Text, {
          style: [styles.buttonText, {
            color: checkoutDetails.buttonTextColor,
            fontFamily: checkoutDetails.fontFamily.semiBold
          }],
          children: isShippingEnabled ? 'Save Address' : 'Save Personal Details'
        })
      })
    })]
  });
};
export default AddressScreen;
//# sourceMappingURL=addressScreen.js.map