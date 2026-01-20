import { Colors } from '@/constants/Colors';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { SharedValue, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

const SLIDER_WIDTH = Dimensions.get('window').width - 80;
const KNOB_SIZE = 40;

interface CheckInSliderProps {
    value: SharedValue<number>; // 0 to 1
    labelLeft: string;
    labelRight: string;
}

export const CheckInSlider = ({ value, labelLeft, labelRight }: CheckInSliderProps) => {
    const startX = useSharedValue(0);

    const pan = Gesture.Pan()
        .onBegin(() => {
            startX.value = value.value * SLIDER_WIDTH;
        })
        .onUpdate((e) => {
            let newValue = (startX.value + e.translationX) / SLIDER_WIDTH;
            if (newValue < 0) newValue = 0;
            if (newValue > 1) newValue = 1;
            value.value = newValue;
        });

    const animatedKnobStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: value.value * SLIDER_WIDTH }],
    }));

    const animatedTrackStyle = useAnimatedStyle(() => ({
        width: value.value * SLIDER_WIDTH,
    }));

    return (
        <View style={styles.container}>
            <View style={styles.labels}>
                <Text style={styles.label}>{labelLeft}</Text>
                <Text style={styles.label}>{labelRight}</Text>
            </View>
            <GestureDetector gesture={pan}>
                <View style={styles.trackContainer}>
                    {/* Background Track */}
                    <View style={styles.trackBackground} />
                    {/* Active Track */}
                    <Animated.View style={[styles.trackActive, animatedTrackStyle]} />
                    {/* Knob */}
                    <Animated.View style={[styles.knob, animatedKnobStyle]} />
                </View>
            </GestureDetector>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 20,
        width: SLIDER_WIDTH + KNOB_SIZE, // Add padding for knob
        alignSelf: 'center',
    },
    labels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
        width: SLIDER_WIDTH,
        alignSelf: 'center',
    },
    label: {
        color: Colors.textDim,
        fontSize: 14,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    trackContainer: {
        height: 40, // Touch area height
        justifyContent: 'center',
    },
    trackBackground: {
        position: 'absolute',
        left: 0,
        width: SLIDER_WIDTH,
        height: 4,
        backgroundColor: '#333',
        borderRadius: 2,
        marginLeft: KNOB_SIZE / 2, // Center track relative to knob start
    },
    trackActive: {
        position: 'absolute',
        left: 0,
        height: 4,
        backgroundColor: Colors.white,
        borderRadius: 2,
        marginLeft: KNOB_SIZE / 2,
    },
    knob: {
        position: 'absolute',
        left: 0,
        width: KNOB_SIZE,
        height: KNOB_SIZE,
        borderRadius: KNOB_SIZE / 2,
        backgroundColor: Colors.white,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
});
