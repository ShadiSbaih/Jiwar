import { useSavedProperty } from '@/hooks/useSavedProperty';
import { useSupabase } from '@/hooks/useSupabase';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/lib/utils';
import { deleteProperty, markPropertySold } from '@/services/properties';
import { userUserStore } from '@/store/userStore';
import { Property } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    FlatList,
    Image,
    Linking,
    NativeScrollEvent,
    NativeSyntheticEvent,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import ImageViewing from 'react-native-image-viewing';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

const { width } = Dimensions.get('window');
const ADMIN_PHONE = '929999999999';

function SpecPill({ icon, value }: { icon: keyof typeof Ionicons.glyphMap; value: string }) {
    return (
        <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            backgroundColor: '#FFFFFF',
            borderWidth: 1,
            borderColor: '#E5E7EB',
            paddingHorizontal: 14,
            paddingVertical: 9,
            borderRadius: 100,
            marginRight: 8,
            shadowColor: '#08383C',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 1,
        }}>
            <Ionicons name={icon} size={14} color="#1C685D" />
            <Text style={{ color: '#0F1712', fontSize: 13, fontWeight: '600' }}>{value}</Text>
        </View>
    );
}

export default function PropertyDetailsScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const isAdmin = userUserStore((state) => state.isAdmin);

    const [property, setProperty] = useState<Property | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isViewerVisible, setIsViewerVisible] = useState(false);

    const { isSaved, saveLoading, toggleSave } = useSavedProperty(id ?? '');
    const authSupabase = useSupabase();

    useEffect(() => { loadProperty(); }, [id]);

    const loadProperty = async () => {
        const { data } = await supabase.from('properties').select('*').eq('id', id).single();
        setProperty(data);
        setIsLoading(false);
    };

    const handleDelete = () => {
        Alert.alert('Delete Property', 'This cannot be undone. Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    await deleteProperty(id ?? '', authSupabase);
                    router.replace('/(root)/(tabs)');
                },
            },
        ]);
    };

    const handleMarkSold = () => {
        Alert.alert('Mark as Sold', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Mark Sold',
                onPress: async () => {
                    await markPropertySold(id ?? '', authSupabase);
                    setProperty((prev) => (prev ? { ...prev, is_sold: true } : prev));
                },
            },
        ]);
    };

    const handleContact = () => {
        const message = `Hi! I'm interested in the property: ${property?.title}`;
        Linking.openURL(`https://wa.me/${ADMIN_PHONE}?text=${encodeURIComponent(message)}`);
    };

    const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        setActiveIndex(Math.round(e.nativeEvent.contentOffset.x / width));
    };

    if (isLoading) {
        return (
            <View style={{ flex: 1, backgroundColor: '#F5F8F6', alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="large" color="#1C685D" />
            </View>
        );
    }

    if (!property) {
        return (
            <View style={{ flex: 1, backgroundColor: '#F5F8F6', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#9CA3AF', fontSize: 15 }}>Property not found</Text>
            </View>
        );
    }

    const isLongDesc = (property.description?.length ?? 0) > 200;
    const displayDesc = isExpanded || !isLongDesc
        ? property.description
        : property.description?.slice(0, 200) + '...';

    const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${property.longitude - 0.003}%2C${property.latitude - 0.003}%2C${property.longitude + 0.003}%2C${property.latitude + 0.003}&layer=mapnik&marker=${property.latitude}%2C${property.longitude}`;

    return (
        <View style={{ flex: 1, backgroundColor: '#F5F8F6' }}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
                {/* Hero image carousel */}
                <View style={{ opacity: property.is_sold ? 0.6 : 1 }}>
                    <FlatList
                        data={property.images}
                        keyExtractor={(_, i) => i.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => setIsViewerVisible(true)} activeOpacity={0.95}>
                                <Image source={{ uri: item }} style={{ width, height: 320 }} resizeMode="cover" />
                            </TouchableOpacity>
                        )}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={onScroll}
                        scrollEventThrottle={16}
                    />

                    {/* Dot indicators */}
                    {property.images.length > 1 && (
                        <View style={{ position: 'absolute', bottom: 16, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 5 }}>
                            {property.images.map((_, i) => (
                                <View
                                    key={i}
                                    style={{
                                        height: 5,
                                        width: i === activeIndex ? 20 : 5,
                                        borderRadius: 3,
                                        backgroundColor: i === activeIndex ? '#FFFFFF' : 'rgba(255,255,255,0.5)',
                                    }}
                                />
                            ))}
                        </View>
                    )}

                    {/* Photo count badge */}
                    <View style={{
                        position: 'absolute',
                        bottom: 14,
                        right: 14,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                        borderRadius: 100,
                    }}>
                        <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '600' }}>
                            {activeIndex + 1}/{property.images.length}
                        </Text>
                    </View>
                </View>

                {/* Floating nav buttons over image */}
                <SafeAreaView style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 10 }}>
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                                backgroundColor: 'rgba(0,0,0,0.45)',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={toggleSave}
                            disabled={saveLoading}
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                                backgroundColor: 'rgba(0,0,0,0.45)',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Ionicons
                                name={isSaved ? 'heart' : 'heart-outline'}
                                size={20}
                                color={isSaved ? '#4ADE80' : '#FFFFFF'}
                            />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>

                {/* Content card — rises over image */}
                <View style={{
                    backgroundColor: '#F5F8F6',
                    borderTopLeftRadius: 24,
                    borderTopRightRadius: 24,
                    marginTop: -20,
                    paddingTop: 24,
                    paddingHorizontal: 20,
                    opacity: property.is_sold ? 0.7 : 1,
                }}>
                    {/* Badges row */}
                    <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
                        <View style={{
                            backgroundColor: '#1C685D',
                            paddingHorizontal: 11,
                            paddingVertical: 4,
                            borderRadius: 100,
                        }}>
                            <Text style={{ color: '#E8F3F1', fontSize: 11, fontWeight: '700', textTransform: 'capitalize', letterSpacing: 0.4 }}>
                                {property.type}
                            </Text>
                        </View>
                        {property.is_featured && (
                            <View style={{ backgroundColor: '#E8F3F1', paddingHorizontal: 11, paddingVertical: 4, borderRadius: 100 }}>
                                <Text style={{ color: '#1C685D', fontSize: 11, fontWeight: '700' }}>⭐ Featured</Text>
                            </View>
                        )}
                        {property.is_sold && (
                            <View style={{ backgroundColor: '#FEF2F2', paddingHorizontal: 11, paddingVertical: 4, borderRadius: 100 }}>
                                <Text style={{ color: '#EF4444', fontSize: 11, fontWeight: '700', letterSpacing: 0.4 }}>SOLD</Text>
                            </View>
                        )}
                    </View>

                    {/* Title + price */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                        <Text style={{ flex: 1, fontSize: 20, fontWeight: '800', color: '#0F1712', lineHeight: 26, marginRight: 12 }}>
                            {property.title}
                        </Text>
                        <Text style={{ fontSize: 20, fontWeight: '800', color: '#1C685D' }}>
                            {formatPrice(property.price)}
                        </Text>
                    </View>

                    {/* Location */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 20 }}>
                        <Ionicons name="location-outline" size={14} color="#9CA3AF" />
                        <Text style={{ color: '#9CA3AF', fontSize: 13 }}>{property.address}, {property.city}</Text>
                    </View>

                    {/* Specs strip */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24 }}>
                        <SpecPill icon="bed-outline" value={`${property.bedrooms} beds`} />
                        <SpecPill icon="water-outline" value={`${property.bathrooms} baths`} />
                        <SpecPill icon="expand-outline" value={`${property.area_sqft} ft²`} />
                        <SpecPill icon="home-outline" value={property.type} />
                    </ScrollView>

                    {/* Divider */}
                    <View style={{ height: 1, backgroundColor: '#E5E7EB', marginBottom: 20 }} />

                    {/* Description */}
                    <Text style={{ fontSize: 15, fontWeight: '700', color: '#0F1712', marginBottom: 10 }}>About this property</Text>
                    <Text style={{ color: '#6B7280', fontSize: 14, lineHeight: 22, marginBottom: 4 }}>{displayDesc}</Text>
                    {isLongDesc && (
                        <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
                            <Text style={{ color: '#1C685D', fontSize: 14, fontWeight: '700', marginBottom: 20 }}>
                                {isExpanded ? 'Show less' : 'Read more'}
                            </Text>
                        </TouchableOpacity>
                    )}

                    <View style={{ marginBottom: 24 }} />

                    {/* Location map */}
                    <Text style={{ fontSize: 15, fontWeight: '700', color: '#0F1712', marginBottom: 12 }}>Location</Text>
                    <TouchableOpacity
                        onPress={() => router.push({
                            pathname: '/(root)/property/map',
                            params: {
                                latitude: property.latitude,
                                longitude: property.longitude,
                                title: property.title,
                                address: `${property.address}, ${property.city}`,
                            },
                        })}
                        activeOpacity={0.9}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: '#FFFFFF',
                            borderRadius: 16,
                            overflow: 'hidden',
                            marginBottom: 24,
                            borderWidth: 1,
                            borderColor: '#E5E7EB',
                        }}
                    >
                        <View style={{ width: 100, height: 88 }}>
                            <WebView source={{ uri: mapUrl }} style={{ flex: 1 }} scrollEnabled={false} pointerEvents="none" />
                        </View>
                        <View style={{ flex: 1, paddingHorizontal: 14 }}>
                            <Text style={{ fontSize: 14, fontWeight: '700', color: '#0F1712' }} numberOfLines={1}>
                                {property.address}
                            </Text>
                            <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }} numberOfLines={1}>
                                {property.city}
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#D1D5DB" style={{ marginRight: 14 }} />
                    </TouchableOpacity>

                    {/* Admin actions */}
                    {isAdmin && (
                        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 8 }}>
                            {!property.is_sold && (
                                <TouchableOpacity
                                    onPress={handleMarkSold}
                                    style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: 8,
                                        backgroundColor: '#E8F3F1',
                                        paddingVertical: 13,
                                        borderRadius: 12,
                                    }}
                                >
                                    <Ionicons name="checkmark-circle-outline" size={18} color="#1C685D" />
                                    <Text style={{ color: '#1C685D', fontWeight: '700' }}>Mark Sold</Text>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity
                                onPress={handleDelete}
                                style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 8,
                                    backgroundColor: '#FEF2F2',
                                    paddingVertical: 13,
                                    borderRadius: 12,
                                }}
                            >
                                <Ionicons name="trash-outline" size={18} color="#EF4444" />
                                <Text style={{ color: '#EF4444', fontWeight: '700' }}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Sticky WhatsApp contact bar */}
            <SafeAreaView
                edges={['bottom']}
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: '#FFFFFF',
                    borderTopWidth: 1,
                    borderTopColor: '#F3F4F6',
                    paddingHorizontal: 20,
                    paddingTop: 12,
                }}
            >
                <TouchableOpacity
                    onPress={handleContact}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 10,
                        backgroundColor: '#08383C',
                        paddingVertical: 15,
                        borderRadius: 14,
                        marginBottom: 4,
                    }}
                >
                    <Ionicons name="logo-whatsapp" size={20} color="#4ADE80" />
                    <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 15 }}>Contact Agent</Text>
                </TouchableOpacity>
            </SafeAreaView>

            <ImageViewing
                images={property.images.map((uri) => ({ uri }))}
                imageIndex={activeIndex}
                visible={isViewerVisible}
                onRequestClose={() => setIsViewerVisible(false)}
            />
        </View>
    );
}
