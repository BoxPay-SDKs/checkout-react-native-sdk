"use strict";

import { View, Text, BackHandler, Dimensions, ScrollView, Image } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { APIStatus } from "../interface.js";
import { checkoutDetailsHandler, setCheckOutDetailsHandlerToDefault } from "../sharedContext/checkoutDetailsHandler.js";
import fetchPaymentMethods from "../postRequest/fetchPaymentMethods.js";
import ShimmerView from "../components/shimmerView.js";
import Header from "../components/header.js";
import { TextInput } from 'react-native-paper';
import BankCard from "../components/bankCard.js";
import SelectTenureScreen from "./selectTenureScreen.js";
import emiPostRequest from "../postRequest/emiPostRequest.js";
import LottieView from 'lottie-react-native';
import PaymentFailed from "../components/paymentFailed.js";
import PaymentSuccess from "../components/paymentSuccess.js";
import SessionExpire from "../components/sessionExpire.js";
import { paymentHandler } from "../sharedContext/paymentStatusHandler.js";
import WebViewScreen from "./webViewScreen.js";
import fetchStatus from "../postRequest/fetchStatus.js";
import PaymentSelectorView from "../components/paymentSelector.js";
import Toast from 'react-native-toast-message';
import styles from "../styles/screens/emiScreenStyles.js";
import { handleFetchStatusResponseHandler, handlePaymentResponse } from "../sharedContext/handlePaymentResponseHandler.js";
import { setUserDataHandlerToDefault } from "../sharedContext/userdataHandler.js";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
const EmiScreen = ({
  navigation
}) => {
  const [emiBankList, setEmiBankList] = useState({
    cards: []
  });
  const [defaultEmiBankList, setDefaultEmiBankList] = useState({
    cards: []
  });
  const [selectedOthersOption, setSelectedOthersOption] = useState('');
  const [searchText, setSearchText] = useState('');
  const [filterList, setFilterList] = useState([]);
  const [isFilterExisted, setIsFilterExisted] = useState(false);
  const {
    checkoutDetails
  } = checkoutDetailsHandler;
  const order = {
    'Credit Card': 0,
    'Debit Card': 1,
    'Others': 2
  };
  const screenHeight = Dimensions.get('window').height;
  const [isSearchVisible, setIsSearchVisible] = useState(true);
  const [checkedOnce, setCheckedOnce] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [searchTextFocused, setSearchTextFocused] = useState(false);
  const [selectTenureScreen, setSelectTenureScreen] = useState(false);
  const [selectedCard, setSelectedCard] = useState('');
  const [selectedBank, setSelectedBank] = useState();
  const [selectedEmi, setSelectedEmi] = useState([]);
  const [loading, setLoading] = useState(false);
  const [failedModalOpen, setFailedModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [sessionExpireModalOpen, setSessionExppireModalOpen] = useState(false);
  const [successfulTimeStamp, setSuccessfulTimeStamp] = useState('');
  const [status, setStatus] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [paymentHtml, setPaymentHtml] = useState('');
  const [paymentUrl, setPaymentUrl] = useState('');
  const [showWebView, setShowWebView] = useState(false);
  const backgroundApiInterval = useRef(null);
  const paymentFailedMessage = useRef('You may have cancelled the payment or there was a delay in response. Please retry.');
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchPaymentMethods();
      switch (response.apiStatus) {
        case APIStatus.Success:
          {
            const data = response.data;
            data.forEach(paymentMethod => {
              if (paymentMethod.type === 'Emi') {
                const title = paymentMethod.title;
                const emiCardName = title?.includes('Credit') ? 'Credit Card' : title?.includes('Debit') ? 'Debit Card' : 'Others';
                let emiBankImage = paymentMethod.logoUrl;
                if (emiBankImage?.startsWith('/assets')) {
                  emiBankImage = `https://checkout.boxpay.in${emiBankImage}`;
                }
                const emiMethod = paymentMethod.emiMethod;
                if (emiMethod) {
                  const bankName = emiCardName === 'Others' ? emiMethod.cardlessEmiProviderTitle : emiMethod.issuerTitle;
                  const effectiveInterestRate = emiMethod.effectiveInterestRate || 0.0;
                  const bankInterestRate = emiCardName === 'Others' ? 0.0 : effectiveInterestRate;
                  let noApplicableOffer = false;
                  let lowApplicableOffer = false;
                  if (emiMethod.applicableOffer) {
                    const discount = emiMethod.applicableOffer.discount;
                    noApplicableOffer = discount.type === 'NoCostEmi';
                    lowApplicableOffer = discount.type === 'LowCostEmi';
                  }
                  const bank = {
                    iconUrl: emiBankImage ?? '',
                    name: bankName ?? '',
                    percent: noApplicableOffer ? emiMethod.merchantBorneInterestRate ?? 0 : bankInterestRate,
                    noCostApplied: noApplicableOffer,
                    lowCostApplied: lowApplicableOffer,
                    emiList: [],
                    cardLessEmiValue: emiMethod.cardlessEmiProviderValue ?? '',
                    issuerBrand: emiCardName === 'Others' ? '' : emiMethod.issuer ?? ''
                  };
                  const emi = {
                    duration: emiMethod.duration ?? 0,
                    percent: noApplicableOffer ? emiMethod.merchantBorneInterestRate ?? 0 : bankInterestRate,
                    amount: emiMethod.emiAmountLocaleFull ?? '',
                    totalAmount: emiMethod.totalAmountLocaleFull ?? '',
                    discount: emiMethod.merchantBorneInterestAmountLocaleFull ?? '',
                    interestCharged: lowApplicableOffer ? emiMethod.interestChargedAmountLocaleFull ?? '' : emiMethod.bankChargedInterestAmountLocaleFull ?? '',
                    noCostApplied: noApplicableOffer,
                    processingFee: emiMethod.processingFee?.amountLocaleFull || '0',
                    lowCostApplied: lowApplicableOffer,
                    code: emiMethod.applicableOffer?.code || '',
                    netAmount: emiMethod.netAmountLocaleFull ?? ''
                  };
                  addBankDetails(emiCardName, bank, emi);
                }
              }
            });
            break;
          }
        case APIStatus.Failed:
          {
            Toast.show({
              type: 'error',
              text1: 'Oops!',
              text2: 'Something went wrong. Please try again.'
            });
            break;
          }
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    if (defaultEmiBankList.cards.length > 0) {
      setEmiBankList(defaultEmiBankList);
    }
  }, [defaultEmiBankList]);
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
        setFailedModalOpen(true);
      },
      onShowSuccessModal: ts => {
        setSuccessfulTimeStamp(ts);
        setSuccessModalOpen(true);
      },
      onShowSessionExpiredModal: () => {
        setSessionExppireModalOpen(true);
      },
      setLoading: setLoading,
      stopBackgroundApiTask: stopBackgroundApiTask,
      isFromUPIIntentFlow: false
    });
  };
  useEffect(() => {
    if (emiBankList.cards.length > 0) {
      setIsFirstLoad(false);
    }
  }, [emiBankList]);
  useEffect(() => {
    if (paymentUrl) {
      setShowWebView(true);
    }
  }, [paymentUrl]);
  useEffect(() => {
    if (paymentHtml) {
      setShowWebView(true);
    }
  }, [paymentHtml]);
  const onProceedForward = async instrumentValue => {
    let response;
    setLoading(true);
    response = await emiPostRequest({
      duration: instrumentValue
    });
    handlePaymentResponse({
      response: response,
      checkoutDetailsErrorMessage: checkoutDetails.errorMessage,
      onSetStatus: setStatus,
      onSetTransactionId: setTransactionId,
      onSetPaymentHtml: setPaymentHtml,
      onSetPaymentUrl: setPaymentUrl,
      onSetFailedMessage: msg => paymentFailedMessage.current = msg,
      onShowFailedModal: () => setFailedModalOpen(true),
      onShowSuccessModal: ts => {
        setSuccessfulTimeStamp(ts);
        setSuccessModalOpen(true);
      },
      onShowSessionExpiredModal: () => setSessionExppireModalOpen(true),
      setLoading: setLoading
    });
  };
  const addBankDetails = (cardType, bank, emi) => {
    try {
      setDefaultEmiBankList(prev => {
        const existingCardType = prev.cards.find(card => card.cardType.toLowerCase() === cardType.toLowerCase());
        if (bank.noCostApplied) {
          setIsFilterExisted(true);
          if (!filterList.some(([filter]) => filter === 'No Cost EMI')) {
            setFilterList([...filterList, ['No Cost EMI', false]]);
          }
        }
        let updatedCards;
        if (existingCardType) {
          let updatedBanks = [...existingCardType.banks];
          const existingBankIndex = updatedBanks.findIndex(b => b.name === bank.name && b.iconUrl === bank.iconUrl);
          if (existingBankIndex !== -1) {
            const existingBank = {
              ...updatedBanks[existingBankIndex]
            };
            const emiExists = existingBank.emiList?.some(e => e.duration === emi.duration && e.amount === emi.amount);
            if (!emiExists) {
              existingBank.emiList = existingBank.emiList ? [...existingBank.emiList, emi] : [emi];
              existingBank.noCostApplied ||= emi.noCostApplied;
              existingBank.lowCostApplied ||= emi.lowCostApplied;
              existingBank.percent = Math.min(existingBank.percent ?? bank.percent, bank.percent);
              updatedBanks[existingBankIndex] = existingBank;
            }
          } else {
            updatedBanks = [...updatedBanks, {
              ...bank,
              emiList: [emi]
            }];
          }

          // 🔽 Sort updated banks inside card
          updatedBanks.sort((a, b) => {
            if (b.noCostApplied !== a.noCostApplied) return b.noCostApplied ? 1 : -1;
            if (b.lowCostApplied !== a.lowCostApplied) return b.lowCostApplied ? 1 : -1;
            return a.name.localeCompare(b.name);
          });
          updatedCards = prev.cards.map(card => card.cardType.toLowerCase() === cardType.toLowerCase() ? {
            ...card,
            banks: updatedBanks
          } : card);
        } else {
          updatedCards = [...prev.cards, {
            cardType,
            banks: [{
              ...bank,
              emiList: [emi]
            }]
          }];
        }

        // 🔽 Sort cards based on predefined order
        updatedCards.sort((a, b) => (order[a.cardType] ?? 3) - (order[b.cardType] ?? 3));
        const newEmiBankList = {
          ...prev,
          cards: updatedCards
        };

        // 🔽 Set default selected card
        if (newEmiBankList.cards.some(card => card.cardType.toLowerCase() === 'credit card')) {
          setSelectedCard('Credit Card');
        } else if (newEmiBankList.cards.some(card => card.cardType.toLowerCase() === 'debit card')) {
          setSelectedCard('Debit Card');
        } else if (newEmiBankList.cards.some(card => card.cardType.toLowerCase() === 'others')) {
          setSelectedCard('Others');
        } else {
          setSelectedCard(cardType);
        }
        return newEmiBankList;
      });
    } catch (error) {}
  };
  const onProceedBack = () => {
    navigation.goBack();
    return true;
  };
  useEffect(() => {
    const backAction = () => {
      if (showWebView) {
        setShowWebView(false);
        paymentFailedMessage.current = checkoutDetails.errorMessage;
        setStatus('Failed');
        setFailedModalOpen(true);
        setLoading(false);
        return true;
      } else if (loading) {
        return true; // Prevent default back action
      } else if (selectTenureScreen) {
        setSelectTenureScreen(false);
        return true;
      }
      return onProceedBack();
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [navigation]);
  const navigateToCardScreen = (duration, bankName, bankUrl, offerCode, amount, percent) => {
    navigation.navigate("CardScreen", {
      duration: duration,
      bankName: bankName,
      bankUrl: bankUrl,
      offerCode: offerCode,
      amount: amount,
      percent: percent,
      cardType: selectedCard,
      issuerBrand: selectedBank?.issuerBrand
    });
  };
  useEffect(() => {
    if (searchText.trim() === '') {
      // Reset to original bank list if search query is empty
      setEmiBankList(defaultEmiBankList);
    } else {
      // Filter banks whose name starts with the search query (case-insensitive)
      const filteredList = {
        ...defaultEmiBankList,
        cards: defaultEmiBankList.cards.map(card => ({
          ...card,
          banks: card.banks.filter(bank => bank.name.toLowerCase().startsWith(searchText.toLowerCase()))
        }))
      };
      setEmiBankList(filteredList);
    }
  }, [searchText]);
  const getBanksByFilter = (cardType, filterApplied) => {
    setFilterList(prevFilters => {
      // Toggle the filter: if already active, deactivate it, else activate it and deactivate others
      const newFilters = prevFilters.map(([filter, isActive]) => filter === filterApplied ? [filter, !isActive] : [filter, false]);

      // Check if any filter is active
      const isAnyFilterActive = newFilters.some(([, isActive]) => isActive);
      setEmiBankList(() => {
        if (!isAnyFilterActive) {
          return defaultEmiBankList; // Reset if no filter is active
        }
        return {
          cards: defaultEmiBankList.cards.map(card => {
            if (card.cardType.toLowerCase() === cardType.toLowerCase()) {
              let filteredBanks = card.banks;

              // Apply filters based on the active filter
              if (newFilters.some(([filter, isActive]) => isActive && filter.includes('No Cost'))) {
                filteredBanks = card.banks.filter(bank => bank.noCostApplied);
              } else if (newFilters.some(([filter, isActive]) => isActive && filter.includes('Low Cost'))) {
                filteredBanks = card.banks.filter(bank => bank.lowCostApplied);
              }
              return {
                ...card,
                banks: filteredBanks
              };
            }
            return card;
          })
        };
      });
      return newFilters;
    });
  };
  const handleCardClick = cardType => {
    setSelectedCard(cardType);
    setSearchText('');
    setFilterList(prevFilters => prevFilters.map(([filter]) => [filter, false]));
  };
  const handleSelectedBank = selectedBank => {
    try {
      setSelectedBank(selectedBank);
      setFilterList(prevFilters => prevFilters.map(([filter]) => [filter, false]));
      setSelectedEmi(sortEmiList(selectedBank));
      setSelectTenureScreen(true);
    } catch (error) {}
  };
  const sortEmiList = bank => {
    return [...bank.emiList].sort((a, b) => {
      // Sort by `noCostApplied` first (true comes before false)
      if (a.noCostApplied !== b.noCostApplied) {
        return a.noCostApplied ? -1 : 1;
      }
      // Then by `lowCostApplied` (true comes before false)
      if (a.lowCostApplied !== b.lowCostApplied) {
        return a.lowCostApplied ? -1 : 1;
      }
      // Finally, sort by `duration` in ascending order
      return a.duration - b.duration;
    });
  };
  const onExitCheckout = () => {
    setSuccessModalOpen(false);
    setSessionExppireModalOpen(false);
    const mockPaymentResult = {
      status: status || '',
      transactionId: transactionId || ''
    };
    setCheckOutDetailsHandlerToDefault();
    setUserDataHandlerToDefault();
    paymentHandler.onPaymentResult(mockPaymentResult);
  };
  return /*#__PURE__*/_jsxs(View, {
    style: styles.screenView,
    children: [isFirstLoad ? /*#__PURE__*/_jsx(ShimmerView, {}) : loading ? /*#__PURE__*/_jsxs(View, {
      style: styles.loadingContainer,
      children: [/*#__PURE__*/_jsx(LottieView, {
        source: require('../../assets/animations/boxpayLogo.json'),
        autoPlay: true,
        loop: true,
        style: styles.lottieStyle
      }), /*#__PURE__*/_jsx(Text, {
        children: "Loading..."
      })]
    }) : /*#__PURE__*/_jsxs(View, {
      style: styles.availableScreenView,
      children: [!selectTenureScreen && /*#__PURE__*/_jsxs(_Fragment, {
        children: [/*#__PURE__*/_jsx(Header, {
          onBackPress: onProceedBack,
          showDesc: true,
          showSecure: false,
          text: "Choose EMI Option"
        }), /*#__PURE__*/_jsxs(View, {
          style: styles.container,
          children: [/*#__PURE__*/_jsx(View, {
            style: styles.insideContainer,
            children: emiBankList.cards.map((item, index) => /*#__PURE__*/_jsxs(View, {
              style: styles.cardsContainer,
              children: [/*#__PURE__*/_jsx(Text, {
                style: [styles.cardsText, {
                  color: selectedCard === item.cardType ? checkoutDetails.buttonColor : '#01010273',
                  fontFamily: checkoutDetails.fontFamily.semiBold
                }],
                onPress: () => handleCardClick(item.cardType),
                children: item.cardType
              }), /*#__PURE__*/_jsx(View, {
                style: [styles.highlightedDivider, {
                  backgroundColor: selectedCard === item.cardType ? checkoutDetails.buttonColor : ''
                }]
              })]
            }, index))
          }), /*#__PURE__*/_jsx(View, {
            style: styles.divider
          }), isSearchVisible && /*#__PURE__*/_jsx(View, {
            style: {
              backgroundColor: 'white'
            },
            children: /*#__PURE__*/_jsx(TextInput, {
              mode: "outlined",
              label: /*#__PURE__*/_jsx(Text, {
                style: [styles.searchTextLable, {
                  color: searchTextFocused ? '#2D2B32' : searchText != '' && searchText != null ? '#2D2B32' : '#ADACB0',
                  fontFamily: checkoutDetails.fontFamily.regular
                }],
                children: selectedCard === 'Others' ? 'Search for other EMI options' : 'Search for bank'
              }),
              value: searchText,
              onChangeText: it => {
                setSearchText(it);
              },
              theme: {
                colors: {
                  primary: '#2D2B32',
                  outline: '#E6E6E6'
                }
              },
              style: [styles.textInputStyle, {
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
          }), isFilterExisted && selectedCard != 'Others' && filterList.map(([item, isSelected], index) => /*#__PURE__*/_jsx(View, {
            style: styles.filterContainer,
            children: /*#__PURE__*/_jsxs(View, {
              style: [styles.filterBox, {
                borderColor: isSelected ? '#1CA672' : '#E6E6E6',
                backgroundColor: isSelected ? '#E8F6F1' : 'white'
              }],
              children: [/*#__PURE__*/_jsx(Text, {
                style: [styles.filterText, {
                  fontFamily: checkoutDetails.fontFamily.semiBold
                }],
                onPress: () => {
                  getBanksByFilter(selectedCard, item);
                },
                children: item
              }), /*#__PURE__*/_jsx(Image, {
                source: isSelected ? require('../../assets/images/ic_cross.png') : require('../../assets/images/add_icon.png'),
                style: [styles.filterImage, {
                  tintColor: isSelected ? '#2D2B32' : '#7F7D83'
                }]
              })]
            })
          }, index))]
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
          children: [/*#__PURE__*/_jsx(Text, {
            style: [styles.headingText, {
              fontFamily: checkoutDetails.fontFamily.semiBold
            }],
            children: selectedCard === 'Others' ? 'Others' : 'All Banks'
          }), /*#__PURE__*/_jsx(View, {
            style: styles.listContainer,
            children: (() => {
              const selectedCardData = emiBankList.cards.find(card => card.cardType === selectedCard);
              if (!selectedCardData || selectedCardData.banks?.length === 0) {
                return /*#__PURE__*/_jsxs(View, {
                  style: styles.emptyListContainer,
                  children: [/*#__PURE__*/_jsx(Image, {
                    source: require('../../assets/images/no_results_found.png'),
                    style: styles.emptyListImage
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
                });
              }
              if (selectedCard === 'Others') {
                return /*#__PURE__*/_jsx(PaymentSelectorView, {
                  providerList: selectedCardData.banks.map(bank => ({
                    type: 'EMI',
                    id: bank.cardLessEmiValue,
                    displayName: '',
                    displayValue: bank.name,
                    iconUrl: bank.iconUrl,
                    instrumentTypeValue: bank.cardLessEmiValue,
                    isSelected: selectedOthersOption === bank.cardLessEmiValue
                  })),
                  onProceedForward: (_, instrumentValue) => onProceedForward(instrumentValue),
                  errorImage: require('../../assets/images/ic_bnpl_semi_bold.png'),
                  onClickRadio: selectedInstumentValue => {
                    setSelectedOthersOption(selectedInstumentValue);
                  }
                });
              }

              // For Credit or Debit
              return selectedCardData.banks.map((bank, index, bankArray) => /*#__PURE__*/_jsxs(View, {
                style: {
                  flexDirection: 'column'
                },
                children: [/*#__PURE__*/_jsx(BankCard, {
                  name: bank.name,
                  iconUrl: bank.iconUrl,
                  hasNoCostEmi: bank.noCostApplied,
                  hasLowCostEmi: bank.lowCostApplied,
                  onPress: () => handleSelectedBank(bank)
                }), index !== bankArray.length - 1 && /*#__PURE__*/_jsx(View, {
                  style: styles.divider
                })]
              }, index));
            })()
          })]
        })]
      }), selectTenureScreen && /*#__PURE__*/_jsx(View, {
        style: styles.availableScreenView,
        children: /*#__PURE__*/_jsx(SelectTenureScreen, {
          bankName: selectedBank?.name || '',
          bankUrl: selectedBank?.iconUrl || '',
          onbackPress: () => {
            setSelectTenureScreen(false);
          },
          cardType: selectedCard,
          emiModel: selectedEmi ? selectedEmi : [],
          onProceedForward: (duration, bankName, bankUrl, offerCode, amount, percent) => {
            navigateToCardScreen(duration, bankName, bankUrl, offerCode, amount, percent);
          }
        })
      })]
    }), failedModalOpen && /*#__PURE__*/_jsx(PaymentFailed, {
      onClick: () => setFailedModalOpen(false),
      errorMessage: paymentFailedMessage.current
    }), successModalOpen && /*#__PURE__*/_jsx(PaymentSuccess, {
      onClick: onExitCheckout,
      transactionId: transactionId || '',
      method: "Card",
      localDateTime: successfulTimeStamp
    }), sessionExpireModalOpen && /*#__PURE__*/_jsx(SessionExpire, {
      onClick: onExitCheckout
    }), showWebView && /*#__PURE__*/_jsx(View, {
      style: styles.webViewScreenStyle,
      children: /*#__PURE__*/_jsx(WebViewScreen, {
        url: paymentUrl,
        html: paymentHtml,
        onBackPress: () => {
          startBackgroundApiTask();
          setLoading(true);
          setShowWebView(false);
        }
      })
    })]
  });
};
export default EmiScreen;
//# sourceMappingURL=emiScreen.js.map