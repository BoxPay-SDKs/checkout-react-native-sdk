import { View, Text, BackHandler, Dimensions, ScrollView, Image, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router } from 'expo-router';
import { Bank, ChooseEmiModel, Emi } from '../../dataClass/emiDataClass';
import { checkoutDetailsHandler } from '../sharedContext/checkoutDetailsHandler';
import fetchPaymentMethods from '../postRequest/fetchPaymentMethods';
import ShimmerPlaceHolder from "react-native-shimmer-placeholder";
import Header from '../components/header';
import { TextInput } from 'react-native-paper';
import BankCard from '../components/bankCard';
import PaymentSelector from '../components/paymentSelector';

const EmiScreen = () => {
    const [emiBankList, setEmiBankList] = useState<ChooseEmiModel>({ cards: [] });
    const [selectedCard, setSelectedCard] = useState<string>("");
    const [selectedOthersOption, setSelectedOthersOption] = useState("")
    const [defaultEmiBankList, setDefaultEmiBankList] = useState<ChooseEmiModel>({ cards: [] });
    const [searchText, setSearchText] = useState<string>("");
    const [filterList, setFilterList] = useState<[string, boolean][]>([]);
    const [isFilterExisted, setIsFilterExisted] = useState<boolean>(false);
    const { checkoutDetails } = checkoutDetailsHandler;
    const order: Record<string, number> = { "Credit Card": 0, "Debit Card": 1, "Others": 2 };
    const screenHeight = Dimensions.get('window').height;
    const [isSearchVisible, setIsSearchVisible] = useState(true);
    const [checkedOnce, setCheckedOnce] = useState(false);
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const [searchTextFocused, setSearchTextFocused] = useState(false);

    useEffect(() => {
        fetchPaymentMethods(checkoutDetails.token, checkoutDetails.env).then((data) => {
            try {
                data.forEach((paymentMethod: any) => {
                    if (paymentMethod.type === "Emi") {
                        const title = paymentMethod.title;
                        const emiCardName = title.includes("Credit")
                            ? "Credit Card"
                            : title.includes("Debit")
                                ? "Debit Card"
                                : "Others";

                        let emiBankImage = paymentMethod.logoUrl;
                        if (emiBankImage.startsWith("/assets")) {
                            emiBankImage = `https://checkout.boxpay.in${emiBankImage}`;
                        }

                        const emiMethod = paymentMethod.emiMethod;
                        const bankName = emiCardName === "Others" ? emiMethod.cardlessEmiProviderTitle : emiMethod.issuerTitle;
                        const effectiveInterestRate = emiMethod.effectiveInterestRate || 0.0;
                        const bankInterestRate = emiCardName === "Others" ? 0.0 : effectiveInterestRate;

                        let noApplicableOffer = false;
                        let lowApplicableOffer = false;
                        if (emiMethod.applicableOffer) {
                            const discount = emiMethod.applicableOffer.discount;
                            noApplicableOffer = discount.type === "NoCostEmi";
                            lowApplicableOffer = discount.type === "LowCostEmi";
                        }

                        const bank: Bank = {
                            iconUrl: emiBankImage,
                            name: bankName,
                            percent: noApplicableOffer ? emiMethod.interestRate : bankInterestRate,
                            noCostApplied: noApplicableOffer,
                            lowCostApplied: lowApplicableOffer,
                            emiList: [],
                            cardLessEmiValue: emiMethod.cardlessEmiProviderValue,
                            issuerBrand: emiCardName === "Others" ? "" : emiMethod.issuer,
                        };

                        const emi: Emi = {
                            duration: emiMethod.duration,
                            percent: noApplicableOffer ? emiMethod.interestRate : bankInterestRate,
                            amount: emiMethod.emiAmountLocaleFull,
                            totalAmount: emiMethod.totalAmountLocaleFull,
                            discount: emiMethod.merchantBorneInterestAmountLocaleFull,
                            interestCharged: lowApplicableOffer ? emiMethod.interestChargedAmountLocaleFull : emiMethod.bankChargedInterestAmountLocaleFull,
                            noCostApplied: noApplicableOffer,
                            processingFee: emiMethod.processingFee?.amountLocale || "0",
                            lowCostApplied: lowApplicableOffer,
                            code: emiMethod.applicableOffer?.code || "",
                            netAmount: emiMethod.netAmountLocaleFull,
                        };

                        addBankDetails(emiCardName, bank, emi);
                    }
                });

                // 🔹 **Sort and set the EMI Bank List here**
                setDefaultEmiBankList((prev) => {
                    const sortedBankList: ChooseEmiModel = {
                        cards: prev.cards.map(card => ({
                            ...card,
                            banks: [...card.banks].sort((a, b) => {
                                if (b.noCostApplied !== a.noCostApplied) return b.noCostApplied ? 1 : -1;
                                if (b.lowCostApplied !== a.lowCostApplied) return b.lowCostApplied ? 1 : -1;
                                return a.name.localeCompare(b.name);
                            }),
                        })),
                    };

                    return sortedBankList;
                });

            } catch (error) {
                console.log(error);
            }
        });
    }, []);

    useEffect(() => {
        if (defaultEmiBankList.cards.length > 0) {
            setEmiBankList(defaultEmiBankList)
        }
    }, [defaultEmiBankList])

    useEffect(() => {
        if (emiBankList.cards.length > 0) {
            setIsFirstLoad(false)
        }
    }, [emiBankList])


    const addBankDetails = (cardType: string, bank: Bank, emi: Emi) => {
        try {
            setDefaultEmiBankList((prev) => {
                const existingCardType = prev.cards.find(
                    (card) => card.cardType.toLowerCase() === cardType.toLowerCase()
                );

                if (bank.noCostApplied) {
                    setIsFilterExisted(true);
                    if (!filterList.some(([filter]) => filter === "No Cost EMI")) {
                        setFilterList([...filterList, ["No Cost EMI", false]]);
                    }
                }

                let updatedCards;
                if (existingCardType) {
                    const existingBank = existingCardType.banks.find(
                        (b) => b.name === bank.name && b.iconUrl === bank.iconUrl
                    );

                    if (existingBank) {
                        const emiExists = existingBank.emiList.some(
                            (e) => e.duration === emi.duration && e.amount === emi.amount
                        );

                        if (!emiExists) {
                            existingBank.emiList.push(emi);
                            existingBank.noCostApplied ||= emi.noCostApplied;
                            existingBank.lowCostApplied ||= emi.lowCostApplied;
                            existingBank.percent = Math.min(existingBank.percent, bank.percent);
                        }
                    } else {
                        existingCardType.banks.push(bank);
                    }

                    updatedCards = [...prev.cards];
                } else {
                    updatedCards = [
                        ...prev.cards,
                        { cardType, banks: [bank] }
                    ];
                }

                updatedCards.sort((a, b) => (order[a.cardType as keyof typeof order] ?? 3) - (order[b.cardType as keyof typeof order] ?? 3));

                const newEmiBankList = { ...prev, cards: updatedCards };

                // **🔹 Update selectedCard after updating emiBankList**
                if (newEmiBankList.cards.some((card) => card.cardType.toLowerCase() === "credit card")) {
                    setSelectedCard("Credit Card");
                } else if (newEmiBankList.cards.some((card) => card.cardType.toLowerCase() === "debit card")) {
                    setSelectedCard("Debit Card");
                } else if (newEmiBankList.cards.some((card) => card.cardType.toLowerCase() === "others")) {
                    setSelectedCard("Others");
                } else {
                    setSelectedCard(cardType); // Select newly added card type
                }

                return newEmiBankList;
            });
        } catch (error) {
            console.log(error)
        }
    };

    const onProceedBack = () => {
        router.back();
        return true;
    };
    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', onProceedBack);
        return () => {
            backHandler.remove();
        };
    }, []);


    useEffect((() => {
        if (searchText.trim() === "") {
            // Reset to original bank list if search query is empty
            setEmiBankList(defaultEmiBankList);
        } else {
            // Filter banks whose name starts with the search query (case-insensitive)
            const filteredList: ChooseEmiModel = {
                ...defaultEmiBankList,
                cards: defaultEmiBankList.cards.map((card) => ({
                    ...card,
                    banks: card.banks.filter((bank) => bank.name.toLowerCase().startsWith(searchText.toLowerCase()))
                }))
            };
            setEmiBankList(filteredList);
        }
    }), [searchText])

    const getBanksByFilter = (cardType: string, filterApplied: string) => {
        setFilterList((prevFilters) => {
            // Toggle the filter: if already active, deactivate it, else activate it and deactivate others
            const newFilters: [string, boolean][] = prevFilters.map(([filter, isActive]) =>
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
                            if (newFilters.some(([filter, isActive]) => isActive && filter.includes("No Cost"))) {
                                filteredBanks = card.banks.filter((bank) => bank.noCostApplied);
                            } else if (newFilters.some(([filter, isActive]) => isActive && filter.includes("Low Cost"))) {
                                filteredBanks = card.banks.filter((bank) => bank.lowCostApplied);
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
        setSelectedCard(cardType)
        setSearchText("")
        setFilterList((prevFilters) =>
            prevFilters.map(([filter]) => [filter, false])
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <StatusBar barStyle="dark-content" />
            {isFirstLoad ? (
                <View style={{ flex: 1, backgroundColor: 'white', marginHorizontal: 16 }}>
                    <ShimmerPlaceHolder visible={false} style={{ width: '100%', height: 50, borderRadius: 10, marginTop: 30 }} />
                    <ShimmerPlaceHolder visible={false} style={{ width: '100%', height: 50, borderRadius: 10, marginTop: 25 }} />
                    <ShimmerPlaceHolder visible={false} style={{ width: '100%', height: 50, borderRadius: 10, marginTop: 25 }} />
                    <ShimmerPlaceHolder visible={false} style={{ width: '100%', height: 50, borderRadius: 10, marginTop: 25 }} />
                    <ShimmerPlaceHolder visible={false} style={{ width: '100%', height: 50, borderRadius: 10, marginTop: 25 }} />
                    <ShimmerPlaceHolder visible={false} style={{ width: '100%', height: 50, borderRadius: 10, marginTop: 25 }} />
                    <ShimmerPlaceHolder visible={false} style={{ width: '100%', height: 50, borderRadius: 10, marginTop: 25 }} />
                    <ShimmerPlaceHolder visible={false} style={{ width: '100%', height: 50, borderRadius: 10, marginTop: 25 }} />
                </View>
            ) : (
                <View style={{ flex: 1, backgroundColor: '#F5F6FB' }}>
                    <Header onBackPress={onProceedBack} showDesc={true} showSecure={false} text='Choose EMI Option' />
                    <View style={{ backgroundColor: 'white', marginTop: 4, paddingBottom: 16 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            {emiBankList.cards.map((item, index) => (
                                <View key={index} style={{ paddingHorizontal: 16, paddingTop: 12 }}>
                                    <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 14, color: selectedCard === item.cardType ? checkoutDetails.brandColor : "#01010273" }} onPress={() => handleCardClick(item.cardType)}>{item.cardType}</Text>
                                    <View style={{
                                        height: 2, backgroundColor: selectedCard === item.cardType ? checkoutDetails.brandColor : "", width: "120%",
                                        minWidth: 40,
                                        alignSelf: 'center',
                                        borderRadius: 1
                                    }}></View>
                                </View>
                            ))}
                        </View>
                        <View style={{
                            height: 2, backgroundColor: "#DCDCDE",
                            borderRadius: 1
                        }}></View>
                        {isSearchVisible && (
                            <View style={{ backgroundColor: 'white' }}>
                                <TextInput
                                    mode='outlined'
                                    label={
                                        <Text style={{ fontSize: 16, fontFamily: 'Poppins-Regular', color: searchTextFocused ? '#2D2B32' : (searchText != "" && searchText != null) ? '#2D2B32' : '#ADACB0' }}>Search for bank</Text>
                                    }
                                    value={searchText}
                                    onChangeText={(it) => {
                                        setSearchText(it);
                                    }}
                                    theme={{
                                        colors: {
                                            primary: "#2D2B32",
                                            outline: '#E6E6E6',
                                        }
                                    }}
                                    style={{
                                        marginTop: 16, marginHorizontal: 16, backgroundColor: 'white',
                                        fontSize: 16,
                                        fontFamily: 'Poppins-Regular',
                                        color: '#0A090B'
                                    }}
                                    left={
                                        <TextInput.Icon
                                            icon={() => <Image source={require("../../assets/images/ic_search.png")} style={{ width: 20, height: 20 }} />}
                                        />
                                    }
                                    outlineStyle={{
                                        borderRadius: 6,
                                        borderWidth: 1
                                    }}
                                    onFocus={() => setSearchTextFocused(true)}
                                    onBlur={() => setSearchTextFocused(false)}
                                />
                            </View>
                        )}
                        {isFilterExisted && (
                            filterList.map(([item, isSelected], index) => (
                                <View key={index} style={{ flexDirection: 'row', marginHorizontal: 16, marginTop: 20 }}>
                                    <View style={{ borderColor: isSelected ? "#1CA672" : "#E6E6E6", borderWidth: 1, flexDirection: 'row', paddingVertical: 4, paddingHorizontal: 6, alignItems: 'center', borderRadius: 20, backgroundColor: isSelected ? "#E8F6F1" : "white" }}>
                                        <Text style={{ fontFamily: 'Poppins-SemiBoold', fontSize: 12, color: '#2D2B32' }} onPress={() => {
                                            getBanksByFilter(selectedCard, item)
                                        }}>{item}</Text>
                                        <Image source={require("../../assets/images/add_icon.png")} style={{ height: 10, width: 10, marginStart: 4 }} />
                                    </View>
                                </View>
                            ))
                        )}
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
                        }}>
                        <Text style={{ marginTop: 16, marginBottom: 8, marginHorizontal: 16, color: '#020815B5', fontFamily: 'Poppins-SemiBold', fontSize: 14 }}>All Banks</Text>
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
                            {
                                (() => {
                                    const selectedCardData = emiBankList.cards.find((card) => card.cardType === selectedCard);

                                    return selectedCardData && selectedCardData.banks?.length > 0 ? (
                                        selectedCardData.banks.map((bank, index, bankArray) => (
                                            <View key={index} style={{ flexDirection: "column" }}>
                                                {selectedCard === "Others" ? (
                                                    <PaymentSelector
                                                        id={""}
                                                        title={bank.name}
                                                        image={bank.iconUrl}
                                                        isSelected={bank.cardLessEmiValue === selectedOthersOption}
                                                        instrumentTypeValue={bank.cardLessEmiValue}
                                                        onPress={(it) => {
                                                            setSelectedOthersOption(it);
                                                        }}
                                                        onProceedForward={() => {
                                                            // Todo will add the proceed forward function 
                                                        }}
                                                        errorImage={require("../../assets/images/ic_bnpl_semi_bold.png")}
                                                    />
                                                ) : (
                                                    <BankCard
                                                        name={bank.name}
                                                        iconUrl={bank.iconUrl}
                                                        hasNoCostEmi={bank.noCostApplied}
                                                        hasLowCostEmi={bank.lowCostApplied}
                                                        onPress={() => {
                                                            // Handle press event for BankCard
                                                        }}
                                                    />
                                                )}

                                                {/* ✅ Corrected Divider Condition */}
                                                {index !== bankArray.length - 1 && (
                                                    <View style={{ height: 1, backgroundColor: "#ECECED" }} />
                                                )}
                                            </View>
                                        ))
                                    ) : (
                                        <View
                                            style={{
                                                marginHorizontal: 16,
                                                backgroundColor: "white",
                                                marginBottom: 32,
                                                height: 300,
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <Image
                                                source={require("../../assets/images/no_results_found.png")}
                                                style={{ width: 100, height: 100 }}
                                            />
                                            <Text
                                                style={{
                                                    fontFamily: "Poppins-SemiBold",
                                                    fontSize: 16,
                                                    color: "#212426",
                                                    marginTop: 16,
                                                }}
                                            >
                                                Oops!! No result found
                                            </Text>
                                            <Text
                                                style={{
                                                    fontFamily: "Poppins-Regular",
                                                    fontSize: 14,
                                                    color: "#4F4D55",
                                                    marginTop: -4,
                                                }}
                                            >
                                                Please try another search
                                            </Text>
                                        </View>
                                    );
                                })()
                            }


                        </View>


                    </ScrollView>
                </View>
            )
            }
        </View >
    )
}

export default EmiScreen