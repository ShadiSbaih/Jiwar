import { BEDROOM_OPTIONS, PRICE_PRESETS, PROPERTY_TYPE_OPTIONS } from '@/constants/filters';
import { colors, fonts, fontSize, radius, spacing } from '@/constants/theme';
import { useFilterStore } from '@/store/filterStore';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function FilterModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
    const { type, bedrooms, minPrice, maxPrice,
        setType, setBedrooms, setMinPrice, setMaxPrice, resetFilters } = useFilterStore();

    const [localMin, setLocalMin] = useState(minPrice ? String(minPrice) : '');
    const [localMax, setLocalMax] = useState(maxPrice ? String(maxPrice) : '');

    const activeCount = [type, bedrooms, minPrice, maxPrice].filter((v) => v !== null).length;

    const handleApply = () => {
        setMinPrice(localMin ? Number(localMin) : null);
        setMaxPrice(localMax ? Number(localMax) : null);
        onClose();
    };

    const handleReset = () => {
        setLocalMin('');
        setLocalMax('');
        resetFilters();
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
            <KeyboardAvoidingView
                style={{ flex: 1, backgroundColor: colors.surface }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                {/* Drag handle */}
                <View style={{ alignItems: 'center', paddingTop: spacing.md, paddingBottom: spacing.sm }}>
                    <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: colors.borderStrong }} />
                </View>

                {/* Header */}
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
                            fontSize: fontSize.h3,
                            color: colors.textPrimary,
                        }}>
                            Filters
                        </Text>
                        {activeCount > 0 && (
                            <Text style={{
                                fontFamily: fonts.bodyM,
                                fontSize: fontSize.caption,
                                color: colors.brand,
                                marginTop: 2,
                            }}>
                                {activeCount} active {activeCount > 1 ? 'filters' : 'filter'}
                            </Text>
                        )}
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                        <TouchableOpacity
                            onPress={handleReset}
                            style={{
                                paddingHorizontal: spacing.lg,
                                paddingVertical: spacing.sm,
                                borderRadius: radius.xs,
                                borderWidth: 1,
                                borderColor: colors.border,
                            }}
                        >
                            <Text style={{
                                fontFamily: fonts.bodyM,
                                fontSize: fontSize.caption,
                                color: colors.textSecondary,
                            }}>
                                Reset all
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={onClose}
                            style={{
                                width: 34,
                                height: 34,
                                borderRadius: radius.sm,
                                backgroundColor: colors.background,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderWidth: 1,
                                borderColor: colors.border,
                            }}
                        >
                            <Ionicons name="close" size={17} color={colors.textPrimary} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Body */}
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{
                        paddingHorizontal: spacing.pageHorizontal,
                        paddingTop: spacing.xxl,
                        paddingBottom: spacing.mega,
                        gap: spacing.xxxl,
                    }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* ── Property Type ──────────────────────── */}
                    <View>
                        <FilterSectionLabel>Property Type</FilterSectionLabel>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md }}>
                            {PROPERTY_TYPE_OPTIONS.map((item) => {
                                const active = type === item.value;
                                return (
                                    <TouchableOpacity
                                        key={String(item.value)}
                                        onPress={() => setType(active ? null : item.value)}
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
                                        {item.icon && (
                                            <Ionicons
                                                name={item.icon}
                                                size={20}
                                                color={active ? colors.surface : colors.textMuted}
                                            />
                                        )}
                                        <Text style={{
                                            fontFamily: fonts.bodyM,
                                            fontSize: fontSize.micro,
                                            marginTop: spacing.xs,
                                            color: active ? colors.surface : colors.textSecondary,
                                        }}>
                                            {item.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    {/* ── Bedrooms ───────────────────────────── */}
                    <View>
                        <FilterSectionLabel>Bedrooms</FilterSectionLabel>
                        <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md }}>
                            {BEDROOM_OPTIONS.map((item) => {
                                const active = bedrooms === item.value;
                                return (
                                    <TouchableOpacity
                                        key={String(item.value)}
                                        onPress={() => setBedrooms(active ? null : item.value)}
                                        style={{
                                            width: 52,
                                            height: 48,
                                            borderRadius: radius.sm,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: active ? colors.brand : colors.surface,
                                            borderWidth: 1,
                                            borderColor: active ? colors.brand : colors.border,
                                        }}
                                    >
                                        <Text style={{
                                            fontFamily: fonts.bodySB,
                                            fontSize: fontSize.body,
                                            color: active ? colors.surface : colors.textSecondary,
                                        }}>
                                            {item.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    {/* ── Price Range ─────────────────────────── */}
                    <View>
                        <FilterSectionLabel>Price Range (PKR)</FilterSectionLabel>

                        {/* Min / Max inputs */}
                        <View style={{ flexDirection: 'row', gap: spacing.md, marginTop: spacing.md }}>
                            {[
                                { label: 'MIN', value: localMin, onChange: setLocalMin, placeholder: 'No min' },
                                { label: 'MAX', value: localMax, onChange: setLocalMax, placeholder: 'No max' },
                            ].map(({ label, value, onChange, placeholder }) => (
                                <View
                                    key={label}
                                    style={{
                                        flex: 1,
                                        backgroundColor: colors.background,
                                        borderRadius: radius.sm,
                                        borderWidth: 1,
                                        borderColor: colors.border,
                                        paddingHorizontal: spacing.md,
                                        paddingVertical: spacing.xs,
                                    }}
                                >
                                    <Text style={{
                                        fontFamily: fonts.bodySB,
                                        fontSize: fontSize.nano,
                                        color: colors.textMuted,
                                        letterSpacing: 0.8,
                                        textTransform: 'uppercase',
                                        marginTop: spacing.sm,
                                    }}>
                                        {label}
                                    </Text>
                                    <TextInput
                                        style={{
                                            fontFamily: fonts.bodySB,
                                            fontSize: fontSize.body,
                                            color: colors.textPrimary,
                                            paddingVertical: spacing.sm,
                                        }}
                                        placeholder={placeholder}
                                        placeholderTextColor={colors.textMuted}
                                        keyboardType="numeric"
                                        value={value}
                                        onChangeText={onChange}
                                    />
                                </View>
                            ))}
                        </View>

                        {/* Price presets */}
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.lg }}>
                            {PRICE_PRESETS.map((p) => {
                                const active = minPrice === p.min && maxPrice === p.max;
                                return (
                                    <TouchableOpacity
                                        key={p.label}
                                        onPress={() => {
                                            setLocalMin(p.min ? String(p.min) : '');
                                            setLocalMax(p.max ? String(p.max) : '');
                                            setMinPrice(p.min);
                                            setMaxPrice(p.max);
                                        }}
                                        style={{
                                            paddingHorizontal: spacing.lg,
                                            paddingVertical: spacing.sm,
                                            borderRadius: radius.xs,
                                            backgroundColor: active ? colors.brand : colors.surface,
                                            borderWidth: 1,
                                            borderColor: active ? colors.brand : colors.border,
                                        }}
                                    >
                                        <Text style={{
                                            fontFamily: active ? fonts.bodySB : fonts.bodyM,
                                            fontSize: fontSize.caption,
                                            color: active ? colors.surface : colors.textSecondary,
                                        }}>
                                            {p.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                </ScrollView>

                {/* Apply button — sticky at bottom */}
                <View style={{
                    paddingHorizontal: spacing.pageHorizontal,
                    paddingTop: spacing.lg,
                    paddingBottom: spacing.xxxl,
                    borderTopWidth: 1,
                    borderTopColor: colors.border,
                    backgroundColor: colors.surface,
                }}>
                    <TouchableOpacity
                        onPress={handleApply}
                        style={{
                            backgroundColor: colors.brand,
                            borderRadius: radius.md,
                            height: 50,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Text style={{
                            fontFamily: fonts.bodySB,
                            color: colors.surface,
                            fontSize: fontSize.bodyLg,
                        }}>
                            Show Results{activeCount > 0 ? `  ·  ${activeCount} filter${activeCount > 1 ? 's' : ''}` : ''}
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

function FilterSectionLabel({ children }: { children: string }) {
    return (
        <Text style={{
            fontFamily: fonts.bodySB,
            fontSize: fontSize.nano,
            color: colors.textMuted,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
        }}>
            {children}
        </Text>
    );
}