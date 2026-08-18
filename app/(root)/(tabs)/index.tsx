import FeaturedCard from '@/components/FeaturedCard';
import PropertyCard from '@/components/PropertyCard';
import { FeaturedCardSkeleton, PropertyCardSkeleton } from '@/components/SkeletonCard';
import { SectionHeader } from '@/components/DesignSystem';
import BrandLockup from '@/components/BrandLockup';
import { fetchFeaturedProperties, fetchRecommendedProperties } from '@/services/properties';
import { Property } from '@/types';
import { colors, fonts, fontSize, radius, shadows, spacing } from '@/constants/theme';
import { useUser } from '@clerk/expo';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { FlatList, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
    const { user } = useUser();
    const router = useRouter();

    const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
    const [recommendedProperties, setRecommendedProperties] = useState<Property[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadHomes = async () => {
        setIsLoading(true);
        const [featured, recommended] = await Promise.all([
            fetchFeaturedProperties(),
            fetchRecommendedProperties(),
        ]);
        setFeaturedProperties(featured);
        setRecommendedProperties(recommended);
        setIsLoading(false);
    };

    useFocusEffect(
        useCallback(() => {
            loadHomes();
        }, [])
    );

    const greeting = () => {
        const h = new Date().getHours();
        if (h < 12) return 'Good morning';
        if (h < 17) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            {/* ── Header area — warm ivory, NOT dark green ── */}
            <SafeAreaView edges={['top']} style={{ backgroundColor: colors.background }}>
                <View style={{ paddingHorizontal: spacing.pageHorizontal, paddingTop: spacing.sm, paddingBottom: spacing.xl }}>
                    {/* Top row: wordmark + avatar */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.xl }}>
                        <BrandLockup />

                        {/* Avatar button → Profile */}
                        <TouchableOpacity
                            onPress={() => router.push('/(root)/(tabs)/profile')}
                            style={{ alignItems: 'center', justifyContent: 'center' }}
                        >
                            <View style={{
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                                overflow: 'hidden',
                                borderWidth: 1,
                                borderColor: colors.borderStrong,
                            }}>
                                {user?.imageUrl ? (
                                    <Image
                                        source={{ uri: user.imageUrl }}
                                        style={{ width: 40, height: 40 }}
                                    />
                                ) : (
                                    <View style={{
                                        flex: 1,
                                        backgroundColor: colors.brandSubtle,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                        <Text style={{
                                            fontFamily: fonts.bodySB,
                                            fontSize: fontSize.body,
                                            color: colors.brand,
                                        }}>
                                            {user?.firstName?.charAt(0) ?? '?'}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Greeting — compact single-row Inter lockup */}
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'baseline',
                        gap: spacing.xs,
                        marginBottom: spacing.xl,
                    }}>
                        <Text style={{
                            fontFamily: fonts.bodyM,
                            fontSize: fontSize.bodyLg,
                            color: colors.textSecondary,
                        }}>
                            {greeting()},
                        </Text>
                        <Text style={{
                            fontFamily: fonts.bodySB,
                            fontSize: fontSize.title,
                            color: colors.textPrimary,
                        }}>
                            {user?.firstName ?? 'there'}
                        </Text>
                    </View>

                    {/* Search bar */}
                    <TouchableOpacity
                        onPress={() => router.push('/(root)/(tabs)/explore')}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: colors.surface,
                            borderRadius: radius.sm,
                            borderWidth: 1,
                            borderColor: colors.borderStrong,
                            paddingLeft: spacing.lg,
                            paddingRight: spacing.sm,
                            paddingVertical: spacing.sm,
                            gap: spacing.md,
                            ...shadows.subtle,
                        }}
                    >
                        <Ionicons name="search-outline" size={18} color={colors.textMuted} />
                        <Text style={{
                            flex: 1,
                            fontFamily: fonts.body,
                            color: colors.textMuted,
                            fontSize: fontSize.body,
                            paddingVertical: spacing.sm,
                        }}>
                            Search city, area, or property...
                        </Text>
                        <TouchableOpacity
                            onPress={() => router.push('/(root)/(tabs)/explore?openFilters=true')}
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: radius.sm,
                                backgroundColor: colors.brandSubtle,
                                borderWidth: 1,
                                borderColor: 'rgba(107, 122, 87, 0.15)',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Ionicons name="options-outline" size={16} color={colors.brand} />
                        </TouchableOpacity>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            {/* ── Scrollable content ── */}
            <FlatList
                data={recommendedProperties}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 100, paddingTop: spacing.xxl }}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <View>
                        {/* Featured section */}
                        <View style={{ marginBottom: spacing.sectionGap }}>
                            <View style={{ paddingHorizontal: spacing.pageHorizontal, marginBottom: spacing.md }}>
                                <SectionHeader
                                    title="Featured"
                                    action="See all"
                                    onAction={() => router.push('/(root)/(tabs)/explore')}
                                />
                            </View>

                            {isLoading ? (
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={{ paddingHorizontal: spacing.pageHorizontal, gap: spacing.md }}
                                >
                                    <FeaturedCardSkeleton />
                                    <FeaturedCardSkeleton />
                                </ScrollView>
                            ) : (
                                <FlatList
                                    data={featuredProperties}
                                    keyExtractor={(item) => item.id}
                                    renderItem={({ item }) => <FeaturedCard property={item} />}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={{
                                        paddingHorizontal: spacing.pageHorizontal,
                                        paddingBottom: spacing.xs,
                                    }}
                                />
                            )}
                        </View>

                        {/* Recommended heading */}
                        <View style={{ paddingHorizontal: spacing.pageHorizontal, marginBottom: spacing.md }}>
                            <SectionHeader title="Recommended" />
                        </View>
                    </View>
                }
                renderItem={({ item }) => (
                    <View style={{ paddingHorizontal: spacing.pageHorizontal }}>
                        <PropertyCard property={item} />
                    </View>
                )}
                ListEmptyComponent={
                    isLoading ? (
                        <View style={{ paddingHorizontal: spacing.pageHorizontal }}>
                            <PropertyCardSkeleton />
                            <PropertyCardSkeleton />
                            <PropertyCardSkeleton />
                        </View>
                    ) : (
                        <View style={{ alignItems: 'center', paddingVertical: spacing.mega, paddingHorizontal: spacing.pageHorizontal }}>
                            <Text style={{
                                fontFamily: fonts.body,
                                color: colors.textMuted,
                                fontSize: fontSize.body,
                                textAlign: 'center',
                            }}>
                                No properties found.
                            </Text>
                        </View>
                    )
                }
            />
        </View>
    );
}
