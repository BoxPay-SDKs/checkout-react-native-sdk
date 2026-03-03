import { View, Text, Pressable } from 'react-native';
import type{ PaymentClass } from '../interface';
import { checkoutDetailsHandler } from '../sharedContext/checkoutDetailsHandler';
import MorePaymentContainer from './morePaymentContainer';
import type { CheckoutStackParamList } from '../navigation';
import { useNavigation, type NavigationProp } from "@react-navigation/native";
import type { SurchargeProp } from './orderDetails';

interface MorePaymentMethodsArgs{
    savedCards : PaymentClass[],
    stopTimer : () => void,
    setSelectedPaymentMethod : (method : string) => void,
    surchargeDetails : SurchargeProp[]
}

const MorePaymentMethods = ({savedCards, stopTimer, setSelectedPaymentMethod, surchargeDetails}:MorePaymentMethodsArgs) => {
  const navigation = useNavigation<NavigationProp<CheckoutStackParamList>>();
    const {checkoutDetails} = checkoutDetailsHandler
    const {
        isCardMethodEnabled: isCardVisible,
        isWalletMethodEnabled: isWalletVisible,
        isNetBankingMethodEnabled: isNetBankingVisible,
        isBnplMethodEnabled: isBNPLVisible,
        isEmiMethodEnabled: isEmiVisible,
        isUpiCollectMethodEnabled: isUpiCollectVisible,
        isUpiIntentMethodEnabled: isUpiIntentVisibile
      } = checkoutDetails;
    return (
        <View>
                {(isCardVisible ||
                  isWalletVisible ||
                  isNetBankingVisible ||
                  isBNPLVisible ||
                  isEmiVisible) && (
                  <View>
                    {isUpiCollectVisible || isUpiIntentVisibile ? (
                      <Text
                        style={{
                          marginStart: 16,
                          marginTop: 12,
                          fontSize: 14,
                          color: '#020815B5',
                          fontFamily: 'Poppins-SemiBold',
                        }}
                      >
                        More Payment Options
                      </Text>
                    ) : (
                      <Text
                        style={{
                          marginStart: 16,
                          marginTop: 12,
                          fontSize: 14,
                          color: '#020815B5',
                          fontFamily: 'Poppins-SemiBold',
                        }}
                      >
                        Payment Options
                      </Text>
                    )}

                    <View
                      style={{
                        flex: 1,
                        backgroundColor: 'white',
                        marginVertical: 8,
                        marginHorizontal: 16,
                        borderRadius: 12,
                        flexDirection: 'column',
                        borderColor: '#F1F1F1',
                        borderWidth: 1,
                        paddingBottom: 16,
                      }}
                    >
                      {isCardVisible && savedCards.length == 0 && (
                        <Pressable
                          style={{ paddingHorizontal: 16, paddingTop: 16 }}
                          onPress= {() => {
                            stopTimer()
                            setSelectedPaymentMethod("card")
                            navigation.navigate("CardScreen", {})
                          }}
                        >
                          <MorePaymentContainer
                            title="Cards"
                            image={require('../../assets/images/ic_card.png')}
                            surchargeFee={
                              (surchargeDetails.find(
                                item => item.applicable?.toLowerCase() === 'card'
                              )?.amount)?.toString() ?? ""
                            }
                            currencySymbol={checkoutDetails.currencySymbol}
                          />
                          {(isWalletVisible ||
                            isNetBankingVisible ||
                            isEmiVisible ||
                            isBNPLVisible) && (
                            <View
                              style={{
                                flexDirection: 'row',
                                height: 1,
                                backgroundColor: '#ECECED',
                                marginTop: 16,
                                marginHorizontal: -16,
                              }}
                            />
                          )}
                        </Pressable>
                      )}
                      {isWalletVisible && (
                        <Pressable
                          style={{ paddingHorizontal: 16, paddingTop: 16 }}
                          onPress={() => {
                            stopTimer()
                            setSelectedPaymentMethod("wallet")
                            navigation.navigate("WalletScreen", {})
                          }}
                        >
                          <MorePaymentContainer
                            title="Wallet"
                            image={require('../../assets/images/ic_wallet.png')}
                            surchargeFee={
                              (surchargeDetails.find(
                                item => item.applicable?.toLowerCase() === 'wallet'
                              )?.amount)?.toString() ?? ""
                            }
                            currencySymbol={checkoutDetails.currencySymbol}
                          />
                          {(isNetBankingVisible ||
                            isEmiVisible ||
                            isBNPLVisible) && (
                            <View
                              style={{
                                flexDirection: 'row',
                                height: 1,
                                backgroundColor: '#ECECED',
                                marginTop: 16,
                                marginHorizontal: -16,
                              }}
                            />
                          )}
                        </Pressable>
                      )}
                      {isNetBankingVisible && (
                        <Pressable
                          style={{ paddingHorizontal: 16, paddingTop: 16 }}
                          onPress={() => {
                            stopTimer()
                            setSelectedPaymentMethod("netbanking")
                            navigation.navigate("NetBankingScreen", {})
                          }}
                        >
                          <MorePaymentContainer
                            title="Netbanking"
                            image={require('../../assets/images/ic_netbanking.png')}
                            surchargeFee={
                              (surchargeDetails.find(
                                item => item.applicable?.toLowerCase() === 'netbanking'
                              )?.amount)?.toString() ?? ""
                            }
                            currencySymbol={checkoutDetails.currencySymbol}
                          />
                          {(isEmiVisible || isBNPLVisible) && (
                            <View
                              style={{
                                flexDirection: 'row',
                                height: 1,
                                backgroundColor: '#ECECED',
                                marginTop: 16,
                                marginHorizontal: -16,
                              }}
                            />
                          )}
                        </Pressable>
                      )}
                      {isEmiVisible && (
                        <Pressable
                          style={{ paddingHorizontal: 16, paddingTop: 16 }}
                          onPress={() => {
                            stopTimer()
                            setSelectedPaymentMethod("emi")
                            navigation.navigate("EmiScreen", {})
                          }}
                        >
                          <MorePaymentContainer
                            title="EMI"
                            image={require('../../assets/images/ic_emi.png')}
                            surchargeFee={
                              (surchargeDetails.find(
                                item => item.applicable?.toLowerCase() === 'emi'
                              )?.amount)?.toString() ?? ""
                            }
                            currencySymbol={checkoutDetails.currencySymbol}
                          />
                          {isBNPLVisible && (
                            <View
                              style={{
                                flexDirection: 'row',
                                height: 1,
                                backgroundColor: '#ECECED',
                                marginTop: 16,
                                marginHorizontal: -16,
                              }}
                            />
                          )}
                        </Pressable>
                      )}
                      {isBNPLVisible && (
                        <Pressable
                          style={{ paddingHorizontal: 16, paddingTop: 16 }}
                          onPress={() => {
                            stopTimer()
                            setSelectedPaymentMethod("buynowpaylater")
                            navigation.navigate("BNPLScreen", {})
                          }}
                        >
                          <MorePaymentContainer
                            title="Pay Later"
                            image={require('../../assets/images/ic_bnpl.png')}
                            surchargeFee={
                              (surchargeDetails.find(
                                item => item.applicable?.toLowerCase() === 'buynowpaylater'
                              )?.amount)?.toString() ?? ""
                            }
                            currencySymbol={checkoutDetails.currencySymbol}
                          />
                        </Pressable>
                      )}
                    </View>
                  </View>
                )}
              </View>
    )
}

export default MorePaymentMethods