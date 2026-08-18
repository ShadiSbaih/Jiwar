import { colors, fonts } from '@/constants/theme';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

type BrandLockupProps = {
    wordmarkColor?: string;
    markSize?: number;
};

export default function BrandLockup({
    wordmarkColor = colors.textPrimary,
    markSize = 28,
}: BrandLockupProps) {
    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/images/favicon.png')}
                style={{ width: markSize, height: markSize }}
                resizeMode="contain"
                accessibilityLabel="Jiwar emblem"
            />
            <Text style={[styles.wordmark, { color: wordmarkColor }]}>Jiwar</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    wordmark: {
        fontFamily: fonts.displaySB,
        fontSize: 24,
        letterSpacing: -0.5,
    },
});
