"use strict";

import { View, Text, BackHandler, Image, ScrollView, Dimensions } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { checkoutDetailsHandler, setCheckOutDetailsHandlerToDefault } from "../sharedContext/checkoutDetailsHandler.js";
import LottieView from 'lottie-react-native';
import Header from "../components/header.js";
import { TextInput } from 'react-native-paper';
import ShimmerView from "../components/shimmerView.js";
import PaymentSuccess from "../components/paymentSuccess.js";
import SessionExpire from "../components/sessionExpire.js";
import PaymentFailed from "../components/paymentFailed.js";
import { paymentHandler } from "../sharedContext/paymentStatusHandler.js";
import methodsPostRequest from "../postRequest/methodsPostRequest.js";
import fetchStatus from "../postRequest/fetchStatus.js";
import WebViewScreen from "./webViewScreen.js";
import PaymentSelectorView from "../components/paymentSelector.js";
import { fetchPaymentMethodHandler, handleFetchStatusResponseHandler, handlePaymentResponse } from "../sharedContext/handlePaymentResponseHandler.js";
import styles from "../styles/screens/netBankingScreenStyles.js";
import { setUserDataHandlerToDefault } from "../sharedContext/userdataHandler.js";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
const NetBankingScreen = ({
  navigation
}) => {
  const [netBankingList, setNetBankingList] = useState([]);
  const [defaultNetBankingList, setDefaultNetBankingList] = useState([]);
  const [searchText, setSearchText] = useState('');
  const {
    checkoutDetails
  } = checkoutDetailsHandler;
  const [loading, setLoading] = useState(false);
  const screenHeight = Dimensions.get('window').height;
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [checkedOnce, setCheckedOnce] = useState(false);
  const defaultpopularNetBankingList = ['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Punjab National Bank Retail'];
  const [popularNetBankingList, setPopularNetBankingList] = useState([]);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [paymentHtml, setPaymentHtml] = useState(null);
  const [showWebView, setShowWebView] = useState(false);
  const [failedModalOpen, setFailedModalState] = useState(false);
  const [successModalOpen, setSuccessModalState] = useState(false);
  const paymentFailedMessage = useRef('You may have cancelled the payment or there was a delay in response. Please retry.');
  const [sessionExpireModalOpen, setSessionExppireModalState] = useState(false);
  const [successfulTimeStamp, setSuccessfulTimeStamp] = useState('');
  const [status, setStatus] = useState(null);
  const [transactionId, setTransactionId] = useState(null);
  const backgroundApiInterval = useRef(null);
  const [searchTextFocused, setSearchTextFocused] = useState(false);
  const onProceedBack = () => {
    if (!loading) {
      navigation.goBack();
      return true;
    }
    return false;
  };
  const handleSearchTextChange = text => {
    setSearchText(text);
  };
  useEffect(() => {
    const backAction = () => {
      if (showWebView) {
        setShowWebView(false);
        paymentFailedMessage.current = checkoutDetails.errorMessage;
        setStatus('Failed');
        setFailedModalState(true);
        setLoading(false);
        return true;
      } else if (loading) {
        return true; // Prevent default back action
      }
      return onProceedBack();
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [navigation]);
  useEffect(() => {
    const fetchData = async () => {
      fetchPaymentMethodHandler({
        paymentType: "NetBanking",
        setList: list => {
          const popularList = list.filter(item => defaultpopularNetBankingList.includes(item.displayValue ?? ''));
          setNetBankingList(list);
          setPopularNetBankingList(popularList);
          setDefaultNetBankingList(list);
        }
      });
    };
    fetchData();
  }, []);
  const callFetchStatusApi = async () => {
    const response = await fetchStatus();
    handleFetchStatusResponseHandler({
      response: response,
      checkoutDetailsErrorMessage: checkoutDetailsHandler.checkoutDetails.errorMessage,
      onSetStatus: setStatus,
      onSetTransactionId: setTransactionId,
      onSetFailedMessage: msg => {
        paymentFailedMessage.current = msg;
      },
      onShowFailedModal: () => {
        setFailedModalState(true);
      },
      onShowSuccessModal: ts => {
        setSuccessfulTimeStamp(ts);
        setSuccessModalState(true);
      },
      onShowSessionExpiredModal: () => {
        setSessionExppireModalState(true);
      },
      setLoading: setLoading,
      stopBackgroundApiTask: stopBackgroundApiTask,
      isFromUPIIntentFlow: false
    });
  };
  const startBackgroundApiTask = () => {
    backgroundApiInterval.current = setInterval(() => {
      callFetchStatusApi();
    }, 4000);
  };
  const stopBackgroundApiTask = () => {
    if (backgroundApiInterval.current) {
      clearInterval(backgroundApiInterval.current);
    }
  };
  useEffect(() => {
    if (paymentUrl || paymentHtml) {
      setShowWebView(true);
    }
  }, [paymentUrl, paymentHtml]);
  const onProceedForward = async (_, instrumentType) => {
    setLoading(true);
    const response = await methodsPostRequest(instrumentType, 'netBanking');
    handlePaymentResponse({
      response: response,
      checkoutDetailsErrorMessage: checkoutDetails.errorMessage,
      onSetStatus: setStatus,
      onSetTransactionId: setTransactionId,
      onSetPaymentHtml: setPaymentHtml,
      onSetPaymentUrl: setPaymentUrl,
      onSetFailedMessage: msg => paymentFailedMessage.current = msg,
      onShowFailedModal: () => setFailedModalState(true),
      onShowSuccessModal: ts => {
        setSuccessfulTimeStamp(ts);
        setSuccessModalState(true);
      },
      onShowSessionExpiredModal: () => setSessionExppireModalState(true),
      setLoading: setLoading
    });
  };
  const onClickRadioButton = id => {
    const updatedNetBankingList = netBankingList.map(netBankingItem => ({
      ...netBankingItem,
      isSelected: netBankingItem.id === id
    }));
    const updatedPopularNetBankingList = popularNetBankingList.map(popularNetBankingItem => ({
      ...popularNetBankingItem,
      isSelected: false
    }));
    setPopularNetBankingList(updatedPopularNetBankingList);
    setNetBankingList(updatedNetBankingList);
  };
  const onClickPopularBank = id => {
    const updatedPopularNetBankingList = popularNetBankingList.map(popularNetBankingItem => ({
      ...popularNetBankingItem,
      isSelected: popularNetBankingItem.id === id
    }));
    const updatedNetBankingList = netBankingList.map(netBankingItem => ({
      ...netBankingItem,
      isSelected: false
    }));
    setNetBankingList(updatedNetBankingList);
    setPopularNetBankingList(updatedPopularNetBankingList);
  };
  const onExitCheckout = () => {
    setSuccessModalState(false);
    setSessionExppireModalState(false);
    const mockPaymentResult = {
      status: status || '',
      transactionId: transactionId || ''
    };
    setUserDataHandlerToDefault();
    setCheckOutDetailsHandlerToDefault();
    paymentHandler.onPaymentResult(mockPaymentResult);
  };
  useEffect(() => {
    if (netBankingList.length > 0) {
      setIsFirstLoad(false);
    }
  }, [netBankingList]);
  useEffect(() => {
    if (searchText.length > 0) {
      const filteredNetBankingList = defaultNetBankingList.filter(item => {
        const words = item.displayValue.toLowerCase().split(/\s+/); // Split title into words
        return words.some(word => word.startsWith(searchText.toLowerCase())); // Check if any word starts with searchText
      });
      setNetBankingList(filteredNetBankingList);
    } else {
      setNetBankingList(defaultNetBankingList);
    }
  }, [searchText]);
  return /*#__PURE__*/_jsxs(View, {
    style: styles.screenView,
    children: [loading ? /*#__PURE__*/_jsxs(View, {
      style: styles.loadingContainer,
      children: [/*#__PURE__*/_jsx(LottieView, {
        source: require('../../assets/animations/boxpayLogo.json'),
        autoPlay: true,
        loop: true,
        style: styles.lottieStyle
      }), /*#__PURE__*/_jsx(Text, {
        children: "Loading..."
      })]
    }) : isFirstLoad ? /*#__PURE__*/_jsx(ShimmerView, {}) : /*#__PURE__*/_jsxs(View, {
      style: styles.availableScreenView,
      children: [/*#__PURE__*/_jsx(Header, {
        onBackPress: onProceedBack,
        showDesc: true,
        showSecure: false,
        text: "Select Bank"
      }), /*#__PURE__*/_jsx(View, {
        style: styles.divider
      }), isSearchVisible && /*#__PURE__*/_jsx(View, {
        style: {
          backgroundColor: 'white',
          paddingBottom: 20
        },
        children: /*#__PURE__*/_jsx(TextInput, {
          mode: "outlined",
          label: /*#__PURE__*/_jsx(Text, {
            style: [styles.searchTextInputLabel, {
              color: searchTextFocused ? '#2D2B32' : searchText != '' && searchText != null ? '#2D2B32' : '#ADACB0',
              fontFamily: checkoutDetails.fontFamily.regular
            }],
            children: "Search for bank"
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
        })
      }), /*#__PURE__*/_jsxs(ScrollView, {
        contentContainerStyle: {
          flexGrow: 1
        },
        keyboardShouldPersistTaps: "handled",
        onContentSizeChange: (_, contentHeight) => {
          if (!checkedOnce) {
            if (contentHeight > screenHeight) {
              setIsSearchVisible(true);
            }
            setCheckedOnce(true);
          }
        },
        children: [popularNetBankingList.length > 0 && searchText.length === 0 && /*#__PURE__*/_jsxs(_Fragment, {
          children: [/*#__PURE__*/_jsx(Text, {
            style: [styles.headingText, {
              fontFamily: checkoutDetails.fontFamily.semiBold
            }],
            children: "Popular Banks"
          }), /*#__PURE__*/_jsx(View, {
            style: styles.container,
            children: /*#__PURE__*/_jsx(PaymentSelectorView, {
              providerList: popularNetBankingList,
              onProceedForward: onProceedForward,
              errorImage: require('../../assets/images/ic_netbanking_semi_bold.png'),
              onClickRadio: selectedInstrumentValue => onClickPopularBank(selectedInstrumentValue)
            })
          })]
        }), /*#__PURE__*/_jsx(Text, {
          style: [styles.headingText, {
            fontFamily: checkoutDetails.fontFamily.semiBold
          }],
          children: "All Banks"
        }), netBankingList.length > 0 ? /*#__PURE__*/_jsx(View, {
          style: styles.container,
          children: /*#__PURE__*/_jsx(PaymentSelectorView, {
            providerList: netBankingList,
            onProceedForward: onProceedForward,
            errorImage: require('../../assets/images/ic_netbanking_semi_bold.png'),
            onClickRadio: selectedInstrumentValue => onClickRadioButton(selectedInstrumentValue)
          })
        }) : /*#__PURE__*/_jsxs(View, {
          style: styles.emptyListContainer,
          children: [/*#__PURE__*/_jsx(Image, {
            source: require('../../assets/images/no_results_found.png'),
            style: styles.emptyIcon
          }), /*#__PURE__*/_jsx(Text, {
            style: [styles.emptyListHeadingText, {
              fontFamily: checkoutDetails.fontFamily.semiBold
            }],
            children: "Oops!! No result found"
          }), /*#__PURE__*/_jsx(Text, {
            style: [styles.emptyListDescText, {
              fontFamily: checkoutDetails.fontFamily.regular
            }],
            children: "Please try another search"
          })]
        })]
      }), /*#__PURE__*/_jsxs(View, {
        style: styles.footerContainer,
        children: [/*#__PURE__*/_jsx(Text, {
          style: [styles.footerTextStyle, {
            fontFamily: checkoutDetails.fontFamily.medium
          }],
          children: "Secured by"
        }), /*#__PURE__*/_jsx(Image, {
          source: require('../../assets/images/splash-icon.png'),
          style: styles.footerIcon
        })]
      })]
    }), failedModalOpen && /*#__PURE__*/_jsx(PaymentFailed, {
      onClick: () => setFailedModalState(false),
      errorMessage: paymentFailedMessage.current
    }), successModalOpen && /*#__PURE__*/_jsx(PaymentSuccess, {
      onClick: onExitCheckout,
      transactionId: transactionId || '',
      method: "Card",
      localDateTime: successfulTimeStamp
    }), sessionExpireModalOpen && /*#__PURE__*/_jsx(SessionExpire, {
      onClick: onExitCheckout
    }), showWebView && /*#__PURE__*/_jsx(View, {
      style: styles.webViewContainer,
      children: /*#__PURE__*/_jsx(WebViewScreen, {
        url: paymentUrl,
        html: paymentHtml,
        onBackPress: () => {
          startBackgroundApiTask();
          setShowWebView(false);
        }
      })
    })]
  });
};
export default NetBankingScreen;
//# sourceMappingURL=netBankingScreen.js.map