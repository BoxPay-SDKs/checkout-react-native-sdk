import {
  View,
  Text,
  Pressable,
  Image,
  Animated,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { TextInput } from 'react-native-paper';
import { checkoutDetailsHandler } from '../sharedContext/checkoutDetailsHandler';
import { AnalyticsEvents, type InstrumentDetails, type PaymentClass } from '../interface';
import PaymentSelectorView from '../components/paymentSelector';
import { getInstalledUpiApps } from '../components/getInstalledUPI';
import styles from '../styles/screens/upiScreenStyles';
import { formatTime } from '../utils/stringUtils';
import { height, width } from '../utils/listAndObjectUtils';
import upiPostRequest from '../postRequest/upiPostRequest';
import { handlePaymentResponse } from '../sharedContext/handlePaymentResponseHandler';
import callUIAnalytics from '../postRequest/callUIAnalytics';

interface UpiScreenProps {
  handleUpiPayment: (selectedIntent: string) => void;
  handleCollectPayment: (item: string, id: string, type: string) => void;
  savedUpiArray: PaymentClass[];
  onClickRadio: (instrumentValue: string) => void;
  qrIsExpired : boolean,
  timeRemaining : number,
  stopTimer : () => void,
  setLoading : (loading : boolean) => void,
  setStatus:(status : string) => void
  setTransaction:(transactionId : string) => void,
  onStartQRTimer:()=> void
  setFailedModal : (state : boolean) => void
  setFailedModalMessage : (message : string) => void
}

const UpiScreen: React.FC<UpiScreenProps> = ({
  handleUpiPayment,
  handleCollectPayment,
  savedUpiArray,
  onClickRadio,
  qrIsExpired,
  timeRemaining,
  stopTimer,
  setLoading,
  setStatus,
  setTransaction,
  onStartQRTimer,
  setFailedModal,
  setFailedModalMessage
}) => {
  const [upiCollectError, setUpiCollectError] = useState(false);
  const [upiCollectValid, setUpiCollectValid] = useState(false);
  const [upiCollectTextInput, setUpiCollectTextInput] = useState('');
  const [upiIdFocused, setUpiIdFocused] = useState(false);
  const [isGpayInstalled, setIsGpayInstalled] = useState(false);
  const [isPhonePeInstalled, setIsPhonePeInstalled] = useState(false);
  const [isPaytmInstalled, setIsPaytmInstalled] = useState(false);
  const { checkoutDetails } = checkoutDetailsHandler;
  const [upiCollectVisible, setUpiCollectVisible] = useState(false);
  const [upiQRVisible, setUpiQRVisible] = useState(false)
  const [selectedIntent, setSelectedIntent] = useState<string | null>(null);
  const {
    isUpiCollectMethodEnabled: isUpiCollectVisible,
    isUpiIntentMethodEnabled: isUpiIntentVisible,
    isUpiQRMethodEnabled: isUpiQRVisible,
  } = checkoutDetails;
  const isTablet = Math.min(width, height) >= 600
  const [qrImage, setQrImage] = useState("")

  useEffect(() => {
    const checkUpiApps = async () => {
      try {
        const installedApplications = await getInstalledUpiApps();
        setIsPhonePeInstalled(installedApplications.includes('phonepe'));
        setIsGpayInstalled(installedApplications.includes('gpay'));
        setIsPaytmInstalled(installedApplications.includes('paytm'));
      } catch(error) {
        callUIAnalytics(AnalyticsEvents.ERROR_GETTING_UPI_URL, "UPIScreen", `fetch installed applications failed due to ${error}`)
        throw new Error(`${error}`);
      }
    };

    checkUpiApps();
  }, []);

  const handleUpiQRPayment = async() => {
    const requestPayload: InstrumentDetails ={
      type: 'upi/qr',
    }
    setLoading(true);
    const response = await upiPostRequest(requestPayload);
    handlePaymentResponse({
      response: response,
      checkoutDetailsErrorMessage: checkoutDetailsHandler.checkoutDetails.errorMessage,
      onSetStatus : setStatus,
      onSetTransactionId:setTransaction,
      onShowFailedModal : () => setFailedModal(true),
      onSetFailedMessage : setFailedModalMessage,
      onOpenQr: (url:string)=> {
        setQrImage(url)
        onStartQRTimer()
        setSelectedIntent(null);
        setUpiCollectVisible(false);
        setUpiQRVisible(true)
        setDefaultStateOfSavedUpiArray();
      },
      setLoading: setLoading
    });
  }

  const handleUpiCollectChevronClick = () => {
    setSelectedIntent(null);
    setUpiCollectVisible(!upiCollectVisible);
    setUpiQRVisible(false)
    setDefaultStateOfSavedUpiArray();
    stopTimer()
  };

  const handleUpiQRChevronClick = () => {
    if(upiQRVisible) {
      setUpiQRVisible(false)
    } else {
      handleUpiQRPayment()
    }
  }

  const handleTextChange = (text: string) => {
    setUpiCollectTextInput(text);
    setUpiCollectError(false);
    if (
      text.trim() !== '' &&
      /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{3,64}$/.test(text)
    ) {
      setUpiCollectError(false);
      setUpiCollectValid(true);
    } else {
      if (text.includes('@') && (text.split('@')[1]?.length ?? 0) >= 2) {
        setUpiCollectError(true);
        setUpiCollectValid(false);
      }
    }
  };

  const setDefaultStateOfSavedUpiArray = () => {
    if (
      savedUpiArray.length != 0 &&
      savedUpiArray.some((item) => item.isSelected)
    ) {
      onClickRadio('');
    }
  };

  return (
    <View>
      {(isUpiIntentVisible || isUpiCollectVisible || (isUpiQRVisible && isTablet)) && (
        <View style={styles.headingContainer}>
          <Text style={styles.headingText}>Pay by any UPI</Text>
        </View>
      )}
      <View style={styles.intentBackground}>
        <PaymentSelectorView
          providerList={savedUpiArray}
          onProceedForward={(displayValue, instrumentValue, type) =>
            handleCollectPayment(displayValue, instrumentValue, type)
          }
          errorImage={require('../../assets/images/ic_upi.png')}
          isLastUsed={false}
          onClickRadio={(selectedValue) => {
            setUpiQRVisible(false);
            stopTimer()
            setSelectedIntent(null);
            setUpiCollectVisible(false);
            onClickRadio(selectedValue);
          }}
        />
        <View
          style={styles.divider}
        />
        {isUpiIntentVisible && (
          <View>
            <View style={styles.upiIntentRow}>
              {isGpayInstalled && (
                <View style={styles.intentContainer}>
                  <Pressable
                    style={[
                      styles.intentIconBorder,
                      selectedIntent === 'GPay' && {
                        borderColor: checkoutDetails.brandColor,
                        borderWidth: 2,
                      },
                    ]}
                    onPress={() => {
                      setUpiCollectVisible(false);
                      setUpiCollectError(false);
                      setSelectedIntent('GPay');
                      setDefaultStateOfSavedUpiArray();
                      stopTimer()
                    }}
                  >
                    <Image
                      source={require('../../assets/images/gpay-icon.png')}
                      style={styles.intentIcon}
                    />
                  </Pressable>
                  <Text
                    style={[
                      styles.intentTitle,
                      selectedIntent === 'GPay' && {
                        color: checkoutDetails.brandColor,
                        fontFamily: 'Poppins-SemiBold',
                      },
                    ]}
                  >
                    GPay
                  </Text>
                </View>
              )}
              {isPhonePeInstalled && (
                <View style={styles.intentContainer}>
                  <Pressable
                    style={[
                      styles.intentIconBorder,
                      selectedIntent === 'PhonePe' && {
                        borderColor: checkoutDetails.brandColor,
                        borderWidth: 2,
                      },
                    ]}
                    onPress={() => {
                      setUpiCollectVisible(false);
                      setUpiCollectError(false);
                      setSelectedIntent('PhonePe');
                      setDefaultStateOfSavedUpiArray();
                      stopTimer()
                    }}
                  >
                    <Image
                      source={require('../../assets/images/phonepe-icon.png')}
                      style={{ height: 30, width: 30 }}
                    />
                  </Pressable>

                  <Text
                    style={[
                      styles.intentTitle,
                      selectedIntent === 'PhonePe' && {
                        color: checkoutDetails.brandColor,
                        fontFamily: 'Poppins-SemiBold',
                      },
                    ]}
                  >
                    PhonePe
                  </Text>
                </View>
              )}
              {isPaytmInstalled && (
                <View style={styles.intentContainer}>
                  <Pressable
                    style={[
                      styles.intentIconBorder,
                      selectedIntent === 'PayTm' && {
                        borderColor: checkoutDetails.brandColor,
                        borderWidth: 2,
                      },
                    ]}
                    onPress={() => {
                      setUpiCollectVisible(false);
                      setUpiCollectError(false);
                      setSelectedIntent('PayTm');
                      setDefaultStateOfSavedUpiArray();
                      stopTimer()
                    }}
                  >
                    <Image
                      source={require('../../assets/images/paytm-icon.png')}
                      style={{ height: 28, width: 44 }}
                    />
                  </Pressable>
                  <Text
                    style={[
                      styles.intentTitle,
                      selectedIntent === 'PayTm' && {
                        color: checkoutDetails.brandColor,
                        fontFamily: 'Poppins-SemiBold',
                      },
                    ]}
                  >
                    PayTm
                  </Text>
                </View>
              )}
              <View style={styles.intentContainer}>
                <Pressable
                  style={styles.intentIconBorder}
                  onPress={() => {
                    setUpiCollectVisible(false);
                    setUpiCollectError(false);
                    setSelectedIntent('');
                    setDefaultStateOfSavedUpiArray();
                    handleUpiPayment('');
                    stopTimer()
                  }}
                >
                  <Image
                    source={require('../../assets/images/other-intent-icon.png')}
                    style={styles.intentIcon}
                  />
                </Pressable>
                <Text style={styles.intentTitle}>Others</Text>
              </View>
            </View>

            {selectedIntent !== null && selectedIntent !== '' && (
              <Pressable
                style={[
                  styles.buttonContainer,
                  { backgroundColor: checkoutDetails.brandColor },
                ]}
                onPress={() => handleUpiPayment(selectedIntent)}
              >
                <Text style={styles.buttonText}>
                  Pay{' '}
                  <Text style={styles.currencySymbol}>
                    {checkoutDetails.currencySymbol}
                  </Text>
                  {checkoutDetails.amount} via {selectedIntent}
                </Text>
              </Pressable>
            )}
          </View>
        )}

        {isUpiCollectVisible && (
          <View>
            {upiCollectVisible ? (
              <ImageBackground
                source={require('../../assets/images/add_upi_id_background.png')} // Replace with your background image
                resizeMode="cover"
                style={{
                  paddingBottom: 34,
                  marginTop: isUpiIntentVisible ? 24 : 0,
                }}
              >
                <Pressable
                  style={styles.pressableCollectContainer}
                  onPress={() => handleUpiCollectChevronClick()}
                >
                  {/* Icon and Text Wrapper */}
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image
                      source={require('../../assets/images/add_icon.png')}
                      style={[styles.imageStyle,{
                        tintColor: checkoutDetails.brandColor,
                      }]}
                    />
                    <Text
                      style={[styles.subHeaderText,{
                        color: checkoutDetails.brandColor,
                      }]}
                    >
                      Add new UPI Id
                    </Text>
                  </View>

                  <Animated.Image
                    source={require('../../assets/images/chervon-down.png')}
                    style={[styles.animatedIcon,{
                      transform: [
                        {
                          rotate: upiCollectVisible ? '180deg' : '0deg',
                        },
                      ],
                    }]}
                  />
                </Pressable>
              </ImageBackground>
            ) : (
              <View style={{ paddingBottom: isUpiCollectVisible && (!isUpiQRVisible && !isTablet) ? 16 : 0 }}>
                {isUpiIntentVisible && (
                  <View
                    style={styles.subContainerDivider}
                  />
                )}
                <Pressable
                  style={styles.pressableCollectContainer}
                  onPress={() => handleUpiCollectChevronClick()}
                >
                  {/* Icon and Text Wrapper */}
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image
                      source={require('../../assets/images/add_icon.png')}
                      style={[styles.imageStyle,{
                        tintColor: checkoutDetails.brandColor,
                      }]}
                    />
                    <Text
                      style={[styles.subHeaderText,{
                        color: checkoutDetails.brandColor
                      }]}
                    >
                      Add new UPI Id
                    </Text>
                  </View>

                  <Animated.Image
                    source={require('../../assets/images/chervon-down.png')}
                    style={[styles.animatedIcon,{
                      transform: [
                        {
                          rotate: upiCollectVisible ? '180deg' : '0deg',
                        },
                      ],
                    }]}
                  />
                </Pressable>
              </View>
            )}
          </View>
        )}

        {upiCollectVisible && (
          <View style={{ paddingBottom: isUpiCollectVisible && (!isUpiQRVisible && !isTablet) ? 16 : 0 }}>
            <TextInput
              mode="outlined"
              label={
                <Text
                  style={[styles.labelText,{
                    color: upiIdFocused ? '#2D2B32' : '#ADACB0',
                  }]}
                >
                  Enter UPI Id
                </Text>
              }
              value={upiCollectTextInput}
              onChangeText={(it) => {
                handleTextChange(it);
              }}
              theme={{
                colors: {
                  primary: '#2D2B32',
                  outline: '#E6E6E6',
                },
              }}
              style={styles.textInput}
              error={upiCollectError}
              right={
                upiCollectError ? (
                  <TextInput.Icon
                    icon={() => (
                      <Image
                        source={require('../../assets/images/ic_upi_error.png')}
                        style={styles.errorIcon}
                      />
                    )}
                  />
                ) : null
              }
              outlineStyle={{
                borderRadius: 8, // Add this
                borderWidth: 1.5,
              }}
              onFocus={() => setUpiIdFocused(true)}
              onBlur={() => setUpiIdFocused(false)}
            />
            {upiCollectError && (
              <Text
                style={styles.errorText}
              >
                Please enter a valid UPI Id
              </Text>
            )}
            {upiCollectValid ? (
              <Pressable
                style={[
                  styles.buttonContainer,
                  { backgroundColor: checkoutDetails.brandColor },
                ]}
                onPress={() => {
                  if (upiCollectValid) {
                    handleCollectPayment(upiCollectTextInput, '', 'Upi');
                  } else {
                    setUpiCollectError(true);
                  }
                }}
              >
                <Text style={styles.buttonText}>
                  Verify & Pay{' '}
                  <Text style={styles.currencySymbol}>
                    {checkoutDetails.currencySymbol}
                  </Text>
                  {checkoutDetails.amount}
                </Text>
              </Pressable>
            ) : (
              <Pressable
                style={[styles.buttonContainer, { backgroundColor: '#E6E6E6' }]}
              >
                <Text style={[styles.buttonText, { color: '#ADACB0' }]}>
                  Verify & Pay{' '}
                  <Text style={[styles.currencySymbol, { color: '#ADACB0' }]}>
                    {checkoutDetails.currencySymbol}
                  </Text>
                  {checkoutDetails.amount}
                </Text>
              </Pressable>
            )}
          </View>
        )}

        {(isUpiQRVisible && isTablet) && (
          <View>
          {upiQRVisible ? (
            <ImageBackground
              source={require('../../assets/images/add_upi_id_background.png')} // Replace with your background image
              resizeMode="cover"
              style={{
                paddingBottom: 34,
                marginTop: isUpiIntentVisible || isUpiCollectVisible ? 24 : 0,
              }}
            >
              <Pressable
                style={styles.pressableCollectContainer}
                onPress={() => handleUpiQRChevronClick()}
              >
                {/* Icon and Text Wrapper */}
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image
                    source={require('../../assets/images/ic_qr.png')}
                    style={[styles.imageStyle,{
                      tintColor: checkoutDetails.brandColor,
                    }]}
                  />
                  <Text
                    style={[styles.subHeaderText,{
                      color: checkoutDetails.brandColor
                    }]}
                  >
                    Pay Using QR
                  </Text>
                </View>

                <Animated.Image
                  source={require('../../assets/images/chervon-down.png')}
                  style={[styles.animatedIcon,{
                    transform: [
                      {
                        rotate: upiQRVisible ? '180deg' : '0deg',
                      },
                    ],
                  }]}
                />
              </Pressable>
            </ImageBackground>
          ) : (
            <View style={{ paddingBottom: isUpiCollectVisible || isUpiIntentVisible ? 16 : 0 }}>
              {(isUpiIntentVisible || isUpiCollectVisible) && (
                <View
                  style={styles.subContainerDivider}
                />
              )}
              <Pressable
                style={styles.pressableCollectContainer}
                onPress={() => handleUpiQRChevronClick()}
              >
                {/* Icon and Text Wrapper */}
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image
                    source={require('../../assets/images/ic_qr.png')}
                    style={[styles.imageStyle,{
                      tintColor: checkoutDetails.brandColor,
                    }]}
                  />
                  <Text
                    style={[styles.subHeaderText,{
                      color: checkoutDetails.brandColor
                    }]}
                  >
                   Pay Using QR
                  </Text>
                </View>

                <Animated.Image
                  source={require('../../assets/images/chervon-down.png')}
                  style={[styles.animatedIcon,{
                    transform: [
                      {
                        rotate: upiQRVisible ? '180deg' : '0deg',
                      },
                    ],
                  }]}
                />
              </Pressable>
            </View>
          )}
        </View>
        )}

{upiQRVisible && (
  <View
    style={{
      paddingBottom: isUpiCollectVisible || isUpiIntentVisible ? 16 : 0,
      flexDirection: "row", // ✅ Arrange QR + text in a row
      alignItems: "center", // ✅ Align vertically in the center
    }}
  >
    {qrImage != "" && (
      <View style={styles.qrContainer}>
        <Image
          source={{ uri: `data:image/png;base64,${qrImage}` }}
          style={[
            styles.qrImage,
            { opacity: qrIsExpired ? 0.2 : 1 },
          ]}
        />

        {qrIsExpired && (
          <TouchableOpacity style={styles.retryButton} onPress={handleUpiQRPayment}>
            <Text style={[styles.retryText, { color: checkoutDetails.brandColor }]}>
              ↻ Retry
            </Text>
          </TouchableOpacity>
        )}
      </View>
    )}

    {/* ✅ This will be placed to the right of QR */}
    <View style={styles.textContainer}>
      <Text style={styles.label}>Scan & Pay with UPI Application</Text>
      <Text style={styles.label}>QR code will expire in</Text>
      <Text style={[styles.timer, { color: checkoutDetails.brandColor }]}>
        {formatTime(timeRemaining)}
      </Text>
    </View>
  </View>
)}

      </View>
    </View>
  );
};

export default UpiScreen;
