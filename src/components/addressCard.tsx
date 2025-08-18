import { View, Text, Pressable, Image } from 'react-native';
import { checkoutDetailsHandler } from '../sharedContext/checkoutDetailsHandler';
import { userDataHandler } from '../sharedContext/userdataHandler';


interface AddressCardProps {
    address:string,
    navigateToAddressScreen : ()=> void,
}

const AddressComponent = ({address, navigateToAddressScreen} : AddressCardProps) => {
    const {checkoutDetails} = checkoutDetailsHandler
    const {userData} = userDataHandler
    return (
        <View>
            {address != '' && checkoutDetails.isShippingAddressEnabled && (
                <View>
                  <Text
                    style={{
                      marginStart: 16,
                      marginTop: 20,
                      fontSize: 14,
                      color: '#020815B5',
                      fontFamily: 'Poppins-SemiBold',
                    }}
                  >
                    Address
                  </Text>
                  <Pressable
                    style={{
                      borderColor: '#F1F1F1',
                      borderWidth: 1,
                      marginHorizontal: 16,
                      marginTop: 8,
                      paddingBottom: 16,
                      backgroundColor: 'white',
                      flexDirection: 'row',
                      borderRadius: 12,
                    }}
                    onPress={() => {
                      if (checkoutDetails.isShippingAddressEditable) {
                        navigateToAddressScreen();
                      }
                    }}
                  >
                    <Image
                      source={require('../../assets/images/ic_location.png')}
                      style={{
                        height: 20,
                        width: 20,
                        marginStart: 12,
                        marginTop: 20,
                      }}
                    />
                    <View
                      style={{
                        flexDirection: 'column',
                        marginStart: 8,
                        marginTop: 12,
                        marginEnd: 8,
                        flex: 1,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          color: '#4F4D55',
                          fontFamily: 'Poppins-Regular',
                        }}
                      >
                        Deliver at{' '}
                        <Text
                          style={{
                            fontFamily: 'Poppins-SemiBold',
                            fontSize: 12,
                            color: '#4F4D55',
                          }}
                        >
                          {userData.labelType === 'Other' ? userData.labelName : userData.labelType}
                        </Text>
                      </Text>
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={{
                          fontSize: 14,
                          color: '#4F4D55',
                          fontFamily: 'Poppins-SemiBold',
                          flexShrink: 1,
                          marginTop: -4,
                        }}
                      >
                        {address}
                      </Text>
                    </View>
                  </Pressable>
                </View>
              )}

              {address == '' && checkoutDetails.isShippingAddressEnabled && (
                <View>
                  <Text
                    style={{
                      marginStart: 16,
                      marginTop: 20,
                      fontSize: 14,
                      color: '#020815B5',
                      fontFamily: 'Poppins-SemiBold',
                    }}
                  >
                    Address
                  </Text>
                  <Pressable
                    style={{
                      borderColor: '#F1F1F1',
                      borderWidth: 1,
                      marginHorizontal: 16,
                      marginTop: 8,
                      paddingBottom: 16,
                      backgroundColor: 'white',
                      flexDirection: 'row',
                      borderRadius: 12,
                    }}
                    onPress={() => {
                      if (checkoutDetails.isShippingAddressEditable) {
                        navigateToAddressScreen();
                      }
                    }}
                  >
                    <Image
                      source={require('../../assets/images/add_icon.png')}
                      style={{
                        height: 20,
                        width: 20,
                        marginStart: 12,
                        marginTop: 20,
                      }}
                    />
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={{
                        fontSize: 14,
                        color: checkoutDetails.brandColor,
                        fontFamily: 'Poppins-SemiBold',
                        flexShrink: 1,
                        marginTop: -4,
                      }}
                    >
                      Add new address
                    </Text>
                  </Pressable>
                </View>
              )}

              {(checkoutDetails.isFullNameEnabled || checkoutDetails.isPhoneEnabled || checkoutDetails.isEmailEnabled) &&
                !checkoutDetails.isShippingAddressEnabled && (
                  <View>
                    <Text
                      style={{
                        marginStart: 16,
                        marginTop: 20,
                        fontSize: 14,
                        color: '#020815B5',
                        fontFamily: 'Poppins-SemiBold',
                      }}
                    >
                      Personal Details
                    </Text>
                    <Pressable
                      style={{
                        borderColor: '#F1F1F1',
                        borderWidth: 1,
                        marginHorizontal: 16,
                        marginTop: 8,
                        paddingBottom: 16,
                        backgroundColor: 'white',
                        flexDirection: 'row',
                        borderRadius: 12,
                      }}
                      onPress={() => {
                        if (
                            checkoutDetails.isFullNameEditable ||
                            checkoutDetails.isPhoneEditable ||
                            checkoutDetails.isEmailEditable
                        ) {
                          navigateToAddressScreen();
                        }
                      }}
                    >
                      {(userData.firstName != '' || userData.phone != '' || userData.email != '') && (
                        <>
                          <Image
                            source={require('../../assets/images/ic_user.png')}
                            style={{
                              height: 20,
                              width: 20,
                              marginStart: 12,
                              marginTop: 20,
                            }}
                          />
                          <View
                            style={{
                              flexDirection: 'column',
                              marginStart: 8,
                              marginTop: 12,
                              marginEnd: 8,
                              flex: 1,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 14,
                                color: '#4F4D55',
                                fontFamily: 'Poppins-SemiBold',
                              }}
                            >
                              {userData.firstName} {userData.lastName} | {' '}
                              <Text
                                style={{
                                  fontFamily: 'Poppins-SemiBold',
                                  fontSize: 14,
                                  color: '#4F4D55',
                                }}
                              >
                                {userData.phone}
                              </Text>
                            </Text>
                            <Text
                              numberOfLines={1}
                              ellipsizeMode="tail"
                              style={{
                                fontSize: 12,
                                color: '#4F4D55',
                                fontFamily: 'Poppins-Regular',
                                flexShrink: 1,
                                marginTop: -4,
                              }}
                            >
                              {userData.email}
                            </Text>
                          </View>
                        </>
                      )}
                      {(userData.firstName == '' || userData.phone == '' || userData.email == '') && (
                        <>
                          <Image
                            source={require('../../assets/images/add_icon.png')}
                            style={{
                              height: 20,
                              width: 20,
                              marginStart: 12,
                              marginTop: 20,
                            }}
                          />
                          <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            style={{
                              fontSize: 14,
                              color: checkoutDetails.brandColor,
                              fontFamily: 'Poppins-SemiBold',
                              flexShrink: 1,
                              marginTop: -4,
                            }}
                          >
                            Add personal details
                          </Text>
                        </>
                      )}
                    </Pressable>
                  </View>
              )}
        </View>
    )
}

export default AddressComponent