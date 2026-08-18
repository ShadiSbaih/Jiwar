import { formatPrice } from '@/lib/utils';
import { Property } from '@/types';
import { colors, fonts, fontSize, radius, shadows, spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useRef } from 'react';
import { Animated, Image, Text, TouchableWithoutFeedback, View } from 'react-native';

export default function FeaturedCard({ property }: { property: Property }) {
    const router = useRouter();
    const scale = useRef(new Animated.Value(1)).current;

    const onPressIn = () => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 20 }).start();
    const onPressOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20 }).start();

    return (
        <TouchableWithoutFeedback
            onPress={() => router.push(`/(root)/property/${property.id}`)}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
        >
            <Animated.View
                style={{
                    width: 240,
                    marginRight: spacing.lg,
                    borderRadius: radius.lg,
                    overflow: 'hidden',
                    opacity: property.is_sold ? 0.55 : 1,
                    transform: [{ scale }],
                    backgroundColor: colors.surface,
                    borderWidth: 1,
                    borderColor: colors.border,
                    ...shadows.card,
                }}
            >
                {/* Full-bleed photo */}
                <View style={{ position: 'relative' }}>
                    <Image
                        source={{ uri: property.images[0] }}
                        style={{ width: '100%', height: 180 }}
                        resizeMode="cover"
                    />

                    {/* Featured badge — gold, top-left */}
                    {property.is_featured && (
                        <View
                            style={{
                                position: 'absolute',
                                top: spacing.md,
                                left: spacing.md,
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 4,
                                backgroundColor: 'rgba(250,248,244,0.92)',
                                paddingHorizontal: spacing.sm,
                                paddingVertical: 4,
                                borderRadius: radius.xs,
                                borderWidth: 1,
                                borderColor: 'rgba(201,164,106,0.25)',
                            }}
                        >
                            <Text style={{
                                fontFamily: fonts.bodySB,
                                fontSize: fontSize.micro,
                                color: colors.accentGold,
                                letterSpacing: 0.3,
                            }}>
                                ✦ Featured
                            </Text>
                        </View>
                    )}

                    {/* Sold badge — top right */}
                    {property.is_sold && (
                        <View
                            style={{
                                position: 'absolute',
                                top: spacing.md,
                                right: spacing.md,
                                backgroundColor: colors.errorBg,
                                borderWidth: 1,
                                borderColor: 'rgba(180,68,53,0.18)',
                                paddingHorizontal: spacing.sm,
                                paddingVertical: 4,
                                borderRadius: radius.xs,
                            }}
                        >
                            <Text style={{
                                fontFamily: fonts.bodySB,
                                fontSize: fontSize.micro,
                                color: colors.error,
                                letterSpacing: 0.5,
                                textTransform: 'uppercase',
                            }}>
                                Sold
                            </Text>
                        </View>
                    )}
                </View>

                {/* Card body — white below image */}
                <View style={{ paddingHorizontal: spacing.md, paddingTop: spacing.md, paddingBottom: spacing.md }}>
                    {/* Type */}
                    <Text style={{
                        fontFamily: fonts.bodyM,
                        fontSize: fontSize.micro,
                        color: colors.textMuted,
                        textTransform: 'capitalize',
                        letterSpacing: 0.3,
                        marginBottom: 3,
                    }}>
                        {property.type}
                    </Text>

                    {/* Title */}
                    <Text
                        numberOfLines={1}
                        style={{
                            fontFamily: fonts.bodySB,
                            fontSize: fontSize.body,
                            color: colors.textPrimary,
                            marginBottom: 3,
                        }}
                    >
                        {property.title}
                    </Text>

                    {/* Location */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: spacing.sm }}>
                        <Ionicons name="location-outline" size={11} color={colors.textMuted} />
                        <Text numberOfLines={1} style={{
                            fontFamily: fonts.body,
                            fontSize: fontSize.micro,
                            color: colors.textMuted,
                            flex: 1,
                        }}>
                            {property.city}
                        </Text>
                    </View>

                    {/* Price + specs */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{
                            fontFamily: fonts.bodySB,
                            fontSize: fontSize.label,
                            color: colors.brand,
                        }}>
                            {formatPrice(property.price)}
                        </Text>

                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                                <Ionicons name="bed-outline" size={12} color={colors.textMuted} />
                                <Text style={{ fontFamily: fonts.bodyM, fontSize: fontSize.micro, color: colors.textMuted }}>
                                    {property.bedrooms}
                                </Text>
                            </View>
                            <View style={{ width: 1, height: 10, backgroundColor: colors.border }} />
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                                <Ionicons name="expand-outline" size={12} color={colors.textMuted} />
                                <Text style={{ fontFamily: fonts.bodyM, fontSize: fontSize.micro, color: colors.textMuted }}>
                                    {property.area_sqft}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </Animated.View>
        </TouchableWithoutFeedback>
    );
}