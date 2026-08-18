import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Linking, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';
import { colors, fonts, fontSize, radius, spacing } from '@/constants/theme';

export default function MapScreen() {
    const { latitude, longitude, title, address } = useLocalSearchParams<{
        latitude: string;
        longitude: string;
        title: string;
        address: string;
    }>();

    const router = useRouter();
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.001}%2C${lat - 0.001}%2C${lng + 0.001}%2C${lat + 0.001}&layer=mapnik&marker=${lat}%2C${lng}`;

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            {/* Header — ivory background, no dark bar */}
            <SafeAreaView edges={["top"]} style={{ backgroundColor: colors.background, zIndex: 50 }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: spacing.pageHorizontal,
                    paddingTop: spacing.sm,
                    paddingBottom: spacing.md,
                    gap: spacing.md,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                }}>
                    {/* Back button */}
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={{
                            width: 38,
                            height: 38,
                            borderRadius: radius.sm,
                            backgroundColor: colors.surface,
                            borderWidth: 1,
                            borderColor: colors.border,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Ionicons name="arrow-back" size={18} color={colors.textPrimary} />
                    </TouchableOpacity>

                    {/* Title block */}
                    <View style={{ flex: 1 }}>
                        <Text style={{
                            fontFamily: fonts.bodySB,
                            fontSize: fontSize.body,
                            color: colors.textPrimary,
                        }} numberOfLines={1}>
                            {title}
                        </Text>
                        <Text style={{
                            fontFamily: fonts.body,
                            fontSize: fontSize.caption,
                            color: colors.textMuted,
                            marginTop: 2,
                        }} numberOfLines={1}>
                            {address}
                        </Text>
                    </View>

                    {/* Open in Maps CTA */}
                    <TouchableOpacity
                        onPress={() => Linking.openURL(`https://www.google.com/maps?q=${lat},${lng}`)}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: spacing.xs,
                            backgroundColor: colors.brand,
                            paddingHorizontal: spacing.md,
                            paddingVertical: spacing.sm,
                            borderRadius: radius.xs,
                        }}
                    >
                        <Ionicons name="navigate-outline" size={14} color={colors.surface} />
                        <Text style={{
                            fontFamily: fonts.bodySB,
                            color: colors.surface,
                            fontSize: fontSize.caption,
                        }}>
                            Directions
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            {/* Full-screen map */}
            <View style={{ flex: 1 }}>
                <WebView source={{ uri: mapUrl }} style={{ flex: 1 }} />
            </View>
        </View>
    );
}