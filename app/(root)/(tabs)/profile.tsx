import { useAuth, useUser } from '@clerk/expo';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator, Alert, Image, Linking, ScrollView,
    Text, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { userUserStore } from '@/store/userStore';
import { colors, fonts, fontSize, radius, spacing } from '@/constants/theme';

// ─── Menu Item ────────────────────────────────────────────────────────────────
function MenuItem({
    icon,
    label,
    onPress,
    danger = false,
    last = false,
}: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    onPress?: () => void;
    danger?: boolean;
    last?: boolean;
}) {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing.lg,
                paddingHorizontal: spacing.lg,
                paddingVertical: spacing.lg,
                backgroundColor: colors.surface,
                borderBottomWidth: last ? 0 : 1,
                borderBottomColor: colors.border,
            }}
        >
            <Ionicons
                name={icon}
                size={18}
                color={danger ? colors.error : colors.textMuted}
            />
            <Text style={{
                flex: 1,
                fontFamily: fonts.bodyM,
                fontSize: fontSize.body,
                color: danger ? colors.error : colors.textPrimary,
            }}>
                {label}
            </Text>
            {!danger && (
                <Ionicons name="chevron-forward" size={15} color={colors.textMuted} />
            )}
        </TouchableOpacity>
    );
}

// ─── Section Group ─────────────────────────────────────────────────────────────
function MenuSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <View style={{ marginBottom: spacing.sectionGap }}>
            <Text style={{
                fontFamily: fonts.bodySB,
                fontSize: fontSize.nano,
                color: colors.textMuted,
                letterSpacing: 1.2,
                textTransform: 'uppercase',
                paddingHorizontal: spacing.pageHorizontal,
                marginBottom: spacing.sm,
            }}>
                {title}
            </Text>
            <View style={{
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderColor: colors.border,
                backgroundColor: colors.surface,
            }}>
                {children}
            </View>
        </View>
    );
}

// ─── Profile Screen ───────────────────────────────────────────────────────────
export default function ProfileScreen() {
    const { user, isLoaded } = useUser();
    const isAdmin = userUserStore((state) => state.isAdmin);
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
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="large" color={colors.brand} />
            </SafeAreaView>
        );
    }

    const isVerified = user.emailAddresses[0]?.verification?.status === 'verified';

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <SafeAreaView edges={['top']} style={{ backgroundColor: colors.background }}>
                {/* ── Profile card — ivory, no dark block ── */}
                <View style={{
                    paddingHorizontal: spacing.pageHorizontal,
                    paddingTop: spacing.xl,
                    paddingBottom: spacing.xxl,
                    alignItems: 'center',
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                }}>
                    {/* Avatar with camera button */}
                    <View style={{ position: 'relative', marginBottom: spacing.lg }}>
                        <View style={{
                            width: 84,
                            height: 84,
                            borderRadius: 42,
                            overflow: 'hidden',
                            borderWidth: 1,
                            borderColor: colors.borderStrong,
                        }}>
                            {user.imageUrl ? (
                                <Image
                                    source={{ uri: user.imageUrl }}
                                    style={{ width: 84, height: 84 }}
                                />
                            ) : (
                                <View style={{
                                    flex: 1,
                                    backgroundColor: colors.brandSubtle,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <Text style={{
                                        fontFamily: fonts.displaySB,
                                        fontSize: fontSize.h2,
                                        color: colors.brand,
                                    }}>
                                        {user.firstName?.charAt(0) ?? '?'}
                                    </Text>
                                </View>
                            )}
                        </View>
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
                                backgroundColor: colors.surface,
                                borderWidth: 1,
                                borderColor: colors.borderStrong,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {isUpdatingPhoto ? (
                                <ActivityIndicator size="small" color={colors.brand} />
                            ) : (
                                <Ionicons name="camera-outline" size={13} color={colors.textSecondary} />
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Name */}
                    <Text style={{
                        fontFamily: fonts.display,
                        fontSize: fontSize.h3,
                        color: colors.textPrimary,
                        marginBottom: 4,
                        textAlign: 'center',
                    }}>
                        {user.firstName} {user.lastName}
                    </Text>

                    {/* Email */}
                    <Text style={{
                        fontFamily: fonts.body,
                        fontSize: fontSize.caption,
                        color: colors.textMuted,
                        marginBottom: spacing.md,
                    }}>
                        {user.emailAddresses[0].emailAddress}
                    </Text>

                    {/* Verified badge + Admin badge */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                        {isVerified && (
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 4,
                                backgroundColor: colors.brandSubtle,
                                paddingHorizontal: spacing.md,
                                paddingVertical: 4,
                                borderRadius: radius.xs,
                                borderWidth: 1,
                                borderColor: 'rgba(107,122,87,0.15)',
                            }}>
                                <Ionicons name="checkmark-circle" size={12} color={colors.brand} />
                                <Text style={{
                                    fontFamily: fonts.bodyM,
                                    fontSize: fontSize.micro,
                                    color: colors.brand,
                                }}>
                                    Verified
                                </Text>
                            </View>
                        )}
                        {isAdmin && (
                            <View style={{
                                backgroundColor: 'rgba(201,164,106,0.10)',
                                paddingHorizontal: spacing.md,
                                paddingVertical: 4,
                                borderRadius: radius.xs,
                                borderWidth: 1,
                                borderColor: 'rgba(201,164,106,0.20)',
                            }}>
                                <Text style={{
                                    fontFamily: fonts.bodySB,
                                    fontSize: fontSize.micro,
                                    color: colors.accentGold,
                                    letterSpacing: 0.5,
                                    textTransform: 'uppercase',
                                }}>
                                    Admin
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </SafeAreaView>

            {/* ── Menu items ── */}
            <ScrollView
                contentContainerStyle={{ paddingTop: spacing.xxl, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                <MenuSection title="Account">
                    <MenuItem
                        icon="bookmark-outline"
                        label="Saved Properties"
                        onPress={() => router.push('/(root)/(tabs)/favorites')}
                    />
                    <MenuItem
                        icon="time-outline"
                        label="Recently Viewed"
                        onPress={() => Alert.alert('Coming Soon', 'This feature is coming soon!')}
                        last
                    />
                </MenuSection>

                <MenuSection title="General">
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
                        last
                    />
                </MenuSection>

                <MenuSection title="Account">
                    <MenuItem
                        icon="log-out-outline"
                        label="Sign Out"
                        onPress={handleSignOut}
                        danger
                        last
                    />
                </MenuSection>
            </ScrollView>
        </View>
    );
}