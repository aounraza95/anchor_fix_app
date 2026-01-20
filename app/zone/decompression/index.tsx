import Slider from '@react-native-community/slider';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Using Google Actions Sounds for reliable demo purposes
const CHANNELS = [
    { id: 'brown', label: 'Rumble', uri: 'https://actions.google.com/sounds/v1/water/waves_crashing_on_rocks_1.ogg' }, // Proxy for Brown
    { id: 'pink', label: 'Wash', uri: 'https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg' }, // Proxy for Pink
    { id: 'life', label: 'Life', uri: 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg' },
    { id: 'anchor', label: 'Anchor', uri: 'https://cdn.pixabay.com/audio/2022/03/10/audio_51ccf074b3.mp3' }, // Heartbeat (Pixabay)
];

export default function SonicCocoonScreen() {
    const router = useRouter();
    const [volumes, setVolumes] = useState<{ [key: string]: number }>({
        brown: 0.5, pink: 0, life: 0, anchor: 0
    });
    const [isLoaded, setIsLoaded] = useState(false);

    // Refs to hold sound objects
    const soundObjects = useRef<{ [key: string]: Audio.Sound | null }>({});

    useEffect(() => {
        let mounted = true;

        const setupAudio = async () => {
            try {
                await Audio.setAudioModeAsync({
                    staysActiveInBackground: true,
                    allowsRecordingIOS: false,
                    interruptionModeIOS: InterruptionModeIOS.MixWithOthers,
                    playsInSilentModeIOS: true,
                    shouldDuckAndroid: false,
                    interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
                    playThroughEarpieceAndroid: false,
                });

                // Load all sounds
                const loadPromises = CHANNELS.map(async (channel) => {
                    const { sound } = await Audio.Sound.createAsync(
                        { uri: channel.uri },
                        { shouldPlay: true, isLooping: true, volume: volumes[channel.id] }
                    );
                    soundObjects.current[channel.id] = sound;
                });

                await Promise.all(loadPromises);
                if (mounted) setIsLoaded(true);

            } catch (error) {
                console.log('Error loading sounds:', error);
            }
        };

        setupAudio();

        return () => {
            mounted = false;
            // Unload all sounds
            Object.values(soundObjects.current).forEach(async (sound) => {
                if (sound) await sound.unloadAsync();
            });
        };
    }, []);

    const handleVolumeChange = async (id: string, value: number) => {
        setVolumes(prev => ({ ...prev, [id]: value }));
        const sound = soundObjects.current[id];
        if (sound) {
            await sound.setVolumeAsync(value);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Sonic Cocoon</Text>

            {!isLoaded ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4AA088" />
                    <Text style={styles.loadingText}>Loading Soundscape...</Text>
                </View>
            ) : (
                <View style={styles.mixerContainer}>
                    {CHANNELS.map(channel => (
                        <View key={channel.id} style={styles.channel}>
                            <View style={styles.sliderWrapper}>
                                <Slider
                                    style={{ width: 200, height: 40 }}
                                    minimumValue={0}
                                    maximumValue={1}
                                    value={volumes[channel.id]}
                                    onValueChange={(v: number) => handleVolumeChange(channel.id, v)}
                                    minimumTrackTintColor="#4AA088"
                                    maximumTrackTintColor="#333"
                                    thumbTintColor="#B0B0B0"
                                />
                            </View>
                            <Text style={styles.label}>{channel.label}</Text>
                        </View>
                    ))}
                </View>
            )}

            <View style={styles.navRow}>
                <TouchableOpacity
                    style={styles.navCard}
                    onPress={() => router.push('/zone/decompression/bodyscan')}
                >
                    <Text style={styles.navTitle}>The Melter</Text>
                    <Text style={styles.navDesc}>Interactive Body Scan</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.navCard}
                    onPress={() => router.push('/zone/decompression/smoke')}
                >
                    <Text style={styles.navTitle}>Digital Smoke</Text>
                    <Text style={styles.navDesc}>Visual Fidget</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={styles.exitButton}
                onPress={() => router.replace('/post-check')}
            >
                <Text style={styles.exitText}>Exit Chamber</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1A1B41', // Deep Indigo
        paddingTop: 60,
        alignItems: 'center',
    },
    header: {
        color: '#B0B0B0',
        fontSize: 24,
        fontWeight: '300',
        letterSpacing: 3,
        textTransform: 'uppercase',
        marginBottom: 40,
    },
    loadingContainer: {
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#4AA088',
        marginTop: 20,
    },
    mixerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        height: 300,
    },
    channel: {
        alignItems: 'center',
        width: 60,
    },
    sliderWrapper: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{ rotate: '-90deg' }]
    },
    label: {
        color: '#88AACC',
        fontSize: 12,
        marginTop: 20,
        textAlign: 'center',
        width: 60,
    },
    navRow: {
        flexDirection: 'row',
        gap: 15,
        marginTop: 20,
    },
    navCard: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 15,
        borderRadius: 10,
        width: 150,
        alignItems: 'center',
    },
    navTitle: {
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 5,
    },
    navDesc: {
        color: '#88AACC',
        fontSize: 10,
    },
    exitButton: {
        marginTop: 40,
    },
    exitText: {
        color: '#555',
        fontSize: 14,
        letterSpacing: 1,
        textTransform: 'uppercase',
    }
});
