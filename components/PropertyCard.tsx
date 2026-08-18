import { useSavedProperty } from '@/hooks/useSavedProperty';
import { formatPrice } from '@/lib/utils';
import { Property } from '@/types';
import { colors, fonts, fontSize, radius, shadows, spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useRef } from 'react';
import { Animated, Image, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

export default function PropertyCard({ property, onUnSave, showSave = false }: {
    property: Property;
    onUnSave?: () => void;
    showSave?: boolean;
}) {
    const router = useRouter();
    const { isSaved, saveLoading, toggleSave } = useSavedProperty(property.id, onUnSave);

    const scale = useRef(new Animated.Value(1)).current;
    const onPressIn = () => Animated.spring(scale, { toValue: 0.975, useNativeDriver: true, speed: 20 }).start();
    const onPressOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20 }).start();

    return (
        <TouchableWithoutFeedback
            onPress={() => router.push(`/(root)/property/${property.id}`)}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
        >
            <Animated.View
                style={{
                    opacity: property.is_sold ? 0.55 : 1,
                    transform: [{ scale }],
                    backgroundColor: colors.surface,
                    borderRadius: radius.lg,
                    marginBottom: spacing.itemGap,
                    overflow: 'hidden',
                    borderWidth: 1,
                    borderColor: colors.border,
                    ...shadows.card,
                }}
            >
                {/* Property photograph */}
                <View style={{ position: 'relative' }}>
                    <Image
                        source={{ uri: property.images[0] }}
                        style={{ width: '100%', height: 192 }}
                        resizeMode="cover"
                    />

                    {/* Sold overlay — top right */}
                    {property.is_sold && (
                        <View
                            style={{
                                position: 'absolute',
                                top: spacing.md,
                                right: showSave ? 52 : spacing.md,
                                backgroundColor: colors.errorBg,
                                borderWidth: 1,
                                borderColor: 'rgba(180,68,53,0.20)',
                                paddingHorizontal: spacing.md,
                                paddingVertical: 4,
                                borderRadius: radius.xs,
                            }}
                        >
                            <Text style={{
                                fontFamily: fonts.bodySB,
                                color: colors.error,
                                fontSize: fontSize.micro,
                                letterSpacing: 0.6,
                                textTransform: 'uppercase',
                            }}>
                                Sold
                            </Text>
                        </View>
                    )}

                    {/* Save button */}
                    {showSave && (
                        <TouchableOpacity
                            onPress={toggleSave}
                            disabled={saveLoading}
                            style={{
                                position: 'absolute',
                                top: spacing.sm,
                                right: spacing.sm,
                                width: 36,
                                height: 36,
                                borderRadius: radius.sm,
                                backgroundColor: 'rgba(255,255,255,0.92)',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderWidth: 1,
                                borderColor: colors.border,
                            }}
                        >
                            <Ionicons
                                name={isSaved ? 'heart' : 'heart-outline'}
                                size={17}
                                color={isSaved ? colors.error : colors.textMuted}
                            />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Card body */}
                <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.lg }}>
                    {/* Type label + Featured badge in one row */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs }}>
                        <Text style={{
                            fontFamily: fonts.bodySB,
                            fontSize: fontSize.micro,
                            color: colors.textMuted,
                            textTransform: 'capitalize',
                            letterSpacing: 0.4,
                        }}>
                            {property.type}
                        </Text>
                        {property.is_featured && (
                            <>
                                <View style={{ width: 3, height: 3, borderRadius: 2, backgroundColor: colors.accentGold }} />
                                <Text style={{
                                    fontFamily: fonts.bodyM,
                                    fontSize: fontSize.micro,
                                    color: colors.accentGold,
                                }}>
                                    Featured
                                </Text>
                            </>
                        )}
                    </View>

                    {/* Title */}
                    <Text
                        numberOfLines={1}
                        style={{
                            fontFamily: fonts.bodySB,
                            fontSize: fontSize.bodyLg,
                            color: colors.textPrimary,
                            marginBottom: spacing.xs,
                        }}
                    >
                        {property.title}
                    </Text>

                    {/* Location */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: spacing.md }}>
                        <Ionicons name="location-outline" size={12} color={colors.textMuted} />
                        <Text numberOfLines={1} style={{
                            fontFamily: fonts.body,
                            fontSize: fontSize.caption,
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
                            fontSize: fontSize.title,
                            color: colors.brand,
                        }}>
                            {formatPrice(property.price)}
                        </Text>

                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                            {property.bedrooms != null && (
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                    <Ionicons name="bed-outline" size={13} color={colors.textMuted} />
                                    <Text style={{
                                        fontFamily: fonts.bodyM,
                                        fontSize: fontSize.caption,
                                        color: colors.textMuted,
                                    }}>
                                        {property.bedrooms}
                                    </Text>
                                </View>
                            )}
                            <View style={{ width: 1, height: 12, backgroundColor: colors.border }} />
                            {property.area_sqft && (
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                    <Ionicons name="expand-outline" size={13} color={colors.textMuted} />
                                    <Text style={{
                                        fontFamily: fonts.bodyM,
                                        fontSize: fontSize.caption,
                                        color: colors.textMuted,
                                    }}>
                                        {property.area_sqft} ft²
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            </Animated.View>
        </TouchableWithoutFeedback>
    );
}