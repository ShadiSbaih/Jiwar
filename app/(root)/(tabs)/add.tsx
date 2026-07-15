import { LISTING_PROPERTY_OPTIONS } from '@/constants/filters';
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

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
    pine:       '#08383C',
    pineDark:   '#061F22',
    teal:       '#1C685D',
    tealMuted:  '#E8F3F1',
    green:      '#4ADE80',
    sage:       '#F5F8F6',
    white:      '#FFFFFF',
    border:     '#E5E7EB',
    textMain:   '#0F1712',
    textSub:    '#6B7280',
    textMuted:  '#9CA3AF',
};

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
function SectionLabel({ children }: { children: string }) {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <View style={{ width: 3, height: 14, borderRadius: 2, backgroundColor: C.teal }} />
            <Text style={{ fontSize: 11, fontWeight: '800', color: C.textMuted, letterSpacing: 1.2, textTransform: 'uppercase' }}>
                {children}
            </Text>
        </View>
    );
}

function FormInput({
    placeholder, value, onChangeText, keyboardType = 'default',
    multiline = false, height, autoCapitalize = 'sentences',
}: {
    placeholder: string; value: string;
    onChangeText: (v: string) => void;
    keyboardType?: any; multiline?: boolean; height?: number;
    autoCapitalize?: any;
}) {
    return (
        <TextInput
            placeholder={placeholder}
            placeholderTextColor={C.textMuted}
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            multiline={multiline}
            textAlignVertical={multiline ? 'top' : 'center'}
            autoCapitalize={autoCapitalize}
            style={{
                backgroundColor: C.white,
                borderWidth: 1,
                borderColor: C.border,
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 13,
                color: C.textMain,
                fontSize: 14,
                height: height,
            }}
        />
    );
}

function Stepper({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
    return (
        <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 11, fontWeight: '800', color: C.textMuted, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 10 }}>
                {label}
            </Text>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: C.white,
                borderWidth: 1,
                borderColor: C.border,
                borderRadius: 12,
                paddingHorizontal: 12,
                paddingVertical: 10,
            }}>
                <TouchableOpacity
                    onPress={() => onChange(Math.max(1, value - 1))}
                    style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: C.sage, alignItems: 'center', justifyContent: 'center' }}
                >
                    <Ionicons name="remove" size={16} color={C.textMain} />
                </TouchableOpacity>
                <Text style={{ fontSize: 17, fontWeight: '800', color: C.textMain }}>{value}</Text>
                <TouchableOpacity
                    onPress={() => onChange(value + 1)}
                    style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: C.tealMuted, alignItems: 'center', justifyContent: 'center' }}
                >
                    <Ionicons name="add" size={16} color={C.teal} />
                </TouchableOpacity>
            </View>
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
        Alert.alert("Success! 🎉", "Property listed successfully.", [
            { text: "OK", onPress: () => router.replace("/(root)/(tabs)") },
        ]);
    };

    return (
        <View style={{ flex: 1, backgroundColor: C.sage }}>
            {/* Header */}
            <SafeAreaView edges={["top"]} style={{ backgroundColor: C.pine }}>
                <View style={{
                    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                    paddingHorizontal: 20, paddingTop: 10, paddingBottom: 18,
                }}>
                    <View>
                        <Text style={{ color: C.white, fontSize: 22, fontWeight: '800' }}>New Listing</Text>
                        <Text style={{ color: C.textMuted, fontSize: 13, marginTop: 2 }}>Fill in the property details</Text>
                    </View>
                    {/* Photo count badge */}
                    <View style={{
                        backgroundColor: form.images.length > 0 ? C.tealMuted : 'rgba(255,255,255,0.1)',
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 20,
                    }}>
                        <Text style={{ color: form.images.length > 0 ? C.teal : C.textMuted, fontSize: 12, fontWeight: '700' }}>
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
                    contentContainerStyle={{ padding: 20, paddingBottom: 80, gap: 22 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* ── Photos ────────────────────────────────── */}
                    <View>
                        <SectionLabel>Photos (up to 6)</SectionLabel>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                            {form.localImages.map((uri, index) => (
                                <View key={index} style={{ position: 'relative' }}>
                                    <Image
                                        source={{ uri }}
                                        style={{ width: 80, height: 80, borderRadius: 12 }}
                                        resizeMode="cover"
                                    />
                                    {index === 0 && (
                                        <View style={{
                                            position: 'absolute', top: 6, left: 6,
                                            backgroundColor: C.pine,
                                            paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6,
                                        }}>
                                            <Text style={{ color: C.green, fontSize: 8, fontWeight: '800', letterSpacing: 0.5 }}>COVER</Text>
                                        </View>
                                    )}
                                    <TouchableOpacity
                                        onPress={() => handleRemoveImage(index)}
                                        style={{
                                            position: 'absolute', top: -6, right: -6,
                                            width: 20, height: 20, borderRadius: 10,
                                            backgroundColor: '#EF4444',
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
                                        width: 80, height: 80, borderRadius: 12,
                                        backgroundColor: C.white,
                                        borderWidth: 2, borderStyle: 'dashed', borderColor: C.teal,
                                        alignItems: 'center', justifyContent: 'center',
                                        gap: 4,
                                    }}
                                >
                                    {isUploadingImages ? (
                                        <ActivityIndicator size="small" color={C.teal} />
                                    ) : (
                                        <>
                                            <Ionicons name="camera-outline" size={22} color={C.teal} />
                                            <Text style={{ color: C.teal, fontSize: 9, fontWeight: '700' }}>ADD</Text>
                                        </>
                                    )}
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    {/* ── Title ─────────────────────────────────── */}
                    <View>
                        <SectionLabel>Title</SectionLabel>
                        <FormInput
                            placeholder="e.g. Modern 3-Bed Apartment"
                            value={form.title}
                            onChangeText={(v) => updateForm({ title: v })}
                        />
                    </View>

                    {/* ── Description ───────────────────────────── */}
                    <View>
                        <SectionLabel>Description</SectionLabel>
                        <FormInput
                            placeholder="Describe the property..."
                            value={form.description}
                            onChangeText={(v) => updateForm({ description: v })}
                            multiline
                            height={96}
                        />
                    </View>

                    {/* ── Price ─────────────────────────────────── */}
                    <View>
                        <SectionLabel>Price (PKR)</SectionLabel>
                        <FormInput
                            placeholder="e.g. 5000000"
                            value={form.price}
                            onChangeText={(v) => updateForm({ price: v })}
                            keyboardType="numeric"
                            autoCapitalize="none"
                        />
                    </View>

                    {/* ── Property Type ─────────────────────────── */}
                    <View>
                        <SectionLabel>Property Type</SectionLabel>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
                            {LISTING_PROPERTY_OPTIONS.map((option) => {
                                const active = form.type === option.value;
                                return (
                                    <TouchableOpacity
                                        key={option.label}
                                        onPress={() => updateForm({ type: option.value })}
                                        style={{
                                            alignItems: 'center', justifyContent: 'center',
                                            width: 76, height: 76, borderRadius: 16,
                                            backgroundColor: active ? C.pine : C.white,
                                            borderWidth: active ? 0 : 1, borderColor: C.border,
                                            shadowColor: active ? C.pine : '#000',
                                            shadowOffset: { width: 0, height: active ? 4 : 1 },
                                            shadowOpacity: active ? 0.25 : 0.04,
                                            shadowRadius: active ? 8 : 4,
                                            elevation: active ? 4 : 1,
                                        }}
                                    >
                                        <Ionicons name={option.icon} size={22} color={active ? C.green : C.textSub} />
                                        <Text style={{
                                            fontSize: 11, fontWeight: '700', marginTop: 6,
                                            color: active ? C.white : C.textSub,
                                        }}>
                                            {option.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    </View>

                    {/* ── Bedrooms / Bathrooms ──────────────────── */}
                    <View style={{ flexDirection: 'row', gap: 14 }}>
                        <Stepper label="Bedrooms" value={form.bedrooms} onChange={(v) => updateForm({ bedrooms: v })} />
                        <Stepper label="Bathrooms" value={form.bathrooms} onChange={(v) => updateForm({ bathrooms: v })} />
                    </View>

                    {/* ── Area ──────────────────────────────────── */}
                    <View>
                        <SectionLabel>Area (sq ft)</SectionLabel>
                        <FormInput
                            placeholder="e.g. 1200"
                            value={form.areaSqft}
                            onChangeText={(v) => updateForm({ areaSqft: v })}
                            keyboardType="numeric"
                            autoCapitalize="none"
                        />
                    </View>

                    {/* ── Address ───────────────────────────────── */}
                    <View>
                        <SectionLabel>Address</SectionLabel>
                        <FormInput
                            placeholder="Street address"
                            value={form.address}
                            onChangeText={(v) => updateForm({ address: v })}
                        />
                    </View>

                    {/* ── City ──────────────────────────────────── */}
                    <View>
                        <SectionLabel>City</SectionLabel>
                        <FormInput
                            placeholder="e.g. Lahore"
                            value={form.city}
                            onChangeText={(v) => updateForm({ city: v })}
                        />
                    </View>

                    {/* ── Coordinates ───────────────────────────── */}
                    <View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                            <SectionLabel>Coordinates</SectionLabel>
                            <TouchableOpacity
                                onPress={handleDetectLocation}
                                disabled={isDetectingLocation}
                                style={{
                                    flexDirection: 'row', alignItems: 'center', gap: 6,
                                    backgroundColor: C.tealMuted,
                                    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20,
                                }}
                            >
                                {isDetectingLocation ? (
                                    <ActivityIndicator size="small" color={C.teal} />
                                ) : (
                                    <Ionicons name="locate-outline" size={13} color={C.teal} />
                                )}
                                <Text style={{ color: C.teal, fontSize: 12, fontWeight: '700' }}>
                                    {isDetectingLocation ? "Detecting..." : "Detect Location"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', gap: 12 }}>
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

                    {/* ── Featured toggle ───────────────────────── */}
                    <TouchableOpacity
                        onPress={() => updateForm({ isFeatured: !form.isFeatured })}
                        style={{
                            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                            backgroundColor: C.white,
                            borderRadius: 14, padding: 16,
                            borderWidth: 1, borderColor: form.isFeatured ? C.teal : C.border,
                        }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                            <View style={{
                                width: 38, height: 38, borderRadius: 10,
                                backgroundColor: form.isFeatured ? C.tealMuted : C.sage,
                                alignItems: 'center', justifyContent: 'center',
                            }}>
                                <Ionicons name="star-outline" size={18} color={form.isFeatured ? C.teal : C.textMuted} />
                            </View>
                            <View>
                                <Text style={{ fontSize: 14, fontWeight: '700', color: C.textMain }}>Feature this listing</Text>
                                <Text style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>Shown in Home's Featured row</Text>
                            </View>
                        </View>
                        {/* Toggle pill */}
                        <View style={{
                            width: 48, height: 28, borderRadius: 14, padding: 3,
                            backgroundColor: form.isFeatured ? C.teal : C.border,
                            justifyContent: 'center',
                        }}>
                            <View style={{
                                width: 22, height: 22, borderRadius: 11,
                                backgroundColor: C.white,
                                marginLeft: form.isFeatured ? 20 : 0,
                            }} />
                        </View>
                    </TouchableOpacity>

                    {/* ── Submit ────────────────────────────────── */}
                    <TouchableOpacity
                        onPress={handleSubmit}
                        disabled={isSubmitting || isUploadingImages}
                        style={{
                            backgroundColor: C.pine,
                            borderRadius: 14,
                            paddingVertical: 16,
                            alignItems: 'center', justifyContent: 'center',
                            flexDirection: 'row', gap: 10,
                            opacity: isSubmitting || isUploadingImages ? 0.6 : 1,
                            shadowColor: C.pine,
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.35,
                            shadowRadius: 10,
                            elevation: 6,
                            marginTop: 4,
                        }}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator color={C.white} />
                        ) : (
                            <>
                                <Ionicons name="cloud-upload-outline" size={19} color={C.green} />
                                <Text style={{ color: C.white, fontWeight: '800', fontSize: 16 }}>Publish Listing</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}