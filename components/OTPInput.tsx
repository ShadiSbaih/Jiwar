import React, { useRef, useState } from 'react';
import { View, TextInput, StyleSheet, Pressable, Text } from 'react-native';

const C = {
    pine:     '#08383C',
    teal:     '#1C685D',
    green:    '#4ADE80',
    white:    '#FFFFFF',
    border:   'rgba(255,255,255,0.12)',
    muted:    'rgba(255,255,255,0.45)',
    inputBg:  'rgba(255,255,255,0.08)',
};

interface OTPInputProps {
    code: string;
    setCode: (code: string) => void;
    maximumLength?: number;
}

export default function OTPInput({ code, setCode, maximumLength = 6 }: OTPInputProps) {
    const inputRef = useRef<TextInput>(null);
    const [isFocused, setIsFocused] = useState(false);

    const handleOnPress = () => {
        inputRef.current?.focus();
    };

    const handleOnBlur = () => {
        setIsFocused(false);
    };

    const handleOnFocus = () => {
        setIsFocused(true);
    };

    return (
        <View style={styles.container}>
            <Pressable style={styles.inputsContainer} onPress={handleOnPress}>
                {Array(maximumLength).fill(0).map((_, index) => {
                    const digit = code[index] || "";
                    const isCurrentDigit = index === code.length;
                    const isLastDigit = index === maximumLength - 1;
                    const isCodeFull = code.length === maximumLength;

                    const isFocusedDigit = isFocused && (isCurrentDigit || (isLastDigit && isCodeFull));

                    return (
                        <View
                            key={index}
                            style={[
                                styles.digitContainer,
                                isFocusedDigit && styles.digitContainerFocused
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
                onSubmitEditing={handleOnBlur}
                keyboardType="number-pad"
                returnKeyType="done"
                textContentType="oneTimeCode"
                maxLength={maximumLength}
                style={styles.hiddenInput}
                onFocus={handleOnFocus}
                onBlur={handleOnBlur}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 4,
    },
    inputsContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    digitContainer: {
        width: 48,
        height: 58,
        borderRadius: 14,
        backgroundColor: C.inputBg,
        borderWidth: 1,
        borderColor: C.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    digitContainerFocused: {
        borderColor: C.green,
        backgroundColor: 'rgba(74, 222, 128, 0.05)',
        shadowColor: C.green,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 3,
    },
    digitText: {
        fontSize: 24,
        fontWeight: '700',
        color: C.white,
    },
    hiddenInput: {
        position: 'absolute',
        width: 1,
        height: 1,
        opacity: 0,
    }
});
