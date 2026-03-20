"use strict";

import { View, Text, Pressable, Image, Animated, ImageBackground, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { TextInput } from 'react-native-paper';
import { checkoutDetailsHandler } from "../sharedContext/checkoutDetailsHandler.js";
import { AnalyticsEvents } from "../interface.js";
import PaymentSelectorView from "../components/paymentSelector.js";
import { getInstalledUpiApps } from "../components/getInstalledUPI.js";
import styles from "../styles/screens/upiScreenStyles.js";
import { formatTime, height, width } from "../utility.js";
import upiPostRequest from "../postRequest/upiPostRequest.js";
import { handlePaymentResponse } from "../sharedContext/handlePaymentResponseHandler.js";
import callUIAnalytics from "../postRequest/callUIAnalytics.js";
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
const UpiScreen = ({
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
  const {
    checkoutDetails
  } = checkoutDetailsHandler;
  const [upiCollectVisible, setUpiCollectVisible] = useState(false);
  const [upiQRVisible, setUpiQRVisible] = useState(false);
  const [selectedIntent, setSelectedIntent] = useState(null);
  const {
    isUpiCollectMethodEnabled: isUpiCollectVisible,
    isUpiIntentMethodEnabled: isUpiIntentVisible,
    isUpiQRMethodEnabled: isUpiQRVisible,
    isUPIOtmIntentMethodEnabled: isUPIOtmIntentVisible,
    isUPIOtmCollectMethodEnabled: isUPIOtmCollectVisible,
    isUPIOtmQRMethodEnabled: isUPIOtmQRVisible,
    fontFamily
  } = checkoutDetails;
  const isTablet = Math.min(width, height) >= 600;
  const [qrImage, setQrImage] = useState("");
  useEffect(() => {
    const checkUpiApps = async () => {
      try {
        const installedApplications = await getInstalledUpiApps();
        setIsPhonePeInstalled(installedApplications.includes('phonepe'));
        setIsGpayInstalled(installedApplications.includes('gpay'));
        setIsPaytmInstalled(installedApplications.includes('paytm'));
      } catch (error) {
        callUIAnalytics(AnalyticsEvents.ERROR_GETTING_UPI_URL, "UPIScreen", `fetch installed applications failed due to ${error}`);
        throw new Error(`${error}`);
      }
    };
    checkUpiApps();
  }, []);
  const handleUpiQRPayment = async () => {
    const requestPayload = {
      type: isUPIOtmQRVisible ? "upiotm/qr" : 'upi/qr'
    };
    setLoading(true);
    const response = await upiPostRequest(requestPayload, false);
    handlePaymentResponse({
      response: response,
      checkoutDetailsErrorMessage: checkoutDetailsHandler.checkoutDetails.errorMessage,
      onSetStatus: setStatus,
      onSetTransactionId: setTransaction,
      onShowFailedModal: () => setFailedModal(true),
      onSetFailedMessage: setFailedModalMessage,
      onOpenQr: url => {
        setQrImage(url);
        onStartQRTimer();
        setSelectedIntent(null);
        setUpiCollectVisible(false);
        setUpiQRVisible(true);
        setDefaultStateOfSavedUpiArray();
      },
      setLoading: setLoading
    });
  };
  const handleUpiCollectChevronClick = () => {
    setSelectedIntent(null);
    setUpiCollectVisible(!upiCollectVisible);
    setUpiQRVisible(false);
    setDefaultStateOfSavedUpiArray();
    stopTimer();
  };
  const handleUpiQRChevronClick = () => {
    if (upiQRVisible) {
      setUpiQRVisible(false);
    } else {
      handleUpiQRPayment();
    }
  };
  const handleTextChange = text => {
    setUpiCollectTextInput(text);
    setUpiCollectError(false);
    if (text.trim() !== '' && /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{3,64}$/.test(text)) {
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
    if (savedUpiArray.length != 0 && savedUpiArray.some(item => item.isSelected)) {
      onClickRadio('');
    }
  };
  return /*#__PURE__*/_jsx(View, {
    children: (isUpiIntentVisible || isUpiCollectVisible || isUpiQRVisible && isTablet || isUPIOtmIntentVisible || isUPIOtmCollectVisible || isUPIOtmQRVisible && isTablet) && /*#__PURE__*/_jsxs(_Fragment, {
      children: [/*#__PURE__*/_jsx(View, {
        style: styles.headingContainer,
        children: /*#__PURE__*/_jsx(Text, {
          style: [styles.headingText, {
            fontFamily: checkoutDetails.fontFamily.semiBold
          }],
          children: "Pay by any UPI"
        })
      }), /*#__PURE__*/_jsxs(View, {
        style: styles.intentBackground,
        children: [savedUpiArray.length != 0 && /*#__PURE__*/_jsxs(_Fragment, {
          children: [/*#__PURE__*/_jsx(PaymentSelectorView, {
            providerList: savedUpiArray,
            onProceedForward: (displayValue, instrumentValue, type) => handleCollectPayment(displayValue, instrumentValue, type),
            errorImage: require('../../assets/images/ic_upi.png'),
            isLastUsed: false,
            onClickRadio: selectedValue => {
              setUpiQRVisible(false);
              stopTimer();
              setSelectedIntent(null);
              setUpiCollectVisible(false);
              onClickRadio(selectedValue);
            }
          }), /*#__PURE__*/_jsx(View, {
            style: styles.divider
          })]
        }), (isUpiIntentVisible || isUPIOtmIntentVisible) && /*#__PURE__*/_jsxs(View, {
          children: [/*#__PURE__*/_jsxs(View, {
            style: styles.upiIntentRow,
            children: [isGpayInstalled && /*#__PURE__*/_jsxs(View, {
              style: styles.intentContainer,
              children: [/*#__PURE__*/_jsx(Pressable, {
                style: [styles.intentIconBorder, selectedIntent === 'GPay' && {
                  borderColor: checkoutDetails.buttonColor,
                  borderWidth: 2
                }],
                onPress: () => {
                  setUpiCollectVisible(false);
                  setUpiCollectError(false);
                  setSelectedIntent('GPay');
                  setDefaultStateOfSavedUpiArray();
                  stopTimer();
                },
                children: /*#__PURE__*/_jsx(Image, {
                  source: require('../../assets/images/gpay-icon.png'),
                  style: styles.intentIcon
                })
              }), /*#__PURE__*/_jsx(Text, {
                style: [styles.intentTitle, selectedIntent === 'GPay' && {
                  color: checkoutDetails.buttonColor,
                  fontFamily: fontFamily.semiBold
                }],
                children: "GPay"
              })]
            }), isPhonePeInstalled && /*#__PURE__*/_jsxs(View, {
              style: styles.intentContainer,
              children: [/*#__PURE__*/_jsx(Pressable, {
                style: [styles.intentIconBorder, selectedIntent === 'PhonePe' && {
                  borderColor: checkoutDetails.buttonColor,
                  borderWidth: 2
                }],
                onPress: () => {
                  setUpiCollectVisible(false);
                  setUpiCollectError(false);
                  setSelectedIntent('PhonePe');
                  setDefaultStateOfSavedUpiArray();
                  stopTimer();
                },
                children: /*#__PURE__*/_jsx(Image, {
                  source: require('../../assets/images/phonepe-icon.png'),
                  style: {
                    height: 30,
                    width: 30
                  }
                })
              }), /*#__PURE__*/_jsx(Text, {
                style: [styles.intentTitle, selectedIntent === 'PhonePe' && {
                  color: checkoutDetails.buttonColor,
                  fontFamily: fontFamily.semiBold
                }],
                children: "PhonePe"
              })]
            }), isPaytmInstalled && /*#__PURE__*/_jsxs(View, {
              style: styles.intentContainer,
              children: [/*#__PURE__*/_jsx(Pressable, {
                style: [styles.intentIconBorder, selectedIntent === 'PayTm' && {
                  borderColor: checkoutDetails.buttonColor,
                  borderWidth: 2
                }],
                onPress: () => {
                  setUpiCollectVisible(false);
                  setUpiCollectError(false);
                  setSelectedIntent('PayTm');
                  setDefaultStateOfSavedUpiArray();
                  stopTimer();
                },
                children: /*#__PURE__*/_jsx(Image, {
                  source: require('../../assets/images/paytm-icon.png'),
                  style: {
                    height: 28,
                    width: 44
                  }
                })
              }), /*#__PURE__*/_jsx(Text, {
                style: [styles.intentTitle, selectedIntent === 'PayTm' && {
                  color: checkoutDetails.buttonColor,
                  fontFamily: fontFamily.semiBold
                }],
                children: "PayTm"
              })]
            }), /*#__PURE__*/_jsxs(View, {
              style: styles.intentContainer,
              children: [/*#__PURE__*/_jsx(Pressable, {
                style: styles.intentIconBorder,
                onPress: () => {
                  setUpiCollectVisible(false);
                  setUpiCollectError(false);
                  setSelectedIntent('');
                  setDefaultStateOfSavedUpiArray();
                  handleUpiPayment('');
                  stopTimer();
                },
                children: /*#__PURE__*/_jsx(Image, {
                  source: require('../../assets/images/other-intent-icon.png'),
                  style: styles.intentIcon
                })
              }), /*#__PURE__*/_jsx(Text, {
                style: [styles.intentTitle, {
                  fontFamily: fontFamily.semiBold
                }],
                children: "Others"
              })]
            })]
          }), selectedIntent !== null && selectedIntent !== '' && /*#__PURE__*/_jsx(Pressable, {
            style: [styles.buttonContainer, {
              backgroundColor: checkoutDetails.buttonColor
            }],
            onPress: () => handleUpiPayment(selectedIntent),
            children: /*#__PURE__*/_jsxs(Text, {
              style: [styles.buttonText, {
                color: checkoutDetails.buttonTextColor,
                fontFamily: fontFamily.semiBold
              }],
              children: ["Pay", ' ', /*#__PURE__*/_jsx(Text, {
                style: styles.currencySymbol,
                children: checkoutDetails.currencySymbol
              }), checkoutDetails.amount, " via ", selectedIntent]
            })
          })]
        }), (isUpiCollectVisible || isUPIOtmCollectVisible) && /*#__PURE__*/_jsx(View, {
          children: upiCollectVisible ? /*#__PURE__*/_jsx(ImageBackground, {
            source: require('../../assets/images/add_upi_id_background.png') // Replace with your background image
            ,
            resizeMode: "cover",
            style: {
              paddingBottom: 34,
              marginTop: isUpiIntentVisible || isUPIOtmIntentVisible ? 24 : 0
            },
            children: /*#__PURE__*/_jsxs(Pressable, {
              style: styles.pressableCollectContainer,
              onPress: () => handleUpiCollectChevronClick(),
              children: [/*#__PURE__*/_jsxs(View, {
                style: {
                  flexDirection: 'row',
                  alignItems: 'center'
                },
                children: [/*#__PURE__*/_jsx(Image, {
                  source: require('../../assets/images/add_icon.png'),
                  style: [styles.imageStyle, {
                    tintColor: checkoutDetails.buttonColor
                  }]
                }), /*#__PURE__*/_jsx(Text, {
                  style: [styles.subHeaderText, {
                    color: checkoutDetails.buttonColor,
                    paddingTop: 4,
                    fontFamily: fontFamily.semiBold
                  }],
                  children: "Add new UPI Id"
                })]
              }), /*#__PURE__*/_jsx(Animated.Image, {
                source: require('../../assets/images/chervon-down.png'),
                style: [styles.animatedIcon, {
                  transform: [{
                    rotate: upiCollectVisible ? '180deg' : '0deg'
                  }]
                }]
              })]
            })
          }) : /*#__PURE__*/_jsxs(View, {
            style: {
              paddingBottom: (isUpiCollectVisible || isUPIOtmCollectVisible) && (!isUpiQRVisible || !isUPIOtmQRVisible) && !isTablet ? 16 : 0
            },
            children: [(isUpiIntentVisible || isUPIOtmIntentVisible) && /*#__PURE__*/_jsx(View, {
              style: styles.subContainerDivider
            }), /*#__PURE__*/_jsxs(Pressable, {
              style: styles.pressableCollectContainer,
              onPress: () => handleUpiCollectChevronClick(),
              children: [/*#__PURE__*/_jsxs(View, {
                style: {
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingBottom: 10
                },
                children: [/*#__PURE__*/_jsx(Image, {
                  source: require('../../assets/images/add_icon.png'),
                  style: [styles.imageStyle, {
                    tintColor: checkoutDetails.buttonColor
                  }]
                }), /*#__PURE__*/_jsx(Text, {
                  style: [styles.subHeaderText, {
                    color: checkoutDetails.buttonColor,
                    paddingTop: 4,
                    fontFamily: fontFamily.semiBold
                  }],
                  children: "Add new UPI Id"
                })]
              }), /*#__PURE__*/_jsx(Animated.Image, {
                source: require('../../assets/images/chervon-down.png'),
                style: [styles.animatedIcon, {
                  transform: [{
                    rotate: upiCollectVisible ? '180deg' : '0deg'
                  }]
                }]
              })]
            })]
          })
        }), upiCollectVisible && /*#__PURE__*/_jsxs(View, {
          style: {
            paddingBottom: 16
          },
          children: [/*#__PURE__*/_jsx(TextInput, {
            mode: "outlined",
            label: /*#__PURE__*/_jsx(Text, {
              style: [styles.labelText, {
                color: upiIdFocused ? '#2D2B32' : '#ADACB0',
                fontFamily: fontFamily.regular
              }],
              children: "Enter UPI Id"
            }),
            value: upiCollectTextInput,
            onChangeText: it => {
              handleTextChange(it);
            },
            theme: {
              colors: {
                primary: '#2D2B32',
                outline: '#E6E6E6'
              }
            },
            style: [styles.textInput, {
              fontFamily: checkoutDetails.fontFamily.regular
            }],
            error: upiCollectError,
            right: upiCollectError ? /*#__PURE__*/_jsx(TextInput.Icon, {
              icon: () => /*#__PURE__*/_jsx(Image, {
                source: require('../../assets/images/ic_upi_error.png'),
                style: styles.errorIcon
              })
            }) : null,
            outlineStyle: {
              borderRadius: 8,
              // Add this
              borderWidth: 1.5
            },
            onFocus: () => setUpiIdFocused(true),
            onBlur: () => setUpiIdFocused(false)
          }), upiCollectError && /*#__PURE__*/_jsx(Text, {
            style: [styles.errorText, {
              fontFamily: fontFamily.regular
            }],
            children: "Please enter a valid UPI Id"
          }), upiCollectValid ? /*#__PURE__*/_jsx(Pressable, {
            style: [styles.buttonContainer, {
              backgroundColor: checkoutDetails.buttonColor
            }],
            onPress: () => {
              if (upiCollectValid) {
                handleCollectPayment(upiCollectTextInput, '', 'Upi');
              } else {
                setUpiCollectError(true);
              }
            },
            children: /*#__PURE__*/_jsxs(Text, {
              style: [styles.buttonText, {
                color: checkoutDetails.buttonTextColor,
                fontFamily: fontFamily.semiBold
              }],
              children: ["Verify & Pay", ' ', /*#__PURE__*/_jsx(Text, {
                style: styles.currencySymbol,
                children: checkoutDetails.currencySymbol
              }), checkoutDetails.amount]
            })
          }) : /*#__PURE__*/_jsx(Pressable, {
            style: [styles.buttonContainer, {
              backgroundColor: '#E6E6E6'
            }],
            children: /*#__PURE__*/_jsxs(Text, {
              style: [styles.buttonText, {
                color: '#ADACB0',
                fontFamily: fontFamily.semiBold
              }],
              children: ["Verify & Pay", ' ', /*#__PURE__*/_jsx(Text, {
                style: [styles.currencySymbol, {
                  color: '#ADACB0'
                }],
                children: checkoutDetails.currencySymbol
              }), checkoutDetails.amount]
            })
          })]
        }), (isUpiQRVisible || isUPIOtmQRVisible) && isTablet && /*#__PURE__*/_jsx(View, {
          children: upiQRVisible ? /*#__PURE__*/_jsx(ImageBackground, {
            source: require('../../assets/images/add_upi_id_background.png') // Replace with your background image
            ,
            resizeMode: "cover",
            style: {
              paddingBottom: 34,
              marginTop: isUpiIntentVisible || isUPIOtmIntentVisible || isUpiCollectVisible || isUPIOtmCollectVisible ? 24 : 0
            },
            children: /*#__PURE__*/_jsxs(Pressable, {
              style: styles.pressableCollectContainer,
              onPress: () => handleUpiQRChevronClick(),
              children: [/*#__PURE__*/_jsxs(View, {
                style: {
                  flexDirection: 'row',
                  alignItems: 'center'
                },
                children: [/*#__PURE__*/_jsx(Image, {
                  source: require('../../assets/images/ic_qr.png'),
                  style: [styles.imageStyle, {
                    tintColor: checkoutDetails.buttonColor
                  }]
                }), /*#__PURE__*/_jsx(Text, {
                  style: [styles.subHeaderText, {
                    color: checkoutDetails.buttonColor,
                    fontFamily: fontFamily.semiBold
                  }],
                  children: "Pay Using QR"
                })]
              }), /*#__PURE__*/_jsx(Animated.Image, {
                source: require('../../assets/images/chervon-down.png'),
                style: [styles.animatedIcon, {
                  transform: [{
                    rotate: upiQRVisible ? '180deg' : '0deg'
                  }]
                }]
              })]
            })
          }) : /*#__PURE__*/_jsxs(View, {
            style: {
              paddingBottom: isUpiCollectVisible || isUPIOtmCollectVisible || isUpiIntentVisible || isUPIOtmIntentVisible ? 16 : 0
            },
            children: [(isUpiIntentVisible || isUPIOtmIntentVisible || isUpiCollectVisible || isUPIOtmCollectVisible) && /*#__PURE__*/_jsx(View, {
              style: styles.subContainerDivider
            }), /*#__PURE__*/_jsxs(Pressable, {
              style: styles.pressableCollectContainer,
              onPress: () => handleUpiQRChevronClick(),
              children: [/*#__PURE__*/_jsxs(View, {
                style: {
                  flexDirection: 'row',
                  alignItems: 'center'
                },
                children: [/*#__PURE__*/_jsx(Image, {
                  source: require('../../assets/images/ic_qr.png'),
                  style: [styles.imageStyle, {
                    tintColor: checkoutDetails.buttonColor
                  }]
                }), /*#__PURE__*/_jsx(Text, {
                  style: [styles.subHeaderText, {
                    color: checkoutDetails.buttonColor,
                    fontFamily: fontFamily.semiBold
                  }],
                  children: "Pay Using QR"
                })]
              }), /*#__PURE__*/_jsx(Animated.Image, {
                source: require('../../assets/images/chervon-down.png'),
                style: [styles.animatedIcon, {
                  transform: [{
                    rotate: upiQRVisible ? '180deg' : '0deg'
                  }]
                }]
              })]
            })]
          })
        }), upiQRVisible && /*#__PURE__*/_jsxs(View, {
          style: {
            paddingBottom: isUpiCollectVisible || isUPIOtmCollectVisible || isUpiIntentVisible || isUPIOtmIntentVisible ? 16 : 0,
            flexDirection: "row",
            // ✅ Arrange QR + text in a row
            alignItems: "center" // ✅ Align vertically in the center
          },
          children: [qrImage != "" && /*#__PURE__*/_jsxs(View, {
            style: styles.qrContainer,
            children: [/*#__PURE__*/_jsx(Image, {
              source: {
                uri: `data:image/png;base64,${qrImage}`
              },
              style: [styles.qrImage, {
                opacity: qrIsExpired ? 0.2 : 1
              }]
            }), qrIsExpired && /*#__PURE__*/_jsx(TouchableOpacity, {
              style: styles.retryButton,
              onPress: handleUpiQRPayment,
              children: /*#__PURE__*/_jsx(Text, {
                style: [styles.retryText, {
                  color: checkoutDetails.buttonColor
                }],
                children: "\u21BB Retry"
              })
            })]
          }), /*#__PURE__*/_jsxs(View, {
            style: styles.textContainer,
            children: [/*#__PURE__*/_jsx(Text, {
              style: styles.label,
              children: "Scan & Pay with UPI Application"
            }), /*#__PURE__*/_jsx(Text, {
              style: styles.label,
              children: "QR code will expire in"
            }), /*#__PURE__*/_jsx(Text, {
              style: [styles.timer, {
                color: checkoutDetails.buttonColor
              }],
              children: formatTime(timeRemaining)
            })]
          })]
        })]
      })]
    })
  });
};
export default UpiScreen;
//# sourceMappingURL=upiScreen.js.map