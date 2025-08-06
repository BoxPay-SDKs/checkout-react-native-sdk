import { View, Text, Pressable } from 'react-native';
import type{ PaymentClass } from '../interface';
import { checkoutDetailsHandler } from '../sharedContext/checkoutDetailsHandler';
import MorePaymentContainer from './morePaymentContainer';
import { navigateToBNPLScreen, navigateToCardScreen, navigateToEmiScreen, navigateToNetBankingScreen, navigateToWalletScreen } from '../navigation';

interface MorePaymentMethodsArgs{
    savedCards : PaymentClass[]
}

const MorePaymentMethods = ({savedCards}:MorePaymentMethodsArgs) => {
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
                          onPress={navigateToCardScreen}
                        >
                          <MorePaymentContainer
                            title="Cards"
                            image={require('./assets/images/ic_card.png')}
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
                          onPress={navigateToWalletScreen}
                        >
                          <MorePaymentContainer
                            title="Wallet"
                            image={require('./assets/images/ic_wallet.png')}
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
                          onPress={navigateToNetBankingScreen}
                        >
                          <MorePaymentContainer
                            title="Netbanking"
                            image={require('./assets/images/ic_netbanking.png')}
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
                          onPress={navigateToEmiScreen}
                        >
                          <MorePaymentContainer
                            title="EMI"
                            image={require('./assets/images/ic_emi.png')}
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
                          onPress={navigateToBNPLScreen}
                        >
                          <MorePaymentContainer
                            title="Pay Later"
                            image={require('./assets/images/ic_bnpl.png')}
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