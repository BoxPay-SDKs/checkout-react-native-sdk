import {
    View,
    Text,
    BackHandler,
    ScrollView,
    Image,
    Pressable
} from 'react-native';
import styles from '../styles/screens/savedAddressScreenStyles';
import { useEffect, useState } from 'react';
import ShimmerView from '../components/shimmerView';
import LottieView from 'lottie-react-native';
import Header from '../components/header';
import { APIStatus, type FetchSavedAddress} from '../interface';
import fetchSavedAddress from '../postRequest/fetchSavedAddress';
import Toast from 'react-native-toast-message'
import deleteSavedAddress from '../postRequest/deleteSavedAddress';
import type { CheckoutStackParamList } from '../navigation';
import type { NavigationProp } from '@react-navigation/native';
import SavedAddressComponent from '../components/savedAddressCard';
import { checkoutDetailsHandler } from '../sharedContext/checkoutDetailsHandler';
import SavedAddressBottomSheet from '../components/savedAddressBottomSheet';
import { setUserDataHandler, userDataHandler } from '../sharedContext/userdataHandler';
import { extractNames, formatAddress, getPhoneNumberCodeAndCountryName } from '../utility';
import DeleteAddressModal from '../components/deleteAddressModal';

type AddressScreenNavigationProp = NavigationProp<CheckoutStackParamList, 'AddressScreen'>;

interface Props {
  navigation: AddressScreenNavigationProp;
}

const SavedAddressScreen = ({ navigation }: Props) => {
    const [isFirstLoad, setIsFirstLoad] = useState(true)
    const [loading, setLoading] = useState(false)
    const [isEditClicked, setIsEditClicked] = useState(false)
    const [savedAddressList, setSavedAddresList] = useState<FetchSavedAddress[]>([]);
    const {checkoutDetails} = checkoutDetailsHandler
    const [isOptionsClicked, setIsOptionsClicked] = useState<boolean>(false)
    const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] = useState<boolean>(false)
    const [selectedAddress,setSelectedAddress] = useState<FetchSavedAddress>()
    const [updateAddress, setUpdateAddress] = useState<boolean>(false)

    const icons = {
        home: require('../../assets/images/ic_home.png'),
        work: require('../../assets/images/ic_work.png'),
        other: require('../../assets/images/ic_other.png'),
    };

    const onProceedBack = () => {
        if (!loading) {
            navigation.goBack()
          return true;
        }
        return false;
    };
    
    useEffect(() => {
        const fetchAddress = async() => {
            const apiResponse = await fetchSavedAddress()
            switch(apiResponse.apiStatus) {
                case APIStatus.Success : {
                    setSavedAddresList(apiResponse.data)
                    setIsFirstLoad(false)
                    break
                }
                case APIStatus.Failed : {
                    Toast.show({
                        type: 'error',
                        text1: 'Oops!',
                        text2: 'Something went wrong. Please try again.',
                    });
                    setIsFirstLoad(false)
                    break 
                }
                default : {
                    break
                }
            }
        }
        fetchAddress()
    }, []);

    const onClickDeleteAddress = async (selectedAddressRef : string) => {
        const response = await deleteSavedAddress(selectedAddressRef)
        switch(response.apiStatus) {
            case APIStatus.Success : {
                setSavedAddresList(prevList =>
                    prevList.filter(address => address.addressRef !== selectedAddressRef)
                );
                setLoading(false)
                break
            }
            case APIStatus.Failed : {
                Toast.show({
                    type: 'error',
                    text1: 'Oops!',
                    text2: 'Something went wrong. Please try again.',
                });
                setLoading(false)
                break
            }
            default : {
                break
            }
        }
    }


    useEffect(() => {

        const backAction = () => {
            if (loading) {
                return true; 
            }
            return onProceedBack();
        }
        const backHandler = BackHandler.addEventListener(
          'hardwareBackPress',
          backAction,
        );
    
        return () => backHandler.remove();
    }, [navigation]);

    useEffect(() => {
        if(updateAddress || isEditClicked) {
            setIsEditClicked(false)
            const { firstName, lastName } = extractNames(selectedAddress?.name ?? "");
            const selectedCountry = getPhoneNumberCodeAndCountryName(selectedAddress?.countryCode ?? "")
            setUserDataHandler({
                userData: {
                  email: selectedAddress?.email ?? "",
                  firstName: firstName,
                  lastName: lastName,
                  completePhoneNumber: selectedAddress?.phoneNumber ?? "",
                  phoneCode : selectedCountry.isdCode ?? "",
                  uniqueId: userDataHandler.userData.uniqueId,
                  dob: userDataHandler.userData.dob,
                  pan: userDataHandler.userData.pan,
                  address1: selectedAddress?.address1 ?? "",
                  address2: selectedAddress?.address2 ?? "",
                  city: selectedAddress?.city ?? "",
                  state: selectedAddress?.state ?? "",
                  pincode: selectedAddress?.postalCode ?? "",
                  countryCode: selectedAddress?.countryCode ?? "",
                  countryName : selectedCountry.fullName ?? "",
                  labelType: selectedAddress?.labelType ?? "",
                  labelName: selectedAddress?.labelName ?? "",
                },
            });
            if(isEditClicked) {
                navigation.navigate("AddressScreen",{isNewAddress : false})
            } else {
                navigation.goBack()
            }
        }
    }, [updateAddress, isEditClicked]);

    return (
        <View style = {styles.screenView}>
            {isFirstLoad ? (
                <ShimmerView/>
            ) : loading ? (
                <View
                style={styles.loaderView}
              >
                <LottieView
                  source={require('../../assets/animations/boxpayLogo.json')}
                  autoPlay
                  loop
                  style={styles.lottieStyle}
                />
                <Text>Loading...</Text>
              </View>
            ) : (
                <View style={{ flex: 1, backgroundColor: '#F5F6FB' }}>
                    <Header
                        onBackPress={onProceedBack}
                        showDesc={false}
                        showSecure={false}
                        text="Your Addresses"
                    />
                    <View
                        style={styles.divider}
                    />

                    <Pressable  
                    style={styles.pressableContainer}
                    onPress={() => {
                      if (checkoutDetails.isShippingAddressEditable) {
                        navigation.navigate("AddressScreen",{isNewAddress : true})
                      }
                    }}
                  >
                    <Image
                      source={require('../../assets/images/add_icon.png')}
                      style={[styles.imageStyle, {tintColor:checkoutDetails.buttonColor}]}
                    />
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={[styles.insideContainerClickableText, {color:checkoutDetails.buttonColor, paddingTop:4}]}
                    >
                      Add new address
                    </Text>
                    <Image
                      source={require('../../assets/images/chervon-down.png')}
                      style={{
                        alignSelf: 'center',
                        height: 6,
                        width: 14,
                        marginTop : 6,
                        marginRight :10,
                        marginLeft: 'auto',
                        transform: [
                          {
                            rotate: '270deg',
                          },
                        ],
                      }}
                    />
                  </Pressable>
                  {savedAddressList.length !== 0 && (
    <>
        <Text style={styles.mainHeadingText}>
            Saved Addresses
        </Text>
        <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
        >
            <SavedAddressComponent
                savedAddressList={savedAddressList}
                onClickAddress={(address : FetchSavedAddress) => {
                    setSelectedAddress(address)
                    setUpdateAddress(true)
                }}
                onClickOtherOptions={(address : FetchSavedAddress) => {
                    setSelectedAddress(address)
                    setIsOptionsClicked(true)
                }}
            />
        </ScrollView>
    </>
)}
                </View>
            )}
            <SavedAddressBottomSheet
        visible={isOptionsClicked}
        onClose={() => setIsOptionsClicked(false)}
        onEdit={() => setIsEditClicked(true)}
        onSetDefault={() => setUpdateAddress(true)}
        onDelete={() => {
            setIsOptionsClicked(false)
            setIsDeleteConfirmationVisible(true)
        }}
        label= {selectedAddress?.labelName ? selectedAddress?.labelName ?? "" : selectedAddress?.labelType ?? ""}
        address={formatAddress({
            address1 : selectedAddress?.address1 ?? "",
            address2: selectedAddress?.address2 ?? "",
            city : selectedAddress?.city ?? "",
            state : selectedAddress?.state ?? "",
            postalCode : selectedAddress?.postalCode ?? "",
            countryCode : selectedAddress?.countryCode ?? "",
            labelName : selectedAddress?.labelName ?? "",
            labelType : selectedAddress?.labelType ?? ""
          })}
        icon={icons[selectedAddress?.labelType.toLowerCase() as keyof typeof icons] || icons.other}
      />

<DeleteAddressModal
        visible={isDeleteConfirmationVisible}
        onCancel={() => setIsDeleteConfirmationVisible(false)}
        onDelete={() => {
            setIsDeleteConfirmationVisible(false);
            onClickDeleteAddress(selectedAddress?.addressRef ?? "")
        }}
        address={formatAddress({
            address1 : selectedAddress?.address1 ?? "",
            address2: selectedAddress?.address2 ?? "",
            city : selectedAddress?.city ?? "",
            state : selectedAddress?.state ?? "",
            postalCode : selectedAddress?.postalCode ?? "",
            countryCode : selectedAddress?.countryCode ?? "",
            labelName : selectedAddress?.labelName ?? "",
            labelType : selectedAddress?.labelType ?? ""
          })}
      />
        </View>
    )
}

export default SavedAddressScreen