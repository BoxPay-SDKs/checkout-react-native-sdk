"use strict";

import { View, Text, Image, Pressable, ScrollView } from 'react-native';
import { useState } from 'react';
import { SvgUri } from 'react-native-svg';
import { checkoutDetailsHandler } from "../sharedContext/checkoutDetailsHandler.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const OrderDetails = ({
  totalAmount,
  itemsArray,
  subTotalAmount,
  shippingAmount,
  taxAmount,
  surchargeDetails,
  selectedPaymentMethod
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    checkoutDetails
  } = checkoutDetailsHandler;
  const itemHeight = 70; // Approximate height of each row
  const maxVisibleItems = 3;
  const scrollHeight = Math.min(itemsArray.length, maxVisibleItems) * itemHeight;
  const MyImage = ({
    uri
  }) => {
    const isSvg = uri?.endsWith('.svg');
    return isSvg ? /*#__PURE__*/_jsx(View, {
      style: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center'
      },
      children: /*#__PURE__*/_jsx(SvgUri, {
        uri: uri,
        width: 100 // Keep original size
        ,
        height: 100,
        style: {
          transform: [{
            scale: 0.4
          }]
        }
      })
    }) : /*#__PURE__*/_jsx(Image, {
      source: {
        uri
      },
      style: {
        width: 44,
        height: 44
      },
      resizeMode: "contain"
    });
  };
  return /*#__PURE__*/_jsx(View, {
    children: isExpanded ? /*#__PURE__*/_jsxs(View, {
      style: {
        borderColor: '#F1F1F1',
        borderWidth: 1,
        marginHorizontal: 16,
        marginVertical: 8,
        paddingVertical: 16,
        backgroundColor: 'white',
        borderRadius: 12
      },
      children: [/*#__PURE__*/_jsx(Pressable, {
        onPress: () => setIsExpanded(false),
        children: /*#__PURE__*/_jsxs(View, {
          style: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 12
          },
          children: [/*#__PURE__*/_jsx(Text, {
            style: {
              fontSize: 14,
              color: '#363840',
              fontFamily: checkoutDetails.fontFamily.semiBold
            },
            children: "Price Details"
          }), /*#__PURE__*/_jsx(Image, {
            source: require('../../assets/images/chervon-down.png'),
            style: {
              height: 6,
              width: 14,
              marginHorizontal: 6,
              // Space between price and arrow
              alignSelf: 'center',
              transform: [{
                rotate: '180deg'
              }]
            }
          })]
        })
      }), /*#__PURE__*/_jsx(View, {
        style: {
          height: scrollHeight,
          overflow: 'hidden',
          marginTop: 12
        },
        children: /*#__PURE__*/_jsx(ScrollView, {
          nestedScrollEnabled: true,
          showsVerticalScrollIndicator: true,
          style: {
            paddingHorizontal: 12
          },
          children: itemsArray.map((item, index) => /*#__PURE__*/_jsxs(View, {
            style: {
              flexDirection: 'row',
              marginBottom: 8,
              alignItems: 'flex-start'
            },
            children: [item.imageUrl !== '' && /*#__PURE__*/_jsx(View, {
              style: {
                borderColor: '#DCDEE3',
                borderWidth: 1,
                borderRadius: 8,
                width: 54,
                height: 54,
                padding: 4
              },
              children: /*#__PURE__*/_jsx(MyImage, {
                uri: item.imageUrl
              })
            }), /*#__PURE__*/_jsxs(View, {
              style: {
                flexGrow: 1,
                flexShrink: 1,
                paddingHorizontal: 8
              },
              children: [/*#__PURE__*/_jsx(Text, {
                style: {
                  fontFamily: checkoutDetails.fontFamily.regular,
                  fontSize: 12,
                  color: '#2D2B32'
                },
                numberOfLines: 2,
                ellipsizeMode: 'tail',
                children: item.imageTitle
              }), /*#__PURE__*/_jsxs(Text, {
                style: {
                  fontFamily: checkoutDetails.fontFamily.semiBold,
                  fontSize: 12,
                  color: '#2D2B32'
                },
                children: ["Qty: ", item.imageOty]
              })]
            }), /*#__PURE__*/_jsx(View, {
              style: {
                alignSelf: 'flex-start'
              },
              children: /*#__PURE__*/_jsxs(Text, {
                style: {
                  fontFamily: checkoutDetails.fontFamily.regular,
                  fontSize: 12,
                  color: '#2D2B32',
                  textAlign: 'right'
                },
                children: [/*#__PURE__*/_jsxs(Text, {
                  style: {
                    fontFamily: 'Inter-Regular',
                    fontSize: 12,
                    color: '#2D2B32'
                  },
                  children: [' ', checkoutDetails.currencySymbol]
                }), item.imageAmount]
              })
            })]
          }, index))
        })
      }), (subTotalAmount !== '' || taxAmount !== '' || shippingAmount !== '') && /*#__PURE__*/_jsx(View, {
        style: {
          borderBottomWidth: 1.5,
          // Thickness of the line
          borderBottomColor: '#E6E6E6',
          // Color of the line
          borderStyle: 'dashed',
          // Makes it dashed
          width: '100%',
          // Full width
          marginVertical: 10,
          marginTop: 4
        }
      }), subTotalAmount !== '' && /*#__PURE__*/_jsxs(View, {
        style: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8,
          paddingHorizontal: 12
        },
        children: [/*#__PURE__*/_jsx(Text, {
          style: {
            fontFamily: checkoutDetails.fontFamily.regular,
            fontSize: 14,
            color: '#2D2B32'
          },
          children: "Subtotal"
        }), /*#__PURE__*/_jsxs(Text, {
          style: {
            fontFamily: checkoutDetails.fontFamily.semiBold,
            fontSize: 14,
            color: '#2D2B32'
          },
          children: [/*#__PURE__*/_jsxs(Text, {
            style: {
              fontFamily: 'Inter-SemiBold',
              fontSize: 14,
              color: '#2D2B32'
            },
            children: [' ', checkoutDetails.currencySymbol]
          }), subTotalAmount]
        })]
      }), taxAmount !== '' && /*#__PURE__*/_jsxs(View, {
        style: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8,
          paddingHorizontal: 12
        },
        children: [/*#__PURE__*/_jsx(Text, {
          style: {
            fontFamily: checkoutDetails.fontFamily.regular,
            fontSize: 14,
            color: '#2D2B32'
          },
          children: "Tax"
        }), /*#__PURE__*/_jsxs(Text, {
          style: {
            fontFamily: checkoutDetails.fontFamily.semiBold,
            fontSize: 14,
            color: '#2D2B32'
          },
          children: [/*#__PURE__*/_jsxs(Text, {
            style: {
              fontFamily: 'Inter-SemiBold',
              fontSize: 14,
              color: '#2D2B32'
            },
            children: [' ', checkoutDetails.currencySymbol]
          }), taxAmount]
        })]
      }), shippingAmount !== '' && /*#__PURE__*/_jsxs(View, {
        style: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8,
          paddingHorizontal: 12
        },
        children: [/*#__PURE__*/_jsx(Text, {
          style: {
            fontFamily: checkoutDetails.fontFamily.regular,
            fontSize: 14,
            color: '#2D2B32'
          },
          children: "Shipping Amount"
        }), /*#__PURE__*/_jsxs(Text, {
          style: {
            fontFamily: checkoutDetails.fontFamily.semiBold,
            fontSize: 14,
            color: '#2D2B32'
          },
          children: [/*#__PURE__*/_jsx(Text, {
            style: {
              fontFamily: 'Inter-SemiBold',
              fontSize: 14,
              color: '#2D2B32'
            },
            children: checkoutDetails.currencySymbol
          }), shippingAmount]
        })]
      }), surchargeDetails.length != 0 && surchargeDetails?.filter(item => {
        const applicable = item?.applicable?.toLowerCase?.();
        return !applicable ||
        // handles "", null, undefined
        applicable === selectedPaymentMethod?.toLowerCase?.();
      }).map((item, index) => /*#__PURE__*/_jsxs(View, {
        style: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8,
          paddingHorizontal: 12
        },
        children: [/*#__PURE__*/_jsx(Text, {
          style: {
            fontFamily: checkoutDetails.fontFamily.regular,
            fontSize: 14,
            color: '#2D2B32'
          },
          children: item.title
        }), /*#__PURE__*/_jsxs(Text, {
          style: {
            fontFamily: checkoutDetails.fontFamily.semiBold,
            fontSize: 14,
            color: '#2D2B32'
          },
          children: [/*#__PURE__*/_jsx(Text, {
            style: {
              fontFamily: 'Inter-SemiBold',
              fontSize: 14,
              color: '#2D2B32'
            },
            children: checkoutDetails.currencySymbol
          }), item.amount.toLocaleString()]
        })]
      }, index)), /*#__PURE__*/_jsxs(View, {
        style: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#F1F1F1',
          paddingHorizontal: 8,
          paddingVertical: 12,
          borderRadius: 8,
          marginHorizontal: 12
        },
        children: [/*#__PURE__*/_jsx(Text, {
          style: {
            fontFamily: checkoutDetails.fontFamily.semiBold,
            fontSize: 16,
            color: '#1D1C20'
          },
          children: "Total"
        }), /*#__PURE__*/_jsxs(Text, {
          style: {
            fontFamily: checkoutDetails.fontFamily.semiBold,
            fontSize: 16,
            color: '#1D1C20'
          },
          children: [/*#__PURE__*/_jsxs(Text, {
            style: {
              fontFamily: 'Inter-SemiBold',
              fontSize: 16,
              color: '#1D1C20'
            },
            children: [' ', checkoutDetails.currencySymbol]
          }), totalAmount]
        })]
      })]
    }) : /*#__PURE__*/_jsx(Pressable, {
      onPress: () => setIsExpanded(true),
      children: /*#__PURE__*/_jsxs(View, {
        style: {
          borderColor: '#F1F1F1',
          borderWidth: 1,
          marginHorizontal: 16,
          marginVertical: 8,
          paddingVertical: 16,
          paddingHorizontal: 12,
          backgroundColor: 'white',
          flexDirection: 'row',
          borderRadius: 12,
          justifyContent: 'space-between',
          alignItems: 'center' // Ensures vertical alignment
        },
        children: [/*#__PURE__*/_jsx(Text, {
          style: {
            fontSize: 14,
            color: '#363840',
            fontFamily: checkoutDetails.fontFamily.semiBold
          },
          children: "Price Details"
        }), /*#__PURE__*/_jsxs(View, {
          style: {
            flexDirection: 'row',
            alignItems: 'center'
          },
          children: [/*#__PURE__*/_jsxs(Text, {
            style: {
              fontSize: 14,
              color: '#363840',
              fontFamily: checkoutDetails.fontFamily.semiBold
            },
            children: [/*#__PURE__*/_jsx(Text, {
              style: {
                fontSize: 14,
                color: '#363840',
                fontFamily: 'Inter-SemiBold'
              },
              children: checkoutDetails.currencySymbol
            }), totalAmount]
          }), /*#__PURE__*/_jsx(Image, {
            source: require('../../assets/images/chervon-down.png'),
            style: {
              height: 6,
              width: 14,
              marginHorizontal: 6,
              // Space between price and arrow
              alignSelf: 'center'
            }
          })]
        })]
      })
    })
  });
};
export default OrderDetails;
//# sourceMappingURL=orderDetails.js.map