import FilterModal from '@/components/FilterModal';
import PropertyCard from '@/components/PropertyCard';
import { PropertyCardSkeleton } from '@/components/SkeletonCard';
import { formatPrice } from '@/lib/utils';
import { searchProperties } from '@/services/properties';
import { useFilterStore } from '@/store/filterStore';
import { Property } from '@/types';
import { colors, fonts, fontSize, radius, shadows, spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function FilterChip({ label, onClear }: { label: string; onClear: () => void }) {
    return (
        <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.brandSubtle,
            borderRadius: radius.xs,
            borderWidth: 1,
            borderColor: 'rgba(107, 122, 87, 0.15)',
            paddingHorizontal: spacing.md,
            paddingVertical: 5,
            gap: spacing.xs,
        }}>
            <Text style={{
                fontFamily: fonts.bodyM,
                color: colors.brand,
                fontSize: fontSize.caption,
            }}>
                {label}
            </Text>
            <TouchableOpacity onPress={onClear} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="close" size={12} color={colors.brand} />
            </TouchableOpacity>
        </View>
    );
}

export default function ExploreScreen() {
    const [results, setResults] = useState<Property[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    const { openFilters } = useLocalSearchParams<{ openFilters?: string }>();

    useEffect(() => {
        if (openFilters === 'true') setShowFilters(true);
    }, [openFilters]);

    const { search, type, bedrooms, minPrice, maxPrice,
        setSearch, setType, setBedrooms, setMinPrice, setMaxPrice } = useFilterStore();

    const activeFilterCount = [type, bedrooms, minPrice, maxPrice].filter((v) => v != null).length;

    const loadResults = async () => {
        setIsLoading(true);
        const data = await searchProperties({ search, type, bedrooms, minPrice, maxPrice });
        setResults(data);
        setIsLoading(false);
    };

    useEffect(() => { loadResults(); }, [search, type, bedrooms, minPrice, maxPrice]);

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            {/* ── Header — ivory, no dark block ── */}
            <SafeAreaView edges={['top']} style={{ backgroundColor: colors.background }}>
                <View style={{ paddingHorizontal: spacing.pageHorizontal, paddingTop: spacing.sm, paddingBottom: spacing.xl }}>
                    {/* Screen title */}
                    <Text style={{
                        fontFamily: fonts.display,
                        fontSize: fontSize.h2,
                        color: colors.textPrimary,
                        marginBottom: 3,
                    }}>
                        Explore
                    </Text>
                    <Text style={{
                        fontFamily: fonts.body,
                        fontSize: fontSize.caption,
                        color: colors.textMuted,
                        marginBottom: spacing.xl,
                    }}>
                        Find your next home
                    </Text>

                    {/* Search bar with filter button */}
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: colors.surface,
                        borderRadius: radius.sm,
                        borderWidth: 1,
                        borderColor: colors.borderStrong,
                        paddingLeft: spacing.lg,
                        paddingRight: spacing.sm,
                        paddingVertical: spacing.xs,
                        gap: spacing.md,
                        ...shadows.subtle,
                    }}>
                        <Ionicons name="search-outline" size={18} color={colors.textMuted} />
                        <TextInput
                            style={{
                                flex: 1,
                                fontFamily: fonts.body,
                                color: colors.textPrimary,
                                fontSize: fontSize.body,
                                paddingVertical: spacing.sm,
                            }}
                            placeholder="Search by title or city..."
                            placeholderTextColor={colors.textMuted}
                            value={search}
                            onChangeText={setSearch}
                            autoCapitalize="none"
                        />
                        {search.length > 0 && (
                            <TouchableOpacity onPress={() => setSearch('')}>
                                <Ionicons name="close-circle" size={18} color={colors.textMuted} />
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity
                            onPress={() => setShowFilters(true)}
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: radius.sm,
                                backgroundColor: activeFilterCount > 0 ? colors.brand : colors.brandSubtle,
                                borderWidth: 1,
                                borderColor: activeFilterCount > 0 ? 'transparent' : 'rgba(107,122,87,0.15)',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Ionicons name="options-outline" size={16} color={activeFilterCount > 0 ? colors.surface : colors.brand} />
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>

            <View style={{ flex: 1 }}>
                {/* Active filter chips */}
                {activeFilterCount > 0 && (
                    <View style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        gap: spacing.sm,
                        paddingHorizontal: spacing.pageHorizontal,
                        paddingBottom: spacing.md,
                    }}>
                        {type && <FilterChip label={type} onClear={() => setType(null)} />}
                        {bedrooms != null && (
                            <FilterChip
                                label={bedrooms === 4 ? '4+ beds' : `${bedrooms} bed${bedrooms > 1 ? 's' : ''}`}
                                onClear={() => setBedrooms(null)}
                            />
                        )}
                        {(minPrice !== null || maxPrice !== null) && (
                            <FilterChip
                                label={
                                    minPrice && maxPrice
                                        ? `${formatPrice(minPrice)} – ${formatPrice(maxPrice)}`
                                        : minPrice
                                            ? `From ${formatPrice(minPrice)}`
                                            : `Up to ${formatPrice(maxPrice!)}`
                                }
                                onClear={() => { setMinPrice(null); setMaxPrice(null); }}
                            />
                        )}
                    </View>
                )}

                <FlatList
                    data={results}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{
                        paddingHorizontal: spacing.pageHorizontal,
                        paddingBottom: 100,
                    }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    renderItem={({ item }) => <PropertyCard property={item} />}
                    ListHeaderComponent={
                        !isLoading && results.length > 0 ? (
                            <Text style={{
                                fontFamily: fonts.body,
                                fontSize: fontSize.caption,
                                color: colors.textMuted,
                                marginBottom: spacing.md,
                                marginTop: spacing.xs,
                            }}>
                                {results.length} {results.length === 1 ? 'property' : 'properties'} found
                            </Text>
                        ) : null
                    }
                    ListEmptyComponent={
                        isLoading ? (
                            <View>
                                <PropertyCardSkeleton />
                                <PropertyCardSkeleton />
                                <PropertyCardSkeleton />
                            </View>
                        ) : (
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
                                    <Ionicons name="search-outline" size={28} color={colors.brand} />
                                </View>
                                <Text style={{
                                    fontFamily: fonts.display,
                                    fontSize: fontSize.h3,
                                    color: colors.textPrimary,
                                    marginBottom: spacing.sm,
                                    textAlign: 'center',
                                }}>
                                    No results found
                                </Text>
                                <Text style={{
                                    fontFamily: fonts.body,
                                    fontSize: fontSize.body,
                                    color: colors.textMuted,
                                    textAlign: 'center',
                                    paddingHorizontal: spacing.xxxl,
                                    lineHeight: 22,
                                }}>
                                    Try adjusting your search or removing filters
                                </Text>
                            </View>
                        )
                    }
                />

                <FilterModal visible={showFilters} onClose={() => setShowFilters(false)} />
            </View>
        </View>
    );
}