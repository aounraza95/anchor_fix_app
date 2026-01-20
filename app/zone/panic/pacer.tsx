import { Colors } from '@/constants/Colors';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { Easing, FadeIn, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const CYCLE_DURATION = 12000; // 4s inhale + 4s hold + 4s exhale
const TOTAL_CYCLES = 4;

export default function HapticPacerScreen() {
    const router = useRouter();
    const scale = useSharedValue(1);
    const opacity = useSharedValue(0.5);
    const [cycleCount, setCycleCount] = useState(0);
    const [phaseText, setPhaseText] = useState('Inhale');

    useEffect(() => {
        let interval: NodeJS.Timeout;

        const runBreathingCycle = async () => {
            if (cycleCount >= TOTAL_CYCLES) {
                // Auto-advance to Grounding after cycles
                router.replace('/zone/panic/grounding');
                return;
            }

            // INHALE (4s)
            setPhaseText('Inhale');
            scale.value = withTiming(2.5, { duration: 4000, easing: Easing.inOut(Easing.ease) });
            opacity.value = withTiming(1, { duration: 4000 });

            // Haptic Loop for Inhale (Increasing intensity/frequency simulation)
            let hapticCount = 0;
            const inhaleHaptics = setInterval(() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                hapticCount++;
                if (hapticCount > 15) clearInterval(inhaleHaptics);
            }, 250);

            // HOLD (4s)
            setTimeout(() => {
                setPhaseText('Hold');
                clearInterval(inhaleHaptics);
            }, 4000);

            // EXHALE (4s)
            setTimeout(() => {
                setPhaseText('Exhale');
                scale.value = withTiming(1, { duration: 4000, easing: Easing.out(Easing.ease) });
                opacity.value = withTiming(0.5, { duration: 4000 });

                // Haptic Loop for Exhale (Slower, heavier)
                const exhaleHaptics = setInterval(() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                }, 800);
                setTimeout(() => clearInterval(exhaleHaptics), 4000);

            }, 8000);

            // Next Cycle
            setTimeout(() => {
                setCycleCount(c => c + 1);
            }, CYCLE_DURATION);
        };

        runBreathingCycle();
        interval = setInterval(runBreathingCycle, CYCLE_DURATION);

        return () => clearInterval(interval);
    }, [cycleCount]);

    const animatedCircleStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    return (
        <View style={styles.container}>
            <Text style={styles.instruction}>Breathe with the vibration.</Text>

            <View style={styles.circleContainer}>
                <Animated.View style={[styles.breathingCircle, animatedCircleStyle]} />
                <Text style={styles.phaseText}>{phaseText}</Text>
            </View>

            {/* Logic: 3 Mandatory Cycles then Auto-Advance or Show Button */}
            {cycleCount >= 3 && (
                <Animated.View entering={FadeIn.duration(1000)} style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={() => router.replace('/zone/panic/grounding')}>
                        <Text style={styles.buttonText}>I'M READY</Text>
                    </TouchableOpacity>
                </Animated.View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    instruction: {
        color: Colors.white,
        fontSize: 24,
        fontWeight: '600',
        position: 'absolute',
        top: 100,
    },
    circleContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    breathingCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Colors.primary, // Blue glow
        position: 'absolute',
    },
    phaseText: {
        color: Colors.white,
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 40,
        letterSpacing: 2,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 50,
    },
    button: {
        paddingVertical: 15,
        paddingHorizontal: 40,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 30,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.5)',
    },
    buttonText: {
        color: '#E0E0E0',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    exitButton: {
        position: 'absolute',
        bottom: 80,
        padding: 15,
    },
    exitText: {
        color: Colors.textDim,
        fontSize: 16,
        textDecorationLine: 'underline',
    },
});
