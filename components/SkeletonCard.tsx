import React, { useEffect, useRef } from 'react';
import { Animated, View, ViewStyle } from 'react-native';
import { colors, radius, spacing } from '@/constants/theme';

export function Skeleton({ style }: { style?: ViewStyle }) {
    const fadeAnim = useRef(new Animated.Value(0.4)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(fadeAnim, { toValue: 0.85, duration: 1000, useNativeDriver: true }),
                Animated.timing(fadeAnim, { toValue: 0.4, duration: 1000, useNativeDriver: true }),
            ])
        ).start();
    }, [fadeAnim]);

    return (
        <Animated.View
            style={[
                {
                    opacity: fadeAnim,
                    // Warm ivory skeleton — matches Desert Minimal palette
                    backgroundColor: '#E8E2D8',
                    borderRadius: radius.xs,
                },
                style,
            ]}
        />
    );
}

/** Matches PropertyCard layout */
export function PropertyCardSkeleton() {
    return (
        <View style={{
            backgroundColor: colors.surface,
            borderRadius: radius.lg,
            marginBottom: spacing.itemGap,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: colors.border,
        }}>
            {/* Photo area */}
            <Skeleton style={{ width: '100%', height: 192, borderRadius: 0 }} />
            {/* Body */}
            <View style={{ padding: spacing.lg, gap: spacing.sm }}>
                <Skeleton style={{ height: 11, width: '30%', borderRadius: 4 }} />
                <Skeleton style={{ height: 18, width: '75%' }} />
                <Skeleton style={{ height: 12, width: '45%' }} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.xs }}>
                    <Skeleton style={{ height: 18, width: 90 }} />
                    <Skeleton style={{ height: 18, width: 80 }} />
                </View>
            </View>
        </View>
    );
}

/** Matches FeaturedCard layout */
export function FeaturedCardSkeleton() {
    return (
        <View style={{
            width: 240,
            marginRight: spacing.lg,
            borderRadius: radius.lg,
            overflow: 'hidden',
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
        }}>
            <Skeleton style={{ width: '100%', height: 180, borderRadius: 0 }} />
            <View style={{ padding: spacing.md, gap: spacing.sm }}>
                <Skeleton style={{ height: 10, width: '30%', borderRadius: 4 }} />
                <Skeleton style={{ height: 16, width: '80%' }} />
                <Skeleton style={{ height: 11, width: '50%' }} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 }}>
                    <Skeleton style={{ height: 15, width: 70 }} />
                    <Skeleton style={{ height: 15, width: 60 }} />
                </View>
            </View>
        </View>
    );
}
