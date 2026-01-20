import { Colors } from '@/constants/Colors';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

export default function InterrupterScreen() {
    const router = useRouter();
    const opacity = useSharedValue(0);

    useEffect(() => {
        // 1. Audio Control: Duck/Pause others
        const stopAudio = async () => {
            try {
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: false,
                    staysActiveInBackground: true,
                    interruptionModeIOS: InterruptionModeIOS.DoNotMix, // Enforce exclusivity
                    playsInSilentModeIOS: true,
                    shouldDuckAndroid: true,
                    interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
                    playThroughEarpieceAndroid: false,
                });
            } catch (e) {
                console.warn('Audio Interruption failed', e);
            }
        };
        stopAudio();

        // 2. Haptics: Sharp, heavy vibration
        const triggerHaptics = async () => {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error); // Distinct heavy feel
            setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 200);
        };
        triggerHaptics();

        // 3. Animation: Text Fade In
        opacity.value = withDelay(500, withTiming(1, { duration: 1000 }));

        // 4. Transition: Auto-fade to Next Screen (Pacer)
        const timeout = setTimeout(() => {
            router.replace('/zone/panic/pacer');
        }, 3000);

        return () => clearTimeout(timeout);
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <View style={styles.container}>
            <Animated.Text style={[styles.text, animatedStyle]}>
                YOU ARE SAFE.
            </Animated.Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000', // Pure black override
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: Colors.white,
        fontSize: 32,
        fontWeight: '900', // Heavy bold
        letterSpacing: 4,
        textTransform: 'uppercase',
    },
});
