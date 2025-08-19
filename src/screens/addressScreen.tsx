import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  BackHandler,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import Header from '../components/header';
import { checkoutDetailsHandler } from '../sharedContext/checkoutDetailsHandler';
import {
  setUserDataHandler,
  userDataHandler,
} from '../sharedContext/userdataHandler';
import styles from '../styles/screens/addressScreenStyles.';

const AddressScreen = () => {
  const { userData } = userDataHandler;
  const { checkoutDetails } = checkoutDetailsHandler;
  const [selectedCountryCode, /*setSelectedCountryCode*/] = useState('');
  const selectedPhoneCodeRef = useRef('');

  const isShippingEnabled = checkoutDetails.isShippingAddressEnabled;
  const isFullNameEnabled = checkoutDetails.isFullNameEnabled;
  const isPhoneNumberEnabled = checkoutDetails.isPhoneEnabled;
  const isEmailEnabled = checkoutDetails.isEmailEnabled;
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

  const [countryTextField, /*setCountryTextField*/] = useState<string>('');
  const [fullNameTextField, setFullNameTextField] = useState<string>('');
  const [phoneNumberTextField, /*setPhoneNumberTextField*/] = useState<string>('');
  const [emailTextField, setEmailTextField] = useState<string>('');
  const [pinTextField, setPinTextField] = useState<string>('');
  const [cityTextField, setCityTextField] = useState<string>('');
  const [stateTextField, setStateTextField] = useState<string>('');
  const [mainAddressTextField, setMainAddressTextField] = useState<string>('');
  const [secondaryAddressTextField, setSecondaryAddressTextField] =
    useState<string>('');

  const [fullNameErrorText, setFullNameErrorText] = useState('');
  const [mobileNumberErrorText, /*setMobileNumberErrorText*/] = useState('');
  const [emailIdErrorText, setEmailIdErrorText] = useState('');
  const [pinCodeErrorText, setPinCodeErrorText] = useState('');
  const [cityErrorText, setCityErrorText] = useState('');
  const [stateErrorText, setStateErrorText] = useState('');
  const [mainAddressErrorText, setMainAddressErrorText] = useState('');

  const [isFullNameValid, setIsFullNameValid] = useState(false);
  const [isPhoneNumberValid, /*setIsPhoneNumberValid*/] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPinValid, setIsPinValid] = useState(false);
  const [isCityValid, setIsCityValid] = useState(false);
  const [isStateValid, setIsStateValid] = useState(false);
  const [isMainAddressValid, setIsMainAddressValid] = useState(false);

  const onProceedBack = () => {
    router.back();
    return true;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        return onProceedBack(); // Allow back navigation if not loading
      }
    );

    return () => backHandler.remove();
  });

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

  return (
    <SafeAreaView style={styles.screenView}>
      <StatusBar barStyle="dark-content" />
      <Header
        onBackPress={onProceedBack}
        showDesc={false}
        showSecure={false}
        text={isShippingEnabled ? 'Add Address' : 'Add Personal Details'}
      />
      <View
        style={styles.divider}
      />
      <ScrollView>
        <View>
          {isShippingEnabled && (
            <>
              <Pressable
                onPress={() => {}}
              >
                <TextInput
                  mode="outlined"
                  label={
                    <Text
                      style={[styles.textFieldLable,{
                        color: countryTextFieldFocused ? '#2D2B32' : '#ADACB0',
                      }]}
                    >
                      Country*
                    </Text>
                  }
                  value={countryTextField || ''}
                  onChangeText={(_) => {}}
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
                          style={styles.imageStyle}
                        />
                      )}
                    />
                  }
                />
              </Pressable>
            </>
          )}

          {(isShippingEnabled || isFullNameEnabled) && (
            <>
              <TextInput
                mode="outlined"
                label={
                  <Text
                    style={[styles.textFieldLable,{
                      color: nameTextFieldFocused ? '#2D2B32' : '#ADACB0',
                    }]}
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
                  style={styles.errorText}
                >
                  {fullNameErrorText}
                </Text>
              )}
            </>
          )}
          {(isShippingEnabled || isPhoneNumberEnabled) && (
            <>
              <View
                style={[styles.container, {
                  alignItems: 'center',
                }]}
              >
                <TextInput
                  mode="outlined"
                  value={selectedPhoneCodeRef.current || ''}
                  onChangeText={(_) => {}}
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
                          style={styles.imageStyle}
                        />
                      )}
                    />
                  }
                  keyboardType="number-pad"
                  onFocus={() => {
                    setPhoneTextFieldFocused(true);
                  }}
                  onBlur={() => {
                    setPhoneTextFieldFocused(false);
                  }}
                />
                <TextInput
                  mode="outlined"
                  label={
                    <Text
                      style={[styles.textFieldLable,{
                        color: phoneTextFieldFocused ? '#2D2B32' : '#ADACB0',
                      }]}
                    >
                      Mobile Number*
                    </Text>
                  }
                  value={phoneNumberTextField || ''}
                  onChangeText={(_) => {}}
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
                  style={styles.errorText}
                >
                  {mobileNumberErrorText}
                </Text>
              )}
            </>
          )}
          {(isShippingEnabled || isEmailEnabled) && (
            <>
              <TextInput
                mode="outlined"
                label={
                  <Text
                    style={[styles.textFieldLable,{
                      color: emailTextFieldFocused ? '#2D2B32' : '#ADACB0',
                    }]}
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
                  style={styles.errorText}
                >
                  {emailIdErrorText}
                </Text>
              )}
            </>
          )}
          {isShippingEnabled && (
            <>
              <View
                style={[styles.container,{
                  alignItems: 'flex-start',
                }]}
              >
                <View style={{ flex: 1 }}>
                  <TextInput
                    mode="outlined"
                    label={
                      <Text
                        style={[styles.textFieldLable,{
                          color: pincodeTextFieldFocused
                            ? '#2D2B32'
                            : '#ADACB0',
                        }]}
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
                      style={styles.errorText}
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
                        style={[styles.textFieldLable,{
                          color: cityTextFieldFocused ? '#2D2B32' : '#ADACB0',
                        }]}
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
                      style={styles.errorText}
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
                    style={[styles.textFieldLable,{
                      color: stateTextFieldFocused ? '#2D2B32' : '#ADACB0',
                    }]}
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
                  style={styles.errorText}
                >
                  {stateErrorText}
                </Text>
              )}
              <TextInput
                mode="outlined"
                label={
                  <Text
                    style={[styles.textFieldLable,{
                      color: mainAddressTextFieldFocused
                        ? '#2D2B32'
                        : '#ADACB0',
                    }]}
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
                  style={styles.errorText}
                >
                  {mainAddressErrorText}
                </Text>
              )}
              <TextInput
                mode="outlined"
                label={
                  <Text
                    style={[styles.textFieldLable,{
                      color: secondaryAddressTextFieldFocused
                        ? '#2D2B32'
                        : '#ADACB0',
                    }]}
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
        style={styles.bottomContainer}
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

export default AddressScreen;
