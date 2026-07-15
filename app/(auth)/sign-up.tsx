import { useAuth, useSignUp } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator, Image, KeyboardAvoidingView,
    Platform, ScrollView, Text, TextInput, TouchableOpacity, View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import OTPInput from "../../components/OTPInput";

const C = {
    pine:     '#08383C',
    teal:     '#1C685D',
    green:    '#4ADE80',
    white:    '#FFFFFF',
    border:   'rgba(255,255,255,0.12)',
    muted:    'rgba(255,255,255,0.45)',
    inputBg:  'rgba(255,255,255,0.08)',
};

function AuthInput({
    placeholder, value, onChangeText, secureTextEntry = false,
    keyboardType = 'default', autoCapitalize = 'none', style = {},
}: any) {
    return (
        <TextInput
            placeholder={placeholder}
            placeholderTextColor={C.muted}
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            style={{
                backgroundColor: C.inputBg,
                borderWidth: 1,
                borderColor: C.border,
                borderRadius: 14,
                paddingHorizontal: 16,
                paddingVertical: 15,
                color: C.white,
                fontSize: 15,
                ...style,
            }}
        />
    );
}

export default function SignUpScreen() {
    const { signUp, errors, fetchStatus } = useSignUp();
    const { isSignedIn } = useAuth();
    const router = useRouter();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [verifyCode, setVerifyCode] = useState("");

    const isLoading = fetchStatus === "fetching";

    const handleRegister = async () => {
        const { error } = await signUp.password({ emailAddress: email, password, firstName, lastName });
        if (error) return console.error(error);
        await signUp.verifications.sendEmailCode();
    };

    const handleVerifyCode = async () => {
        try {
            const { error } = await signUp.verifications.verifyEmailCode({ code: verifyCode });
            if (error) { console.error(JSON.stringify(error, null, 2)); return; }
            if (signUp.status === "complete") await signUp.finalize();
        } catch (err) {
            console.error("Verification failed", err);
        }
    };

    const needsVerification =
        signUp.status === "missing_requirements" &&
        signUp.unverifiedFields.includes("email_address") &&
        signUp.missingFields.length === 0;

    useEffect(() => {
        if (signUp.status === "complete" || isSignedIn) router.replace("/(root)/(tabs)");
    }, [signUp.status, isSignedIn]);

    if (signUp.status === "complete" || isSignedIn) return null;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: C.pine }} edges={["bottom", "left", "right"]}>
            <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >

                    {/* Hero image */}
                    <Image
                        source={require("../../assets/images/onboarding.png")}
                        style={{ width: '100%', height: 340 }}
                        resizeMode="cover"
                    />

                    {/* Card sheet */}
                    <View style={{
                        flex: 1,
                        backgroundColor: C.pine,
                        borderTopLeftRadius: 28,
                        borderTopRightRadius: 28,
                        marginTop: -24,
                        paddingHorizontal: 28,
                        paddingTop: 32,
                        gap: 14,
                    }}>
                        {/* Header */}
                        <View style={{ marginBottom: 4 }}>
                            <Text style={{ color: C.green, fontSize: 11, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase' }}>
                                {needsVerification ? "Step 2 of 2" : "Step 1 of 2"}
                            </Text>
                            <Text style={{ color: C.white, fontSize: 26, fontWeight: '800', marginTop: 4 }}>
                                {needsVerification ? "Verify your email" : "Create account"}
                            </Text>
                            <Text style={{ color: C.muted, fontSize: 14, marginTop: 6 }}>
                                {needsVerification ? `We sent a code to ${email}` : "Your dream home is one step away."}
                            </Text>
                        </View>

                        {needsVerification ? (
                            <>
                                <OTPInput
                                    code={verifyCode}
                                    setCode={setVerifyCode}
                                    maximumLength={6}
                                />
                                {errors.fields.code && (
                                    <Text style={{ color: '#F87171', fontSize: 12, marginTop: -6 }}>{errors.fields.code.message}</Text>
                                )}
                                <TouchableOpacity
                                    onPress={handleVerifyCode}
                                    disabled={isLoading}
                                    style={{
                                        backgroundColor: C.teal,
                                        borderRadius: 14,
                                        paddingVertical: 16,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginTop: 4,
                                        shadowColor: C.teal,
                                        shadowOffset: { width: 0, height: 4 },
                                        shadowOpacity: 0.4,
                                        shadowRadius: 10,
                                        elevation: 6,
                                    }}
                                >
                                    {isLoading
                                        ? <ActivityIndicator color={C.white} />
                                        : <Text style={{ color: C.white, fontWeight: '800', fontSize: 16 }}>Confirm & Continue</Text>
                                    }
                                </TouchableOpacity>
                                <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 24, marginTop: 4 }}>
                                    <TouchableOpacity onPress={() => signUp.verifications.sendEmailCode()}>
                                        <Text style={{ color: C.green, fontSize: 14, fontWeight: '600' }}>Resend code</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => signUp.reset()}>
                                        <Text style={{ color: C.muted, fontSize: 14 }}>Start over</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        ) : (
                            <>
                                {/* Name row */}
                                <View style={{ flexDirection: 'row', gap: 12 }}>
                                    <AuthInput
                                        placeholder="First name"
                                        value={firstName}
                                        onChangeText={setFirstName}
                                        autoCapitalize="words"
                                        style={{ flex: 1 }}
                                    />
                                    <AuthInput
                                        placeholder="Last name"
                                        value={lastName}
                                        onChangeText={setLastName}
                                        autoCapitalize="words"
                                        style={{ flex: 1 }}
                                    />
                                </View>

                                <AuthInput
                                    placeholder="Email address"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                />
                                {errors.fields.emailAddress && (
                                    <Text style={{ color: '#F87171', fontSize: 12, marginTop: -6 }}>{errors.fields.emailAddress.message}</Text>
                                )}

                                <AuthInput
                                    placeholder="Password"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                />
                                {errors.fields.password && (
                                    <Text style={{ color: '#F87171', fontSize: 12, marginTop: -6 }}>{errors.fields.password.message}</Text>
                                )}

                                <TouchableOpacity
                                    onPress={handleRegister}
                                    disabled={isLoading}
                                    style={{
                                        backgroundColor: C.teal,
                                        borderRadius: 14,
                                        paddingVertical: 16,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginTop: 4,
                                        shadowColor: C.teal,
                                        shadowOffset: { width: 0, height: 4 },
                                        shadowOpacity: 0.4,
                                        shadowRadius: 10,
                                        elevation: 6,
                                    }}
                                >
                                    {isLoading
                                        ? <ActivityIndicator color={C.white} />
                                        : <Text style={{ color: C.white, fontWeight: '800', fontSize: 16 }}>Create Account</Text>
                                    }
                                </TouchableOpacity>

                                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 6 }}>
                                    <Text style={{ color: C.muted, fontSize: 14 }}>Already have an account? </Text>
                                    <Link href="/sign-in">
                                        <Text style={{ color: C.green, fontWeight: '700', fontSize: 14 }}>Sign In</Text>
                                    </Link>
                                </View>
                                <View nativeID="clerk-captcha" />
                            </>
                        )}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
