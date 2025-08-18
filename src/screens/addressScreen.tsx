import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  BackHandler,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import countryData from '../../assets/json/countryCodes.json';
import Header from '../components/header';
import { checkoutDetailsHandler } from '../sharedContext/checkoutDetailsHandler';
import {
  setUserDataHandler,
  userDataHandler,
} from '../sharedContext/userdataHandler';

const AddressScreen = () => {
  const { userData } = userDataHandler;
  const { checkoutDetails } = checkoutDetailsHandler;
  const [countryNameDropdownData, setCountryNameDropdownData] = useState<
    { key: string; value: string }[]
  >([]);
  const [
    duplicateCountryNameDropdownData,
    setDuplicateCountryNameDropdownData,
  ] = useState<{ key: string; value: string }[]>([]);
  const [phoneCodeDropDownData, setPhoneCodeDropDownData] = useState<
    { key: string; value: string }[]
  >([]);
  const [duplicatePhoneCodeDropdownData, setDuplicatePhoneCodeDropdownData] =
    useState<{ key: string; value: string }[]>([]);
  const [selectedCountryCode, setSelectedCountryCode] = useState('');
  const selectedPhoneCodeRef = useRef('');
  const [countryNameDropdownDataVisible, setCountryNameDropdownVisible] =
    useState(false);
  const [phoneCodeDropdownDataVisible, setPhoneCodeDropdownDataVisible] =
    useState(false);

  const isShippingEnabled = checkoutDetails.isShippingAddressEnabled;
  const isFullNameEnabled = checkoutDetails.isFullNameEnabled;
  const isPhoneNumberEnabled = checkoutDetails.isPhoneEnabled;
  const isEmailEnabled = checkoutDetails.isEmailEnabled;
  const mobileRegex = /^[0-9]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const [countryTextFieldFocused] = useState(false);
  const [phoneTextFieldFocused, setPhoneTextFieldFocused] = useState(false);
  const [nameTextFieldFocused, setNameTextFieldFocused] = useState(false);
  const [mainAddressTextFieldFocused, setMainAddressTextFieldFocused] =
    useState(false);
  const [emailTextFieldFocused, setEmailTextFieldFocused] = useState(false);
  const [cityTextFieldFocused, setCityTextFieldFocused] = useState(false);
  const [stateTextFieldFocused, setStateTextFieldFocused] = useState(false);
  const [pincodeTextFieldFocused, setPincodeTextFieldFocused] = useState(false);
  const [
    secondaryAddressTextFieldFocused,
    setSecondaryAddressTextFieldFocused,
  ] = useState(false);

  const [countryTextField, setCountryTextField] = useState<string>('');
  const [fullNameTextField, setFullNameTextField] = useState<string>('');
  const [phoneNumberTextField, setPhoneNumberTextField] = useState<string>('');
  const [emailTextField, setEmailTextField] = useState<string>('');
  const [pinTextField, setPinTextField] = useState<string>('');
  const [cityTextField, setCityTextField] = useState<string>('');
  const [stateTextField, setStateTextField] = useState<string>('');
  const [mainAddressTextField, setMainAddressTextField] = useState<string>('');
  const [secondaryAddressTextField, setSecondaryAddressTextField] =
    useState<string>('');

  const [fullNameErrorText, setFullNameErrorText] = useState('');
  const [mobileNumberErrorText, setMobileNumberErrorText] = useState('');
  const [emailIdErrorText, setEmailIdErrorText] = useState('');
  const [pinCodeErrorText, setPinCodeErrorText] = useState('');
  const [cityErrorText, setCityErrorText] = useState('');
  const [stateErrorText, setStateErrorText] = useState('');
  const [mainAddressErrorText, setMainAddressErrorText] = useState('');

  const [isFullNameValid, setIsFullNameValid] = useState(false);
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPinValid, setIsPinValid] = useState(false);
  const [isCityValid, setIsCityValid] = useState(false);
  const [isStateValid, setIsStateValid] = useState(false);
  const [isMainAddressValid, setIsMainAddressValid] = useState(false);

  const [minPhoneNumberLength, setMinPhoneNumberLength] = useState(10);
  const [maxPhoneNumberLength, setMaxPhoneNumberLength] = useState(10);

  const onProceedBack = () => {
    router.back();
    return true;
  };

  useEffect(() => {
    const selectedCountry =
      countryData[selectedCountryCode as keyof typeof countryData];
    if (selectedCountry) {
      setCountryTextField(selectedCountry.fullName);
      selectedPhoneCodeRef.current = selectedCountry.isdCode || '+91';

      if (Array.isArray(selectedCountry.phoneNumberLength)) {
        const lengths = selectedCountry.phoneNumberLength;
        const min = Math.min(...lengths);
        const max = Math.max(...lengths);
        setMinPhoneNumberLength(min);
        setMaxPhoneNumberLength(max);
      } else {
        // Fallback if phoneNumberLength is not an array
        setMinPhoneNumberLength(10);
        setMaxPhoneNumberLength(10);
      }
    }
  }, [selectedCountryCode]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        return onProceedBack(); // Allow back navigation if not loading
      }
    );

    return () => backHandler.remove();
  });

  const handleCountrySelect = (key: string) => {
    const selectedCountry = countryData[key as keyof typeof countryData];
    setCountryTextField(selectedCountry.fullName);
    setSelectedCountryCode(key);
    selectedPhoneCodeRef.current = selectedCountry.isdCode;
  };

  const onChangeFullName = (updatedText: string) => {
    setFullNameTextField(updatedText);
    const trimmedText = updatedText.trim();

    if (trimmedText === '') {
      setFullNameErrorText('Required');
      setIsFullNameValid(true);
    } else {
      setFullNameErrorText('');
      setIsFullNameValid(false);
    }
  };

  const onChangeMobileNumber = (updatedText: string) => {
    setPhoneNumberTextField(updatedText);
    const trimmedText = updatedText.trim();
    const mobileNumberRegex = new RegExp(mobileRegex);

    if (trimmedText === '') {
      setMobileNumberErrorText('Required');
      setIsPhoneNumberValid(true);
    } else if (
      trimmedText.length < minPhoneNumberLength ||
      trimmedText.length > maxPhoneNumberLength ||
      !mobileNumberRegex.test(trimmedText)
    ) {
      let lengthMsg = '';

      if (minPhoneNumberLength !== maxPhoneNumberLength) {
        lengthMsg = `Mobile number must be between ${minPhoneNumberLength} and ${maxPhoneNumberLength} digits`;
      } else {
        lengthMsg = `Mobile number must be ${maxPhoneNumberLength} digits`;
      }

      setMobileNumberErrorText(lengthMsg);
      setIsPhoneNumberValid(true);
    } else {
      setMobileNumberErrorText('');
      setIsPhoneNumberValid(false);
    }
  };

  function extractNames(fullName: string): {
    firstName: string;
    lastName: string;
  } {
    const components = fullName
      .trim()
      .split(' ')
      .filter((part) => part !== '');

    if (components.length === 0) {
      return { firstName: '', lastName: '' };
    }

    const firstName = components[0] || '';
    const lastName = components.slice(1).join(' ') || '';

    return { firstName, lastName };
  }

  const onChangeEmailId = (updatedText: string) => {
    setEmailTextField(updatedText);
    const trimmedText = updatedText.trim();
    const emailRegexPattern = new RegExp(emailRegex); // emailRegex should be a string pattern

    if (trimmedText === '') {
      setEmailIdErrorText('Required');
      setIsEmailValid(true);
    } else if (!emailRegexPattern.test(trimmedText)) {
      setEmailIdErrorText('Invalid Email');
      setIsEmailValid(true);
    } else {
      setEmailIdErrorText('');
      setIsEmailValid(false);
    }
  };

  const onChangePostalCode = (updatedText: string) => {
    setPinTextField(updatedText);
    const trimmedText = updatedText.trim();

    if (trimmedText === '') {
      setPinCodeErrorText('Required');
      setIsPinValid(true);
    } else if (
      selectedPhoneCodeRef.current === '+91' &&
      trimmedText.length < 6
    ) {
      setPinCodeErrorText('Zip/Postal code must be 6 digits');
      setIsPinValid(true);
    } else {
      setPinCodeErrorText('');
      setIsPinValid(false);
    }
  };

  const onChangeCity = (updatedText: string) => {
    setCityTextField(updatedText);
    const trimmedText = updatedText.trim();

    if (trimmedText === '') {
      setCityErrorText('Required');
      setIsCityValid(true);
    } else {
      setCityErrorText('');
      setIsCityValid(false);
    }
  };

  const onChangeCountryTextField = (updatedText: string) => {
    setCountryTextField(updatedText);
    const trimmedText = updatedText.trim();

    if (trimmedText === '') {
      setCountryNameDropdownData(duplicateCountryNameDropdownData);
    } else {
      const filtered = duplicateCountryNameDropdownData
        .filter((key) =>
          key.value.toLowerCase().includes(trimmedText.toLowerCase())
        )
        .sort();
      setCountryNameDropdownData(filtered);
    }
  };

  const onChangeCountryCodeTextField = (updatedText: string) => {
    selectedPhoneCodeRef.current = updatedText;
    const trimmedText = updatedText.trim();

    if (trimmedText === '') {
      setPhoneCodeDropDownData(duplicatePhoneCodeDropdownData);
    } else {
      const filtered = duplicatePhoneCodeDropdownData
        .filter((key) =>
          key.value.toLowerCase().includes(trimmedText.toLowerCase())
        )
        .sort();
      setPhoneCodeDropDownData(filtered);
    }
  };

  const onChangeState = (updatedText: string) => {
    setStateTextField(updatedText);
    const trimmedText = updatedText.trim();

    if (trimmedText === '') {
      setStateErrorText('Required');
      setIsStateValid(true);
    } else {
      setStateErrorText('');
      setIsStateValid(false);
    }
  };

  const onChangeMainAddress = (updatedText: string) => {
    setMainAddressTextField(updatedText);
    const trimmedText = updatedText.trim();

    if (trimmedText === '') {
      setMainAddressErrorText('Required');
      setIsMainAddressValid(true);
    } else {
      setMainAddressErrorText('');
      setIsMainAddressValid(true);
    }
  };

  const isAllDetailsValid = (): boolean => {
    let isAllValid = true;

    // Helper function to safely trim nullable strings
    const safeTrim = (text: string | null | undefined): string =>
      text ? text.trim() : '';

    // Full Name
    const fullNameTrimmed = safeTrim(fullNameTextField);
    const fullNameValid = fullNameTrimmed !== '' && isFullNameEnabled;
    if (!fullNameValid) {
      onChangeFullName(fullNameTextField);
      isAllValid = false;
    }

    // Mobile Number
    const mobileTrimmed = safeTrim(phoneNumberTextField); // Replace with your numberRegex if different
    const mobileValid =
      mobileTrimmed !== '' &&
      mobileTrimmed.length >= minPhoneNumberLength &&
      mobileTrimmed.length <= maxPhoneNumberLength &&
      mobileRegex.test(mobileTrimmed) &&
      isPhoneNumberEnabled;
    if (!mobileValid) {
      onChangeMobileNumber(phoneNumberTextField);
      isAllValid = false;
    }

    // Email
    const emailTrimmed = safeTrim(emailTextField); // Replace with your emailRegex if defined
    const emailValid =
      emailTrimmed !== '' && emailRegex.test(emailTrimmed) && isEmailEnabled;
    if (!emailValid) {
      onChangeEmailId(emailTextField);
      isAllValid = false;
    }

    // Shipping-specific fields
    if (isShippingEnabled) {
      // Postal Code
      const postalTrimmed = safeTrim(pinTextField);
      let postalValid = false;
      if (selectedPhoneCodeRef.current === '+91') {
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

  useEffect(() => {
    // Transform, deduplicate and sort country names
    const initialCountryCode = userData.country ? userData.country : 'IN';
    setSelectedCountryCode(initialCountryCode);
    const selectedCountry =
      countryData[initialCountryCode as keyof typeof countryData];
    if (selectedCountry) {
      selectedPhoneCodeRef.current = selectedCountry.isdCode || '+91';
    }
    const transformed = Array.from(
      new Map(
        Object.entries(countryData).map(([key, value]) => [
          value.fullName,
          { key, value: value.fullName },
        ])
      ).values()
    ).sort((a, b) => a.value.localeCompare(b.value)); // ascending alphabetical sort

    setCountryNameDropdownData(transformed);
    setDuplicateCountryNameDropdownData(transformed);

    // Transform, deduplicate and sort phone codes
    const phoneCodeTransformed = Array.from(
      new Map(
        Object.entries(countryData).map(([key, value]) => [
          value.isdCode,
          { key, value: value.isdCode },
        ])
      ).values()
    ).sort((a, b) => a.value.localeCompare(b.value)); // sort by ISD code as strings

    setPhoneCodeDropDownData(phoneCodeTransformed);
    setDuplicatePhoneCodeDropdownData(phoneCodeTransformed);

    const firstName = userData.firstName;
    const lastName = userData.lastName;
    const fullName = `${firstName} ${lastName}`.trim();
    setFullNameTextField(fullName);

    setEmailTextField(userData.email ? userData.email : '');
    setPinTextField(userData.pincode ? userData.pincode : '');
    setCityTextField(userData.city ? userData.city : '');
    setStateTextField(userData.state ? userData.state : '');
    setMainAddressTextField(userData.address1 ? userData.address1 : '');
    setSecondaryAddressTextField(userData.address2 ? userData.address2 : '');

    const storedPhoneNumber = userData.phone;
    if (
      storedPhoneNumber &&
      storedPhoneNumber.startsWith(selectedPhoneCodeRef.current)
    ) {
      const slicedNumber = storedPhoneNumber.slice(
        selectedPhoneCodeRef.current.length
      );
      setPhoneNumberTextField(slicedNumber);
    }
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar barStyle="dark-content" />
      <Header
        onBackPress={onProceedBack}
        showDesc={false}
        showSecure={false}
        text={isShippingEnabled ? 'Add Address' : 'Add Personal Details'}
      />
      <View
        style={{ flexDirection: 'row', height: 1, backgroundColor: '#ECECED' }}
      />
      <ScrollView>
        <View>
          {isShippingEnabled && (
            <>
              <Pressable
                onPress={() => {
                  setCountryNameDropdownVisible(true);
                }}
              >
                <TextInput
                  mode="outlined"
                  label={
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: 'Poppins-Regular',
                        color: countryTextFieldFocused ? '#2D2B32' : '#ADACB0',
                      }}
                    >
                      Country*
                    </Text>
                  }
                  value={countryTextField || ''}
                  onChangeText={(it) => onChangeCountryTextField(it)}
                  editable={false} // disables keyboard input
                  theme={{
                    colors: {
                      primary: '#2D2B32',
                      outline: '#E6E6E6',
                    },
                  }}
                  style={[
                    styles.textInput,
                    { marginTop: 28, marginHorizontal: 16 },
                  ]}
                  outlineStyle={{
                    borderRadius: 8,
                    borderWidth: 1.5,
                  }}
                  right={
                    <TextInput.Icon
                      icon={() => (
                        <Image
                          source={require('../../assets/images/chervon-down.png')}
                          style={{
                            alignSelf: 'center',
                            height: 6,
                            width: 14,
                            marginEnd: 8,
                          }}
                        />
                      )}
                    />
                  }
                />
              </Pressable>

              {countryNameDropdownDataVisible && (
                <View
                  style={{
                    position: 'absolute',
                    top: 100, // You may still need to fine-tune
                    left: 16,
                    right: 16,
                    zIndex: 999,
                    backgroundColor: 'white',
                    borderWidth: 1,
                    borderColor: '#E6E6E6',
                    borderRadius: 8,
                    maxHeight: 200,
                    elevation: 5,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                  }}
                >
                  <ScrollView>
                    {countryNameDropdownData.map((item) => (
                      <Pressable
                        key={item.key}
                        onPress={() => {
                          handleCountrySelect(item.key);
                          setCountryNameDropdownVisible(false);
                        }}
                        style={{
                          paddingVertical: 12,
                          paddingHorizontal: 16,
                          borderBottomWidth: 1,
                          borderBottomColor: '#F0F0F0',
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 16,
                            fontFamily: 'Poppins-Regular',
                            color: '#2D2B32',
                          }}
                        >
                          {item.value}
                        </Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>
              )}
            </>
          )}

          {(isShippingEnabled || isFullNameEnabled) && (
            <>
              <TextInput
                mode="outlined"
                label={
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: 'Poppins-Regular',
                      color: nameTextFieldFocused ? '#2D2B32' : '#ADACB0',
                    }}
                  >
                    Full Name*
                  </Text>
                }
                value={fullNameTextField || ''}
                onChangeText={(it) => {
                  onChangeFullName(it);
                }}
                theme={{
                  colors: {
                    primary: '#2D2B32',
                    outline: '#E6E6E6',
                  },
                }}
                style={[
                  styles.textInput,
                  { marginTop: 20, marginHorizontal: 16 },
                ]}
                error={isFullNameValid}
                outlineStyle={{
                  borderRadius: 8, // Add this
                  borderWidth: 1.5,
                }}
                onFocus={() => {
                  setNameTextFieldFocused(true);
                }}
                onBlur={() => {
                  setNameTextFieldFocused(false);
                }}
              />
              {isFullNameValid && (
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: 'Poppins-Regular',
                    color: '#E12121',
                    marginHorizontal: 16,
                  }}
                >
                  {fullNameErrorText}
                </Text>
              )}
            </>
          )}
          {(isShippingEnabled || isPhoneNumberEnabled) && (
            <>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  marginTop: 20,
                  marginHorizontal: 16,
                  alignItems: 'center',
                }}
              >
                <TextInput
                  mode="outlined"
                  value={selectedPhoneCodeRef.current || ''}
                  onChangeText={(it) => onChangeCountryCodeTextField(it)}
                  theme={{
                    colors: {
                      primary: '#2D2B32',
                      outline: '#E6E6E6',
                    },
                  }}
                  style={[
                    styles.textInput,
                    { width: 90, marginEnd: 8, marginTop: 6 },
                  ]}
                  outlineStyle={{
                    borderRadius: 8,
                    borderWidth: 1.5,
                  }}
                  right={
                    <TextInput.Icon
                      icon={() => (
                        <Image
                          source={require('../../assets/images/chervon-down.png')}
                          style={{
                            alignSelf: 'center',
                            height: 6,
                            width: 14,
                            marginLeft: 'auto',
                          }}
                        />
                      )}
                    />
                  }
                  keyboardType="number-pad"
                  onFocus={() => {
                    setPhoneTextFieldFocused(true);
                    setPhoneCodeDropdownDataVisible(true);
                  }}
                  onBlur={() => {
                    setPhoneTextFieldFocused(false);
                  }}
                />
                <TextInput
                  mode="outlined"
                  label={
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: 'Poppins-Regular',
                        color: phoneTextFieldFocused ? '#2D2B32' : '#ADACB0',
                      }}
                    >
                      Mobile Number*
                    </Text>
                  }
                  value={phoneNumberTextField || ''}
                  onChangeText={(it) => onChangeMobileNumber(it)}
                  theme={{
                    colors: {
                      primary: '#2D2B32',
                      outline: '#E6E6E6',
                    },
                  }}
                  style={[styles.textInput, { flex: 1 }]}
                  error={isPhoneNumberValid}
                  outlineStyle={{
                    borderRadius: 8,
                    borderWidth: 1.5,
                  }}
                  keyboardType="number-pad"
                  onFocus={() => setPhoneTextFieldFocused(true)}
                  onBlur={() => {
                    setPhoneTextFieldFocused(false);
                  }}
                />
              </View>
              {isPhoneNumberValid && (
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: 'Poppins-Regular',
                    color: '#E12121',
                    marginHorizontal: 16,
                  }}
                >
                  {mobileNumberErrorText}
                </Text>
              )}
              {phoneCodeDropdownDataVisible && (
                <View
                  style={{
                    position: 'absolute',
                    top: isShippingEnabled ? 270 : 170, // You might need to fine-tune this based on your layout
                    left: 16,
                    right: 16,
                    zIndex: 999,
                    backgroundColor: 'white',
                    borderWidth: 1,
                    borderColor: '#E6E6E6',
                    borderRadius: 8,
                    maxHeight: 200,
                    elevation: 5, // For Android shadow
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                  }}
                >
                  <ScrollView>
                    {phoneCodeDropDownData.map((item) => (
                      <Pressable
                        key={item.key}
                        onPress={() => {
                          handleCountrySelect(item.key);
                          setPhoneCodeDropdownDataVisible(false);
                        }}
                        style={{
                          paddingVertical: 12,
                          paddingHorizontal: 16,
                          borderBottomWidth: 1,
                          borderBottomColor: '#F0F0F0',
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 16,
                            fontFamily: 'Poppins-Regular',
                            color: '#2D2B32',
                          }}
                        >
                          {item.value}
                        </Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>
              )}
            </>
          )}
          {(isShippingEnabled || isEmailEnabled) && (
            <>
              <TextInput
                mode="outlined"
                label={
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: 'Poppins-Regular',
                      color: emailTextFieldFocused ? '#2D2B32' : '#ADACB0',
                    }}
                  >
                    Email ID*
                  </Text>
                }
                value={emailTextField || ''}
                onChangeText={(it) => {
                  onChangeEmailId(it);
                }}
                theme={{
                  colors: {
                    primary: '#2D2B32',
                    outline: '#E6E6E6',
                  },
                }}
                style={[
                  styles.textInput,
                  { marginTop: 20, marginHorizontal: 16 },
                ]}
                error={isEmailValid}
                outlineStyle={{
                  borderRadius: 8, // Add this
                  borderWidth: 1.5,
                }}
                onFocus={() => {
                  setEmailTextFieldFocused(true);
                }}
                onBlur={() => {
                  setEmailTextFieldFocused(false);
                }}
              />
              {isEmailValid && (
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: 'Poppins-Regular',
                    color: '#E12121',
                    marginHorizontal: 16,
                  }}
                >
                  {emailIdErrorText}
                </Text>
              )}
            </>
          )}
          {isShippingEnabled && (
            <>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  marginTop: 20,
                  marginHorizontal: 16,
                  alignItems: 'flex-start',
                }}
              >
                <View style={{ flex: 1 }}>
                  <TextInput
                    mode="outlined"
                    label={
                      <Text
                        style={{
                          fontSize: 16,
                          fontFamily: 'Poppins-Regular',
                          color: pincodeTextFieldFocused
                            ? '#2D2B32'
                            : '#ADACB0',
                        }}
                      >
                        ZIP/Postal code*
                      </Text>
                    }
                    value={pinTextField || ''}
                    onChangeText={(it) => {
                      onChangePostalCode(it);
                    }}
                    theme={{
                      colors: {
                        primary: '#2D2B32',
                        outline: '#E6E6E6',
                      },
                    }}
                    style={[styles.textInput]}
                    error={isPinValid}
                    outlineStyle={{
                      borderRadius: 8, // Add this
                      borderWidth: 1.5,
                    }}
                    keyboardType="number-pad"
                    onFocus={() => {
                      setPincodeTextFieldFocused(true);
                    }}
                    onBlur={() => {
                      setPincodeTextFieldFocused(false);
                    }}
                  />
                  {isPinValid && (
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: 'Poppins-Regular',
                        color: '#E12121',
                        alignSelf: 'flex-start',
                      }}
                    >
                      {pinCodeErrorText}
                    </Text>
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <TextInput
                    mode="outlined"
                    label={
                      <Text
                        style={{
                          fontSize: 16,
                          fontFamily: 'Poppins-Regular',
                          color: cityTextFieldFocused ? '#2D2B32' : '#ADACB0',
                        }}
                      >
                        City*
                      </Text>
                    }
                    value={cityTextField || ''}
                    onChangeText={(it) => {
                      onChangeCity(it);
                    }}
                    theme={{
                      colors: {
                        primary: '#2D2B32',
                        outline: '#E6E6E6',
                      },
                    }}
                    style={[styles.textInput, { marginStart: 8 }]}
                    error={isCityValid}
                    outlineStyle={{
                      borderRadius: 8, // Add this
                      borderWidth: 1.5,
                    }}
                    onFocus={() => {
                      setCityTextFieldFocused(true);
                    }}
                    onBlur={() => {
                      setCityTextFieldFocused(false);
                    }}
                  />
                  {isCityValid && (
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: 'Poppins-Regular',
                        color: '#E12121',
                        alignSelf: 'flex-start',
                      }}
                    >
                      {cityErrorText}
                    </Text>
                  )}
                </View>
              </View>
              <TextInput
                mode="outlined"
                label={
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: 'Poppins-Regular',
                      color: stateTextFieldFocused ? '#2D2B32' : '#ADACB0',
                    }}
                  >
                    State*
                  </Text>
                }
                value={stateTextField || ''}
                onChangeText={(it) => {
                  onChangeState(it);
                }}
                theme={{
                  colors: {
                    primary: '#2D2B32',
                    outline: '#E6E6E6',
                  },
                }}
                style={[
                  styles.textInput,
                  { marginTop: 20, marginHorizontal: 16 },
                ]}
                error={isStateValid}
                outlineStyle={{
                  borderRadius: 8, // Add this
                  borderWidth: 1.5,
                }}
                onFocus={() => {
                  setStateTextFieldFocused(true);
                }}
                onBlur={() => {
                  setStateTextFieldFocused(false);
                }}
              />
              {isStateValid && (
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: 'Poppins-Regular',
                    color: '#E12121',
                  }}
                >
                  {stateErrorText}
                </Text>
              )}
              <TextInput
                mode="outlined"
                label={
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: 'Poppins-Regular',
                      color: mainAddressTextFieldFocused
                        ? '#2D2B32'
                        : '#ADACB0',
                    }}
                  >
                    House number, Apartment*
                  </Text>
                }
                value={mainAddressTextField || ''}
                onChangeText={(it) => {
                  onChangeMainAddress(it);
                }}
                theme={{
                  colors: {
                    primary: '#2D2B32',
                    outline: '#E6E6E6',
                  },
                }}
                style={[
                  styles.textInput,
                  { marginTop: 20, marginHorizontal: 16 },
                ]}
                error={isMainAddressValid}
                outlineStyle={{
                  borderRadius: 8, // Add this
                  borderWidth: 1.5,
                }}
                onFocus={() => {
                  setMainAddressTextFieldFocused(true);
                }}
                onBlur={() => {
                  setMainAddressTextFieldFocused(false);
                }}
              />
              {isMainAddressValid && (
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: 'Poppins-Regular',
                    color: '#E12121',
                  }}
                >
                  {mainAddressErrorText}
                </Text>
              )}
              <TextInput
                mode="outlined"
                label={
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: 'Poppins-Regular',
                      color: secondaryAddressTextFieldFocused
                        ? '#2D2B32'
                        : '#ADACB0',
                    }}
                  >
                    Area,Colony,Street, Sector
                  </Text>
                }
                value={secondaryAddressTextField || ''}
                onChangeText={(it) => {
                  setSecondaryAddressTextField(it);
                }}
                theme={{
                  colors: {
                    primary: '#2D2B32',
                    outline: '#E6E6E6',
                  },
                }}
                style={[
                  styles.textInput,
                  { marginTop: 20, marginHorizontal: 16 },
                ]}
                outlineStyle={{
                  borderRadius: 8, // Add this
                  borderWidth: 1.5,
                }}
                onFocus={() => {
                  setSecondaryAddressTextFieldFocused(true);
                }}
                onBlur={() => {
                  setSecondaryAddressTextFieldFocused(false);
                }}
              />
            </>
          )}
        </View>
      </ScrollView>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          paddingBottom: 16,
        }}
      >
        <Pressable
          style={[
            styles.buttonContainer,
            { backgroundColor: checkoutDetails.brandColor },
          ]}
          onPress={() => {
            // Todo add functon call
            if (isAllDetailsValid()) {
              const { firstName, lastName } = extractNames(fullNameTextField);
              setUserDataHandler({
                userData: {
                  email: emailTextField,
                  firstName: firstName,
                  lastName: lastName,
                  phone: `${selectedPhoneCodeRef.current}${phoneNumberTextField}`,
                  uniqueId: userData.uniqueId,
                  dob: userData.dob,
                  pan: userData.pan,
                  address1: mainAddressTextField,
                  address2: secondaryAddressTextField,
                  city: cityTextField,
                  state: stateTextField,
                  pincode: pinTextField,
                  country: selectedCountryCode,
                  labelType: userData.labelType,
                  labelName: userData.labelName,
                },
              });
              onProceedBack();
            }
          }}
        >
          <Text style={styles.buttonText}>
            {isShippingEnabled ? 'Save Address' : 'Save Personal Details'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  textInput: {
    backgroundColor: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#0A090B',
    height: 56,
  },
  buttonContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    justifyContent: 'center',
    marginTop: 20,
    marginHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
});

export default AddressScreen;
