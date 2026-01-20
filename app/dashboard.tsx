import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons'; // Assuming Expo icons available
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const QUICK_ACTIONS = [
    { id: 'panic', label: 'Panic Mode', route: '/zone/panic', color: Colors.zonePanic },
    { id: 'focus', label: 'Focus Lab', route: '/zone/focus', color: Colors.zoneFocus },
    { id: 'sanctuary', label: 'Sanctuary', route: '/zone/sanctuary', color: Colors.zoneSanctuary },
    { id: 'decomp', label: 'Decompress', route: '/zone/decompression', color: Colors.zoneDecompression },
];

export default function DashboardScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.headerRow}>
                    <View>
                        <Text style={styles.greeting}>Good evening,</Text>
                        <Text style={styles.name}>Traveler.</Text>
                    </View>
                    <TouchableOpacity onPress={() => console.log('Settings')}>
                        <Ionicons name="settings-outline" size={24} color={Colors.textDim} />
                    </TouchableOpacity>
                </View>

                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Current Streak</Text>
                    <Text style={styles.statValue}>3 Days</Text>
                </View>

                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.grid}>
                    {QUICK_ACTIONS.map(action => (
                        <TouchableOpacity
                            key={action.id}
                            style={[styles.card, { borderColor: action.color }]}
                            onPress={() => router.push(action.route as any)}
                        >
                            <View style={[styles.cardIcon, { backgroundColor: action.color }]} />
                            <Text style={styles.cardLabel}>{action.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            {/* SOS FAB */}
            <TouchableOpacity
                style={styles.sosButton}
                onPress={() => router.push('/zone/panic')}
            >
                <Text style={styles.sosText}>I NEED A MOMENT</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        paddingTop: 60,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    greeting: {
        color: Colors.textDim,
        fontSize: 18,
    },
    name: {
        color: Colors.white,
        fontSize: 28,
        fontWeight: 'bold',
    },
    statCard: {
        backgroundColor: '#1E1E1E',
        padding: 20,
        borderRadius: 15,
        marginBottom: 30,
        borderLeftWidth: 4,
        borderLeftColor: Colors.primary,
    },
    statLabel: {
        color: Colors.textDim,
        fontSize: 14,
        textTransform: 'uppercase',
    },
    statValue: {
        color: Colors.white,
        fontSize: 32,
        fontWeight: 'bold',
        marginTop: 5,
    },
    sectionTitle: {
        color: Colors.white,
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 20,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 15,
    },
    card: {
        width: '47%', // roughly half - gap
        aspectRatio: 1,
        backgroundColor: '#1E1E1E',
        borderRadius: 20,
        padding: 20,
        justifyContent: 'space-between',
        borderWidth: 1,
    },
    cardIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    cardLabel: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    sosButton: {
        position: 'absolute',
        bottom: 40,
        alignSelf: 'center',
        width: '80%',
        height: 60,
        borderRadius: 30,
        backgroundColor: '#4AA088', // Teal/Sageish
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        zIndex: 100,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
    },
    sosText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
});
