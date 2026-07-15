import React, { useEffect, useRef } from 'react';
import { Animated, View, ViewStyle } from 'react-native';

export function Skeleton({ style }: { style?: ViewStyle }) {
    const fadeAnim = useRef(new Animated.Value(0.4)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(fadeAnim, { toValue: 0.85, duration: 900, useNativeDriver: true }),
                Animated.timing(fadeAnim, { toValue: 0.4, duration: 900, useNativeDriver: true }),
            ])
        ).start();
    }, [fadeAnim]);

    return (
        <Animated.View
            style={[
                {
                    opacity: fadeAnim,
                    backgroundColor: '#D1E8E4',
                    borderRadius: 10,
                },
                style,
            ]}
        />
    );
}

/** Matches the new full-width PropertyCard layout */
export function PropertyCardSkeleton() {
    return (
        <View style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 20,
            marginBottom: 16,
            overflow: 'hidden',
            shadowColor: '#08383C',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.06,
            shadowRadius: 10,
            elevation: 2,
        }}>
            {/* Photo area */}
            <Skeleton style={{ width: '100%', height: 190, borderRadius: 0 }} />
            {/* Body */}
            <View style={{ padding: 16, gap: 10 }}>
                <Skeleton style={{ height: 16, width: '70%' }} />
                <Skeleton style={{ height: 13, width: '45%' }} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
                    <Skeleton style={{ height: 18, width: 90 }} />
                    <Skeleton style={{ height: 18, width: 80 }} />
                </View>
            </View>
        </View>
    );
}

/** Matches the new FeaturedCard layout */
export function FeaturedCardSkeleton() {
    return (
        <View style={{
            width: 220,
            marginRight: 14,
            borderRadius: 20,
            overflow: 'hidden',
            backgroundColor: '#FFFFFF',
            shadowColor: '#08383C',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 3,
        }}>
            <Skeleton style={{ width: '100%', height: 260, borderRadius: 0 }} />
            <View style={{ padding: 14, gap: 8, flexDirection: 'row', justifyContent: 'space-around' }}>
                <Skeleton style={{ height: 14, width: 50 }} />
                <Skeleton style={{ height: 14, width: 50 }} />
                <Skeleton style={{ height: 14, width: 50 }} />
            </View>
        </View>
    );
}
