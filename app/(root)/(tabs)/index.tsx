import FeaturedCard from '@/components/FeaturedCard';
import PropertyCard from '@/components/PropertyCard';
import { FeaturedCardSkeleton, PropertyCardSkeleton } from '@/components/SkeletonCard';
import { fetchFeaturedProperties, fetchRecommendedProperties } from '@/services/properties';
import { Property } from '@/types';
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
    }

    useFocusEffect(
        useCallback(() => {
            loadHomes();
        }, [])
    )

    return (
        <View style={{ flex: 1, backgroundColor: '#F5F8F6' }}>
            {/* Header — deep pine */}
            <SafeAreaView edges={["top"]} style={{ backgroundColor: '#08383C' }}>
                <View style={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 }}>
                    {/* Top row: logo mark left, greeting + avatar right */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                        {/* Brand mark */}
                        <View>
                            <Text style={{ color: '#FFFFFF', fontSize: 22, fontWeight: '900', letterSpacing: -0.5 }}>Jiwar</Text>
                        </View>

                        {/* Greeting + avatar */}
                        <TouchableOpacity 
                            onPress={() => router.push('/(root)/(tabs)/profile')}
                            style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
                        >
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '700' }}>
                                    Hi {user?.firstName ?? 'there'} 👋
                                </Text>
                                <Text style={{ color: '#6DAF96', fontSize: 11, marginTop: 1 }}>
                                    Welcome back
                                </Text>
                            </View>
                            <View style={{ width: 42, height: 42, borderRadius: 21, borderWidth: 2, borderColor: '#4ADE80', overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }}>
                                {user?.imageUrl ? (
                                    <Image source={{ uri: user.imageUrl }} style={{ width: 38, height: 38, borderRadius: 19 }} />
                                ) : (
                                    <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: '#1C685D', alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 14 }}>
                                            {user?.firstName?.charAt(0)}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Search bar */}
                    <TouchableOpacity
                        onPress={() => router.push('/(root)/(tabs)/explore')}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: '#FFFFFF',
                            borderRadius: 14,
                            paddingLeft: 14,
                            paddingRight: 6,
                            paddingVertical: 6,
                            gap: 10,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.08,
                            shadowRadius: 8,
                            elevation: 3,
                        }}
                    >
                        <Ionicons name="search-outline" size={18} color="#9CA3AF" />
                        <Text style={{ flex: 1, color: '#9CA3AF', fontSize: 14, paddingVertical: 8 }}>
                            Search city, title, area...
                        </Text>
                        <TouchableOpacity
                            onPress={() => router.push('/(root)/(tabs)/explore?openFilters=true')}
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: 10,
                                backgroundColor: '#1C685D',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Ionicons name="options-outline" size={16} color="#FFFFFF" />
                        </TouchableOpacity>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            {/* Scrollable content — no SafeAreaView here to avoid the gap */}
            <FlatList
                data={recommendedProperties}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 110, paddingTop: 20 }}
                showsVerticalScrollIndicator={false}
                    ListHeaderComponent={
                        <View>
                            {/* Featured section */}
                            <View style={{ marginBottom: 8 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 14 }}>
                                    <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F1712' }}>Featured</Text>
                                    <Text style={{ fontSize: 13, color: '#1C685D', fontWeight: '600' }}>See all</Text>
                                </View>

                                {isLoading ? (
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 14 }}>
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
                                        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 4 }}
                                    />
                                )}
                            </View>

                            {/* Recommended heading */}
                            <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 16, marginBottom: 14 }}>
                                <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F1712' }}>Recommended</Text>
                            </View>
                        </View>
                    }
                    renderItem={({ item }) => (
                        <View style={{ paddingHorizontal: 20 }}>
                            <PropertyCard property={item} />
                        </View>
                    )}
                    ListEmptyComponent={
                        isLoading ? (
                            <View style={{ paddingHorizontal: 20 }}>
                                <PropertyCardSkeleton />
                                <PropertyCardSkeleton />
                                <PropertyCardSkeleton />
                            </View>
                        ) : (
                            <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                                <Text style={{ color: '#9CA3AF', fontSize: 15 }}>No properties found</Text>
                            </View>
                        )
                    }
                />
        </View>
    )
}