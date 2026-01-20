import { Colors } from '@/constants/Colors';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';

export default function SplashScreen() {
    const router = useRouter();
    const scale = useSharedValue(0.8);
    const opacity = useSharedValue(0);

    useEffect(() => {
        // Heartbeat Haptics
        const triggerHaptics = async () => {
            try {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 150);
            } catch (e) {
                console.log('Haptics not available');
            }
        };

        triggerHaptics();

        // Pulse Animation
        scale.value = withSequence(
            withTiming(1.2, { duration: 300 }),
            withTiming(1, { duration: 300 })
        );
        opacity.value = withTiming(1, { duration: 500 });

        // Navigate away
        const timeout = setTimeout(() => {
            router.replace('/check-in');
        }, 1500);

        return () => clearTimeout(timeout);
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.logoContainer, animatedStyle]}>
                {/* Placeholder Logo (Anchor Icon) */}
                <Text style={styles.logoText}>⚓</Text>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000', // Pitch black as requested
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoText: {
        fontSize: 80,
        color: Colors.text,
    },
});
