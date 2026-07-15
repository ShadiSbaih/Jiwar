import { formatPrice } from '@/lib/utils'
import { Property } from '@/types'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useRef } from 'react'
import { Animated, Image, Text, TouchableWithoutFeedback, View } from 'react-native'

export default function FeaturedCard({ property }: { property: Property }) {
    const router = useRouter()
    const scale = useRef(new Animated.Value(1)).current;

    const onPressIn = () => {
        Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();
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
                    width: 220,
                    marginRight: 14,
                    borderRadius: 20,
                    overflow: 'hidden',
                    opacity: property.is_sold ? 0.6 : 1,
                    transform: [{ scale }],
                    shadowColor: '#08383C',
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.18,
                    shadowRadius: 14,
                    elevation: 5,
                }}
            >
                {/* Full-bleed photo */}
                <View style={{ position: 'relative' }}>
                    <Image
                        source={{ uri: property.images[0] }}
                        style={{ width: '100%', height: 260 }}
                        resizeMode="cover"
                    />

                    {/* Gradient scrim — bottom portion */}
                    <View
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: 140,
                            // Linear gradient via background layers
                            backgroundColor: 'transparent',
                        }}
                    />
                    {/* Dark base for text */}
                    <View
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            backgroundColor: 'rgba(8,56,60,0.72)',
                            paddingHorizontal: 14,
                            paddingTop: 28,
                            paddingBottom: 14,
                        }}
                    >
                        {/* Type pill */}
                        <View
                            style={{
                                alignSelf: 'flex-start',
                                backgroundColor: '#1C685D',
                                paddingHorizontal: 9,
                                paddingVertical: 3,
                                borderRadius: 100,
                                marginBottom: 6,
                            }}
                        >
                            <Text style={{ color: '#E8F3F1', fontSize: 10, fontWeight: '700', textTransform: 'capitalize', letterSpacing: 0.4 }}>
                                {property.type}
                            </Text>
                        </View>

                        {/* Title */}
                        <Text
                            numberOfLines={2}
                            style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '700', marginBottom: 2, lineHeight: 20 }}
                        >
                            {property.title}
                        </Text>

                        {/* Location + price row */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, flex: 1 }}>
                                <Ionicons name="location-outline" size={11} color="#E8F3F1" />
                                <Text numberOfLines={1} style={{ color: '#D1D5DB', fontSize: 11, flex: 1 }}>
                                    {property.city}
                                </Text>
                            </View>
                            <Text style={{ color: '#4ADE80', fontSize: 13, fontWeight: '800', marginLeft: 8 }}>
                                {formatPrice(property.price)}
                            </Text>
                        </View>
                    </View>

                    {/* Top badges */}
                    {(property.is_featured || property.is_sold) && (
                        <View style={{ position: 'absolute', top: 12, right: 12, gap: 6 }}>
                            {property.is_featured && (
                                <View style={{ backgroundColor: 'rgba(28,104,93,0.9)', paddingHorizontal: 9, paddingVertical: 3, borderRadius: 100 }}>
                                    <Text style={{ color: '#E8F3F1', fontSize: 10, fontWeight: '700' }}>Featured</Text>
                                </View>
                            )}
                            {property.is_sold && (
                                <View style={{ backgroundColor: 'rgba(220,38,38,0.88)', paddingHorizontal: 9, paddingVertical: 3, borderRadius: 100 }}>
                                    <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '700' }}>SOLD</Text>
                                </View>
                            )}
                        </View>
                    )}
                </View>

                {/* Stat strip */}
                <View style={{ backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingVertical: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        <Ionicons name="bed-outline" size={13} color="#1C685D" />
                        <Text style={{ fontSize: 12, color: '#374151', fontWeight: '600' }}>{property.bedrooms} bd</Text>
                    </View>
                    <View style={{ width: 1, height: 14, backgroundColor: '#E5E7EB' }} />
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        <Ionicons name="water-outline" size={13} color="#1C685D" />
                        <Text style={{ fontSize: 12, color: '#374151', fontWeight: '600' }}>{property.bathrooms} ba</Text>
                    </View>
                    <View style={{ width: 1, height: 14, backgroundColor: '#E5E7EB' }} />
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        <Ionicons name="expand-outline" size={13} color="#1C685D" />
                        <Text style={{ fontSize: 12, color: '#374151', fontWeight: '600' }}>{property.area_sqft} ft²</Text>
                    </View>
                </View>
            </Animated.View>
        </TouchableWithoutFeedback>
    )
}