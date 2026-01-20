import { Colors } from '@/constants/Colors';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

// Placeholder for Hidden Object location (relative to image center, scaled)
const TARGET = { x: 100, y: -100, r: 50 }; // x,y offset, radius

export default function SanctuaryScreen() {
    const router = useRouter();
    const scale = useSharedValue(1);
    const focalX = useSharedValue(0);
    const focalY = useSharedValue(0);
    const [found, setFound] = useState(false);

    const pinch = Gesture.Pinch()
        .onUpdate((e) => {
            scale.value = e.scale;
            focalX.value = e.focalX;
            focalY.value = e.focalY;
        })
        .onEnd(() => {
            // Simple logic: If zoomed enough, check "location"
            // In a real fractal, we'd pan/zoom into coordinates.
            // Mock: If scale > 3, we define it as "found" for this demo
            if (scale.value > 3) {
                runOnJS(handleFound)();
            } else {
                scale.value = withSpring(1);
            }
        });

    const handleFound = async () => {
        if (found) return;
        setFound(true);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        // Show star
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: scale.value },
        ],
    }));

    return (
        <View style={styles.container}>
            <GestureDetector gesture={pinch}>
                <Animated.View style={[styles.canvas, animatedStyle]}>
                    {/* Placeholder Fractal - A complex gradient or image would go here */}
                    <View style={styles.fractalPlaceholder}>
                        <View style={styles.circle} />
                        <View style={[styles.circle, { width: 200, height: 200, backgroundColor: '#333' }]} />
                        <View style={[styles.circle, { width: 100, height: 100, backgroundColor: '#555' }]} />
                        {/* Hidden Star */}
                        <Text style={styles.hiddenStar}>★</Text>
                    </View>
                </Animated.View>
            </GestureDetector>

            <View style={styles.overlay}>
                <Text style={styles.hint}>{found ? "You found the light." : "Can you find the golden star? Pinch to zoom."}</Text>
                {found && (
                    <Text style={styles.exitText} onPress={() => router.replace('/post-check')}>Return to Dashboard</Text>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        overflow: 'hidden',
    },
    canvas: {
        width: width,
        height: height,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fractalPlaceholder: {
        width: 600,
        height: 600,
        backgroundColor: '#1a1a1a',
        justifyContent: 'center',
        alignItems: 'center',
    },
    circle: {
        position: 'absolute',
        width: 400,
        height: 400,
        borderRadius: 200,
        borderWidth: 2,
        borderColor: Colors.zoneSanctuary,
    },
    hiddenStar: {
        position: 'absolute',
        top: 200,
        left: 400,
        color: '#FFD700',
        fontSize: 20,
        opacity: 0.5,
    },
    overlay: {
        position: 'absolute',
        bottom: 50,
        width: '100%',
        alignItems: 'center',
    },
    hint: {
        color: Colors.white,
        fontSize: 16,
        marginBottom: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 10,
        borderRadius: 10,
        overflow: 'hidden',
    },
    exitText: {
        color: Colors.primary,
        fontWeight: 'bold',
        fontSize: 18,
    }
});
