import { BEDROOM_OPTIONS, PRICE_PRESETS, PROPERTY_TYPE_OPTIONS } from '@/constants/filters';
import { useFilterStore } from '@/store/filterStore';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

// ─── Design tokens (inline — consistent with the rest of the app) ──────────
const C = {
    pine:       '#08383C',
    pineDark:   '#061F22',
    teal:       '#1C685D',
    tealMuted:  '#E8F3F1',
    green:      '#4ADE80',
    white:      '#FFFFFF',
    sage:       '#F5F8F6',
    border:     '#E5E7EB',
    textMain:   '#0F1712',
    textSub:    '#6B7280',
    textMuted:  '#9CA3AF',
};

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
                style={{ flex: 1, backgroundColor: C.white }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >

                {/* Drag handle */}
                <View style={{ alignItems: 'center', paddingTop: 12, paddingBottom: 6 }}>
                    <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: C.border }} />
                </View>

                {/* Header */}
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 20,
                    paddingTop: 8,
                    paddingBottom: 20,
                    borderBottomWidth: 1,
                    borderBottomColor: C.border,
                }}>
                    <View>
                        <Text style={{ fontSize: 20, fontWeight: '800', color: C.textMain }}>Filters</Text>
                        {activeCount > 0 && (
                            <Text style={{ fontSize: 12, color: C.teal, fontWeight: '600', marginTop: 2 }}>
                                {activeCount} active filter{activeCount > 1 ? 's' : ''}
                            </Text>
                        )}
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <TouchableOpacity
                            onPress={handleReset}
                            style={{
                                paddingHorizontal: 14,
                                paddingVertical: 7,
                                borderRadius: 20,
                                borderWidth: 1,
                                borderColor: C.border,
                            }}
                        >
                            <Text style={{ fontSize: 13, fontWeight: '600', color: C.textSub }}>Reset all</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={onClose}
                            style={{
                                width: 34,
                                height: 34,
                                borderRadius: 17,
                                backgroundColor: C.sage,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Ionicons name="close" size={18} color={C.textMain} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Body */}
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 28, paddingBottom: 40, gap: 32 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* ── Property Type ─────────────────────────────── */}
                    <View>
                        <SectionLabel>Property Type</SectionLabel>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12 }}>
                            {PROPERTY_TYPE_OPTIONS.map((item) => {
                                const active = type === item.value;
                                return (
                                    <TouchableOpacity
                                        key={String(item.value)}
                                        onPress={() => setType(active ? null : item.value)}
                                        style={{
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: 76,
                                            height: 76,
                                            borderRadius: 18,
                                            backgroundColor: active ? C.pine : C.white,
                                            borderWidth: active ? 0 : 1,
                                            borderColor: C.border,
                                            shadowColor: active ? C.pine : '#000',
                                            shadowOffset: { width: 0, height: active ? 4 : 1 },
                                            shadowOpacity: active ? 0.25 : 0.04,
                                            shadowRadius: active ? 8 : 4,
                                            elevation: active ? 4 : 1,
                                        }}
                                    >
                                        <Ionicons
                                            name={item.icon}
                                            size={22}
                                            color={active ? C.green : C.textSub}
                                        />
                                        <Text style={{
                                            fontSize: 11,
                                            fontWeight: '700',
                                            marginTop: 6,
                                            color: active ? C.white : C.textSub,
                                            letterSpacing: 0.2,
                                        }}>
                                            {item.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    {/* ── Bedrooms ──────────────────────────────────── */}
                    <View>
                        <SectionLabel>Bedrooms</SectionLabel>
                        <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
                            {BEDROOM_OPTIONS.map((item) => {
                                const active = bedrooms === item.value;
                                return (
                                    <TouchableOpacity
                                        key={String(item.value)}
                                        onPress={() => setBedrooms(active ? null : item.value)}
                                        style={{
                                            width: 52,
                                            height: 52,
                                            borderRadius: 26,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: active ? C.pine : C.white,
                                            borderWidth: active ? 0 : 1,
                                            borderColor: C.border,
                                            shadowColor: active ? C.pine : '#000',
                                            shadowOffset: { width: 0, height: active ? 4 : 1 },
                                            shadowOpacity: active ? 0.25 : 0.04,
                                            shadowRadius: active ? 8 : 4,
                                            elevation: active ? 4 : 1,
                                        }}
                                    >
                                        <Text style={{
                                            fontSize: 14,
                                            fontWeight: '800',
                                            color: active ? C.green : C.textSub,
                                        }}>
                                            {item.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    {/* ── Price Range ───────────────────────────────── */}
                    <View>
                        <SectionLabel>Price Range (PKR)</SectionLabel>

                        {/* Min / Max inputs */}
                        <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
                            {[
                                { label: 'Min', value: localMin, onChange: setLocalMin, placeholder: 'No min' },
                                { label: 'Max', value: localMax, onChange: setLocalMax, placeholder: 'No max' },
                            ].map(({ label, value, onChange, placeholder }) => (
                                <View
                                    key={label}
                                    style={{
                                        flex: 1,
                                        backgroundColor: C.sage,
                                        borderRadius: 12,
                                        borderWidth: 1,
                                        borderColor: C.border,
                                        paddingHorizontal: 12,
                                        paddingVertical: 2,
                                    }}
                                >
                                    <Text style={{ fontSize: 10, fontWeight: '700', color: C.textMuted, letterSpacing: 0.8, textTransform: 'uppercase', marginTop: 8 }}>
                                        {label}
                                    </Text>
                                    <TextInput
                                        style={{ fontSize: 15, fontWeight: '700', color: C.textMain, paddingVertical: 6 }}
                                        placeholder={placeholder}
                                        placeholderTextColor={C.textMuted}
                                        keyboardType="numeric"
                                        value={value}
                                        onChangeText={onChange}
                                    />
                                </View>
                            ))}
                        </View>

                        {/* Price presets */}
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
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
                                            paddingHorizontal: 14,
                                            paddingVertical: 8,
                                            borderRadius: 100,
                                            backgroundColor: active ? C.pine : C.white,
                                            borderWidth: active ? 0 : 1,
                                            borderColor: C.border,
                                        }}
                                    >
                                        <Text style={{
                                            fontSize: 13,
                                            fontWeight: '600',
                                            color: active ? C.green : C.textSub,
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
                    paddingHorizontal: 20,
                    paddingTop: 14,
                    paddingBottom: 32,
                    borderTopWidth: 1,
                    borderTopColor: C.border,
                    backgroundColor: C.white,
                }}>
                    <TouchableOpacity
                        onPress={handleApply}
                        style={{
                            backgroundColor: C.pine,
                            borderRadius: 14,
                            paddingVertical: 16,
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'row',
                            gap: 8,
                            shadowColor: C.pine,
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.35,
                            shadowRadius: 10,
                            elevation: 6,
                        }}
                    >
                        <Ionicons name="checkmark-circle" size={19} color={C.green} />
                        <Text style={{ color: C.white, fontWeight: '800', fontSize: 16 }}>
                            Show Results{activeCount > 0 ? `  ·  ${activeCount} filter${activeCount > 1 ? 's' : ''}` : ''}
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

// Small helper — keeps section labels consistent
function SectionLabel({ children }: { children: string }) {
    return (
        <Text style={{
            fontSize: 11,
            fontWeight: '800',
            color: '#9CA3AF',
            letterSpacing: 1.2,
            textTransform: 'uppercase',
        }}>
            {children}
        </Text>
    );
}