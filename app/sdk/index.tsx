import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, BackHandler, ToastAndroid, AppState, Image, ScrollView, Pressable, StatusBar } from 'react-native'; // Added ScrollView
import Header from './components/header';
import axios from 'axios';
import upiPostRequest from './postRequest/upiPostRequest';
import { decode as atob } from 'base-64';
import { Linking } from 'react-native';
import LottieView from 'lottie-react-native';
import PaymentSuccess from './components/paymentSuccess';
import SessionExpire from './components/sessionExpire';
import PaymentFailed from './components/paymentFailed';
import ShimmerPlaceHolder from "react-native-shimmer-placeholder";
import fetchStatus from './postRequest/fetchStatus';
import UpiScreen from './screens/upiScreen';
import { router, useFocusEffect } from 'expo-router';
import { paymentHandler, setPaymentHandler } from "./sharedContext/paymentStatusHandler";
import { loadCustomFonts, loadInterCustomFonts } from './components/fontFamily';
import { checkInstalledApps } from 'expo-check-installed-apps';
import MorePaymentContainer from './components/morePaymentContainer';
import { setUserDataHandler, userDataHandler } from './sharedContext/userdataHandler';
import { ConfigurationOptions, PaymentResult } from '../../interface';
import { checkoutDetailsHandler, setCheckoutDetailsHandler } from './sharedContext/checkoutDetailsHandler';
import WebViewScreen from './screens/webViewScreen';
import getSymbolFromCurrency from 'currency-symbol-map'
import OrderDetails, { ItemsProp } from './components/orderDetails';
import PaymentClass from '@/interface/paymentClass';
import fetchRecommendedInstruments from './postRequest/fetchRecommendedInstruments';
import PaymentSelector from './components/paymentSelector';

// Define the props interface
interface BoxpayCheckoutProps {
    token: string;
    configurationOptions?: Partial<Record<ConfigurationOptions, any>>,
    onPaymentResult: (result: PaymentResult) => void,
    shopperToken?: string | null
}

const BoxpayCheckout: React.FC<BoxpayCheckoutProps> = ({ token, configurationOptions = {}, onPaymentResult, shopperToken = null }) => {
    const [status, setStatus] = useState("NOACTION")
    const [transactionId, setTransactionId] = useState("")
    const tokenState = useRef(token)
    const showSuccessScreen = configurationOptions?.[ConfigurationOptions?.ShowBoxpaySuccessScreen] ?? true;
    const testEnv = testHandler.testEnv
    const env = configurationOptions?.[ConfigurationOptions?.EnableSandboxEnv] ? 'sandbox' : 'prod'
    const [isUpiIntentVisibile, setIsUpiVisible] = useState(false)
    const [isCardVisible, setIsCardVisible] = useState(false)
    const [isWalletVisible, setIsWalletVisible] = useState(false)
    const [isNetBankingVisible, setIsNetBankingVisible] = useState(false)
    const [isEmiVisible, setIsEmiVisible] = useState(false)
    const [isBNPLVisible, setIsBNPLVisible] = useState(false)
    const [isUpiCollectVisible, setisUpiCollectVisible] = useState(false)
    const appStateListenerRef = useRef<any>(null);
    const [appState] = useState(AppState.currentState);
    const [isGpayInstalled, setIsGpayInstalled] = useState(false)
    const [isAddressVisible, setIsAddressVisible] = useState(false)
    const [isAddressEditable, setisAddressEditable] = useState(false)
    const [isNameVisible, setIsNameVisible] = useState(false)
    const [isPhoneNumberVisible, setIsPhoneNumberVisible] = useState(false)
    const [isEmailVisible, setIsEmailVisible] = useState(false)
    const [isNameEditable, setIsNameEditable] = useState(false)
    const [isPhoneEditable, setIsPhoneEditable] = useState(false)
    const [isEmailEditable, setIsEmailEditable] = useState(false)
    const [isPhonePeInstalled, setIsPhonePeInstalled] = useState(false)
    const [isPaytmInstalled, setIsPaytmInstalled] = useState(false)
    const [loadingState, setLoadingState] = useState(false)
    const [isFirstLoading, setIsFirstLoading] = useState(true)
    const [amount, setAmount] = useState("")
    const [currencySymbol, setCurrencySymbol] = useState("")
    const totalItemsRef = useRef(0)
    const [selectedIntent, setSelectedIntent] = useState<string | null>(null);
    const [primaryButtonColor, setPrimaryButtonColor] = useState("#1CA672")
    const [email, setEmail] = useState<string | null>(null)
    const [firstName, setFirstName] = useState<string | null>(null)
    const [lastName, setLastName] = useState<string | null>(null)
    const [labelType, setLabelType] = useState<string | null>(null)
    const [labelName, setLabelName] = useState<string | null>(null)
    const [phone, setPhone] = useState<string | null>(null)
    const [address, setAddress] = useState("")
    const [failedModalOpen, setFailedModalState] = useState(false)
    const [successModalOpen, setSuccessModalState] = useState(false)
    const lastOpenendUrl = useRef<string>("")
    const paymentFailedMessage = useRef<string>("You may have cancelled the payment or there was a delay in response. Please retry.")
    const [sessionExpireModalOpen, setSessionExppireModalState] = useState(false)
    const [successfulTimeStamp, setSuccessfulTimeStamp] = useState("")
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [showWebView, setShowWebView] = useState(false)
    const [paymentUrl, setPaymentUrl] = useState<string | null>(null)
    const [paymentHtml, setPaymentHtml] = useState<string | null>(null)
    const isUpiOpeningRef = useRef(false)
    const shippingAmountRef = useRef("")
    const taxAmountRef = useRef("")
    const subTotalAmountRef = useRef("")
    const orderItemsArrayRef = useRef<ItemsProp[]>([])
    const [recommendedInstrumentsArray, setRecommendedInstruments] = useState<PaymentClass[]>([])
    const [savedUpiArray, setSavedUpiArray] = useState<PaymentClass[]>([])
    const [upiCollectVisible, setUpiCollectVisible] = useState(false)

    let isFirstTimeLoadRef = true

    const handlePaymentIntent = async () => {
        setLoadingState(true)
        const response = await upiPostRequest(
            {
                type: "upi/intent",
                ...(selectedIntent && { upiAppDetails: { upiApp: selectedIntent } }) // Conditionally add upiAppDetails only if upiIntent is present
            }
        )
        try {
            setStatus(response.status.status)
            setTransactionId(response.transactionId)
            const reason = response.status.statusReason
            const reasonCode = response.status.reasonCode
            const status = response.status.status.toUpperCase()
            if (status === 'REQUIRESACTION' && response.actions?.length > 0) {
                urlToBase64(response.actions[0].url);
            } else if (['FAILED', 'REJECTED'].includes(status)) {
                if (!reasonCode?.startsWith("UF")) {
                    paymentFailedMessage.current = checkoutDetailsHandler.checkoutDetails.errorMessage;
                } else {
                    paymentFailedMessage.current = reason?.includes(":") ? reason.split(":")[1]?.trim() : reason || checkoutDetailsHandler.checkoutDetails.errorMessage;
                }
                setStatus('Failed')
                setFailedModalState(true)
                setLoadingState(false)
            } else if (['APPROVED', 'SUCCESS', 'PAID'].includes(status)) {
                setSuccessfulTimeStamp(response.transactionTimestampLocale)
                setStatus('Success')
                setSuccessModalState(true)
                setLoadingState(false)
            } else if (['EXPIRED'].includes(status)) {
                setSessionExppireModalState(true)
                setStatus('Expired')
                setLoadingState(false)
            }
        } catch (error) {
            setFailedModalState(true)
            setLoadingState(false)
        }
    };

    const handleUpiCollectPayment = async (upiId: string, instrumentRef: string) => {
        const requestPayload = {
            type: "upi/collect",
            upi: instrumentRef ? { instrumentRef: instrumentRef } : { shopperVpa: upiId } // Replace "your_value_here" with actual reference
        };
        setLoadingState(true)
        const response = await upiPostRequest(requestPayload)
        console.log(response)
        try {
            setStatus(response.status.status)
            setTransactionId(response.transactionId)
            const reason = response.status.statusReason
            const reasonCode = response.status.reasonCode
            const actionsArray = response.actions
            const status = response.status.status.toUpperCase()
            if (status === 'REQUIRESACTION' && actionsArray.length > 0) {
                if (Array.isArray(actionsArray)) {
                    if (actionsArray.length > 0) {
                        if (actionsArray[0].type == "html") {
                            setPaymentHtml(actionsArray[0].url)
                        } else {
                            setPaymentUrl(actionsArray[0].url)
                        }
                    }
                }
            } else if (status === 'REQUIRESACTION' && actionsArray.length == 0) {
                navigateToUpiTimerModal(upiId)
            } else if (['FAILED', 'REJECTED'].includes(status)) {
                if (!reasonCode?.startsWith("UF")) {
                    paymentFailedMessage.current = checkoutDetailsHandler.checkoutDetails.errorMessage;
                } else {
                    paymentFailedMessage.current = reason?.includes(":") ? reason.split(":")[1]?.trim() : reason || checkoutDetailsHandler.checkoutDetails.errorMessage;
                }
                setStatus('Failed')
                setFailedModalState(true)
                setLoadingState(false)
            } else if (['APPROVED', 'SUCCESS', 'PAID'].includes(status)) {
                setSuccessfulTimeStamp(response.transactionTimestampLocale)
                setStatus('Success')
                setSuccessModalState(true)
                setLoadingState(false)
            } else if (['EXPIRED'].includes(status)) {
                setSessionExppireModalState(true)
                setStatus('Expired')
                setLoadingState(false)
            }
        } catch (error) {
            setFailedModalState(true)
            setLoadingState(false)
        }
    };

    const navigateToUpiTimerModal = (upiId: string) => {
        setLoadingState(false)
        router.push({
            pathname: "/sdk/screens/upiTimerScreen",
            params: {
                upiId: upiId
            }
        })
    }

    useFocusEffect(
        useCallback(() => {
            if (isFirstTimeLoadRef) {
                isFirstTimeLoadRef = false;
                return;
            }

            const refreshData = () => {
                setFirstName(userDataHandler.userData.firstName)
                setLastName(userDataHandler.userData.lastName)
                setPhone(userDataHandler.userData.phone)
                setEmail(userDataHandler.userData.email)
                const address1Ref = userDataHandler.userData.address1
                const address2Ref = userDataHandler.userData.address2
                const cityRef = userDataHandler.userData.city
                const stateRef = userDataHandler.userData.state
                const postalCodeRef = userDataHandler.userData.pincode

                if (address2Ref == null || address2Ref == "") {
                    setAddress(`${address1Ref}, ${cityRef}, ${stateRef}, ${postalCodeRef}`)
                } else {
                    setAddress(`${address1Ref}, ${address2Ref}, ${cityRef}, ${stateRef}, ${postalCodeRef}`)
                }
            }

            refreshData();
        }, [])
    )


    const urlToBase64 = (base64String: string) => {
        try {
            const decodedString = atob(base64String);
            lastOpenendUrl.current = decodedString
            openUPIIntent(decodedString)
        } catch (error) {
            setFailedModalState(true)
            setLoadingState(false)
        }
    };

    const getRecommendedInstruments = async () => {
        try {
            const response = await fetchRecommendedInstruments();

            // Ensure response is an array; default to an empty array if null/undefined
            const instrumentsList = Array.isArray(response) ? response : [];

            const instruments = instrumentsList.slice(0, 2).map((instrument: any, index: number) => ({
                id: instrument.instrumentRef,
                title: instrument.displayValue,
                image: instrument.logoUrl ? instrument.logoUrl : "///", // Add appropriate image logic if needed
                instrumentTypeValue: instrument.type,
                isSelected: false,
                isLastUsed: index === 0, // Only the first item should have isLastUsed = true
            }));

            const savedUpi = instrumentsList.map((instrument: any, index: number) => ({
                id: instrument.instrumentRef,
                title: instrument.displayValue,
                image: instrument.logoUrl ? instrument.logoUrl : "///", // Add appropriate image logic if needed
                instrumentTypeValue: instrument.type,
                isSelected: false,
                isLastUsed: null
            }));

            setRecommendedInstruments(instruments);
            setSavedUpiArray(savedUpi)
        } catch (error) {
            setRecommendedInstruments([]); // Ensure the list is explicitly set to empty
        } finally {
            setIsFirstLoading(false);
        }
    };



    useEffect(() => {
        if (paymentUrl || paymentHtml) {
            setShowWebView(true)
        }
    }, [paymentUrl, paymentHtml])

    const openUPIIntent = async (url: string) => {
        try {
            await Linking.openURL(url);  // Open the UPI app
            appStateListenerRef.current = AppState.addEventListener('change', handleAppStateChange)
            isUpiOpeningRef.current = true
        } catch (error) {
            isUpiOpeningRef.current = false
            setFailedModalState(true)
            setLoadingState(false)
        }
    };

    const handleAppStateChange = (nextAppState: string) => {
        ToastAndroid.show(`Appstate current ${AppState.currentState}`, ToastAndroid.SHORT);
        if (AppState.currentState === 'active' && isUpiOpeningRef.current) {
            callFetchStatusApi()
        }
    };

    useEffect(() => {
        async function loadFonts() {
            await loadCustomFonts()
            await loadInterCustomFonts()
        }
        loadFonts();
    }, []);

    const stopExpireTimerCountDown = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current)
        }
    }

    const callFetchStatusApi = async () => {
        const response = await fetchStatus(tokenState.current, testEnv ? 'test' : env)
        if (appState == 'active') {
            try {
                setStatus(response.status)
                setTransactionId(response.transactionId)
                const reason = response.statusReason
                const reasonCode = response.reasonCode
                const status = response.status.toUpperCase()
                if (['PENDING'].includes(status) && lastOpenendUrl.current.startsWith("tez:")) {
                    paymentFailedMessage.current = "Payment failed with GPay. Please retry payment with a different UPI app"
                    setFailedModalState(true)
                } else if (['PENDING'].includes(status) && lastOpenendUrl.current.startsWith("phonepe:")) {
                    paymentFailedMessage.current = "Payment failed with PhonePe. Please retry payment with a different UPI app"
                    setFailedModalState(true)
                } else if (['PENDING'].includes(status) && lastOpenendUrl.current.startsWith("paytmmp:")) {
                    paymentFailedMessage.current = "Payment failed with PayTm. Please retry payment with a different UPI app"
                    setFailedModalState(true)
                } else if (['PENDING'].includes(status) && lastOpenendUrl.current.startsWith("upi:")) {
                    paymentFailedMessage.current = checkoutDetailsHandler.checkoutDetails.errorMessage
                    setFailedModalState(true)
                } else if (['PENDING'].includes(status) && lastOpenendUrl.current != "") {
                    paymentFailedMessage.current = checkoutDetailsHandler.checkoutDetails.errorMessage
                    setFailedModalState(true)
                } else if (['FAILED', 'REJECTED'].includes(status)) {
                    if (!reasonCode?.startsWith("UF")) {
                        paymentFailedMessage.current = checkoutDetailsHandler.checkoutDetails.errorMessage
                    } else {
                        paymentFailedMessage.current = reason?.includes(":") ? reason.split(":")[1]?.trim() : reason || checkoutDetailsHandler.checkoutDetails.errorMessage;
                    }
                    setStatus('Failed')
                    setFailedModalState(true)
                } else if (['APPROVED', 'SUCCESS', 'PAID'].includes(status)) {
                    setSuccessfulTimeStamp(response.transactionTimestampLocale)
                    setStatus('Success')
                    setSuccessModalState(true)
                } else if (['EXPIRED'].includes(status)) {
                    setSessionExppireModalState(true)
                    setStatus('Expired')
                }
            } catch (error) {
                const reason = response.status.reason
                const reasonCode = response.status.reasonCode
                if (!reasonCode?.startsWith("UF")) {
                    paymentFailedMessage.current = checkoutDetailsHandler.checkoutDetails.errorMessage
                } else {
                    paymentFailedMessage.current = reason?.includes(":") ? reason.split(":")[1]?.trim() : reason || checkoutDetailsHandler.checkoutDetails.errorMessage
                }
            } finally {
                setSelectedIntent(null)
                setLoadingState(false)
                appStateListenerRef.current?.remove();
                isUpiOpeningRef.current = false
            }
        }
    }

    const onExitCheckout = () => {
        if (!loadingState) {
            stopExpireTimerCountDown()
            const mockPaymentResult: PaymentResult = {
                status: status,
                transactionId: transactionId,
            };
            paymentHandler.onPaymentResult(mockPaymentResult);
            router.dismissAll()
            return true
        }
    }


    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            if (showWebView) {
                setShowWebView(false);
                paymentFailedMessage.current = checkoutDetailsHandler.checkoutDetails.errorMessage
                setStatus('Failed');
                setFailedModalState(true);
                setLoadingState(false)
                return true
            } else if (loadingState) {
                return true
            }
            return onExitCheckout(); // Allow back navigation if not loading
        });

        return () => backHandler.remove();
    });

    const checkAppInstalled = async (packageNames: string[]) => {
        try {
            const result = await checkInstalledApps(packageNames);
            return Object.values(result);
        } catch (error) {
            return []; // Return empty array on error
        }
    };

    const navigateToCardScreen = () => {
        router.push({
            pathname: "/sdk/screens/cardScreen"
        })
    }

    const navigateToWalletScreen = () => {
        router.push({
            pathname: "/sdk/screens/walletsScreen"
        })
    }

    const navigateToNetBankingScreen = () => {
        router.push({
            pathname: "/sdk/screens/netBankingScreen"
        })
    }

    const navigateToEmiScreen = () => {
        router.push({
            pathname: "/sdk/screens/emiScreen"
        })
    }

    const navigateToBNPLScreen = () => {
        router.push({
            pathname: "/sdk/screens/bnplScreen"
        })
    }

    const navigateToAddressScreen = () => {
        router.push({
            pathname: "/sdk/screens/addressScreen"
        })
    }

    useEffect(() => {
        const fetchPaymentMethods = async () => {
            // const endpoint: string = testEnv
            //     ? 'test-apis.boxpay.tech'
            //     : env == 'sandbox'
            //         ? 'sandbox-apis.boxpay.tech'
            //         : 'apis.boxpay.in';
            const endpoint: string = "test-apis.boxpay.tech"
            try {
                setIsFirstLoading(true);
                const response = await axios.get(`https://${endpoint}/v0/checkout/sessions/${tokenState.current}`);
                const paymentMethods = response.data.configs.paymentMethods;
                const enabledFields = response.data.configs.enabledFields
                const paymentDetails = response.data.paymentDetails
                setIsUpiVisible(paymentMethods.find((method: any) => method.type === 'Upi' && method.brand === 'UpiIntent'))
                setisUpiCollectVisible(paymentMethods.find((method: any) => method.type === 'Upi' && method.brand === 'UpiCollect'))
                setIsCardVisible(paymentMethods.find((method: any) => method.type === 'Card'))
                setIsWalletVisible(paymentMethods.find((method: any) => method.type === 'Wallet'))
                setIsNetBankingVisible(paymentMethods.find((method: any) => method.type === 'NetBanking'))
                setIsEmiVisible(paymentMethods.find((method: any) => method.type === 'Emi'))
                setIsBNPLVisible(paymentMethods.find((method: any) => method.type === 'BuyNowPayLater'))
                setAmount(paymentDetails.money.amountLocaleFull)
                const currencyCode: string | undefined = paymentDetails?.money?.currencyCode;
                const symbol = currencyCode ? getSymbolFromCurrency(currencyCode) ?? "₹" : "₹";
                setCurrencySymbol(symbol);
                if (paymentDetails.order != null && paymentDetails.order.items != null) {
                    const total = paymentDetails.order.items.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
                    totalItemsRef.current = total;
                    shippingAmountRef.current = paymentDetails.order.shippingAmountLocaleFull != null ? paymentDetails.order.shippingAmountLocaleFull : ""
                    taxAmountRef.current = paymentDetails.order.taxAmountLocaleFull != null ? paymentDetails.order.taxAmountLocaleFull : ""
                    subTotalAmountRef.current = paymentDetails.order.originalAmountLocaleFull != null ? paymentDetails.order.originalAmountLocaleFull : ""
                    const formattedItemsArray: ItemsProp[] = paymentDetails.order.items.map((item: any) => ({
                        imageUrl: item.imageUrl,
                        imageTitle: item.itemName,
                        imageOty: item.quantity,
                        imageAmount: item.amountWithoutTaxLocaleFull
                    }));
                    orderItemsArrayRef.current = formattedItemsArray
                }
                setPrimaryButtonColor(response.data.merchantDetails.checkoutTheme.primaryButtonColor)
                const emailRef = paymentDetails.shopper.email
                const firstNameRef = paymentDetails.shopper.firstName
                const lastNameRef = paymentDetails.shopper.lastName
                const phoneRef = paymentDetails.shopper.phoneNumber
                const uniqueIdRef = paymentDetails.shopper.uniqueReference
                const dobRef = paymentDetails.shopper.dateOfBirth
                const panRef = paymentDetails.shopper.panNumber
                setEmail(emailRef)
                setFirstName(firstNameRef)
                setLastName(lastNameRef)
                setPhone(phoneRef)
                startCountdown(response.data.sessionExpiryTimestamp)
                const installedApps = await checkAppInstalled(["com.phonepe.app", "com.google.android.apps.nbu.paisa.user", "net.one97.paytm"])
                setIsPhonePeInstalled(installedApps[0])
                setIsGpayInstalled(installedApps[1])
                setIsPaytmInstalled(installedApps[2])
                let labelTypeRef = null
                let address1Ref = null
                let labelNameRef = null
                let address2Ref = null
                let cityRef = null
                let stateRef = null
                let postalCodeRef = null
                let countryCodeRef = null
                if (paymentDetails.shopper.deliveryAddress != null) {
                    const deliveryObject = paymentDetails.shopper.deliveryAddress
                    labelTypeRef = deliveryObject.labelType
                    labelNameRef = deliveryObject.labelName
                    address1Ref = deliveryObject.address1
                    address2Ref = deliveryObject.address2
                    cityRef = deliveryObject.city
                    stateRef = deliveryObject.state
                    postalCodeRef = deliveryObject.postalCode
                    countryCodeRef = deliveryObject.countryCode

                    setLabelName(labelNameRef)
                    setLabelType(labelTypeRef)

                    if (address2Ref == null || address2Ref == "") {
                        setAddress(`${address1Ref}, ${cityRef}, ${stateRef}, ${postalCodeRef}`)
                    } else {
                        setAddress(`${address1Ref}, ${address2Ref}, ${cityRef}, ${stateRef}, ${postalCodeRef}`)
                    }
                }
                if (['APPROVED', 'SUCCESS', 'PAID'].includes(response.data.status)) {
                    setSuccessfulTimeStamp(response.data.lastPaidAtTimestampLocale)
                    setTransactionId(response.data.lastTransactionId)
                    setStatus(response.data.status)
                    setSuccessModalState(true)
                } else if (['EXPIRED'].includes(response.data.status)) {
                    setSessionExppireModalState(true)
                }
                setUserDataHandler({
                    userData: {
                        email: emailRef,
                        firstName: firstNameRef,
                        lastName: lastNameRef,
                        phone: phoneRef,
                        uniqueId: uniqueIdRef,
                        dob: dobRef,
                        pan: panRef,
                        address1: address1Ref,
                        address2: address2Ref,
                        city: cityRef,
                        state: stateRef,
                        pincode: postalCodeRef,
                        country: countryCodeRef,
                        labelType: labelTypeRef,
                        labelName: labelNameRef
                    }
                })
                const isFieldEnabled = (fieldName: string) => {
                    return enabledFields.some((field: { field: string }) => field.field === fieldName);
                }

                const isFieldEditable = (fieldName: string) => {
                    const field = enabledFields.find((field: { field: string; editable?: boolean }) => field.field === fieldName);
                    return field?.editable === true;
                }
                const showSuccessScreen = response.data.configs.showSuccessScreen
                const showShippingAddress = isFieldEnabled('SHIPPING_ADDRESS');
                setIsAddressVisible(showShippingAddress)
                const showShippingAddressEditable = isFieldEditable('SHIPPING_ADDRESS');
                setisAddressEditable(showShippingAddressEditable)

                const showFullName = isFieldEnabled('SHOPPER_NAME');
                const showFullNameEditable = isFieldEditable('SHOPPER_NAME');
                setIsNameVisible(showFullName)
                setIsNameEditable(showFullNameEditable)

                const showEmail = isFieldEnabled('SHOPPER_EMAIL');
                const showEmailEditable = isFieldEditable('SHOPPER_EMAIL');
                setIsEmailVisible(showEmail)
                setIsEmailEditable(showEmailEditable)

                const showPhone = isFieldEnabled('SHOPPER_PHONE');
                const showPhoneEditable = isFieldEditable('SHOPPER_PHONE');
                setIsPhoneEditable(showPhoneEditable)
                setIsPhoneNumberVisible(showPhone)

                const showPan = isFieldEnabled('SHOPPER_PAN');
                const showPanEditable = isFieldEditable('SHOPPER_PAN');

                const showDOB = isFieldEnabled('SHOPPER_DOB');
                const showDOBEditable = isFieldEditable('SHOPPER_DOB');
                setCheckoutDetailsHandler({
                    checkoutDetails: {
                        currencySymbol: symbol,
                        amount: paymentDetails.money.amountLocaleFull,
                        token: tokenState.current,
                        brandColor: response.data.merchantDetails.checkoutTheme.primaryButtonColor,
                        env: testEnv ? 'test' : env,
                        itemsLength: totalItemsRef.current,
                        errorMessage: "You may have cancelled the payment or there was a delay in response. Please retry.",
                        shopperToken: shopperToken,
                        isSuccessScreenVisible: showSuccessScreen,
                        isShippingAddressEnabled: showShippingAddress,
                        isShippingAddressEditable: showShippingAddressEditable,
                        isFullNameEnabled: showFullName,
                        isFullNameEditable: showFullNameEditable,
                        isEmailEnabled: showEmail,
                        isEmailEditable: showEmailEditable,
                        isPhoneEnabled: showPhone,
                        isPhoneEditable: showPhoneEditable,
                        isPanEnabled: showPan,
                        isPanEditable: showPanEditable,
                        isDOBEnabled: showDOB,
                        isDOBEditable: showDOBEditable,
                        showSuccessScreen : showSuccessScreen
                    }
                })
                setPaymentHandler({
                    onPaymentResult: onPaymentResult
                })
            } catch (error) {
                ToastAndroid.show("Please check the token and the environment selected", ToastAndroid.SHORT);
            } finally {
                if (shopperToken != null && shopperToken != "") {
                    getRecommendedInstruments()
                } else {
                    setIsFirstLoading(false);
                } // Set loading to false when API request is finished
            }
        };

        fetchPaymentMethods();
    }, [tokenState.current]);

    const onClickRadio = (instrumentValue: string) => {
        const updatedList = recommendedInstrumentsArray.map((item) => ({
            ...item,
            isSelected: item.id === instrumentValue
        }));
        setRecommendedInstruments(updatedList);
        setSelectedIntent(null)
        setUpiCollectVisible(false)
        setDefaultSavedUpiList()
    }

    const onClickSavedRadio = (instrumentValue: string) => {
        const updatedList = savedUpiArray.map((item) => ({
            ...item,
            isSelected: item.id === instrumentValue
        }));
        setSavedUpiArray(updatedList);
        setSelectedIntent(null)
        setDefaultRecommendedList()
        setUpiCollectVisible(false)
    }

    const setDefaultRecommendedList = () => {
        const updatedList = recommendedInstrumentsArray.map((item) => ({
            ...item,
            isSelected: false
        }));
        setRecommendedInstruments(updatedList)
    }

    const setDefaultSavedUpiList = () => {
        const updatedList = savedUpiArray.map((item) => ({
            ...item,
            isSelected: false
        }));
        setSavedUpiArray(updatedList)
    }

    function startCountdown(sessionExpiryTimestamp: string) {
        if (sessionExpiryTimestamp === "") {
            return;
        }
        const expiryTime = new Date(sessionExpiryTimestamp)
        const expiryTimeIST = new Date(expiryTime.getTime() + 5.5 * 60 * 60 * 1000);

        timerRef.current = setInterval(() => {
            const currentTimeIST = new Date(new Date().getTime() + 5.5 * 60 * 60 * 1000);
            const timeDiff = expiryTimeIST.getTime() - currentTimeIST.getTime();
            if (timeDiff <= 0) {
                if (timerRef.current) {
                    clearInterval(timerRef.current);
                }
                setStatus('EXPIRED')
                setSessionExppireModalState(true)
            }
            // const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
            // const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
            // const seconds = Math.floor((timeDiff / 1000) % 60);

            // console.log(`${hours}hr ${minutes}min ${seconds}sec`)
        }, 1000);
    }

    useEffect(() => {
        if (selectedIntent != null) {
            if (selectedIntent == "") {
                handlePaymentIntent()
            }
        }
    }, [selectedIntent])

    return (
        <View style={{ flex: 1, backgroundColor: '#F5F6FB' }}>
            <StatusBar barStyle="dark-content" />
            {isFirstLoading ? (
                <View style={{ flex: 1, backgroundColor: 'white' }}>
                    <ShimmerPlaceHolder visible={false} style={{ width: '100%', height: 90, marginTop: 10 }} />
                    <ShimmerPlaceHolder visible={false} style={{ width: '100%', height: 50, borderRadius: 10, marginTop: 30 }} />
                    <ShimmerPlaceHolder visible={false} style={{ width: '100%', height: 50, borderRadius: 10, marginTop: 25 }} />
                    <ShimmerPlaceHolder visible={false} style={{ width: '100%', height: 50, borderRadius: 10, marginTop: 25 }} />
                    <ShimmerPlaceHolder visible={false} style={{ width: '100%', height: 50, borderRadius: 10, marginTop: 25 }} />
                </View>
            ) : loadingState ? (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <LottieView source={require('../../assets/animations/boxpayLogo.json')} autoPlay loop style={{ width: 80, height: 80 }} />
                    <Text>Loading...</Text>
                </View>
            ) : (
                <View style={{ flex: 1, backgroundColor: '#F5F6FB' }}>
                    {/* Keyboard Avoiding View */}
                    <ScrollView  // Wrap the content with ScrollView
                        contentContainerStyle={{ flexGrow: 1 }} // Ensure content can grow to take up space
                        keyboardShouldPersistTaps="handled" // Keep keyboard open on tap
                    >
                        <View style={{ flex: 1 }}>
                            {/* Main UI Content */}
                            <Header onBackPress={onExitCheckout} showDesc={true} showSecure={true} text='Payment Details' />
                            {(address != "" && isAddressVisible) && (
                                <View>
                                    <Text style={{
                                        marginStart: 16,
                                        marginTop: 20,
                                        fontSize: 14,
                                        color: '#020815B5',
                                        fontFamily: 'Poppins-SemiBold'
                                    }}>Address</Text>
                                    <Pressable style={{
                                        borderColor: '#F1F1F1',
                                        borderWidth: 1,
                                        marginHorizontal: 16,
                                        marginTop: 8,
                                        paddingBottom: 16,
                                        backgroundColor: "white",
                                        flexDirection: 'row',
                                        borderRadius: 12,
                                    }} onPress={() => {
                                        if (isAddressEditable) {
                                            navigateToAddressScreen()
                                        }
                                    }}>
                                        <Image source={require("../../assets/images/ic_location.png")} style={{ height: 20, width: 20, marginStart: 12, marginTop: 20 }} />
                                        <View style={{ flexDirection: 'column', marginStart: 8, marginTop: 12, marginEnd: 8, flex: 1 }}>
                                            <Text style={{
                                                fontSize: 12,
                                                color: '#4F4D55',
                                                fontFamily: 'Poppins-Regular'
                                            }}>Deliver at <Text style={{
                                                fontFamily: 'Poppins-SemiBold', fontSize: 12, color: '#4F4D55'
                                            }}>{labelType === "Other" ? labelName : labelType}</Text>
                                            </Text>
                                            <Text
                                                numberOfLines={1}
                                                ellipsizeMode="tail"
                                                style={{
                                                    fontSize: 14,
                                                    color: '#4F4D55',
                                                    fontFamily: 'Poppins-SemiBold',
                                                    flexShrink: 1,
                                                    marginTop: -4
                                                }}
                                            >
                                                {address}
                                            </Text>
                                        </View>
                                    </Pressable>
                                </View>
                            )}

                            {(address == "" && isAddressVisible) && (
                                <View>
                                    <Text style={{
                                        marginStart: 16,
                                        marginTop: 20,
                                        fontSize: 14,
                                        color: '#020815B5',
                                        fontFamily: 'Poppins-SemiBold'
                                    }}>Address</Text>
                                    <Pressable style={{
                                        borderColor: '#F1F1F1',
                                        borderWidth: 1,
                                        marginHorizontal: 16,
                                        marginTop: 8,
                                        paddingBottom: 16,
                                        backgroundColor: "white",
                                        flexDirection: 'row',
                                        borderRadius: 12,
                                    }} onPress={() => {
                                        if (isAddressEditable) {
                                            navigateToAddressScreen()
                                        }
                                    }}>
                                        <Image source={require("../../assets/images/add_icon.png")} style={{ height: 20, width: 20, marginStart: 12, marginTop: 20 }} />
                                        <Text
                                            numberOfLines={1}
                                            ellipsizeMode="tail"
                                            style={{
                                                fontSize: 14,
                                                color: primaryButtonColor,
                                                fontFamily: 'Poppins-SemiBold',
                                                flexShrink: 1,
                                                marginTop: -4
                                            }}
                                        >
                                            Add new address
                                        </Text>
                                    </Pressable>
                                </View>
                            )}

                            {((isNameVisible || isPhoneNumberVisible || isEmailVisible) && !isAddressVisible) && (
                                <View>
                                    <Text style={{
                                        marginStart: 16,
                                        marginTop: 20,
                                        fontSize: 14,
                                        color: '#020815B5',
                                        fontFamily: 'Poppins-SemiBold'
                                    }}>Personal Details</Text>
                                    <Pressable style={{
                                        borderColor: '#F1F1F1',
                                        borderWidth: 1,
                                        marginHorizontal: 16,
                                        marginTop: 8,
                                        paddingBottom: 16,
                                        backgroundColor: "white",
                                        flexDirection: 'row',
                                        borderRadius: 12,
                                    }} onPress={() => {
                                        if (isNameEditable || isPhoneEditable || isEmailEditable) {
                                            navigateToAddressScreen()
                                        }
                                    }}>
                                        {(firstName != "" || phone != "" || email != "") && (
                                            <>
                                                <Image source={require("../../assets/images/ic_user.png")} style={{ height: 20, width: 20, marginStart: 12, marginTop: 20 }} />
                                                <View style={{ flexDirection: 'column', marginStart: 8, marginTop: 12, marginEnd: 8, flex: 1 }}>
                                                    <Text style={{
                                                        fontSize: 14,
                                                        color: '#4F4D55',
                                                        fontFamily: 'Poppins-SemiBold'
                                                    }}>{firstName} {lastName} | <Text style={{
                                                        fontFamily: 'Poppins-SemiBold', fontSize: 14, color: '#4F4D55'
                                                    }}>{phone}</Text>
                                                    </Text>
                                                    <Text
                                                        numberOfLines={1}
                                                        ellipsizeMode="tail"
                                                        style={{
                                                            fontSize: 12,
                                                            color: '#4F4D55',
                                                            fontFamily: 'Poppins-Regular',
                                                            flexShrink: 1,
                                                            marginTop: -4
                                                        }}
                                                    >
                                                        {email}
                                                    </Text>
                                                </View>
                                            </>
                                        )}
                                        {(firstName == "" || phone == "" || email == "") && (
                                            <>
                                                <Image source={require("../../assets/images/add_icon.png")} style={{ height: 20, width: 20, marginStart: 12, marginTop: 20 }} />
                                                <Text
                                                    numberOfLines={1}
                                                    ellipsizeMode="tail"
                                                    style={{
                                                        fontSize: 14,
                                                        color: primaryButtonColor,
                                                        fontFamily: 'Poppins-SemiBold',
                                                        flexShrink: 1,
                                                        marginTop: -4
                                                    }}
                                                >
                                                    Add personal details
                                                </Text></>
                                        )}
                                    </Pressable>
                                </View>
                            )}

                            {recommendedInstrumentsArray.length > 0 && (
                                <>
                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{
                                            marginStart: 14,
                                            marginTop: 20,
                                            fontSize: 14,
                                            color: '#020815B5',
                                            fontFamily: 'Poppins-SemiBold'
                                        }}>Recommended</Text>
                                    </View>
                                    <View style={{
                                        borderColor: '#F1F1F1',
                                        borderWidth: 1,
                                        marginHorizontal: 16,
                                        marginVertical: 8,
                                        backgroundColor: "white",
                                        flexDirection: 'column',
                                        borderRadius: 12,
                                    }}>
                                        {recommendedInstrumentsArray.map((item, index) => (
                                            <View key={index}>
                                                <PaymentSelector id={item.id} title={item.title} image={item.image} isSelected={item.isSelected} instrumentTypeValue={item.instrumentTypeValue} onPress={() => onClickRadio(item.id)} onProceedForward={() => handleUpiCollectPayment(item.title, item.id)} errorImage={require("../../assets/images/ic_upi.png")} isLastUsed={item.isLastUsed} scale={0.2} />
                                                {index !== recommendedInstrumentsArray.length - 1 && (
                                                    <View style={{ flexDirection: 'row', height: 1, backgroundColor: '#ECECED' }} />
                                                )}
                                            </View>
                                        ))}
                                    </View>
                                </>
                            )}

                            <UpiScreen
                                isUpiIntentVisible={isUpiIntentVisibile}
                                isGpayVisible={isGpayInstalled}
                                isPaytmVisible={isPaytmInstalled}
                                isPhonePeVisible={isPhonePeInstalled}
                                isUpiCollectVisible={isUpiCollectVisible}
                                selectedIntent={selectedIntent}
                                setSelectedIntent={(it) => {
                                    setSelectedIntent(it)
                                    setDefaultRecommendedList()
                                    setDefaultSavedUpiList()
                                }}
                                handleUpiPayment={handlePaymentIntent}
                                handleCollectPayment={(item: string, id: string) => handleUpiCollectPayment(item, id)}
                                upiCollectVisible={upiCollectVisible}
                                setUpiCollectVisible={(it) => {
                                    setUpiCollectVisible(it)
                                }}
                                savedUpiArray={savedUpiArray}
                                onClickRadio={(it) => {
                                    onClickSavedRadio(it)
                                }}
                            />
                            <View>
                                {(isCardVisible || isWalletVisible || isNetBankingVisible || isBNPLVisible || isEmiVisible) && (
                                    <View>
                                        {(isUpiCollectVisible || isUpiIntentVisibile) ? (<Text style={{
                                            marginStart: 16,
                                            marginTop: 12,
                                            fontSize: 14,
                                            color: '#020815B5',
                                            fontFamily: 'Poppins-SemiBold'
                                        }}>More Payment Options</Text>) : (
                                            <Text style={{
                                                marginStart: 16,
                                                marginTop: 12,
                                                fontSize: 14,
                                                color: '#020815B5',
                                                fontFamily: 'Poppins-SemiBold'
                                            }}>Payment Options</Text>
                                        )}

                                        <View style={{
                                            flex: 1, backgroundColor: 'white', marginVertical: 8, marginHorizontal: 16, borderRadius: 12, flexDirection: 'column', borderColor: '#F1F1F1',
                                            borderWidth: 1,
                                            paddingBottom: 16
                                        }}>
                                            {isCardVisible && (
                                                <Pressable style={{ paddingHorizontal: 16, paddingTop: 16 }} onPress={navigateToCardScreen}>
                                                    <MorePaymentContainer title='Cards' image={require('../../assets/images/ic_card.png')} />
                                                    {(isWalletVisible || isNetBankingVisible || isEmiVisible || isBNPLVisible) && (
                                                        <View style={{ flexDirection: 'row', height: 1, backgroundColor: '#ECECED', marginTop: 16, marginHorizontal: -16 }} />
                                                    )}
                                                </Pressable>
                                            )}
                                            {isWalletVisible && (
                                                <Pressable style={{ paddingHorizontal: 16, paddingTop: 16 }} onPress={navigateToWalletScreen}>
                                                    <MorePaymentContainer title='Wallet' image={require('../../assets/images/ic_wallet.png')} />
                                                    {(isNetBankingVisible || isEmiVisible || isBNPLVisible) && (
                                                        <View style={{ flexDirection: 'row', height: 1, backgroundColor: '#ECECED', marginTop: 16, marginHorizontal: -16 }} />
                                                    )}
                                                </Pressable>
                                            )}
                                            {isNetBankingVisible && (
                                                <Pressable style={{ paddingHorizontal: 16, paddingTop: 16 }} onPress={navigateToNetBankingScreen}>
                                                    <MorePaymentContainer title='Netbanking' image={require('../../assets/images/ic_netbanking.png')} />
                                                    {(isEmiVisible || isBNPLVisible) && (
                                                        <View style={{ flexDirection: 'row', height: 1, backgroundColor: '#ECECED', marginTop: 16, marginHorizontal: -16 }} />
                                                    )}
                                                </Pressable>
                                            )}
                                            {isEmiVisible && (
                                                <Pressable style={{ paddingHorizontal: 16, paddingTop: 16 }} onPress={navigateToEmiScreen}>
                                                    <MorePaymentContainer title='EMI' image={require('../../assets/images/ic_emi.png')} />
                                                    {(isBNPLVisible) && (
                                                        <View style={{ flexDirection: 'row', height: 1, backgroundColor: '#ECECED', marginTop: 16, marginHorizontal: -16 }} />
                                                    )}
                                                </Pressable>
                                            )}
                                            {isBNPLVisible && (
                                                <Pressable style={{ paddingHorizontal: 16, paddingTop: 16 }} onPress={navigateToBNPLScreen}>
                                                    <MorePaymentContainer title='Pay Later' image={require('../../assets/images/ic_bnpl.png')} />
                                                </Pressable>
                                            )}
                                        </View>
                                    </View>
                                )}

                            </View>
                            <View>
                                <Text style={{
                                    marginStart: 16,
                                    marginTop: 12,
                                    fontSize: 14,
                                    color: '#020815B5',
                                    fontFamily: 'Poppins-SemiBold'
                                }}>Order Summary</Text>

                                <OrderDetails
                                    subTotalAmount={subTotalAmountRef.current}
                                    shippingAmount={shippingAmountRef.current}
                                    totalAmount={amount}
                                    itemsArray={orderItemsArrayRef.current}
                                    taxAmount={taxAmountRef.current}
                                />
                            </View>

                            {/* Secured by BoxPay - Fixed at Bottom */}
                            <View style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'flex-end',
                                backgroundColor: '#F5F6FB',
                                flexDirection: 'row'
                            }}>
                                <Text style={{
                                    fontSize: 12, color: "#888888", marginBottom: 15,
                                    fontFamily: 'Poppins-Medium'
                                }}>Secured by</Text>
                                <Image
                                    source={require("../../assets/images/splash-icon.png")}
                                    style={{ height: 50, width: 50, }}
                                />
                            </View>

                        </View>
                    </ScrollView>
                </View>
            )}

            {/* Modals for Different Payment Statuses */}
            {failedModalOpen && (
                <PaymentFailed
                    onClick={() => setFailedModalState(false)}
                    errorMessage={paymentFailedMessage.current}
                />
            )}

            {successModalOpen && (
                <PaymentSuccess
                    onClick={onExitCheckout}
                    transactionId={transactionId}
                    method="UPI"
                    localDateTime={successfulTimeStamp}
                />
            )}

            {sessionExpireModalOpen && (
                <SessionExpire
                    onClick={onExitCheckout}
                />
            )}

            {showWebView && (
                <View style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'white'
                }}>
                    <WebViewScreen
                        url={paymentUrl}
                        html={paymentHtml}
                        onBackPress={() => {
                            callFetchStatusApi()
                            setShowWebView(false);
                        }}
                    />
                </View>
            )}
        </View>
    );
};

export default BoxpayCheckout;


export type TestEnvArg = {
    testEnv: boolean
};

export let testHandler: TestEnvArg = {
    testEnv: false
};

export const setTestEnv = (handler: TestEnvArg) => {
    testHandler = handler;
};