import { BlurMask, Canvas, Rect } from '@shopify/react-native-skia';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

const BODY_PARTS = [
    { id: 'hands', label: 'Hands', instruction: 'Clench your fists.' },
    { id: 'shoulders', label: 'Shoulders', instruction: 'Raise them to your ears.' },
    { id: 'jaw', label: 'Jaw', instruction: 'Clench your teeth gently.' },
    { id: 'eyes', label: 'Eyes', instruction: 'Squeeze them shut.' },
    { id: 'feet', label: 'Feet', instruction: 'Curl your toes.' },
];

export default function MelterScreen() {
    const router = useRouter();
    const [stepIndex, setStepIndex] = useState(0);
    const [isSqueezing, setIsSqueezing] = useState(false);

    // Animation Values
    const shake = useSharedValue(0);
    const tensionColor = useSharedValue(0); // 0 = Blue (Relaxed), 1 = Orange (Tense)

    const currentPart = BODY_PARTS[stepIndex];

    // Haptic Loop
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isSqueezing) {
            // High tension vibration loop
            interval = setInterval(() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            }, 100);

            // Visual Shake
            shake.value = withRepeat(withSequence(withTiming(-5, { duration: 50 }), withTiming(5, { duration: 50 })), -1, true);
        } else {
            shake.value = 0;
        }
        return () => clearInterval(interval);
    }, [isSqueezing]);

    const handleRelease = () => {
        setIsSqueezing(false);
        // Release Haptic: Long sigh feel
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        // Progress after noticeable delay
        setTimeout(() => {
            if (stepIndex < BODY_PARTS.length - 1) {
                setStepIndex(prev => prev + 1);
            } else {
                router.replace('/post-check');
            }
        }, 1500);
    };

    const longPress = Gesture.LongPress()
        .minDuration(0)
        .onStart(() => {
            runOnJS(setIsSqueezing)(true);
        })
        .onFinalize(() => {
            runOnJS(handleRelease)();
        });

    const animatedBodyStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: shake.value }],
    }));

    return (
        <View style={styles.container}>
            <Text style={styles.header}>The Melter</Text>

            <View style={styles.vizContainer}>
                <Animated.View style={[styles.bodyShape, animatedBodyStyle]}>
                    <Canvas style={{ flex: 1 }}>
                        <Rect x={0} y={0} width={200} height={300} color={isSqueezing ? "#FF4500" : "#4AA088"}>
                            <BlurMask blur={20} style="normal" />
                        </Rect>
                    </Canvas>
                </Animated.View>
                <Text style={styles.partLabel}>{currentPart.label}</Text>
                <Text style={styles.instruction}>{isSqueezing ? "HOLD..." : currentPart.instruction}</Text>
            </View>

            <GestureDetector gesture={longPress}>
                <View style={[styles.button, isSqueezing && styles.buttonActive]}>
                    <Text style={styles.buttonText}>{isSqueezing ? "HOLDING" : "SQUEEZE"}</Text>
                </View>
            </GestureDetector>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1A1B41', // Deep Indigo
        alignItems: 'center',
        paddingTop: 60,
    },
    header: {
        color: '#B0B0B0', // Smoke Grey
        fontSize: 20,
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    vizContainer: {
        height: 400,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 40,
    },
    bodyShape: {
        width: 200,
        height: 300,
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 30,
    },
    partLabel: {
        color: 'white',
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    instruction: {
        color: '#88AACC',
        fontSize: 18,
    },
    button: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#555',
    },
    buttonActive: {
        backgroundColor: '#FF4500',
        borderColor: '#FF6347',
        transform: [{ scale: 1.1 }],
    },
    buttonText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        letterSpacing: 2,
    },
});
