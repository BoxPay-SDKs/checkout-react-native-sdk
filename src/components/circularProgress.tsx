import { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing } from 'react-native';
import { Svg, Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CircularProgressBar = ({ size = 100, strokeWidth = 10, progress = 75, textColor = "#3498db", formatTime = "05:00", progressColor = "#3498db" }) => {
    const animatedValue = useRef(new Animated.Value(0)).current;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: (progress / (5 * 60)) * 100, // Convert timerValue to percentage
            duration: 500, // Smooth animation
            easing: Easing.linear,
            useNativeDriver: false,
        }).start();
    }, [progress]);

    const strokeDashoffset = animatedValue.interpolate({
        inputRange: [0, 100],
        outputRange: [circumference, 0], // Full circle to empty
    });


    return (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Svg width={size} height={size}>
                {/* Background Circle */}
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#e0e0e0"
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                {/* Animated Progress Circle */}
                <AnimatedCircle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={progressColor}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                />
            </Svg>
            <Text style={{ position: 'absolute', fontSize: 22, fontFamily: 'Poppins-SemiBold', color: textColor }}>
                {formatTime}
            </Text>
        </View>
    );
};

export default CircularProgressBar;
