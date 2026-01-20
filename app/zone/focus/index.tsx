import { Colors } from '@/constants/Colors';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const BUCKET_SIZE = 80;
const BALL_SIZE = 50;
const BUCKET_Y = 100;

const COLORS = {
    RED: '#FF4C4C',
    BLUE: '#4A90E2',
    YELLOW: '#FFD700',
};

const BUCKETS = [
    { id: 'red', color: COLORS.RED, x: width * 0.2 - BUCKET_SIZE / 2, label: 'Red' },
    { id: 'blue', color: COLORS.BLUE, x: width * 0.5 - BUCKET_SIZE / 2, label: 'Blue' },
    { id: 'yellow', color: COLORS.YELLOW, x: width * 0.8 - BUCKET_SIZE / 2, label: 'Yellow' },
];

interface BallData {
    id: string;
    colorType: 'red' | 'blue' | 'yellow';
    color: string;
    initialX: number;
    initialY: number;
}

const Ball = ({ data, onDrop }: { data: BallData, onDrop: (id: string, success: boolean) => void }) => {
    const x = useSharedValue(data.initialX);
    const y = useSharedValue(data.initialY);
    const scale = useSharedValue(0);

    useEffect(() => {
        // Entrance animation
        scale.value = withSpring(1);
    }, []);

    const pan = Gesture.Pan()
        .onUpdate((e) => {
            x.value = data.initialX + e.translationX;
            y.value = data.initialY + e.translationY;
        })
        .onEnd(() => {
            // Collision Detection
            let dropped = false;

            // Simple manual hit test
            for (const bucket of BUCKETS) {
                const bucketCenter = { x: bucket.x + BUCKET_SIZE / 2, y: BUCKET_Y + BUCKET_SIZE / 2 };
                const ballCenter = { x: x.value + BALL_SIZE / 2, y: y.value + BALL_SIZE / 2 };

                const dist = Math.sqrt(
                    Math.pow(bucketCenter.x - ballCenter.x, 2) + Math.pow(bucketCenter.y - ballCenter.y, 2)
                );

                if (dist < BUCKET_SIZE) {
                    // Hit!
                    if (bucket.id === data.colorType) {
                        // Match
                        runOnJS(onDrop)(data.id, true);
                        scale.value = withTiming(0, { duration: 200 }); // Poof
                        dropped = true;
                    } else {
                        // Mismatch - Bounce
                        runOnJS(onDrop)(data.id, false);
                    }
                    break;
                }
            }

            if (!dropped) {
                x.value = withSpring(data.initialX);
                y.value = withSpring(data.initialY);
            }
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: x.value },
            { translateY: y.value },
            { scale: scale.value }
        ],
    }));

    return (
        <GestureDetector gesture={pan}>
            <Animated.View
                style={[
                    styles.ball,
                    { backgroundColor: data.color },
                    animatedStyle
                ]}
            />
        </GestureDetector>
    );
};

export default function SorterGameScreen() {
    const router = useRouter();
    const [balls, setBalls] = useState<BallData[]>([]);
    const [round, setRound] = useState(0);

    const spawnBalls = () => {
        const newBalls: BallData[] = [];
        for (let i = 0; i < 5; i++) {
            const types: ('red' | 'blue' | 'yellow')[] = ['red', 'blue', 'yellow'];
            const type = types[Math.floor(Math.random() * types.length)];
            newBalls.push({
                id: `${Date.now()}-${i}`,
                colorType: type,
                color: COLORS[type.toUpperCase() as keyof typeof COLORS],
                initialX: width * 0.1 + Math.random() * (width * 0.7),
                initialY: height * 0.5 + Math.random() * (height * 0.3),
            });
        }
        setBalls(newBalls);
    };

    useEffect(() => {
        spawnBalls();
    }, [round]);

    const handleDrop = async (id: string, success: boolean) => {
        if (success) {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            // Remove ball
            setBalls(prev => {
                const remaining = prev.filter(b => b.id !== id);
                if (remaining.length === 0) {
                    // Round clear
                    setTimeout(() => {
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                        setRound(r => r + 1);
                    }, 500);
                }
                return remaining;
            });
        } else {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
    };

    return (
        <View style={styles.container}>
            {/* HUD */}
            <View style={styles.hud}>
                <TouchableOpacity onPress={() => router.replace('/post-check')}>
                    <Text style={styles.exitText}>Pause</Text>
                </TouchableOpacity>
            </View>

            {/* Buckets */}
            <View style={styles.bucketsContainer}>
                {BUCKETS.map(bucket => (
                    <View key={bucket.id} style={[styles.bucket, { left: bucket.x, borderColor: bucket.color }]}>
                        <View style={[styles.bucketInner, { backgroundColor: bucket.color, opacity: 0.3 }]} />
                    </View>
                ))}
            </View>

            {/* Balls Area */}
            {balls.map(ball => (
                // Important: Absolute positioning wrapper not needed if ball handles it via transform
                // But to prevent layout shifts, we render them 'absolute' via style in component
                <Ball key={ball.id} data={ball} onDrop={handleDrop} />
            ))}

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    hud: {
        marginTop: 50,
        alignItems: 'flex-end',
        paddingHorizontal: 20,
    },
    exitText: {
        color: Colors.textDim,
        fontSize: 16,
    },
    bucketsContainer: {
        position: 'absolute',
        top: BUCKET_Y,
        width: '100%',
        flexDirection: 'row',
    },
    bucket: {
        position: 'absolute',
        width: BUCKET_SIZE,
        height: BUCKET_SIZE,
        borderRadius: BUCKET_SIZE / 2,
        borderWidth: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bucketInner: {
        width: BUCKET_SIZE - 20,
        height: BUCKET_SIZE - 20,
        borderRadius: (BUCKET_SIZE - 20) / 2,
    },
    ball: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: BALL_SIZE,
        height: BALL_SIZE,
        borderRadius: BALL_SIZE / 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
});
