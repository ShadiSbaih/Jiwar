import PropertyCard from '@/components/PropertyCard';
import { PropertyCardSkeleton } from '@/components/SkeletonCard';
import { useSupabase } from '@/hooks/useSupabase';
import { fetchSavedProperties } from '@/services/saved';
import { SavedProperty } from '@/types';
import { useAuth } from '@clerk/expo';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FavoritesScreen() {
    const { userId } = useAuth();
    const authSupabase = useSupabase();
    const router = useRouter();

    const [savedHomes, setSavedHomes] = useState<SavedProperty[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadSaved = useCallback(async () => {
        if (!userId) return;
        setIsLoading(true);
        const data = await fetchSavedProperties(userId, authSupabase);
        setSavedHomes(data);
        setIsLoading(false);
    }, [userId]);

    useFocusEffect(useCallback(() => { loadSaved(); }, [loadSaved]));

    return (
        <View style={{ flex: 1, backgroundColor: '#F5F8F6' }}>
            {/* Header */}
            <SafeAreaView edges={['top']} style={{ backgroundColor: '#08383C' }}>
                <View style={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 }}>
                    <Text style={{ color: '#FFFFFF', fontSize: 24, fontWeight: '800' }}>Saved Homes</Text>
                    {!isLoading && (
                        <Text style={{ color: '#9CA3AF', fontSize: 13, marginTop: 3 }}>
                            {savedHomes.length} {savedHomes.length === 1 ? 'property' : 'properties'} saved
                        </Text>
                    )}
                </View>
            </SafeAreaView>

            <View style={{ flex: 1 }}>
                {isLoading ? (
                    <View style={{ flex: 1, padding: 20, paddingTop: 24 }}>
                        <PropertyCardSkeleton />
                        <PropertyCardSkeleton />
                        <PropertyCardSkeleton />
                    </View>
                ) : (
                    <FlatList
                        data={savedHomes}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{ padding: 20, paddingBottom: 110 }}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <PropertyCard
                                property={item.properties}
                                onUnSave={() => setSavedHomes((prev) => prev.filter((s) => s.id !== item.id))}
                                showSave
                            />
                        )}
                        ListEmptyComponent={
                            <View style={{ alignItems: 'center', paddingVertical: 80 }}>
                                <View style={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: 40,
                                    backgroundColor: '#E8F3F1',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: 18,
                                }}>
                                    <Ionicons name="heart-outline" size={36} color="#1C685D" />
                                </View>
                                <Text style={{ fontSize: 17, fontWeight: '700', color: '#0F1712', marginBottom: 6 }}>
                                    No saved properties
                                </Text>
                                <Text style={{ fontSize: 13, color: '#9CA3AF', textAlign: 'center', paddingHorizontal: 40, marginBottom: 24 }}>
                                    Tap the heart on any listing to save it here
                                </Text>
                                <TouchableOpacity
                                    onPress={() => router.push('/(root)/(tabs)/explore')}
                                    style={{
                                        backgroundColor: '#1C685D',
                                        paddingHorizontal: 28,
                                        paddingVertical: 13,
                                        borderRadius: 12,
                                    }}
                                >
                                    <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 14 }}>Browse Properties</Text>
                                </TouchableOpacity>
                            </View>
                        }
                    />
                )}
            </View>
        </View>
    );
}