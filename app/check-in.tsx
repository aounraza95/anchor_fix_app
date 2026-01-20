import { CheckInSlider } from '@/components/CheckInSlider';
import { TheBlob } from '@/components/TheBlob';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, useSharedValue } from 'react-native-reanimated';

export default function CheckInScreen() {
    const router = useRouter();
    const intensity = useSharedValue(0.2); // Start Low
    const location = useSharedValue(0.5); // Center (Mind/Body mix)

    // Logic: 
    // Zone 1 (Panic): Intensity High + Body (loc > 0.5) OR SOS
    // Zone 2 (Focus): Intensity High + Mind (loc < 0.5)
    // Zone 3 (Sanctuary): Intensity Low + Mind (loc < 0.5)
    // Zone 4 (Decomp): Intensity Low + Body (loc > 0.5)

    const handleAnchorMe = () => {
        const isHighIntensity = intensity.value > 0.6;
        const isBody = location.value > 0.5;

        if (isHighIntensity && isBody) {
            // Panic -> Zone 1
            console.log('Navigating to Zone 1 (Panic)');
            router.push('/zone/panic');
        } else if (isHighIntensity && !isBody) {
            // Focus -> Zone 2
            router.push('/zone/focus');
        } else if (!isHighIntensity && !isBody) {
            // Sanctuary -> Zone 3
            console.log('Navigating to Zone 3 (Sanctuary)');
            router.push('/zone/sanctuary');
        } else {
            // Decompression -> Zone 4
            console.log('Navigating to Zone 4 (Decompression)');
            router.push('/zone/decompression');
        }
    };

    return (
        <View style={styles.container}>
            <Animated.View entering={FadeIn.duration(1000)} style={styles.header}>
                <Text style={styles.question}>How are you feeling?</Text>
            </Animated.View>

            <View style={styles.blobContainer}>
                <TheBlob intensity={intensity} location={location} />
            </View>

            <View style={styles.controls}>
                <CheckInSlider value={intensity} labelLeft="Calm" labelRight="Intense" />
                <CheckInSlider value={location} labelLeft="Mind" labelRight="Body" />

                <TouchableOpacity style={styles.button} onPress={handleAnchorMe}>
                    <Text style={styles.buttonText}>ANCHOR ME</Text>
                </TouchableOpacity>
            </View>

            {/* SOS FAB */}
            <TouchableOpacity style={styles.sosButton} onPress={() => console.log('SOS Triggered')}>
                <Text style={styles.sosText}>SOS</Text>
            </TouchableOpacity>
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
    sosButton: {
        position: 'absolute',
        bottom: 40,
        right: 30,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: Colors.zonePanic,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        zIndex: 100,
    },
    sosText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
});
