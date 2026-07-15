import { useSavedProperty } from '@/hooks/useSavedProperty';
import { formatPrice } from '@/lib/utils';
import { Property } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useRef } from 'react';
import { Animated, Image, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

export default function PropertyCard({ property, onUnSave, showSave = false }: {
    property: Property
    onUnSave?: () => void;
    showSave?: boolean;
}) {
    const router = useRouter();
    const { isSaved, saveLoading, toggleSave } = useSavedProperty(
        property.id,
        onUnSave,
    );

    const scale = useRef(new Animated.Value(1)).current;

    const onPressIn = () => {
        Animated.spring(scale, { toValue: 0.975, useNativeDriver: true }).start();
    };
    const onPressOut = () => {
        Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
    };

    return (
        <TouchableWithoutFeedback
            onPress={() => router.push(`/(root)/property/${property.id}`)}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
        >
            <Animated.View
                style={{
                    opacity: property.is_sold ? 0.6 : 1,
                    transform: [{ scale }],
                    backgroundColor: '#FFFFFF',
                    borderRadius: 20,
                    marginBottom: 16,
                    overflow: 'hidden',
                    shadowColor: '#08383C',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.08,
                    shadowRadius: 12,
                    elevation: 3,
                }}
            >
                {/* Top image — 16:9 ratio */}
                <View style={{ position: 'relative' }}>
                    <Image
                        source={{ uri: property.images[0] }}
                        style={{ width: '100%', height: 190 }}
                        resizeMode="cover"
                    />

                    {/* Type badge — top left */}
                    <View
                        style={{
                            position: 'absolute',
                            top: 12,
                            left: 12,
                            backgroundColor: 'rgba(8,56,60,0.82)',
                            paddingHorizontal: 10,
                            paddingVertical: 4,
                            borderRadius: 100,
                        }}
                    >
                        <Text style={{ color: '#E8F3F1', fontSize: 11, fontWeight: '700', textTransform: 'capitalize', letterSpacing: 0.5 }}>
                            {property.type}
                        </Text>
                    </View>

                    {/* Save button — top right */}
                    {showSave && (
                        <TouchableOpacity
                            onPress={toggleSave}
                            disabled={saveLoading}
                            style={{
                                position: 'absolute',
                                top: 10,
                                right: 10,
                                width: 34,
                                height: 34,
                                borderRadius: 17,
                                backgroundColor: 'rgba(255,255,255,0.9)',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Ionicons
                                name={isSaved ? 'heart' : 'heart-outline'}
                                size={16}
                                color={isSaved ? '#1C685D' : '#9CA3AF'}
                            />
                        </TouchableOpacity>
                    )}

                    {/* Sold overlay */}
                    {property.is_sold && (
                        <View
                            style={{
                                position: 'absolute',
                                top: 12,
                                right: showSave ? 52 : 12,
                                backgroundColor: 'rgba(220,38,38,0.88)',
                                paddingHorizontal: 10,
                                paddingVertical: 4,
                                borderRadius: 100,
                            }}
                        >
                            <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '700', letterSpacing: 0.5 }}>SOLD</Text>
                        </View>
                    )}
                </View>

                {/* Card body */}
                <View style={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 16 }}>
                    {/* Title */}
                    <Text
                        numberOfLines={1}
                        style={{ fontSize: 15, fontWeight: '700', color: '#0F1712', marginBottom: 4 }}
                    >
                        {property.title}
                    </Text>

                    {/* Location */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 12 }}>
                        <Ionicons name="location-outline" size={12} color="#9CA3AF" />
                        <Text numberOfLines={1} style={{ fontSize: 13, color: '#9CA3AF', flex: 1 }}>
                            {property.city}
                        </Text>
                    </View>

                    {/* Price + specs row */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 17, fontWeight: '800', color: '#1C685D' }}>
                            {formatPrice(property.price)}
                        </Text>

                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                <Ionicons name="bed-outline" size={13} color="#6B7280" />
                                <Text style={{ fontSize: 12, color: '#6B7280', fontWeight: '600' }}>
                                    {property.bedrooms}
                                </Text>
                            </View>
                            <View style={{ width: 1, height: 12, backgroundColor: '#E5E7EB' }} />
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                <Ionicons name="expand-outline" size={13} color="#6B7280" />
                                <Text style={{ fontSize: 12, color: '#6B7280', fontWeight: '600' }}>
                                    {property.area_sqft} ft²
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </Animated.View>
        </TouchableWithoutFeedback>
    );
}