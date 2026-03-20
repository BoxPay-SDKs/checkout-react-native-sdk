"use strict";

import { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing } from 'react-native';
import { Svg, Circle } from 'react-native-svg';
import { checkoutDetailsHandler } from "../sharedContext/checkoutDetailsHandler.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const CircularProgressBar = ({
  size = 100,
  strokeWidth = 10,
  progress = 75,
  textColor = '#3498db',
  formatTime = '05:00',
  progressColor = '#3498db'
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const {
    fontFamily
  } = checkoutDetailsHandler.checkoutDetails;
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress / (5 * 60) * 100,
      // Convert timerValue to percentage
      duration: 500,
      // Smooth animation
      easing: Easing.linear,
      useNativeDriver: false
    }).start();
  }, [progress]);
  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0] // Full circle to empty
  });
  return /*#__PURE__*/_jsxs(View, {
    style: {
      alignItems: 'center',
      justifyContent: 'center'
    },
    children: [/*#__PURE__*/_jsxs(Svg, {
      width: size,
      height: size,
      children: [/*#__PURE__*/_jsx(Circle, {
        cx: size / 2,
        cy: size / 2,
        r: radius,
        stroke: "#e0e0e0",
        strokeWidth: strokeWidth,
        fill: "none"
      }), /*#__PURE__*/_jsx(AnimatedCircle, {
        cx: size / 2,
        cy: size / 2,
        r: radius,
        stroke: progressColor,
        strokeWidth: strokeWidth,
        fill: "none",
        strokeDasharray: circumference,
        strokeDashoffset: strokeDashoffset,
        strokeLinecap: "round"
      })]
    }), /*#__PURE__*/_jsx(Text, {
      style: {
        position: 'absolute',
        fontSize: 22,
        fontFamily: fontFamily.semiBold,
        color: textColor
      },
      children: formatTime
    })]
  });
};
export default CircularProgressBar;
//# sourceMappingURL=circularProgress.js.map