import { CheckInSlider } from '@/components/CheckInSlider';
import { TheBlob } from '@/components/TheBlob';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, useSharedValue } from 'react-native-reanimated';

export default function PostCheckScreen() {
    const router = useRouter();
    const intensity = useSharedValue(0.2);
    const location = useSharedValue(0.5);

    const handleUpdate = () => {
        // Logic: If intensity is low (< 0.5), we consider it a success.
        // If still high, we suggest trying again.
        const isBetter = intensity.value < 0.5;

        if (isBetter) {
            router.replace('/success');
        } else {
            // Logic for 'Try something else' -> Route to The Ice Dive (Screen 5)
            // alert("Let's try one more thing."); // Optional: Remove alert to reduce friction? User said "Zero Friction".
            router.push('/zone/panic/ice-dive');
        }
    };

    return (
        <View style={styles.container}>
            <Animated.View entering={FadeIn.duration(1000)} style={styles.header}>
                <Text style={styles.question}>Update your shape?</Text>
            </Animated.View>

            <View style={styles.blobContainer}>
                <TheBlob intensity={intensity} location={location} />
            </View>

            <View style={styles.controls}>
                <CheckInSlider value={intensity} labelLeft="Calm" labelRight="Intense" />
                <CheckInSlider value={location} labelLeft="Mind" labelRight="Body" />

                <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                    <Text style={styles.buttonText}>I FEEL BETTER</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        marginTop: 60,
        alignItems: 'center',
    },
    question: {
        color: Colors.text,
        fontSize: 28,
        fontWeight: '600',
    },
    blobContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    controls: {
        paddingBottom: 50,
        paddingHorizontal: 20,
    },
    button: {
        backgroundColor: Colors.white,
        paddingVertical: 18,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 20,
        marginHorizontal: 40,
    },
    buttonText: {
        color: Colors.black,
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 2,
    },
});
