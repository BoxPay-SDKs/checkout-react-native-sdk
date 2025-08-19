import {
    View,
    SafeAreaView,
    StatusBar,
    Text,
    BackHandler
} from 'react-native';
import styles from '../styles/savedAddressScreenStyles';
import { useEffect, useState } from 'react';
import ShimmerView from '../components/shimmerView';
import LottieView from 'lottie-react-native';
import Header from '../components/header';
import { router } from 'expo-router';
import { APIStatus, type FetchSavedAddress } from '../interface';
import fetchSavedAddress from '../postRequest/fetchSavedAddress';
import Toast from 'react-native-toast-message'
import deleteSavedAddress from '../postRequest/deleteSavedAddress';



const SavedAddressScreen = () => {
    const [isFirstLoad, setIsFirstLoad] = useState(true)
    const [loading, setLoading] = useState(false)
    const [savedAddressList, setSavedAddresList] = useState<FetchSavedAddress[]>([]);

    const onProceedBack = () => {
        if (!loading) {
          router.back();
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
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            onProceedBack
        );
        return () => {
            backHandler.remove();
        };
    }, []);

    return (
        <SafeAreaView style = {styles.screenView}>
            <StatusBar barStyle="dark-content" />
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
                </View>
            )}
        </SafeAreaView>
    )
}

export default SavedAddressScreen