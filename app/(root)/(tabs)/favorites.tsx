import PropertyCard from '@/components/PropertyCard';
import { PropertyCardSkeleton } from '@/components/SkeletonCard';
import { useSupabase } from '@/hooks/useSupabase';
import { fetchSavedProperties } from '@/services/saved';
import { SavedProperty } from '@/types';
import { colors, fonts, fontSize, radius, spacing } from '@/constants/theme';
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
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            {/* ── Header — ivory, no dark block ── */}
            <SafeAreaView edges={['top']} style={{ backgroundColor: colors.background }}>
                <View style={{
                    paddingHorizontal: spacing.pageHorizontal,
                    paddingTop: spacing.md,
                    paddingBottom: spacing.xl,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                }}>
                    <Text style={{
                        fontFamily: fonts.display,
                        fontSize: fontSize.h2,
                        color: colors.textPrimary,
                        marginBottom: 3,
                    }}>
                        Saved Homes
                    </Text>
                    {!isLoading && (
                        <Text style={{
                            fontFamily: fonts.body,
                            fontSize: fontSize.caption,
                            color: colors.textMuted,
                        }}>
                            {savedHomes.length === 0
                                ? 'No saved properties'
                                : `${savedHomes.length} ${savedHomes.length === 1 ? 'property' : 'properties'} saved`}
                        </Text>
                    )}
                </View>
            </SafeAreaView>

            <View style={{ flex: 1 }}>
                {isLoading ? (
                    <View style={{ flex: 1, padding: spacing.pageHorizontal, paddingTop: spacing.xxl }}>
                        <PropertyCardSkeleton />
                        <PropertyCardSkeleton />
                        <PropertyCardSkeleton />
                    </View>
                ) : (
                    <FlatList
                        data={savedHomes}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{
                            padding: spacing.pageHorizontal,
                            paddingTop: spacing.xl,
                            paddingBottom: 100,
                        }}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <PropertyCard
                                property={item.properties}
                                onUnSave={() => setSavedHomes((prev) => prev.filter((s) => s.id !== item.id))}
                                showSave
                            />
                        )}
                        ListEmptyComponent={
                            <View style={{ alignItems: 'center', paddingVertical: spacing.mega }}>
                                <View style={{
                                    width: 64,
                                    height: 64,
                                    borderRadius: radius.lg,
                                    backgroundColor: colors.brandSubtle,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: spacing.xl,
                                }}>
                                    <Ionicons name="heart-outline" size={28} color={colors.brand} />
                                </View>
                                <Text style={{
                                    fontFamily: fonts.display,
                                    fontSize: fontSize.h3,
                                    color: colors.textPrimary,
                                    marginBottom: spacing.sm,
                                    textAlign: 'center',
                                }}>
                                    No saved homes yet
                                </Text>
                                <Text style={{
                                    fontFamily: fonts.body,
                                    fontSize: fontSize.body,
                                    color: colors.textMuted,
                                    textAlign: 'center',
                                    paddingHorizontal: spacing.xxxl,
                                    lineHeight: 22,
                                    marginBottom: spacing.xxl,
                                }}>
                                    Properties you save will appear here.
                                </Text>
                                <TouchableOpacity
                                    onPress={() => router.push('/(root)/(tabs)/explore')}
                                    style={{
                                        backgroundColor: colors.brand,
                                        paddingHorizontal: spacing.xxl,
                                        paddingVertical: spacing.md,
                                        borderRadius: radius.md,
                                    }}
                                >
                                    <Text style={{
                                        fontFamily: fonts.bodySB,
                                        color: colors.surface,
                                        fontSize: fontSize.body,
                                    }}>
                                        Explore properties
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        }
                    />
                )}
            </View>
        </View>
    );
}