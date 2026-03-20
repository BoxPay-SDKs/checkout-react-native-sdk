"use strict";

import { View, Text, Pressable, StyleSheet } from 'react-native';
import React from 'react';
import { RadioButton } from 'react-native-paper';
import { checkoutDetailsHandler } from "../sharedContext/checkoutDetailsHandler.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const SelectTenureCard = ({
  duration,
  monthlyEmiAmount,
  interest,
  discount,
  totalAmount,
  debiitedAmount,
  isLowCostOffer,
  isNoCostOffer,
  isSelected,
  onProceedForward,
  brandColor,
  onRadioClick,
  currencySymbol,
  interestCharged,
  processingFee
}) => {
  const {
    checkoutDetails
  } = checkoutDetailsHandler;
  return /*#__PURE__*/_jsx(View, {
    children: isSelected ? /*#__PURE__*/_jsxs(View, {
      style: {
        backgroundColor: '#EFF3FA'
      },
      children: [/*#__PURE__*/_jsxs(Pressable, {
        style: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 14,
          paddingTop: 14
        },
        onPress: () => onRadioClick(duration, monthlyEmiAmount),
        children: [/*#__PURE__*/_jsx(RadioButton, {
          value: monthlyEmiAmount,
          status: isSelected ? 'checked' : 'unchecked',
          onPress: () => onRadioClick(duration, monthlyEmiAmount),
          color: brandColor,
          uncheckedColor: '#01010273'
        }), /*#__PURE__*/_jsxs(Text, {
          style: {
            fontFamily: checkoutDetails.fontFamily.semiBold,
            fontSize: 14,
            color: '#2D2B32'
          },
          children: [duration, " months x", /*#__PURE__*/_jsxs(Text, {
            style: {
              fontFamily: 'Inter-SemiBold',
              fontSize: 14,
              color: '#2D2B32'
            },
            children: [' ', currencySymbol]
          }), monthlyEmiAmount]
        }), isLowCostOffer && /*#__PURE__*/_jsx(View, {
          style: styles.tag,
          children: /*#__PURE__*/_jsx(Text, {
            style: [styles.tagText, {
              fontFamily: checkoutDetails.fontFamily.medium
            }],
            children: "LOW COST EMI"
          })
        }), isNoCostOffer && /*#__PURE__*/_jsx(View, {
          style: styles.tag,
          children: /*#__PURE__*/_jsx(Text, {
            style: [styles.tagText, {
              fontFamily: checkoutDetails.fontFamily.medium
            }],
            children: "NO COST EMI"
          })
        })]
      }), /*#__PURE__*/_jsxs(View, {
        style: {
          borderColor: '#F1F1F1',
          borderWidth: 1
        },
        children: [/*#__PURE__*/_jsxs(View, {
          style: {
            flexDirection: 'row',
            marginHorizontal: 12,
            marginTop: 16,
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#F1F1F1',
            padding: 8,
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12
          },
          children: [/*#__PURE__*/_jsx(Text, {
            style: {
              fontFamily: checkoutDetails.fontFamily.semiBold,
              fontSize: 12,
              color: '#2D2B32',
              flex: 1,
              textAlign: 'center'
            },
            numberOfLines: 2,
            children: "Monthly EMI"
          }), /*#__PURE__*/_jsxs(Text, {
            style: {
              fontFamily: checkoutDetails.fontFamily.semiBold,
              fontSize: 12,
              color: '#2D2B32',
              flex: 1,
              textAlign: 'center'
            },
            numberOfLines: 2,
            children: ["Interest @", interest, "% p.a."]
          }), discount !== '0' && /*#__PURE__*/_jsx(Text, {
            style: {
              fontFamily: checkoutDetails.fontFamily.semiBold,
              fontSize: 12,
              color: '#2D2B32',
              flex: 1,
              textAlign: 'center'
            },
            numberOfLines: 2,
            children: "Discount"
          }), /*#__PURE__*/_jsx(Text, {
            style: {
              fontFamily: checkoutDetails.fontFamily.semiBold,
              fontSize: 12,
              color: '#2D2B32',
              flex: 1,
              textAlign: 'center'
            },
            numberOfLines: 2,
            children: "Total Cost"
          })]
        }), /*#__PURE__*/_jsxs(View, {
          style: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'white',
            padding: 8,
            borderBottomEndRadius: 12,
            justifyContent: 'space-between',
            borderBottomStartRadius: 12,
            marginHorizontal: 12
          },
          children: [/*#__PURE__*/_jsxs(Text, {
            style: {
              fontFamily: checkoutDetails.fontFamily.medium,
              fontSize: 12,
              color: '#2D2B32',
              flex: 1,
              textAlign: 'center'
            },
            numberOfLines: 2,
            children: [/*#__PURE__*/_jsxs(Text, {
              style: {
                fontFamily: 'Inter-Regular',
                fontSize: 12,
                color: '#2D2B32'
              },
              children: [' ', currencySymbol]
            }), monthlyEmiAmount]
          }), /*#__PURE__*/_jsxs(Text, {
            style: {
              fontFamily: checkoutDetails.fontFamily.medium,
              fontSize: 12,
              color: '#2D2B32',
              flex: 1,
              textAlign: 'center'
            },
            numberOfLines: 2,
            children: [/*#__PURE__*/_jsxs(Text, {
              style: {
                fontFamily: 'Inter-Regular',
                fontSize: 12,
                color: '#2D2B32'
              },
              children: [' ', currencySymbol]
            }), interestCharged]
          }), discount !== '0' && /*#__PURE__*/_jsxs(Text, {
            style: {
              fontFamily: checkoutDetails.fontFamily.medium,
              fontSize: 12,
              color: '#1CA672',
              flex: 1,
              textAlign: 'center'
            },
            numberOfLines: 2,
            children: [/*#__PURE__*/_jsxs(Text, {
              style: {
                fontFamily: 'Inter-Regular',
                fontSize: 12,
                color: '#1CA672'
              },
              children: [' ', "-", currencySymbol]
            }), discount]
          }), /*#__PURE__*/_jsxs(Text, {
            style: {
              fontFamily: checkoutDetails.fontFamily.medium,
              fontSize: 12,
              color: '#2D2B32',
              flex: 1,
              textAlign: 'center'
            },
            numberOfLines: 2,
            children: [/*#__PURE__*/_jsxs(Text, {
              style: {
                fontFamily: 'Inter-Regular',
                fontSize: 12,
                color: '#2D2B32'
              },
              children: [' ', currencySymbol]
            }), totalAmount]
          })]
        })]
      }), /*#__PURE__*/_jsxs(Text, {
        style: {
          padding: 12,
          color: '#2D2B32',
          fontSize: 12,
          lineHeight: 18,
          fontFamily: checkoutDetails.fontFamily.regular
        },
        children: ["Your card will be charged for an amount of", ' ', /*#__PURE__*/_jsxs(Text, {
          style: {
            fontFamily: 'Inter-SemiBold',
            fontSize: 12,
            color: '#2D2B32'
          },
          children: [' ', currencySymbol]
        }), /*#__PURE__*/_jsx(Text, {
          style: {
            fontFamily: checkoutDetails.fontFamily.semiBold,
            fontSize: 12,
            color: '#2D2B32'
          },
          children: debiitedAmount
        }), ' ', "You will be charged an interest of\xA0", /*#__PURE__*/_jsxs(Text, {
          style: {
            fontFamily: 'Inter-SemiBold',
            fontSize: 12,
            color: '#2D2B32'
          },
          children: [' ', currencySymbol]
        }), /*#__PURE__*/_jsx(Text, {
          style: {
            fontFamily: checkoutDetails.fontFamily.semiBold,
            fontSize: 12,
            color: '#2D2B32'
          },
          children: interestCharged
        }), ' ', "by the bank making the total payable amount as", ' ', /*#__PURE__*/_jsxs(Text, {
          style: {
            fontFamily: 'Inter-SemiBold',
            fontSize: 12,
            color: '#2D2B32'
          },
          children: [' ', currencySymbol]
        }), /*#__PURE__*/_jsx(Text, {
          style: {
            fontFamily: checkoutDetails.fontFamily.semiBold,
            fontSize: 12,
            color: '#2D2B32'
          },
          children: totalAmount
        }), "."]
      }), /*#__PURE__*/_jsxs(Text, {
        style: {
          fontFamily: checkoutDetails.fontFamily.regular,
          fontSize: 12,
          color: '#2D2B32',
          paddingHorizontal: 12,
          paddingBottom: 12
        },
        children: [/*#__PURE__*/_jsxs(Text, {
          style: {
            fontFamily: 'Inter-SemiBold',
            fontSize: 12,
            color: '#2D2B32'
          },
          children: [' ', currencySymbol]
        }), /*#__PURE__*/_jsx(Text, {
          style: {
            fontFamily: checkoutDetails.fontFamily.semiBold,
            fontSize: 12,
            color: '#2D2B32'
          },
          children: processingFee
        }), "+GST will be charged by HDFC bank as one-time processing fee."]
      }), /*#__PURE__*/_jsx(Pressable, {
        style: {
          flexDirection: 'row',
          borderRadius: 8,
          justifyContent: 'center',
          marginBottom: 16,
          marginHorizontal: 12,
          paddingVertical: 12,
          backgroundColor: brandColor
        },
        onPress: () => {
          onProceedForward();
        },
        children: /*#__PURE__*/_jsx(Text, {
          style: {
            color: 'white',
            fontSize: 16,
            fontFamily: checkoutDetails.fontFamily.semiBold
          },
          children: "Proceed to Enter Card Details"
        })
      })]
    }) : /*#__PURE__*/_jsx(View, {
      style: {
        padding: 14
      },
      children: /*#__PURE__*/_jsxs(View, {
        style: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center'
        },
        children: [/*#__PURE__*/_jsx(RadioButton, {
          value: monthlyEmiAmount,
          status: isSelected ? 'checked' : 'unchecked',
          onPress: () => onRadioClick(duration, monthlyEmiAmount),
          color: brandColor,
          uncheckedColor: '#01010273'
        }), /*#__PURE__*/_jsxs(View, {
          style: {
            flexShrink: 1
          },
          children: [/*#__PURE__*/_jsxs(Text, {
            style: {
              fontFamily: checkoutDetails.fontFamily.semiBold,
              fontSize: 14,
              color: '#2D2B32',
              alignSelf: 'center'
            },
            onPress: () => onRadioClick(duration, monthlyEmiAmount),
            children: [duration, " months x", /*#__PURE__*/_jsxs(Text, {
              style: {
                fontFamily: 'Inter-SemiBold',
                fontSize: 14,
                color: '#2D2B32'
              },
              children: [' ', currencySymbol]
            }), monthlyEmiAmount, " | @", interest, "% p.a."]
          }), /*#__PURE__*/_jsxs(View, {
            style: {
              flexDirection: 'row',
              flexWrap: 'wrap',
              alignSelf: 'flex-start'
            },
            children: [isLowCostOffer && /*#__PURE__*/_jsx(View, {
              style: styles.tag,
              children: /*#__PURE__*/_jsx(Text, {
                style: [styles.tagText, {
                  fontFamily: checkoutDetails.fontFamily.medium
                }],
                children: "LOW COST EMI"
              })
            }), isNoCostOffer && /*#__PURE__*/_jsx(View, {
              style: styles.tag,
              children: /*#__PURE__*/_jsx(Text, {
                style: [styles.tagText, {
                  fontFamily: checkoutDetails.fontFamily.medium
                }],
                children: "NO COST EMI"
              })
            })]
          })]
        })]
      })
    })
  });
};
export default SelectTenureCard;
const styles = StyleSheet.create({
  tag: {
    borderColor: '#FFADD2',
    borderRadius: 6,
    backgroundColor: '#FFF0F6',
    borderWidth: 1,
    paddingHorizontal: 4,
    marginLeft: 4
  },
  tagText: {
    fontSize: 10,
    color: '#EB2F96'
  }
});
//# sourceMappingURL=selectTenureCard.js.map