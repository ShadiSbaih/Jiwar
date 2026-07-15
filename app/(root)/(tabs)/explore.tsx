import FilterModal from '@/components/FilterModal';
import PropertyCard from '@/components/PropertyCard';
import { PropertyCardSkeleton } from '@/components/SkeletonCard';
import { formatPrice } from '@/lib/utils';
import { searchProperties } from '@/services/properties';
import { useFilterStore } from '@/store/filterStore';
import { Property } from '@/types';
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
            backgroundColor: '#E8F3F1',
            borderRadius: 100,
            paddingHorizontal: 12,
            paddingVertical: 6,
            gap: 6,
        }}>
            <Text style={{ color: '#1C685D', fontSize: 12, fontWeight: '600' }}>{label}</Text>
            <TouchableOpacity onPress={onClear} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="close" size={13} color="#1C685D" />
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
        <View style={{ flex: 1, backgroundColor: '#F5F8F6' }}>
            {/* Header */}
            <SafeAreaView edges={['top']} style={{ backgroundColor: '#08383C' }}>
                <View style={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 }}>
                    <Text style={{ color: '#FFFFFF', fontSize: 24, fontWeight: '800', marginBottom: 4 }}>
                        Explore
                    </Text>
                    <Text style={{ color: '#9CA3AF', fontSize: 13, marginBottom: 16 }}>
                        Find your next home
                    </Text>

                    {/* Search bar */}
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: '#FFFFFF',
                        borderRadius: 14,
                        paddingLeft: 14,
                        paddingRight: 6,
                        paddingVertical: 4,
                        gap: 10,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.08,
                        shadowRadius: 8,
                        elevation: 3,
                    }}>
                        <Ionicons name="search-outline" size={18} color="#9CA3AF" />
                        <TextInput
                            style={{ flex: 1, color: '#0F1712', fontSize: 14, paddingVertical: 10 }}
                            placeholder="Search by title or city..."
                            placeholderTextColor="#9CA3AF"
                            value={search}
                            onChangeText={setSearch}
                            autoCapitalize="none"
                        />
                        {search.length > 0 && (
                            <TouchableOpacity onPress={() => setSearch('')}>
                                <Ionicons name="close-circle" size={18} color="#9CA3AF" />
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity
                            onPress={() => setShowFilters(true)}
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: 10,
                                backgroundColor: '#1C685D',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative',
                            }}
                        >
                            <Ionicons name="options-outline" size={16} color="#FFFFFF" />
                            {activeFilterCount > 0 && (
                                <View style={{
                                    position: 'absolute',
                                    top: -4,
                                    right: -4,
                                    width: 16,
                                    height: 16,
                                    borderRadius: 8,
                                    backgroundColor: '#EF4444',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <Text style={{ color: '#FFF', fontSize: 9, fontWeight: '800' }}>{activeFilterCount}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>

            <SafeAreaView edges={['bottom', 'left', 'right']} style={{ flex: 1 }}>
                {/* Active filter chips */}
                {activeFilterCount > 0 && (
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 20, paddingTop: 14, paddingBottom: 4 }}>
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
                    contentContainerStyle={{ padding: 20, paddingBottom: 110 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    renderItem={({ item }) => <PropertyCard property={item} />}
                    ListHeaderComponent={
                        !isLoading && results.length > 0 ? (
                            <Text style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 14 }}>
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
                            <View style={{ alignItems: 'center', paddingVertical: 60 }}>
                                <View style={{
                                    width: 72,
                                    height: 72,
                                    borderRadius: 36,
                                    backgroundColor: '#E8F3F1',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: 16,
                                }}>
                                    <Ionicons name="search-outline" size={32} color="#1C685D" />
                                </View>
                                <Text style={{ fontSize: 16, fontWeight: '700', color: '#0F1712', marginBottom: 6 }}>
                                    No results found
                                </Text>
                                <Text style={{ fontSize: 13, color: '#9CA3AF', textAlign: 'center', paddingHorizontal: 32 }}>
                                    Try adjusting your search or removing filters
                                </Text>
                            </View>
                        )
                    }
                />

                <FilterModal visible={showFilters} onClose={() => setShowFilters(false)} />
            </SafeAreaView>
        </View>
    );
}