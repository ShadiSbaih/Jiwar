import { LISTING_PROPERTY_OPTIONS } from '@/constants/filters';
import { colors, fonts, fontSize, radius, spacing } from '@/constants/theme';
import { useSupabase } from '@/hooks/useSupabase';
import { addProperty, uploadPropertyImage } from '@/services/properties';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator, Alert, Image, KeyboardAvoidingView,
    Platform, ScrollView, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type PropertyType = (typeof LISTING_PROPERTY_OPTIONS)[number]["value"];

interface FormState {
    title: string;
    description: string;
    price: string;
    type: PropertyType;
    bedrooms: number;
    bathrooms: number;
    areaSqft: string;
    address: string;
    city: string;
    latitude: string;
    longitude: string;
    isFeatured: boolean;
    images: string[];
    localImages: string[];
}

const INITIAL_FORM: FormState = {
    title: "", description: "", price: "", type: "apartment",
    bedrooms: 1, bathrooms: 1, areaSqft: "", address: "", city: "",
    latitude: "", longitude: "", isFeatured: false, images: [], localImages: [],
};

const MIN_PRICE = 1;
const MAX_PRICE = 999_999_999;

// ─── Sub-components ───────────────────────────────────────────────────────────

function FormSectionLabel({ children }: { children: string }) {
    return (
        <Text style={{
            fontFamily: fonts.bodySB,
            fontSize: fontSize.nano,
            color: colors.textMuted,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: spacing.md,
        }}>
            {children}
        </Text>
    );
}

function FormInput({
    placeholder, value, onChangeText, keyboardType = 'default',
    multiline = false, height, autoCapitalize = 'sentences',
}: {
    placeholder: string;
    value: string;
    onChangeText: (v: string) => void;
    keyboardType?: any;
    multiline?: boolean;
    height?: number;
    autoCapitalize?: any;
}) {
    return (
        <TextInput
            placeholder={placeholder}
            placeholderTextColor={colors.textMuted}
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            multiline={multiline}
            textAlignVertical={multiline ? 'top' : 'center'}
            autoCapitalize={autoCapitalize}
            style={{
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.borderStrong,
                borderRadius: radius.sm,
                paddingHorizontal: spacing.lg,
                paddingVertical: spacing.md,
                fontFamily: fonts.body,
                color: colors.textPrimary,
                fontSize: fontSize.body,
                height: height,
            }}
        />
    );
}

function Stepper({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
    return (
        <View style={{ flex: 1 }}>
            <Text style={{
                fontFamily: fonts.bodySB,
                fontSize: fontSize.nano,
                color: colors.textMuted,
                letterSpacing: 1.2,
                textTransform: 'uppercase',
                marginBottom: spacing.md,
            }}>
                {label}
            </Text>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.borderStrong,
                borderRadius: radius.sm,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
            }}>
                <TouchableOpacity
                    onPress={() => onChange(Math.max(1, value - 1))}
                    style={{
                        width: 32,
                        height: 32,
                        borderRadius: radius.xs,
                        backgroundColor: colors.background,
                        borderWidth: 1,
                        borderColor: colors.border,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Ionicons name="remove" size={16} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={{
                    fontFamily: fonts.bodySB,
                    fontSize: fontSize.bodyLg,
                    color: colors.textPrimary,
                }}>
                    {value}
                </Text>
                <TouchableOpacity
                    onPress={() => onChange(value + 1)}
                    style={{
                        width: 32,
                        height: 32,
                        borderRadius: radius.xs,
                        backgroundColor: colors.brandSubtle,
                        borderWidth: 1,
                        borderColor: 'rgba(107,122,87,0.15)',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Ionicons name="add" size={16} color={colors.brand} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

// ─── Form Section Container ────────────────────────────────────────────────────
function FormSection({ children }: { children: React.ReactNode }) {
    return (
        <View style={{
            backgroundColor: colors.surface,
            borderRadius: radius.md,
            borderWidth: 1,
            borderColor: colors.border,
            padding: spacing.xl,
            gap: spacing.xl,
        }}>
            {children}
        </View>
    );
}

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function AddListingScreen() {
    const router = useRouter();
    const authSupabase = useSupabase();

    const [form, setForm] = useState<FormState>(INITIAL_FORM);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploadingImages, setIsUploadingImages] = useState(false);
    const [isDetectingLocation, setIsDetectingLocation] = useState(false);

    const updateForm = (fields: Partial<FormState>) =>
        setForm((prev) => ({ ...prev, ...fields }));

    const handlePickImages = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            Alert.alert("Permission Required", "Please allow access to your photo library.");
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: "images", allowsMultipleSelection: true,
            quality: 0.7, base64: true, selectionLimit: 6,
        });
        if (result.canceled) return;

        setIsUploadingImages(true);
        const uploadedUrls: string[] = [];
        const previewUris: string[] = [];

        for (const asset of result.assets) {
            try {
                const filename = `property_${Date.now()}_${Math.random().toString(36).slice(2)}.jpg`;
                const buffer = Uint8Array.from(atob(asset.base64!), (c) => c.charCodeAt(0));
                const publicUrl = await uploadPropertyImage(filename, buffer, authSupabase);
                if (!publicUrl) throw new Error("Upload returned no URL");
                uploadedUrls.push(publicUrl);
                previewUris.push(asset.uri);
            } catch (err) {
                console.error("Upload error:", err);
                Alert.alert("Upload Failed", "One or more images failed to upload.");
            }
        }

        updateForm({
            images: [...form.images, ...uploadedUrls],
            localImages: [...form.localImages, ...previewUris],
        });
        setIsUploadingImages(false);
    };

    const handleRemoveImage = (index: number) => {
        updateForm({
            images: form.images.filter((_, i) => i !== index),
            localImages: form.localImages.filter((_, i) => i !== index),
        });
    };

    const handleDetectLocation = async () => {
        setIsDetectingLocation(true);
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("Permission Denied", "Location permission is required to detect coordinates.");
                return;
            }
            const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
            updateForm({
                latitude: String(location.coords.latitude),
                longitude: String(location.coords.longitude),
            });
        } catch {
            Alert.alert("Error", "Could not detect location. Enter manually.");
        } finally {
            setIsDetectingLocation(false);
        }
    };

    const handleSubmit = async () => {
        if (!form.title.trim()) return Alert.alert("Validation", "Title is required.");
        if (!form.price.trim()) return Alert.alert("Validation", "Price is required.");
        const priceNum = Number(form.price);
        if (isNaN(priceNum) || priceNum < MIN_PRICE) return Alert.alert("Validation", "Price must be greater than PKR 0.");
        if (priceNum > MAX_PRICE) return Alert.alert("Validation", `Price cannot exceed PKR ${MAX_PRICE.toLocaleString("en-IN")}.`);
        if (!form.address.trim()) return Alert.alert("Validation", "Address is required.");
        if (!form.city.trim()) return Alert.alert("Validation", "City is required.");
        if (form.images.length === 0) return Alert.alert("Validation", "Please upload at least one image.");

        setIsSubmitting(true);
        const { error } = await addProperty(
            {
                title: form.title.trim(), description: form.description.trim(),
                price: priceNum, type: form.type, bedrooms: form.bedrooms,
                bathrooms: form.bathrooms, area_sqft: form.areaSqft ? Number(form.areaSqft) : null,
                address: form.address.trim(), city: form.city.trim(),
                latitude: form.latitude ? Number(form.latitude) : null,
                longitude: form.longitude ? Number(form.longitude) : null,
                images: form.images, is_featured: form.isFeatured, is_sold: false,
            },
            authSupabase,
        );
        setIsSubmitting(false);

        if (error) {
            Alert.alert("Error", "Failed to add property. Please try again.");
            return;
        }

        setForm(INITIAL_FORM);
        Alert.alert("Success!", "Property listed successfully.", [
            { text: "View Listings", onPress: () => router.replace("/(root)/(tabs)") },
        ]);
    };

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            {/* ── Header — ivory, no dark block ── */}
            <SafeAreaView edges={["top"]} style={{ backgroundColor: colors.background }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: spacing.pageHorizontal,
                    paddingTop: spacing.sm,
                    paddingBottom: spacing.xl,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                }}>
                    <View>
                        <Text style={{
                            fontFamily: fonts.display,
                            fontSize: fontSize.h2,
                            color: colors.textPrimary,
                        }}>
                            New Listing
                        </Text>
                        <Text style={{
                            fontFamily: fonts.body,
                            fontSize: fontSize.caption,
                            color: colors.textMuted,
                            marginTop: 2,
                        }}>
                            Fill in the property details
                        </Text>
                    </View>
                    {/* Photo progress */}
                    <View style={{
                        backgroundColor: form.images.length > 0 ? colors.brandSubtle : colors.background,
                        borderWidth: 1,
                        borderColor: form.images.length > 0 ? 'rgba(107,122,87,0.15)' : colors.border,
                        paddingHorizontal: spacing.md,
                        paddingVertical: spacing.sm,
                        borderRadius: radius.xs,
                    }}>
                        <Text style={{
                            fontFamily: fonts.bodyM,
                            fontSize: fontSize.caption,
                            color: form.images.length > 0 ? colors.brand : colors.textMuted,
                        }}>
                            {form.images.length}/6 photos
                        </Text>
                    </View>
                </View>
            </SafeAreaView>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={{
                        padding: spacing.pageHorizontal,
                        paddingBottom: 80,
                        gap: spacing.xxl,
                    }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* ── Photos ─────────────────────────────── */}
                    <View>
                        <FormSectionLabel>Photos (up to 6)</FormSectionLabel>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
                            {form.localImages.map((uri, index) => (
                                <View key={index} style={{ position: 'relative' }}>
                                    <Image
                                        source={{ uri }}
                                        style={{ width: 80, height: 80, borderRadius: radius.sm }}
                                        resizeMode="cover"
                                    />
                                    {index === 0 && (
                                        <View style={{
                                            position: 'absolute', top: 5, left: 5,
                                            backgroundColor: 'rgba(250,248,244,0.90)',
                                            paddingHorizontal: 5, paddingVertical: 2, borderRadius: 4,
                                        }}>
                                            <Text style={{
                                                fontFamily: fonts.bodySB,
                                                color: colors.textSecondary,
                                                fontSize: 8,
                                                letterSpacing: 0.4,
                                                textTransform: 'uppercase',
                                            }}>
                                                Cover
                                            </Text>
                                        </View>
                                    )}
                                    <TouchableOpacity
                                        onPress={() => handleRemoveImage(index)}
                                        style={{
                                            position: 'absolute', top: -6, right: -6,
                                            width: 20, height: 20, borderRadius: 10,
                                            backgroundColor: colors.error,
                                            alignItems: 'center', justifyContent: 'center',
                                        }}
                                    >
                                        <Ionicons name="close" size={11} color="white" />
                                    </TouchableOpacity>
                                </View>
                            ))}

                            {form.localImages.length < 6 && (
                                <TouchableOpacity
                                    onPress={handlePickImages}
                                    disabled={isUploadingImages}
                                    style={{
                                        width: 80, height: 80, borderRadius: radius.sm,
                                        backgroundColor: colors.surface,
                                        borderWidth: 1.5, borderStyle: 'dashed',
                                        borderColor: colors.brand,
                                        alignItems: 'center', justifyContent: 'center',
                                        gap: spacing.xs,
                                    }}
                                >
                                    {isUploadingImages ? (
                                        <ActivityIndicator size="small" color={colors.brand} />
                                    ) : (
                                        <>
                                            <Ionicons name="camera-outline" size={22} color={colors.brand} />
                                            <Text style={{
                                                fontFamily: fonts.bodySB,
                                                color: colors.brand,
                                                fontSize: fontSize.nano,
                                                letterSpacing: 0.3,
                                            }}>
                                                ADD
                                            </Text>
                                        </>
                                    )}
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    {/* ── Property Information ──────────────── */}
                    <View>
                        <FormSectionLabel>Property Information</FormSectionLabel>
                        <View style={{ gap: spacing.lg }}>
                            <FormInput
                                placeholder="Property title (e.g. Modern 3-Bed Apartment)"
                                value={form.title}
                                onChangeText={(v) => updateForm({ title: v })}
                            />
                            <FormInput
                                placeholder="Description"
                                value={form.description}
                                onChangeText={(v) => updateForm({ description: v })}
                                multiline
                                height={96}
                            />
                            <FormInput
                                placeholder="Price (PKR)"
                                value={form.price}
                                onChangeText={(v) => updateForm({ price: v })}
                                keyboardType="numeric"
                                autoCapitalize="none"
                            />
                        </View>
                    </View>

                    {/* ── Property Type ─────────────────────── */}
                    <View>
                        <FormSectionLabel>Property Type</FormSectionLabel>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm }}>
                            {LISTING_PROPERTY_OPTIONS.map((option) => {
                                const active = form.type === option.value;
                                return (
                                    <TouchableOpacity
                                        key={option.label}
                                        onPress={() => updateForm({ type: option.value })}
                                        style={{
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: 74,
                                            paddingVertical: spacing.md,
                                            borderRadius: radius.sm,
                                            backgroundColor: active ? colors.brand : colors.surface,
                                            borderWidth: 1,
                                            borderColor: active ? colors.brand : colors.border,
                                        }}
                                    >
                                        <Ionicons name={option.icon} size={20} color={active ? colors.surface : colors.textMuted} />
                                        <Text style={{
                                            fontFamily: fonts.bodyM,
                                            fontSize: fontSize.micro,
                                            marginTop: spacing.xs,
                                            color: active ? colors.surface : colors.textSecondary,
                                        }}>
                                            {option.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    </View>

                    {/* ── Bedrooms / Bathrooms ──────────────── */}
                    <View>
                        <FormSectionLabel>Property Details</FormSectionLabel>
                        <View style={{ flexDirection: 'row', gap: spacing.lg }}>
                            <Stepper label="Bedrooms" value={form.bedrooms} onChange={(v) => updateForm({ bedrooms: v })} />
                            <Stepper label="Bathrooms" value={form.bathrooms} onChange={(v) => updateForm({ bathrooms: v })} />
                        </View>
                    </View>

                    {/* ── Area ──────────────────────────────── */}
                    <View>
                        <FormSectionLabel>Area (sq ft)</FormSectionLabel>
                        <FormInput
                            placeholder="e.g. 1200"
                            value={form.areaSqft}
                            onChangeText={(v) => updateForm({ areaSqft: v })}
                            keyboardType="numeric"
                            autoCapitalize="none"
                        />
                    </View>

                    {/* ── Location ──────────────────────────── */}
                    <View>
                        <FormSectionLabel>Location</FormSectionLabel>
                        <View style={{ gap: spacing.lg }}>
                            <FormInput
                                placeholder="Street address"
                                value={form.address}
                                onChangeText={(v) => updateForm({ address: v })}
                            />
                            <FormInput
                                placeholder="City (e.g. Lahore)"
                                value={form.city}
                                onChangeText={(v) => updateForm({ city: v })}
                            />
                        </View>
                    </View>

                    {/* ── Coordinates ───────────────────────── */}
                    <View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md }}>
                            <Text style={{
                                fontFamily: fonts.bodySB,
                                fontSize: fontSize.nano,
                                color: colors.textMuted,
                                letterSpacing: 1.2,
                                textTransform: 'uppercase',
                            }}>
                                Coordinates
                            </Text>
                            <TouchableOpacity
                                onPress={handleDetectLocation}
                                disabled={isDetectingLocation}
                                style={{
                                    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
                                    backgroundColor: colors.brandSubtle,
                                    borderWidth: 1,
                                    borderColor: 'rgba(107,122,87,0.15)',
                                    paddingHorizontal: spacing.md,
                                    paddingVertical: spacing.sm,
                                    borderRadius: radius.xs,
                                }}
                            >
                                {isDetectingLocation ? (
                                    <ActivityIndicator size="small" color={colors.brand} />
                                ) : (
                                    <Ionicons name="locate-outline" size={13} color={colors.brand} />
                                )}
                                <Text style={{
                                    fontFamily: fonts.bodyM,
                                    color: colors.brand,
                                    fontSize: fontSize.caption,
                                }}>
                                    {isDetectingLocation ? "Detecting..." : "Detect Location"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', gap: spacing.md }}>
                            <View style={{ flex: 1 }}>
                                <FormInput
                                    placeholder="Latitude"
                                    value={form.latitude}
                                    onChangeText={(v) => updateForm({ latitude: v })}
                                    keyboardType="numeric"
                                    autoCapitalize="none"
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <FormInput
                                    placeholder="Longitude"
                                    value={form.longitude}
                                    onChangeText={(v) => updateForm({ longitude: v })}
                                    keyboardType="numeric"
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>
                    </View>

                    {/* ── Featured toggle ───────────────────── */}
                    <TouchableOpacity
                        onPress={() => updateForm({ isFeatured: !form.isFeatured })}
                        style={{
                            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                            backgroundColor: colors.surface,
                            borderRadius: radius.sm, padding: spacing.lg,
                            borderWidth: 1,
                            borderColor: form.isFeatured ? 'rgba(201,164,106,0.25)' : colors.border,
                        }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                            <Ionicons
                                name={form.isFeatured ? "star" : "star-outline"}
                                size={18}
                                color={form.isFeatured ? colors.accentGold : colors.textMuted}
                            />
                            <View>
                                <Text style={{
                                    fontFamily: fonts.bodySB,
                                    fontSize: fontSize.body,
                                    color: colors.textPrimary,
                                }}>
                                    Feature this listing
                                </Text>
                                <Text style={{
                                    fontFamily: fonts.body,
                                    fontSize: fontSize.caption,
                                    color: colors.textMuted,
                                    marginTop: 2,
                                }}>
                                    Shown in Home's Featured row
                                </Text>
                            </View>
                        </View>
                        {/* Toggle pill */}
                        <View style={{
                            width: 44, height: 26, borderRadius: 13, padding: 3,
                            backgroundColor: form.isFeatured ? colors.brand : colors.border,
                            justifyContent: 'center',
                        }}>
                            <View style={{
                                width: 20, height: 20, borderRadius: 10,
                                backgroundColor: colors.surface,
                                marginLeft: form.isFeatured ? 18 : 0,
                            }} />
                        </View>
                    </TouchableOpacity>

                    {/* ── Submit ────────────────────────────── */}
                    <TouchableOpacity
                        onPress={handleSubmit}
                        disabled={isSubmitting || isUploadingImages}
                        style={{
                            backgroundColor: colors.brand,
                            borderRadius: radius.md,
                            height: 50,
                            alignItems: 'center', justifyContent: 'center',
                            flexDirection: 'row', gap: spacing.sm,
                            opacity: isSubmitting || isUploadingImages ? 0.55 : 1,
                            marginTop: spacing.xs,
                        }}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator color={colors.surface} />
                        ) : (
                            <>
                                <Ionicons name="cloud-upload-outline" size={18} color={colors.surface} />
                                <Text style={{
                                    fontFamily: fonts.bodySB,
                                    color: colors.surface,
                                    fontSize: fontSize.bodyLg,
                                }}>
                                    Publish Listing
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}