import type { NavigationProp, RouteProp } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import {
  BackHandler,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import CountryPicker, { type Country, type CountryCode } from 'react-native-country-picker-modal';
import { TextInput } from 'react-native-paper';
import Header from '../components/header';
import type { AddressScreenParams } from '../interface';
import type { CheckoutStackParamList } from '../navigation';
import { checkoutDetailsHandler } from '../sharedContext/checkoutDetailsHandler';
import {
  setUserDataHandler,
  userDataHandler,
} from '../sharedContext/userdataHandler';
import styles from '../styles/screens/addressScreenStyles.';
import { extractNames, getPhoneNumberCodeAndCountryName } from '../utility';
import { getTextInputTheme } from '../sharedContext/getTextInputTheme';

type AddressScreenRouteProp = RouteProp<CheckoutStackParamList, 'AddressScreen'>;
type AddressScreenNavigationProp = NavigationProp<CheckoutStackParamList, 'AddressScreen'>;

interface Props {
  route : AddressScreenRouteProp,
  navigation: AddressScreenNavigationProp;
}

const AddressScreen = ({ route, navigation }: Props) => {
  const {
    isNewAddress
  } = route.params as AddressScreenParams || {}; 

  const isNewAddressBool = Array.isArray(isNewAddress) ? isNewAddress[0] : isNewAddress;
  const { userData } = userDataHandler;
  const { checkoutDetails } = checkoutDetailsHandler;
  const [selectedCountryCode, setSelectedCountryCode] = useState<CountryCode>('IN');
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

  const [isFullNameValid, setIsFullNameValid] = useState<boolean | null>(null);
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState<boolean | null>(null);
  const [isEmailValid, setIsEmailValid] = useState<boolean | null>(null);
  const [isPinValid, setIsPinValid] = useState<boolean | null>(null);
  const [isCityValid, setIsCityValid] = useState<boolean | null>(null);
  const [isStateValid, setIsStateValid] = useState<boolean | null>(null);
  const [isMainAddressValid, setIsMainAddressValid] = useState<boolean | null>(null);

  const phoneNumberLengthList = useRef<number[]>([10])

  const onProceedBack = () => {
    navigation.goBack()
    return true;
  };

  useEffect(() => {

    const backAction = () => {
      return onProceedBack();
    }
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [navigation]);

  useEffect(() => {
    if(!isNewAddress) {
      const firstName = userData.firstName ?? "";
      const lastName = userData.lastName ?? "";
      const fullName = `${firstName} ${lastName}`.trim();

      setFullNameTextField(fullName);
      setEmailTextField(userData.email ?? "")
      setMainAddressTextField(userData.address1 ?? "")
      setSecondaryAddressTextField(userData.address2 ?? "")
      setCityTextField(userData.city ?? "")
      setStateTextField(userData.state ?? "")
      setSelectedCountryCode(
        (userData.countryCode ?? 'IN') as CountryCode
      );
      setCountryTextField(userData.countryName ?? "")
      setPinTextField(userData.pincode ?? "")

      const selectedCountry = getPhoneNumberCodeAndCountryName(userData.countryCode ?? "IN")
      setSelectedPhoneCode(selectedCountry.isdCode ?? "+91")
      setCountryTextField(selectedCountry.fullName ?? "")

      if (userData.completePhoneNumber?.startsWith(selectedCountry.isdCode)) {
        // 2. Remove the ISD code from the beginning
        const rawNumber = userData.completePhoneNumber.slice(selectedCountry.isdCode.length);
        setPhoneNumberTextField(rawNumber)

        phoneNumberLengthList.current = selectedCountry.phoneNumberLength
      }
    }
  }, [userData])

  const onChangeFullName = (updatedText: string) => {
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

  const onChangePhoneNumber = (updatedText : string) => {
    setPhoneNumberTextField(updatedText)
    if(updatedText.length == 0) {
      setMobileNumberErrorText("Required")
      setIsPhoneNumberValid(false)
    } else if(!phoneNumberLengthList.current.includes(updatedText.length)) {
      setMobileNumberErrorText(`Mobile number must be ${phoneNumberLengthList.current} digits long`)
      setIsPhoneNumberValid(false)
    } else {
      setMobileNumberErrorText("")
      setIsPhoneNumberValid(true)
    }
  }

  const handleCountrySelect = (country : Country) => {
    console.log(country)
    const selectedCountry = getPhoneNumberCodeAndCountryName(country?.cca2 ?? "IN")
    setSelectedPhoneCode(selectedCountry.isdCode ?? "+91")
    setCountryTextField(selectedCountry.fullName ?? "")
    phoneNumberLengthList.current = selectedCountry.phoneNumberLength
    setShowContryPicker(false);
  };

  const onChangeEmailId = (updatedText: string) => {
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

  const onChangePostalCode = (updatedText: string) => {
    setPinTextField(updatedText);
    const trimmedText = updatedText.trim();

    if (trimmedText === '') {
      setPinCodeErrorText('Required');
      setIsPinValid(false);
    } else if (
      selectedPhoneCode === '+91' &&
      trimmedText.length < 6
    ) {
      setPinCodeErrorText('Zip/Postal code must be 6 digits');
      setIsPinValid(false);
    } else {
      setPinCodeErrorText('');
      setIsPinValid(true);
    }
  };

  const onChangeCity = (updatedText: string) => {
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

  const onChangeState = (updatedText: string) => {
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

  const onChangeMainAddress = (updatedText: string) => {
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

    // Phone Number
    const phoneNumberTrimmed = safeTrim(phoneNumberTextField)
    const phoneNumberValid = phoneNumberLengthList.current.includes(phoneNumberTrimmed.length) && isPhoneNumberEnabled
    if(!phoneNumberValid) {
      onChangePhoneNumber(phoneNumberTextField)
      isAllValid = false
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

  return (
    <View style={styles.screenView}>
      <Header
        onBackPress={onProceedBack}
        showDesc={false}
        showSecure={false}
        text={(isShippingEnabled && isNewAddressBool) ? 'Add Address' : (isShippingEnabled && !isNewAddressBool) ? 'Edit Address' : (!isShippingEnabled && isNewAddressBool) ? 'Edit Personal Details' :  'Add Personal Details'}
      />
      <View
        style={styles.divider}
      />
      <ScrollView>
        <View>
          {isShippingEnabled && (
            <TextInput
            mode="outlined"
            editable={true}                // allow focus
            showSoftInputOnFocus={false}
            label={
              <Text
                style={[styles.textFieldLable,{
                  color: countryTextFieldFocused ? '#2D2B32' : '#ADACB0',
                  fontFamily: checkoutDetails.fontFamily.regular,
                }]}
              >
                Country*
              </Text>
            }
            value={countryTextField || ''}
            onChangeText={(_) => {}}
            theme={getTextInputTheme()}
            style={[
              styles.textInput,
              { marginTop: 28, marginHorizontal: 16, fontFamily: checkoutDetails.fontFamily.regular, },
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
            onFocus={() => {
              setShowContryPicker(true)
              setCountryTextFieldFocused(true);
            }}
            onBlur={() => {
              setShowContryPicker(false)
              setCountryTextFieldFocused(false);
            }}
          />
          )}

          {(isShippingEnabled || isFullNameEnabled) && (
            <>
              <TextInput
                mode="outlined"
                label={
                  <Text
                    style={[styles.textFieldLable,{
                      color: (nameTextFieldFocused && fullNameTextField != "") ? '#2D2B32' : '#ADACB0',
                      fontFamily: checkoutDetails.fontFamily.regular,
                    }]}
                  >
                    Full Name*
                  </Text>
                }
                value={fullNameTextField || ''}
                onChangeText={(it) => {
                  onChangeFullName(it);
                }}
                theme={getTextInputTheme()}
                style={[
                  styles.textInput,
                  { marginTop: 20, marginHorizontal: 16, fontFamily: checkoutDetails.fontFamily.regular, },
                ]}
                error={isFullNameValid == false}
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
              {(isFullNameValid == false) && (
                <Text
                  style={[styles.errorText, {fontFamily: checkoutDetails.fontFamily.regular,}]}
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
                  editable={true}                // allow focus
                  showSoftInputOnFocus={false}
                  label={
                    <Text
                      style={[styles.textFieldLable,{
                        color: (phoneCodeTextFieldFocused && selectedPhoneCode != "") ? '#2D2B32' : '#ADACB0',
                        fontFamily: checkoutDetails.fontFamily.regular,
                      }]}
                    >
                      Code*
                    </Text>
                  }
                  value={selectedPhoneCode || ''}
                  onChangeText={(_) => {}}
                  theme={getTextInputTheme()}
                  style={[
                    styles.textInput,
                    { width: 100, marginEnd: 8, fontFamily: checkoutDetails.fontFamily.regular,},
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
                  onFocus={() => {
                    setShowContryPicker(true)
                    setPhoneCodeTextFieldFocused(true);
                  }}
                  onBlur={() => {
                    setShowContryPicker(false)
                    setPhoneCodeTextFieldFocused(false);
                  }}
                />
                <TextInput
                  mode="outlined"
                  label={
                    <Text
                      style={[styles.textFieldLable,{
                        color: (phoneTextFieldFocused && phoneNumberTextField != "") ? '#2D2B32' : '#ADACB0',
                        fontFamily: checkoutDetails.fontFamily.regular, 
                      }]}
                    >
                      Mobile Number*
                    </Text>
                  }
                  value={phoneNumberTextField || ''}
                  onChangeText={(it) => {
                    onChangePhoneNumber(it)
                  }}
                  theme={getTextInputTheme()}
                  style={[styles.textInput, { flex: 1 , fontFamily: checkoutDetails.fontFamily.regular,}]}
                  error={isPhoneNumberValid == false}
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
              {(isPhoneNumberValid == false) && (
                <Text
                  style={[styles.errorText, {fontFamily: checkoutDetails.fontFamily.regular,}]}
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
                      color: (emailTextFieldFocused && emailTextField != "") ? '#2D2B32' : '#ADACB0',
                      fontFamily: checkoutDetails.fontFamily.regular,
                    }]}
                  >
                    Email ID*
                  </Text>
                }
                value={emailTextField || ''}
                onChangeText={(it) => {
                  onChangeEmailId(it);
                }}
                theme={getTextInputTheme()}
                style={[
                  styles.textInput,
                  { marginTop: 20, marginHorizontal: 16, fontFamily: checkoutDetails.fontFamily.regular, },
                ]}
                error={isEmailValid == false}
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
              {(isEmailValid == false) && (
                <Text
                  style={[styles.errorText, {fontFamily: checkoutDetails.fontFamily.regular,}]}
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
                          color: (pincodeTextFieldFocused && pinTextField != "")
                            ? '#2D2B32'
                            : '#ADACB0',
                            fontFamily: checkoutDetails.fontFamily.regular,
                        }]}
                      >
                        ZIP/Postal code*
                      </Text>
                    }
                    value={pinTextField || ''}
                    onChangeText={(it) => {
                      onChangePostalCode(it);
                    }}
                    theme={getTextInputTheme()}
                    style={[styles.textInput, {fontFamily: checkoutDetails.fontFamily.regular,}]}
                    error={isPinValid == false}
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
                  {(isPinValid == false) && (
                    <Text
                      style={[styles.errorText, {fontFamily: checkoutDetails.fontFamily.regular,}]}
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
                          fontFamily: checkoutDetails.fontFamily.regular,
                        }]}
                      >
                        City*
                      </Text>
                    }
                    value={cityTextField || ''}
                    onChangeText={(it) => {
                      onChangeCity(it);
                    }}
                    theme={getTextInputTheme()}
                    style={[styles.textInput, { marginStart: 8, fontFamily: checkoutDetails.fontFamily.regular, }]}
                    error={isCityValid == false}
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
                  {(isCityValid == false) && (
                    <Text
                      style={[styles.errorText, {fontFamily: checkoutDetails.fontFamily.regular,}]}
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
                      fontFamily: checkoutDetails.fontFamily.regular,
                    }]}
                  >
                    State*
                  </Text>
                }
                value={stateTextField || ''}
                onChangeText={(it) => {
                  onChangeState(it);
                }}
                theme={getTextInputTheme()}
                style={[
                  styles.textInput,
                  { marginTop: 20, marginHorizontal: 16, fontFamily: checkoutDetails.fontFamily.regular, },
                ]}
                error={isStateValid == false}
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
              {(isStateValid == false) && (
                <Text
                  style={[styles.errorText, {fontFamily: checkoutDetails.fontFamily.regular,}]}
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
                        fontFamily: checkoutDetails.fontFamily.regular,
                    }]}
                  >
                    House number, Apartment*
                  </Text>
                }
                value={mainAddressTextField || ''}
                onChangeText={(it) => {
                  onChangeMainAddress(it);
                }}
                theme={getTextInputTheme()}
                style={[
                  styles.textInput,
                  { marginTop: 20, marginHorizontal: 16, fontFamily: checkoutDetails.fontFamily.regular, },
                ]}
                error={isMainAddressValid == false}
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
              {(isMainAddressValid == false) && (
                <Text
                  style={[styles.errorText, {fontFamily: checkoutDetails.fontFamily.regular,}]}
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
                        fontFamily: checkoutDetails.fontFamily.regular,
                    }]}
                  >
                    Area,Colony,Street, Sector
                  </Text>
                }
                value={secondaryAddressTextField || ''}
                onChangeText={(it) => {
                  setSecondaryAddressTextField(it);
                }}
                theme={getTextInputTheme()}
                style={[
                  styles.textInput,
                  { marginTop: 20, marginHorizontal: 16, fontFamily: checkoutDetails.fontFamily.regular, },
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
      <CountryPicker
      visible = {showCountryPicker}
      withFilter = {true}
      withCallingCode = {true}
      withAlphaFilter = {true}
      withFlag = {true}
      withEmoji = {true}
      countryCode={selectedCountryCode}
      onSelect={handleCountrySelect}
      withFlagButton = {false}
      />
      <View
        style={styles.bottomContainer}
      >
        <Pressable
          style={[
            styles.buttonContainer,
            { backgroundColor: checkoutDetails.buttonColor,
              borderRadius: checkoutDetails.ctaBorderRadius,
             },
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
                  completePhoneNumber: `${selectedPhoneCode}${phoneNumberTextField}`,
                  phoneCode : selectedPhoneCode,
                  uniqueId: userData.uniqueId,
                  dob: userData.dob,
                  pan: userData.pan,
                  address1: mainAddressTextField,
                  address2: secondaryAddressTextField,
                  city: cityTextField,
                  state: stateTextField,
                  pincode: pinTextField,
                  countryCode: selectedCountryCode,
                  countryName : countryTextField,
                  labelType: userData.labelType,
                  labelName: userData.labelName,
                },
              });
              onProceedBack();
            }
          }}
        >
          <Text
            style={[
              styles.buttonText,
              { color: checkoutDetails.buttonTextColor, fontFamily: checkoutDetails.fontFamily.semiBold, }
            ]}
          >
            {isShippingEnabled ? 'Save Address' : 'Save Personal Details'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default AddressScreen;
