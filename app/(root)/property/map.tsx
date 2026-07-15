import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Linking, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';

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
        <View style={{ flex: 1, backgroundColor: '#F5F8F6' }}>
            {/* Header */}
            <SafeAreaView edges={["top"]} style={{ backgroundColor: '#08383C', zIndex: 50 }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 16,
                    paddingTop: 10,
                    paddingBottom: 16,
                    gap: 12,
                }}>
                    {/* Back button */}
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={{
                            width: 38,
                            height: 38,
                            borderRadius: 19,
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Ionicons name="arrow-back" size={18} color="#FFFFFF" />
                    </TouchableOpacity>

                    {/* Title block */}
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 14 }} numberOfLines={1}>
                            {title}
                        </Text>
                        <Text style={{ color: '#9CA3AF', fontSize: 12, marginTop: 2 }} numberOfLines={1}>
                            {address}
                        </Text>
                    </View>

                    {/* Open in Maps CTA */}
                    <TouchableOpacity
                        onPress={() => Linking.openURL(`https://www.google.com/maps?q=${lat},${lng}`)}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 6,
                            backgroundColor: '#1C685D',
                            paddingHorizontal: 14,
                            paddingVertical: 9,
                            borderRadius: 10,
                        }}
                    >
                        <Ionicons name="navigate-outline" size={14} color="#4ADE80" />
                        <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '700' }}>Directions</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            {/* Full-screen map */}
            <View style={{ flex: 1, marginTop: -2 }}>
                <WebView source={{ uri: mapUrl }} style={{ flex: 1 }} />
            </View>
        </View>
    );
}