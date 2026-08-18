import { useSavedProperty } from '@/hooks/useSavedProperty';
import { useSupabase } from '@/hooks/useSupabase';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/lib/utils';
import { deleteProperty, markPropertySold } from '@/services/properties';
import { userUserStore } from '@/store/userStore';
import { Property } from '@/types';
import { colors, fonts, fontSize, radius, spacing } from '@/constants/theme';
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
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import ImageViewerModal from '@/components/ImageViewerModal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

const { width } = Dimensions.get('window');
const ADMIN_PHONE = '929999999999';

// ─── Key fact item ─────────────────────────────────────────────────────────────
function FactItem({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
    return (
        <View style={{ alignItems: 'center', gap: spacing.xs }}>
            <Ionicons name={icon} size={18} color={colors.textMuted} />
            <Text style={{
                fontFamily: fonts.bodyM,
                fontSize: fontSize.caption,
                color: colors.textSecondary,
            }}>
                {label}
            </Text>
        </View>
    );
}

function FactDivider() {
    return (
        <View style={{ width: 1, height: 28, backgroundColor: colors.border }} />
    );
}

// ─── Main screen ──────────────────────────────────────────────────────────────
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
            <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="large" color={colors.brand} />
            </View>
        );
    }

    if (!property) {
        return (
            <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontFamily: fonts.body, color: colors.textMuted, fontSize: fontSize.body }}>
                    Property not found
                </Text>
            </View>
        );
    }

    const isLongDesc = (property.description?.length ?? 0) > 200;
    const displayDesc = isExpanded || !isLongDesc
        ? property.description
        : property.description?.slice(0, 200) + '...';

    const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${property.longitude - 0.003}%2C${property.latitude - 0.003}%2C${property.longitude + 0.003}%2C${property.latitude + 0.003}&layer=mapnik&marker=${property.latitude}%2C${property.longitude}`;

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {/* ── Hero image carousel ── */}
                <View style={{ opacity: property.is_sold ? 0.55 : 1 }}>
                    <FlatList
                        data={property.images}
                        keyExtractor={(_, i) => i.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => setIsViewerVisible(true)} activeOpacity={0.95}>
                                <Image source={{ uri: item }} style={{ width, height: 300 }} resizeMode="cover" />
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
                        <View style={{
                            position: 'absolute',
                            bottom: spacing.lg,
                            left: 0,
                            right: 0,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            gap: spacing.xs,
                        }}>
                            {property.images.map((_, i) => (
                                <View
                                    key={i}
                                    style={{
                                        height: 3,
                                        width: i === activeIndex ? 20 : 5,
                                        borderRadius: 2,
                                        backgroundColor: i === activeIndex ? '#FFFFFF' : 'rgba(255,255,255,0.45)',
                                    }}
                                />
                            ))}
                        </View>
                    )}

                    {/* Photo count */}
                    <View style={{
                        position: 'absolute',
                        bottom: spacing.md,
                        right: spacing.md,
                        backgroundColor: 'rgba(250,248,244,0.90)',
                        paddingHorizontal: spacing.sm,
                        paddingVertical: 3,
                        borderRadius: radius.xs,
                    }}>
                        <Text style={{
                            fontFamily: fonts.bodyM,
                            color: colors.textPrimary,
                            fontSize: fontSize.micro,
                        }}>
                            {activeIndex + 1} / {property.images.length}
                        </Text>
                    </View>
                </View>

                {/* Back / Save floating controls */}
                <SafeAreaView style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingHorizontal: spacing.lg,
                        paddingTop: spacing.md,
                    }}>
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: radius.sm,
                                backgroundColor: 'rgba(250,248,244,0.90)',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderWidth: 1,
                                borderColor: 'rgba(28,28,30,0.08)',
                            }}
                        >
                            <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={toggleSave}
                            disabled={saveLoading}
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: radius.sm,
                                backgroundColor: 'rgba(250,248,244,0.90)',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderWidth: 1,
                                borderColor: 'rgba(28,28,30,0.08)',
                            }}
                        >
                            <Ionicons
                                name={isSaved ? 'heart' : 'heart-outline'}
                                size={20}
                                color={isSaved ? colors.error : colors.textPrimary}
                            />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>

                {/* ── Content area ── */}
                <View style={{
                    backgroundColor: colors.background,
                    paddingHorizontal: spacing.pageHorizontal,
                    paddingTop: spacing.xl,
                    opacity: property.is_sold ? 0.65 : 1,
                }}>
                    {/* Type + badges row */}
                    <View style={{ flexDirection: 'row', gap: spacing.sm, alignItems: 'center', marginBottom: spacing.sm }}>
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
                                    ✦ Featured
                                </Text>
                            </>
                        )}
                        {property.is_sold && (
                            <>
                                <View style={{ width: 3, height: 3, borderRadius: 2, backgroundColor: colors.error }} />
                                <Text style={{
                                    fontFamily: fonts.bodySB,
                                    fontSize: fontSize.micro,
                                    color: colors.error,
                                    textTransform: 'uppercase',
                                    letterSpacing: 0.5,
                                }}>
                                    Sold
                                </Text>
                            </>
                        )}
                    </View>

                    {/* Title */}
                    <Text style={{
                        fontFamily: fonts.display,
                        fontSize: fontSize.h2,
                        color: colors.textPrimary,
                        lineHeight: 32,
                        marginBottom: spacing.sm,
                    }}>
                        {property.title}
                    </Text>

                    {/* Price */}
                    <Text style={{
                        fontFamily: fonts.bodySB,
                        fontSize: fontSize.h3,
                        color: colors.brand,
                        marginBottom: spacing.md,
                    }}>
                        {formatPrice(property.price)}
                    </Text>

                    {/* Location */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: spacing.xxl }}>
                        <Ionicons name="location-outline" size={14} color={colors.textMuted} />
                        <Text style={{
                            fontFamily: fonts.body,
                            color: colors.textMuted,
                            fontSize: fontSize.body,
                        }}>
                            {property.address}, {property.city}
                        </Text>
                    </View>

                    {/* Key facts horizontal strip */}
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                        backgroundColor: colors.surface,
                        borderRadius: radius.md,
                        borderWidth: 1,
                        borderColor: colors.border,
                        paddingVertical: spacing.lg,
                        marginBottom: spacing.xxl,
                    }}>
                        <FactItem icon="bed-outline" label={`${property.bedrooms} beds`} />
                        <FactDivider />
                        <FactItem icon="water-outline" label={`${property.bathrooms} baths`} />
                        {property.area_sqft && (
                            <>
                                <FactDivider />
                                <FactItem icon="expand-outline" label={`${property.area_sqft} ft²`} />
                            </>
                        )}
                    </View>

                    {/* Divider */}
                    <View style={{ height: 1, backgroundColor: colors.border, marginBottom: spacing.xxl }} />

                    {/* Description */}
                    <Text style={{
                        fontFamily: fonts.bodySB,
                        fontSize: fontSize.bodyLg,
                        color: colors.textPrimary,
                        marginBottom: spacing.md,
                    }}>
                        About this property
                    </Text>
                    <Text style={{
                        fontFamily: fonts.body,
                        color: colors.textSecondary,
                        fontSize: fontSize.body,
                        lineHeight: 24,
                        marginBottom: spacing.sm,
                    }}>
                        {displayDesc}
                    </Text>
                    {isLongDesc && (
                        <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
                            <Text style={{
                                fontFamily: fonts.bodySB,
                                color: colors.brand,
                                fontSize: fontSize.body,
                                marginBottom: spacing.xxl,
                            }}>
                                {isExpanded ? 'Show less' : 'Read more'}
                            </Text>
                        </TouchableOpacity>
                    )}

                    <View style={{ marginBottom: spacing.xxl }} />

                    {/* Location map */}
                    <Text style={{
                        fontFamily: fonts.bodySB,
                        fontSize: fontSize.bodyLg,
                        color: colors.textPrimary,
                        marginBottom: spacing.md,
                    }}>
                        Location
                    </Text>
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
                            backgroundColor: colors.surface,
                            borderRadius: radius.md,
                            overflow: 'hidden',
                            marginBottom: spacing.xxl,
                            borderWidth: 1,
                            borderColor: colors.border,
                        }}
                    >
                        <View style={{ width: 100, height: 84 }}>
                            <WebView source={{ uri: mapUrl }} style={{ flex: 1 }} scrollEnabled={false} pointerEvents="none" />
                        </View>
                        <View style={{ flex: 1, paddingHorizontal: spacing.lg }}>
                            <Text style={{
                                fontFamily: fonts.bodySB,
                                fontSize: fontSize.body,
                                color: colors.textPrimary,
                            }} numberOfLines={1}>
                                {property.address}
                            </Text>
                            <Text style={{
                                fontFamily: fonts.body,
                                fontSize: fontSize.caption,
                                color: colors.textMuted,
                                marginTop: 3,
                            }} numberOfLines={1}>
                                {property.city}
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={16} color={colors.textMuted} style={{ marginRight: spacing.lg }} />
                    </TouchableOpacity>

                    {/* Admin actions */}
                    {isAdmin && (
                        <View style={{ flexDirection: 'row', gap: spacing.md, marginBottom: spacing.sm }}>
                            {!property.is_sold && (
                                <TouchableOpacity
                                    onPress={handleMarkSold}
                                    style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: spacing.sm,
                                        backgroundColor: colors.brandSubtle,
                                        borderWidth: 1,
                                        borderColor: 'rgba(107,122,87,0.15)',
                                        paddingVertical: spacing.md,
                                        borderRadius: radius.sm,
                                    }}
                                >
                                    <Ionicons name="checkmark-circle-outline" size={17} color={colors.brand} />
                                    <Text style={{ fontFamily: fonts.bodySB, color: colors.brand, fontSize: fontSize.body }}>
                                        Mark Sold
                                    </Text>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity
                                onPress={handleDelete}
                                style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: spacing.sm,
                                    backgroundColor: colors.errorBg,
                                    borderWidth: 1,
                                    borderColor: 'rgba(180,68,53,0.15)',
                                    paddingVertical: spacing.md,
                                    borderRadius: radius.sm,
                                }}
                            >
                                <Ionicons name="trash-outline" size={17} color={colors.error} />
                                <Text style={{ fontFamily: fonts.bodySB, color: colors.error, fontSize: fontSize.body }}>
                                    Delete
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* ── Sticky Contact bar ── */}
            <SafeAreaView
                edges={['bottom']}
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: colors.surface,
                    borderTopWidth: 1,
                    borderTopColor: colors.border,
                    paddingHorizontal: spacing.pageHorizontal,
                    paddingTop: spacing.md,
                }}
            >
                <TouchableOpacity
                    onPress={handleContact}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: spacing.sm,
                        backgroundColor: colors.brand,
                        paddingVertical: spacing.lg,
                        borderRadius: radius.md,
                        marginBottom: spacing.xs,
                    }}
                >
                    <Ionicons name="logo-whatsapp" size={19} color={colors.surface} />
                    <Text style={{
                        fontFamily: fonts.bodySB,
                        color: colors.surface,
                        fontSize: fontSize.bodyLg,
                    }}>
                        Contact Agent
                    </Text>
                </TouchableOpacity>
            </SafeAreaView>

            <ImageViewerModal
                images={property.images.map((uri) => ({ uri }))}
                imageIndex={activeIndex}
                visible={isViewerVisible}
                onRequestClose={() => setIsViewerVisible(false)}
            />
        </View>
    );
}
