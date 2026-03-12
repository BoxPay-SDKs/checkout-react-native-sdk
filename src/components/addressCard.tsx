import { View, Text, Pressable, Image } from 'react-native';
import { checkoutDetailsHandler } from '../sharedContext/checkoutDetailsHandler';
import { userDataHandler } from '../sharedContext/userdataHandler';
import styles from '../styles/components/addressCardStyles';

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
                    style={[styles.titleText, {fontFamily : checkoutDetails.fontFamily.semiBold}]}
                  >
                    Address
                  </Text>
                  <Pressable
                    style={[styles.pressableContainer, {borderRadius: checkoutDetails.ctaBorderRadius,}]}
                    onPress={() => {
                      if (checkoutDetails.isShippingAddressEditable) {
                        navigateToAddressScreen();
                      }
                    }}
                  >
                    <Image
                      source={require('../../assets/images/ic_location.png')}
                      style={styles.imageStyle}
                    />
                    <View
                      style={styles.insideContainer}
                    >
                      <Text
                        style={[styles.insideContainerNormalText, {fontFamily: checkoutDetails.fontFamily.regular}]}
                      >
                        Deliver at{' '}
                        <Text
                          style={[styles.insideContainerHighlighedText, {fontFamily: checkoutDetails.fontFamily.semiBold,}]}
                        >
                          {userData.labelType === 'Other' ? userData.labelName : userData.labelType}
                        </Text>
                      </Text>
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={[styles.insideContainerDesc, {fontFamily: checkoutDetails.fontFamily.semiBold,}]}
                      >
                        {address}
                      </Text>
                    </View>
                    {checkoutDetails.isShippingAddressEditable && (
                      <Image
                      source={require('../../assets/images/chervon-down.png')}
                      style={{
                        alignSelf: 'center',
                        height: 6,
                        width: 14,
                        marginTop : 4,
                        marginRight :10,
                        transform: [
                          {
                            rotate: '270deg',
                          },
                        ],
                      }}
                    />
                    )}
                  </Pressable>
                </View>
              )}

              {address == '' && checkoutDetails.isShippingAddressEnabled && (
                <View>
                  <Text
                    style={[styles.titleText, {fontFamily : checkoutDetails.fontFamily.semiBold}]}
                  >
                    Address
                  </Text>
                  <Pressable
                    style={[styles.pressableContainer, {borderRadius: checkoutDetails.ctaBorderRadius,}]}
                    onPress={() => {
                      if (checkoutDetails.isShippingAddressEditable) {
                        navigateToAddressScreen();
                      }
                    }}
                  >
                    <Image
                      source={require('../../assets/images/add_icon.png')}
                      style={[styles.imageStyle, {tintColor: checkoutDetails.buttonColor}]}
                    />
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={[styles.insideContainerClickableText, {color: checkoutDetails.buttonColor,
                        fontFamily: checkoutDetails.fontFamily.semiBold,}]}
                    >
                      Add new address
                    </Text>
                    {checkoutDetails.isShippingAddressEditable && (
                      <Image
                      source={require('../../assets/images/chervon-down.png')}
                      style={{
                        alignSelf: 'center',
                        height: 6,
                        width: 14,
                        marginTop : 14,
                        marginRight :10,
                        marginLeft: 'auto',
                        transform: [
                          {
                            rotate: '270deg',
                          },
                        ],
                      }}
                    />
                    )}
                  </Pressable>
                </View>
              )}

              {(checkoutDetails.isFullNameEnabled || checkoutDetails.isPhoneEnabled || checkoutDetails.isEmailEnabled) &&
                !checkoutDetails.isShippingAddressEnabled && (
                  <View>
                    <Text
                      style={[styles.titleText, {fontFamily : checkoutDetails.fontFamily.semiBold}]}
                    >
                      Personal Details
                    </Text>
                    <Pressable
                      style={[styles.pressableContainer, {borderRadius: checkoutDetails.ctaBorderRadius,}]}
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
                      {(userData.firstName != '' || userData.completePhoneNumber != '' || userData.email != '') && (
                        <>
                          <Image
                            source={require('../../assets/images/ic_user.png')}
                            style={styles.imageStyle}
                          />
                          <View
                            style={styles.insideContainer}
                          >
                            <Text
                              style={[styles.insideContainerHighlighedText, {fontFamily: checkoutDetails.fontFamily.semiBold,}]}
                            >
                              {userData.firstName} {userData.lastName} | {' '}
                              <Text
                                style={[styles.insideContainerHighlighedText, {fontFamily: checkoutDetails.fontFamily.semiBold,}]}
                              >
                                {userData.completePhoneNumber}
                              </Text>
                            </Text>
                            <Text
                              numberOfLines={1}
                              ellipsizeMode="tail"
                              style={[styles.insideContainerDesc, {fontFamily: checkoutDetails.fontFamily.semiBold,}]}
                            >
                              {userData.email}
                            </Text>
                          </View>
                        </>
                      )}
                      {(userData.firstName == '' || userData.completePhoneNumber == '' || userData.email == '') && (
                        <>
                          <Image
                            source={require('../../assets/images/add_icon.png')}
                            style={styles.imageStyle}
                          />
                          <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            style={[styles.insideContainerClickableText, {color: checkoutDetails.buttonColor,
                              fontFamily: checkoutDetails.fontFamily.semiBold,}]}
                          >
                            Add personal details
                          </Text>
                        </>
                      )}

                      {(checkoutDetails.isFullNameEditable ||
                            checkoutDetails.isPhoneEditable ||
                            checkoutDetails.isEmailEditable) && (
                      <Image
                      source={require('../../assets/images/chervon-down.png')}
                      style={{
                        alignSelf: 'center',
                        height: 6,
                        width: 14,
                        marginTop : 14,
                        marginRight :4,
                        marginLeft: 'auto',
                        transform: [
                          {
                            rotate: '270deg',
                          },
                        ],
                      }}
                    />
                    )}
                    </Pressable>
                  </View>
              )}
        </View>
    )
}

export default AddressComponent