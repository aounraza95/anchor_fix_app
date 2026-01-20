import { Colors } from '@/constants/Colors';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function IceDiveScreen() {
    const router = useRouter();
    const [active, setActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (active && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setActive(false);
            // Maybe auto-complete or show "Good"
        }
        return () => clearInterval(interval);
    }, [active, timeLeft]);

    const handleStart = () => {
        setActive(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>The Ice Dive</Text>
            <Text style={styles.instruction}>
                Go to your freezer or sink. Grab an ice cube or splash cold water on your face.
            </Text>
            <Text style={styles.subtext}>
                This triggers the Mammalian Dive Reflex to instantly slow your heart rate.
            </Text>

            <View style={styles.timerContainer}>
                <Text style={styles.timer}>{timeLeft}</Text>
                <Text style={styles.sec}>sec</Text>
            </View>

            {!active && timeLeft === 30 && (
                <TouchableOpacity style={styles.button} onPress={handleStart}>
                    <Text style={styles.buttonText}>I'M READY</Text>
                </TouchableOpacity>
            )}

            {timeLeft === 0 && (
                <TouchableOpacity style={styles.button} onPress={() => router.replace('/post-check')}>
                    <Text style={styles.buttonText}>I FEEL BETTER</Text>
                </TouchableOpacity>
            )}

            {active && (
                <Text style={styles.activeText}>Hold cold to your face...</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#001F2D', // Deep cold blue
        alignItems: 'center',
        justifyContent: 'center',
        padding: 30,
    },
    title: {
        color: Colors.white,
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    instruction: {
        color: '#E0E0E0',
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 28,
    },
    subtext: {
        color: '#88AACC', // Light blue-grey
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 50,
    },
    timerContainer: {
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 4,
        borderColor: '#4AA088',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 50,
    },
    timer: {
        color: Colors.white,
        fontSize: 48,
        fontWeight: 'bold',
    },
    sec: {
        color: '#88AACC',
        fontSize: 14,
    },
    button: {
        backgroundColor: '#4AA088',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 30,
    },
    buttonText: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    activeText: {
        marginTop: 20,
        color: '#4AA088',
        fontSize: 18,
        fontStyle: 'italic',
    }
});
