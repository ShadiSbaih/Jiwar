import { useAuth, useUser } from '@clerk/expo';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function MenuItem({
    icon,
    label,
    onPress,
    danger = false,
}: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    onPress?: () => void;
    danger?: boolean;
}) {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 14,
                backgroundColor: '#FFFFFF',
                paddingHorizontal: 16,
                paddingVertical: 15,
                borderRadius: 14,
                marginBottom: 10,
                shadowColor: '#08383C',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 6,
                elevation: 1,
            }}
        >
            <View style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: danger ? '#FEF2F2' : '#E8F3F1',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <Ionicons name={icon} size={17} color={danger ? '#EF4444' : '#1C685D'} />
            </View>
            <Text style={{ flex: 1, fontSize: 15, fontWeight: '600', color: danger ? '#EF4444' : '#0F1712' }}>
                {label}
            </Text>
            {!danger && <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />}
        </TouchableOpacity>
    );
}

export default function ProfileScreen() {
    const { user, isLoaded } = useUser();
    const [isUpdatingPhoto, setIsUpdatingPhoto] = useState(false);
    const { signOut } = useAuth();
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            await signOut();
            router.replace('/sign-in');
        } catch (error) {
            console.error('Sign out failed:', error);
        }
    };

    const handleChangePhoto = async () => {
        try {
            const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permission.granted) {
                Alert.alert('Permission needed', 'Allow photo access to update your picture.');
                return;
            }
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: 'images',
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
                base64: true,
            });
            if (result.canceled) return;
            setIsUpdatingPhoto(true);
            const { base64, uri } = result.assets[0];
            const extension = /\.(\w+)$/.exec(uri)?.[1] ?? 'jpeg';
            await user?.setProfileImage({ file: `data:image/${extension};base64,${base64}` });
            Alert.alert('Success', 'Profile picture updated!');
        } catch (error) {
            Alert.alert('Error', "Couldn't update your picture. Please try again.");
        } finally {
            setIsUpdatingPhoto(false);
        }
    };

    if (!isLoaded || !user) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F8F6', alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="large" color="#1C685D" />
            </SafeAreaView>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#F5F8F6' }}>
            {/* Header — Pine green with centered avatar */}
            <SafeAreaView edges={['top']} style={{ backgroundColor: '#08383C' }}>
                <View style={{ alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 28 }}>
                    {/* Avatar */}
                    <View style={{ position: 'relative', marginBottom: 14 }}>
                        <Image
                            source={{ uri: user.imageUrl }}
                            style={{ width: 88, height: 88, borderRadius: 44, borderWidth: 3, borderColor: '#1C685D' }}
                        />
                        <TouchableOpacity
                            onPress={handleChangePhoto}
                            disabled={isUpdatingPhoto}
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                width: 28,
                                height: 28,
                                borderRadius: 14,
                                backgroundColor: '#1C685D',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderWidth: 2,
                                borderColor: '#08383C',
                            }}
                        >
                            {isUpdatingPhoto ? (
                                <ActivityIndicator size="small" color="#FFFFFF" />
                            ) : (
                                <Ionicons name="camera" size={13} color="#FFFFFF" />
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Name + badge */}
                    <Text style={{ color: '#FFFFFF', fontSize: 20, fontWeight: '800', marginBottom: 4 }}>
                        {user.firstName} {user.lastName}
                    </Text>
                    <Text style={{ color: '#9CA3AF', fontSize: 13, marginBottom: 10 }}>
                        {user.emailAddresses[0].emailAddress}
                    </Text>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 5,
                        backgroundColor: 'rgba(28,104,93,0.25)',
                        paddingHorizontal: 12,
                        paddingVertical: 5,
                        borderRadius: 100,
                    }}>
                        <Ionicons name="checkmark-circle" size={13} color="#4ADE80" />
                        <Text style={{ color: '#4ADE80', fontSize: 12, fontWeight: '700' }}>Verified Member</Text>
                    </View>
                </View>
            </SafeAreaView>

            {/* Menu items */}
            <SafeAreaView edges={['bottom', 'left', 'right']} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 110 }}>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: '#9CA3AF', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 12 }}>
                        Account
                    </Text>
                    <MenuItem
                        icon="bookmark-outline"
                        label="Saved Properties"
                        onPress={() => router.push('/(root)/(tabs)/favorites')}
                    />
                    <MenuItem
                        icon="time-outline"
                        label="Recently Viewed"
                        onPress={() => Alert.alert('Coming Soon', 'This feature is coming soon!')}
                    />

                    <Text style={{ fontSize: 11, fontWeight: '700', color: '#9CA3AF', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 12, marginTop: 8 }}>
                        General
                    </Text>
                    <MenuItem
                        icon="shield-checkmark-outline"
                        label="Privacy & Security"
                        onPress={() => Alert.alert('Coming Soon', 'This feature is coming soon!')}
                    />
                    <MenuItem
                        icon="mail-outline"
                        label="Contact Us"
                        onPress={async () => {
                            const url = 'mailto:hello@jiwar.app?subject=Help%20%26%20Support%20-%20Jiwar';
                            const canOpen = await Linking.canOpenURL(url);
                            if (canOpen) Linking.openURL(url);
                            else Alert.alert('No Mail App', 'Please install a mail app to contact us.');
                        }}
                    />
                    <MenuItem
                        icon="information-circle-outline"
                        label="About Jiwar"
                        onPress={() => Alert.alert('Jiwar', 'Version 1.0.0\n\nYour premium home search companion.')}
                    />

                    {/* Sign out */}
                    <View style={{ marginTop: 20 }}>
                        <MenuItem
                            icon="log-out-outline"
                            label="Sign Out"
                            onPress={handleSignOut}
                            danger
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}