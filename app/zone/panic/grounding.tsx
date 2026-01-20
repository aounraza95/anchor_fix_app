import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const STEPS = [
    { count: 5, label: "Find 5 things you can SEE." },
    { count: 4, label: "Find 4 things you can TOUCH." },
    { count: 3, label: "Find 3 things you can HEAR." },
    { count: 2, label: "Find 2 things you can SMELL." },
    { count: 1, label: "Name 1 good thing about yourself." },
];

export default function GroundingScreen() {
    const router = useRouter();
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [bubbles, setBubbles] = useState<number[]>([]);

    const currentStep = STEPS[currentStepIndex];

    useEffect(() => {
        // Reset bubbles for the new step
        setBubbles(Array.from({ length: currentStep.count }, (_, i) => i));
    }, [currentStepIndex]);

    const handleTap = async (index: number) => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        setBubbles(prev => prev.filter(i => i !== index));

        if (bubbles.length === 1) {
            // Step Complete after this tap
            if (currentStepIndex < STEPS.length - 1) {
                setTimeout(() => {
                    setCurrentStepIndex(i => i + 1);
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                }, 500);
            } else {
                // All Steps Complete
                setTimeout(() => {
                    router.replace('/post-check');
                }, 1000);
            }
        }
    };

    return (
        <View style={styles.container}>
            <Animated.Text
                key={`text-${currentStepIndex}`}
                entering={FadeIn.duration(500)}
                exiting={FadeOut.duration(300)}
                style={styles.instruction}
            >
                {currentStep.label}
            </Animated.Text>

            <View style={styles.bubbleContainer}>
                {bubbles.map((i) => (
                    <Animated.View
                        key={`bubble-${currentStepIndex}-${i}`}
                        entering={FadeIn.delay(i * 100).springify()}
                        exiting={FadeOut.duration(200)}
                        layout={Layout.springify()}
                    >
                        <TouchableOpacity
                            style={[styles.bubble, { width: 80, height: 80, borderRadius: 40 }]}
                            onPress={() => handleTap(i)}
                        />
                    </Animated.View>
                ))}
            </View>

            <Text style={styles.counter}>{currentStepIndex + 1} / 5</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    instruction: {
        color: '#E0E0E0',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 50,
    },
    bubbleContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 20,
        width: width - 40,
    },
    bubble: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    counter: {
        position: 'absolute',
        bottom: 50,
        color: '#555',
        fontSize: 14,
    }
});
