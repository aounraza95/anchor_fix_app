import { Colors } from '@/constants/Colors';
import { BlurMask, Canvas, Circle, RadialGradient, vec } from '@shopify/react-native-skia';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

export default function SuccessScreen() {
    const router = useRouter();
    // Animation for the "Pearl" glow effect
    const glowOpacity = useSharedValue(0.5);
    const scale = useSharedValue(0.9);

    useEffect(() => {
        glowOpacity.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 2000 }),
                withTiming(0.5, { duration: 2000 })
            ), -1, true
        );
        scale.value = withRepeat(
            withSequence(
                withTiming(1.05, { duration: 3000 }),
                withTiming(0.95, { duration: 3000 })
            ), -1, true
        );
    }, []);

    const animatedGlowStyle = useAnimatedStyle(() => ({
        opacity: glowOpacity.value,
        transform: [{ scale: scale.value }]
    }));

    return (
        <View style={styles.container}>
            <View style={styles.pearlContainer}>
                <Animated.View style={animatedGlowStyle}>
                    <Canvas style={{ width: 300, height: 300 }}>
                        {/* The Pearl */}
                        <Circle cx={150} cy={150} r={100} color="#FFF">
                            <RadialGradient
                                c={vec(150, 150)}
                                r={100}
                                colors={['#FFFFFF', '#E0E0E0', '#B0B0B0']}
                            />
                            <BlurMask blur={5} style="normal" />
                        </Circle>
                    </Canvas>
                </Animated.View>
            </View>

            <Animated.View entering={FadeIn.delay(500)} style={styles.content}>
                <Text style={styles.title}>You did it.</Text>
                <Text style={styles.subtitle}>You took control.</Text>

                <TouchableOpacity style={styles.button} onPress={() => router.replace('/dashboard')}>
                    <Text style={styles.buttonText}>BACK TO DASHBOARD</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background, // Should check if Success screen needs specific BG
        alignItems: 'center',
        justifyContent: 'center',
    },
    pearlContainer: {
        marginBottom: 50,
    },
    content: {
        alignItems: 'center',
    },
    title: {
        color: Colors.white,
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        color: Colors.textDim,
        fontSize: 20,
        marginBottom: 60,
    },
    button: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: Colors.white,
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 30,
    },
    buttonText: {
        color: Colors.white,
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 2,
    }
});
