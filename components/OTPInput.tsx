import { colors, fonts, fontSize, radius, spacing } from '@/constants/theme';
import React, { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

interface OTPInputProps {
    code: string;
    setCode: (code: string) => void;
    maximumLength?: number;
}

export default function OTPInput({ code, setCode, maximumLength = 6 }: OTPInputProps) {
    const inputRef = useRef<TextInput>(null);
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={styles.container}>
            <Pressable style={styles.inputsContainer} onPress={() => inputRef.current?.focus()}>
                {Array(maximumLength).fill(0).map((_, index) => {
                    const digit = code[index] || '';
                    const isCurrentDigit = index === code.length;
                    const isLastDigit = index === maximumLength - 1;
                    const isCodeFull = code.length === maximumLength;
                    const isFocusedDigit = isFocused && (isCurrentDigit || (isLastDigit && isCodeFull));

                    return (
                        <View
                            key={index}
                            style={[
                                styles.digitContainer,
                                isFocusedDigit && styles.digitContainerFocused,
                                digit && styles.digitContainerFilled,
                            ]}
                        >
                            <Text style={styles.digitText}>{digit}</Text>
                        </View>
                    );
                })}
            </Pressable>
            <TextInput
                ref={inputRef}
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                returnKeyType="done"
                textContentType="oneTimeCode"
                maxLength={maximumLength}
                style={styles.hiddenInput}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: spacing.xs,
    },
    inputsContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: spacing.sm,
    },
    digitContainer: {
        flex: 1,
        height: 56,
        borderRadius: radius.sm,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.borderStrong,
        alignItems: 'center',
        justifyContent: 'center',
    },
    digitContainerFocused: {
        borderColor: colors.brand,
        borderWidth: 1.5,
        backgroundColor: colors.brandSubtle,
    },
    digitContainerFilled: {
        backgroundColor: colors.surface,
        borderColor: colors.borderStrong,
    },
    digitText: {
        fontFamily: fonts.bodySB,
        fontSize: fontSize.h3,
        color: colors.textPrimary,
    },
    hiddenInput: {
        position: 'absolute',
        width: 1,
        height: 1,
        opacity: 0,
    },
});
