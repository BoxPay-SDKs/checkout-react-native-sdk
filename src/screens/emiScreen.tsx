import {
  View,
  Text,
  BackHandler,
  Dimensions,
  ScrollView,
  Image,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { router } from 'expo-router';
import type {
  Bank,
  ChooseEmiModel,
  Emi,
  PaymentResult,
  EMIPaymentMethod,
} from '../interface';
import { checkoutDetailsHandler } from '../sharedContext/checkoutDetailsHandler';
import fetchPaymentMethods from '../postRequest/fetchPaymentMethods';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import Header from '../components/header';
import { TextInput } from 'react-native-paper';
import BankCard from '../components/bankCard';
import SelectTenureScreen from './selectTenureScreen';
import emiPostRequest from '../postRequest/emiPostRequest';
import LottieView from 'lottie-react-native';
import PaymentFailed from '../components/paymentFailed';
import PaymentSuccess from '../components/paymentSuccess';
import SessionExpire from '../components/sessionExpire';
import { paymentHandler } from '../sharedContext/paymentStatusHandler';
import WebViewScreen from './webViewScreen';
import fetchStatus from '../postRequest/fetchStatus';
import PaymentSelectorView from '../components/paymentSelector';

const EmiScreen = () => {
  const [emiBankList, setEmiBankList] = useState<ChooseEmiModel>({ cards: [] });
  const [defaultEmiBankList, setDefaultEmiBankList] = useState<ChooseEmiModel>({
    cards: [],
  });
  const [selectedOthersOption, setSelectedOthersOption] = useState('');
  const [searchText, setSearchText] = useState<string>('');
  const [filterList, setFilterList] = useState<[string, boolean][]>([]);
  const [isFilterExisted, setIsFilterExisted] = useState<boolean>(false);
  const { checkoutDetails } = checkoutDetailsHandler;
  const order: Record<string, number> = {
    'Credit Card': 0,
    'Debit Card': 1,
    'Others': 2,
  };
  const screenHeight = Dimensions.get('window').height;
  const [isSearchVisible, setIsSearchVisible] = useState(true);
  const [checkedOnce, setCheckedOnce] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [searchTextFocused, setSearchTextFocused] = useState(false);

  const [selectTenureScreen, setSelectTenureScreen] = useState(false);

  const [selectedCard, setSelectedCard] = useState<string>('');
  const [selectedBank, setSelectedBank] = useState<Bank>();
  const [selectedEmi, setSelectedEmi] = useState<Emi[]>([]);

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
  const backgroundApiInterval = useRef<NodeJS.Timeout | null>(null);

  const paymentFailedMessage = useRef<string>(
    'You may have cancelled the payment or there was a delay in response. Please retry.'
  );

  useEffect(() => {
    fetchPaymentMethods(checkoutDetails.token, checkoutDetails.env).then(
      (data) => {
        try {
          data.forEach((paymentMethod: EMIPaymentMethod) => {
            if (paymentMethod.type === 'Emi') {
              const title = paymentMethod.title;
              const emiCardName = title?.includes('Credit')
                ? 'Credit Card'
                : title?.includes('Debit')
                  ? 'Debit Card'
                  : 'Others';

              let emiBankImage = paymentMethod.logoUrl;
              if (emiBankImage?.startsWith('/assets')) {
                emiBankImage = `https://checkout.boxpay.in${emiBankImage}`;
              }

              const emiMethod = paymentMethod.emiMethod;
              const bankName =
                emiCardName === 'Others'
                  ? emiMethod.cardlessEmiProviderTitle
                  : emiMethod.issuerTitle;
              const effectiveInterestRate =
                emiMethod.effectiveInterestRate || 0.0;
              const bankInterestRate =
                emiCardName === 'Others' ? 0.0 : effectiveInterestRate;

              let noApplicableOffer = false;
              let lowApplicableOffer = false;
              if (emiMethod.applicableOffer) {
                const discount = emiMethod.applicableOffer.discount;
                noApplicableOffer = discount.type === 'NoCostEmi';
                lowApplicableOffer = discount.type === 'LowCostEmi';
              }

              const bank: Bank = {
                iconUrl: emiBankImage ?? '',
                name: bankName ?? '',
                percent: noApplicableOffer
                  ? (emiMethod.merchantBorneInterestRate ?? 0)
                  : bankInterestRate,
                noCostApplied: noApplicableOffer,
                lowCostApplied: lowApplicableOffer,
                emiList: [],
                cardLessEmiValue: emiMethod.cardlessEmiProviderValue ?? '',
                issuerBrand:
                  emiCardName === 'Others' ? '' : (emiMethod.issuer ?? ''),
              };

              const emi: Emi = {
                duration: emiMethod.duration ?? 0,
                percent: noApplicableOffer
                  ? (emiMethod.merchantBorneInterestRate ?? 0)
                  : bankInterestRate,
                amount: emiMethod.emiAmountLocaleFull ?? '',
                totalAmount: emiMethod.totalAmountLocaleFull ?? '',
                discount: emiMethod.merchantBorneInterestAmountLocaleFull ?? '',
                interestCharged: lowApplicableOffer
                  ? (emiMethod.interestChargedAmountLocaleFull ?? '')
                  : (emiMethod.bankChargedInterestAmountLocaleFull ?? ''),
                noCostApplied: noApplicableOffer,
                processingFee: emiMethod.processingFee?.amountLocaleFull || '0',
                lowCostApplied: lowApplicableOffer,
                code: emiMethod.applicableOffer?.code || '',
                netAmount: emiMethod.netAmountLocaleFull ?? '',
              };

              addBankDetails(emiCardName, bank, emi);
            }
          });
        } catch (error) {}
      }
    );
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
    const response = await fetchStatus(
      checkoutDetails.token,
      checkoutDetails.env
    );
    try {
      setStatus(response.status);
      setTransactionId(response.transactionId);
      const reasonCode = response.reasonCode;
      const status = response.status.toUpperCase();
      if (['FAILED', 'REJECTED'].includes(status)) {
        const reason = response.reason;
        if (!reasonCode?.startsWith('UF')) {
          paymentFailedMessage.current = checkoutDetails.errorMessage;
        } else {
          paymentFailedMessage.current = reason?.includes(':')
            ? reason.split(':')[1]?.trim()
            : reason || checkoutDetails.errorMessage;
        }
        setStatus('Failed');
        setFailedModalOpen(true);
        setLoading(false);
        stopBackgroundApiTask();
      } else if (['APPROVED', 'SUCCESS', 'PAID'].includes(status)) {
        setSuccessfulTimeStamp(response.transactionTimestampLocale);
        setSuccessModalOpen(true);
        setStatus('Success');
        stopBackgroundApiTask();
        setLoading(false);
      } else if (['EXPIRED'].includes(status)) {
        setSessionExppireModalOpen(true);
        setStatus('Expired');
        stopBackgroundApiTask();
        setLoading(false);
      }
    } catch (error) {
      const reason = response.status.reason;
      const reasonCode = response.status.reasonCode;
      if (!reasonCode?.startsWith('UF')) {
        paymentFailedMessage.current = checkoutDetails.errorMessage;
      } else {
        paymentFailedMessage.current = reason?.includes(':')
          ? reason.split(':')[1]?.trim()
          : reason || checkoutDetails.errorMessage;
      }
      setFailedModalOpen(true);
      setLoading(false);
    }
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

  const onProceedForward = async (instrumentValue: string) => {
    let response;
    try {
      setLoading(true);

      response = await emiPostRequest('', '', '', '', '', '', instrumentValue);
      setStatus(response.status.status);
      setTransactionId(response.transactionId);

      const status = response.status.status.toUpperCase();

      if (status === 'REQUIRESACTION') {
        if (Array.isArray(response.actions) && response.actions.length > 0) {
          if (response.actions[0].type === 'html') {
            setPaymentHtml(response.actions[0].htmlPageString);
          } else {
            setPaymentUrl(response.actions[0].url);
          }
        }
      } else if (['FAILED', 'REJECTED'].includes(status)) {
        const reason = response.status.reason || '';
        const reasonCode = response.status.reasonCode || '';

        if (!reasonCode.startsWith('UF')) {
          paymentFailedMessage.current = checkoutDetails.errorMessage;
        } else {
          paymentFailedMessage.current = reason.includes(':')
            ? reason.split(':')[1]?.trim()
            : reason || checkoutDetails.errorMessage;
        }

        setFailedModalOpen(true);
        setStatus('Failed');
        setLoading(false);
      } else if (['APPROVED', 'SUCCESS', 'PAID'].includes(status)) {
        setSuccessfulTimeStamp(response.transactionTimestampLocale);
        setSuccessModalOpen(true);
        setStatus('Success');
        setLoading(false);
      } else if (status === 'EXPIRED') {
        setSessionExppireModalOpen(true);
        setStatus('Expired');
        setLoading(false);
      }
    } catch (error) {
      const reason = response.status.reason || '';
      const reasonCode = response.status.reasonCode || '';

      if (!reasonCode.startsWith('UF')) {
        paymentFailedMessage.current = checkoutDetails.errorMessage;
      } else {
        paymentFailedMessage.current = reason.includes(':')
          ? reason.split(':')[1]?.trim()
          : reason || checkoutDetails.errorMessage;
      }

      setFailedModalOpen(true);
      setStatus('Failed');
      setLoading(false);
    }
  };

  const addBankDetails = (cardType: string, bank: Bank, emi: Emi) => {
    try {
      setDefaultEmiBankList((prev) => {
        const existingCardType = prev.cards.find(
          (card) => card.cardType.toLowerCase() === cardType.toLowerCase()
        );

        if (bank.noCostApplied) {
          setIsFilterExisted(true);
          if (!filterList.some(([filter]) => filter === 'No Cost EMI')) {
            setFilterList([...filterList, ['No Cost EMI', false]]);
          }
        }

        let updatedCards;
        if (existingCardType) {
          let updatedBanks = [...existingCardType.banks];
          const existingBankIndex = updatedBanks.findIndex(
            (b) => b.name === bank.name && b.iconUrl === bank.iconUrl
          );

          if (existingBankIndex !== -1) {
            const existingBank = { ...updatedBanks[existingBankIndex] };
            const emiExists = existingBank.emiList?.some(
              (e) => e.duration === emi.duration && e.amount === emi.amount
            );

            if (!emiExists) {
              existingBank.emiList = existingBank.emiList
                ? [...existingBank.emiList, emi]
                : [emi];
              existingBank.noCostApplied ||= emi.noCostApplied;
              existingBank.lowCostApplied ||= emi.lowCostApplied;
              existingBank.percent = Math.min(
                existingBank.percent ?? bank.percent,
                bank.percent
              );

              updatedBanks[existingBankIndex] = existingBank as Bank;
            }
          } else {
            updatedBanks = [...updatedBanks, { ...bank, emiList: [emi] }];
          }

          // 🔽 Sort updated banks inside card
          updatedBanks.sort((a, b) => {
            if (b.noCostApplied !== a.noCostApplied)
              return b.noCostApplied ? 1 : -1;
            if (b.lowCostApplied !== a.lowCostApplied)
              return b.lowCostApplied ? 1 : -1;
            return a.name.localeCompare(b.name);
          });

          updatedCards = prev.cards.map((card) =>
            card.cardType.toLowerCase() === cardType.toLowerCase()
              ? { ...card, banks: updatedBanks }
              : card
          );
        } else {
          updatedCards = [
            ...prev.cards,
            {
              cardType,
              banks: [{ ...bank, emiList: [emi] }],
            },
          ];
        }

        // 🔽 Sort cards based on predefined order
        updatedCards.sort(
          (a, b) =>
            (order[a.cardType as keyof typeof order] ?? 3) -
            (order[b.cardType as keyof typeof order] ?? 3)
        );

        const newEmiBankList = { ...prev, cards: updatedCards };

        // 🔽 Set default selected card
        if (
          newEmiBankList.cards.some(
            (card) => card.cardType.toLowerCase() === 'credit card'
          )
        ) {
          setSelectedCard('Credit Card');
        } else if (
          newEmiBankList.cards.some(
            (card) => card.cardType.toLowerCase() === 'debit card'
          )
        ) {
          setSelectedCard('Debit Card');
        } else if (
          newEmiBankList.cards.some(
            (card) => card.cardType.toLowerCase() === 'others'
          )
        ) {
          setSelectedCard('Others');
        } else {
          setSelectedCard(cardType);
        }

        return newEmiBankList;
      });
    } catch (error) {}
  };

  const onProceedBack = () => {
    router.back();
    return true;
  };
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
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
        return onProceedBack(); // Allow back navigation if not loading
      }
    );

    return () => backHandler.remove();
  });

  const navigateToCardScreen = (
    duration: number,
    bankName: string,
    bankUrl: string,
    offerCode: string,
    amount: string,
    percent: number
  ) => {
    router.push({
      pathname: '/sdk/screens/cardScreen',
      params: {
        duration: duration,
        bankName: bankName,
        bankUrl: bankUrl,
        offerCode: offerCode,
        amount: amount,
        percent: percent,
        cardType: selectedCard,
        issuerBrand: selectedBank?.issuerBrand,
      },
    });
  };

  useEffect(() => {
    if (searchText.trim() === '') {
      // Reset to original bank list if search query is empty
      setEmiBankList(defaultEmiBankList);
    } else {
      // Filter banks whose name starts with the search query (case-insensitive)
      const filteredList: ChooseEmiModel = {
        ...defaultEmiBankList,
        cards: defaultEmiBankList.cards.map((card) => ({
          ...card,
          banks: card.banks.filter((bank) =>
            bank.name.toLowerCase().startsWith(searchText.toLowerCase())
          ),
        })),
      };
      setEmiBankList(filteredList);
    }
  }, [searchText]);

  const getBanksByFilter = (cardType: string, filterApplied: string) => {
    setFilterList((prevFilters) => {
      // Toggle the filter: if already active, deactivate it, else activate it and deactivate others
      const newFilters: [string, boolean][] = prevFilters.map(
        ([filter, isActive]) =>
          filter === filterApplied ? [filter, !isActive] : [filter, false]
      );

      // Check if any filter is active
      const isAnyFilterActive = newFilters.some(([, isActive]) => isActive);

      setEmiBankList(() => {
        if (!isAnyFilterActive) {
          return defaultEmiBankList; // Reset if no filter is active
        }

        return {
          cards: defaultEmiBankList.cards.map((card) => {
            if (card.cardType.toLowerCase() === cardType.toLowerCase()) {
              let filteredBanks = card.banks;

              // Apply filters based on the active filter
              if (
                newFilters.some(
                  ([filter, isActive]) => isActive && filter.includes('No Cost')
                )
              ) {
                filteredBanks = card.banks.filter((bank) => bank.noCostApplied);
              } else if (
                newFilters.some(
                  ([filter, isActive]) =>
                    isActive && filter.includes('Low Cost')
                )
              ) {
                filteredBanks = card.banks.filter(
                  (bank) => bank.lowCostApplied
                );
              }

              return { ...card, banks: filteredBanks };
            }
            return card;
          }),
        };
      });

      return newFilters;
    });
  };

  const handleCardClick = (cardType: string) => {
    setSelectedCard(cardType);
    setSearchText('');
    setFilterList((prevFilters) =>
      prevFilters.map(([filter]) => [filter, false])
    );
  };

  const handleSelectedBank = (selectedBank: Bank) => {
    try {
      setSelectedBank(selectedBank);
      setFilterList((prevFilters) =>
        prevFilters.map(([filter]) => [filter, false])
      );
      setSelectedEmi(sortEmiList(selectedBank));
      setSelectTenureScreen(true);
    } catch (error) {}
  };

  const sortEmiList = (bank: Bank): Emi[] => {
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
    const mockPaymentResult: PaymentResult = {
      status: status || '',
      transactionId: transactionId || '',
    };
    paymentHandler.onPaymentResult(mockPaymentResult);
    while (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar barStyle="dark-content" />
      {isFirstLoad ? (
        <View
          style={{ flex: 1, backgroundColor: 'white', marginHorizontal: 16 }}
        >
          <ShimmerPlaceHolder
            visible={false}
            style={{
              width: '100%',
              height: 50,
              borderRadius: 10,
              marginTop: 30,
            }}
          />
          <ShimmerPlaceHolder
            visible={false}
            style={{
              width: '100%',
              height: 50,
              borderRadius: 10,
              marginTop: 25,
            }}
          />
          <ShimmerPlaceHolder
            visible={false}
            style={{
              width: '100%',
              height: 50,
              borderRadius: 10,
              marginTop: 25,
            }}
          />
          <ShimmerPlaceHolder
            visible={false}
            style={{
              width: '100%',
              height: 50,
              borderRadius: 10,
              marginTop: 25,
            }}
          />
          <ShimmerPlaceHolder
            visible={false}
            style={{
              width: '100%',
              height: 50,
              borderRadius: 10,
              marginTop: 25,
            }}
          />
          <ShimmerPlaceHolder
            visible={false}
            style={{
              width: '100%',
              height: 50,
              borderRadius: 10,
              marginTop: 25,
            }}
          />
          <ShimmerPlaceHolder
            visible={false}
            style={{
              width: '100%',
              height: 50,
              borderRadius: 10,
              marginTop: 25,
            }}
          />
          <ShimmerPlaceHolder
            visible={false}
            style={{
              width: '100%',
              height: 50,
              borderRadius: 10,
              marginTop: 25,
            }}
          />
        </View>
      ) : loading ? (
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <LottieView
            source={require('../../../assets/animations/boxpayLogo.json')}
            autoPlay
            loop
            style={{ width: 80, height: 80 }}
          />
          <Text>Loading...</Text>
        </View>
      ) : (
        <View style={{ flex: 1, backgroundColor: '#F5F6FB' }}>
          {!selectTenureScreen && (
            <>
              <Header
                onBackPress={onProceedBack}
                showDesc={true}
                showSecure={false}
                text="Choose EMI Option"
              />
              <View
                style={{
                  backgroundColor: 'white',
                  marginTop: 4,
                  paddingBottom: 16,
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 16,
                  }}
                >
                  {emiBankList.cards.map((item, index) => (
                    <View
                      key={index}
                      style={{ paddingHorizontal: 16, paddingTop: 12 }}
                    >
                      <Text
                        style={{
                          fontFamily: 'Poppins-SemiBold',
                          fontSize: 14,
                          color:
                            selectedCard === item.cardType
                              ? checkoutDetails.brandColor
                              : '#01010273',
                        }}
                        onPress={() => handleCardClick(item.cardType)}
                      >
                        {item.cardType}
                      </Text>
                      <View
                        style={{
                          height: 2,
                          backgroundColor:
                            selectedCard === item.cardType
                              ? checkoutDetails.brandColor
                              : '',
                          width: '120%',
                          minWidth: 40,
                          alignSelf: 'center',
                          borderRadius: 1,
                        }}
                      />
                    </View>
                  ))}
                </View>
                <View
                  style={{
                    height: 1,
                    backgroundColor: '#DCDCDE',
                    borderRadius: 1,
                  }}
                />
                {isSearchVisible && (
                  <View style={{ backgroundColor: 'white' }}>
                    <TextInput
                      mode="outlined"
                      label={
                        <Text
                          style={{
                            fontSize: 16,
                            fontFamily: 'Poppins-Regular',
                            color: searchTextFocused
                              ? '#2D2B32'
                              : searchText != '' && searchText != null
                                ? '#2D2B32'
                                : '#ADACB0',
                          }}
                        >
                          {selectedCard === 'Others'
                            ? 'Search for other EMI options'
                            : 'Search for bank'}
                        </Text>
                      }
                      value={searchText}
                      onChangeText={(it) => {
                        setSearchText(it);
                      }}
                      theme={{
                        colors: {
                          primary: '#2D2B32',
                          outline: '#E6E6E6',
                        },
                      }}
                      style={{
                        marginTop: 16,
                        marginHorizontal: 16,
                        backgroundColor: 'white',
                        fontSize: 16,
                        fontFamily: 'Poppins-Regular',
                        color: '#0A090B',
                      }}
                      left={
                        <TextInput.Icon
                          icon={() => (
                            <Image
                              source={require('../assets/images/ic_search.png')}
                              style={{ width: 20, height: 20 }}
                            />
                          )}
                        />
                      }
                      outlineStyle={{
                        borderRadius: 6,
                        borderWidth: 1,
                      }}
                      onFocus={() => setSearchTextFocused(true)}
                      onBlur={() => setSearchTextFocused(false)}
                    />
                  </View>
                )}
                {isFilterExisted &&
                  selectedCard != 'Others' &&
                  filterList.map(([item, isSelected], index) => (
                    <View
                      key={index}
                      style={{
                        flexDirection: 'row',
                        marginHorizontal: 16,
                        marginTop: 20,
                      }}
                    >
                      <View
                        style={{
                          borderColor: isSelected ? '#1CA672' : '#E6E6E6',
                          borderWidth: 1,
                          flexDirection: 'row',
                          paddingTop: 6,
                          paddingBottom: 4,
                          paddingHorizontal: 12,
                          alignItems: 'baseline',
                          borderRadius: 20,
                          backgroundColor: isSelected ? '#E8F6F1' : 'white',
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: 'Poppins-SemiBold',
                            fontSize: 12,
                            color: '#2D2B32',
                          }}
                          onPress={() => {
                            getBanksByFilter(selectedCard, item);
                          }}
                        >
                          {item}
                        </Text>
                        <Image
                          source={
                            isSelected
                              ? require('../assets/images/ic_cross.png')
                              : require('../assets/images/add_icon.png')
                          }
                          style={{
                            height: 10,
                            width: 10,
                            marginStart: 4,
                            tintColor: isSelected ? '#2D2B32' : '#7F7D83',
                          }}
                        />
                      </View>
                    </View>
                  ))}
              </View>
              <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
                onContentSizeChange={(_, contentHeight) => {
                  if (!checkedOnce) {
                    if (contentHeight > screenHeight) {
                      setIsSearchVisible(true);
                    }
                    setCheckedOnce(true);
                  }
                }}
              >
                <Text
                  style={{
                    marginTop: 16,
                    marginBottom: 8,
                    marginHorizontal: 16,
                    color: '#020815B5',
                    fontFamily: 'Poppins-SemiBold',
                    fontSize: 14,
                  }}
                >
                  {selectedCard === 'Others' ? 'Others' : 'All Banks'}
                </Text>
                <View
                  style={{
                    backgroundColor: 'white',
                    borderColor: '#F1F1F1',
                    borderWidth: 1,
                    borderRadius: 12,
                    marginHorizontal: 16,
                    marginBottom: 30,
                  }}
                >
                  {(() => {
                    const selectedCardData = emiBankList.cards.find(
                      (card) => card.cardType === selectedCard
                    );

                    if (
                      !selectedCardData ||
                      selectedCardData.banks?.length === 0
                    ) {
                      return (
                        <View
                          style={{
                            marginHorizontal: 16,
                            backgroundColor: 'white',
                            marginBottom: 32,
                            height: 300,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Image
                            source={require('../assets/images/no_results_found.png')}
                            style={{ width: 100, height: 100 }}
                          />
                          <Text
                            style={{
                              fontFamily: 'Poppins-SemiBold',
                              fontSize: 16,
                              color: '#212426',
                              marginTop: 16,
                            }}
                          >
                            Oops!! No result found
                          </Text>
                          <Text
                            style={{
                              fontFamily: 'Poppins-Regular',
                              fontSize: 14,
                              color: '#4F4D55',
                              marginTop: -4,
                            }}
                          >
                            Please try another search
                          </Text>
                        </View>
                      );
                    }

                    if (selectedCard === 'Others') {
                      return (
                        <PaymentSelectorView
                          providerList={selectedCardData.banks.map((bank) => ({
                            type: 'EMI',
                            id: bank.cardLessEmiValue,
                            displayName: '',
                            displayValue: bank.name,
                            iconUrl: bank.iconUrl,
                            instrumentTypeValue: bank.cardLessEmiValue,
                            isSelected:
                              selectedOthersOption === bank.cardLessEmiValue,
                          }))}
                          onProceedForward={(_, instrumentValue) =>
                            onProceedForward(instrumentValue)
                          }
                          errorImage={require('../assets/images/ic_bnpl_semi_bold.png')}
                          onClickRadio={(selectedInstumentValue) => {
                            setSelectedOthersOption(selectedInstumentValue);
                          }}
                        />
                      );
                    }

                    // For Credit or Debit
                    return selectedCardData.banks.map(
                      (bank, index, bankArray) => (
                        <View key={index} style={{ flexDirection: 'column' }}>
                          <BankCard
                            name={bank.name}
                            iconUrl={bank.iconUrl}
                            hasNoCostEmi={bank.noCostApplied}
                            hasLowCostEmi={bank.lowCostApplied}
                            onPress={() => handleSelectedBank(bank)}
                          />
                          {index !== bankArray.length - 1 && (
                            <View
                              style={{ height: 1, backgroundColor: '#ECECED' }}
                            />
                          )}
                        </View>
                      )
                    );
                  })()}
                </View>
              </ScrollView>
            </>
          )}

          {selectTenureScreen && (
            <View style={{ flex: 1, backgroundColor: '#F5F6FB' }}>
              <SelectTenureScreen
                bankName={selectedBank?.name || ''}
                bankUrl={selectedBank?.iconUrl || ''}
                onbackPress={() => {
                  setSelectTenureScreen(false);
                }}
                cardType={selectedCard}
                emiModel={selectedEmi ? selectedEmi : []}
                onProceedForward={(
                  duration: number,
                  bankName: string,
                  bankUrl: string,
                  offerCode: string,
                  amount: string,
                  percent: number
                ) => {
                  navigateToCardScreen(
                    duration,
                    bankName,
                    bankUrl,
                    offerCode,
                    amount,
                    percent
                  );
                }}
              />
            </View>
          )}
        </View>
      )}
      {failedModalOpen && (
        <PaymentFailed
          onClick={() => setFailedModalOpen(false)}
          errorMessage={paymentFailedMessage.current}
        />
      )}

      {successModalOpen && (
        <PaymentSuccess
          onClick={onExitCheckout}
          transactionId={transactionId || ''}
          method="Card"
          localDateTime={successfulTimeStamp}
        />
      )}

      {sessionExpireModalOpen && <SessionExpire onClick={onExitCheckout} />}

      {showWebView && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'white',
          }}
        >
          <WebViewScreen
            url={paymentUrl}
            html={paymentHtml}
            onBackPress={() => {
              startBackgroundApiTask();
              setLoading(true);
              setShowWebView(false);
            }}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default EmiScreen;
