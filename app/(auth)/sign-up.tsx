import { useAuth, useSignUp } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator, Image, KeyboardAvoidingView,
    Platform, ScrollView, Text, TouchableOpacity, View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import OTPInput from "../../components/OTPInput";
import { AppTextInput } from "../../components/DesignSystem";
import { colors, fonts, fontSize, radius, spacing } from "../../constants/theme";

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
        <View style={{ flex: 1, backgroundColor: colors.background }}>
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
                    {/* ── Hero image ── */}
                    <View style={{ height: 260 }}>
                        <Image
                            source={require("../../assets/images/onboarding.png")}
                            style={{ width: '100%', height: 260 }}
                            resizeMode="cover"
                        />
                    </View>

                    {/* ── Form area — ivory ── */}
                    <SafeAreaView
                        edges={["bottom", "left", "right"]}
                        style={{ flex: 1, backgroundColor: colors.background }}
                    >
                        <View style={{
                            flex: 1,
                            paddingHorizontal: spacing.pageHorizontal + spacing.sm,
                            paddingTop: spacing.xxl,
                            gap: spacing.lg,
                        }}>
                            {/* Wordmark */}
                            <Text style={{
                                fontFamily: fonts.displaySB,
                                fontSize: fontSize.h3,
                                color: colors.brand,
                                letterSpacing: -0.3,
                            }}>
                                Jiwar
                            </Text>

                            {/* Heading */}
                            <View style={{ gap: spacing.xs, marginBottom: spacing.sm }}>
                                <Text style={{
                                    fontFamily: fonts.displayI,
                                    fontSize: fontSize.h2,
                                    color: colors.textPrimary,
                                }}>
                                    {needsVerification ? "Verify your email." : "Create account."}
                                </Text>
                                <Text style={{
                                    fontFamily: fonts.body,
                                    fontSize: fontSize.body,
                                    color: colors.textMuted,
                                    lineHeight: 22,
                                }}>
                                    {needsVerification
                                        ? `We sent a code to ${email}`
                                        : "Your next home is one step away."}
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
                                        <Text style={errorTextStyle}>{errors.fields.code.message}</Text>
                                    )}

                                    <TouchableOpacity
                                        onPress={handleVerifyCode}
                                        disabled={isLoading}
                                        style={primaryButton(isLoading)}
                                    >
                                        {isLoading
                                            ? <ActivityIndicator color={colors.surface} />
                                            : <Text style={primaryButtonLabel}>Confirm & Continue</Text>
                                        }
                                    </TouchableOpacity>

                                    <View style={{ flexDirection: 'row', justifyContent: 'center', gap: spacing.xxl, marginTop: spacing.sm }}>
                                        <TouchableOpacity onPress={() => signUp.verifications.sendEmailCode()}>
                                            <Text style={ghostLink}>Resend code</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => signUp.reset()}>
                                            <Text style={{ fontFamily: fonts.body, fontSize: fontSize.body, color: colors.textMuted }}>
                                                Start over
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            ) : (
                                <>
                                    {/* Name row */}
                                    <View style={{ flexDirection: 'row', gap: spacing.md }}>
                                        <View style={{ flex: 1 }}>
                                            <AppTextInput
                                                placeholder="First name"
                                                value={firstName}
                                                onChangeText={setFirstName}
                                                autoCapitalize="words"
                                            />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <AppTextInput
                                                placeholder="Last name"
                                                value={lastName}
                                                onChangeText={setLastName}
                                                autoCapitalize="words"
                                            />
                                        </View>
                                    </View>

                                    <AppTextInput
                                        placeholder="Email address"
                                        value={email}
                                        onChangeText={setEmail}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                    {errors.fields.emailAddress && (
                                        <Text style={errorTextStyle}>{errors.fields.emailAddress.message}</Text>
                                    )}

                                    <AppTextInput
                                        placeholder="Password"
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry
                                    />
                                    {errors.fields.password && (
                                        <Text style={errorTextStyle}>{errors.fields.password.message}</Text>
                                    )}

                                    <TouchableOpacity
                                        onPress={handleRegister}
                                        disabled={isLoading}
                                        style={primaryButton(isLoading)}
                                    >
                                        {isLoading
                                            ? <ActivityIndicator color={colors.surface} />
                                            : <Text style={primaryButtonLabel}>Create Account</Text>
                                        }
                                    </TouchableOpacity>

                                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: spacing.sm }}>
                                        <Text style={{ fontFamily: fonts.body, fontSize: fontSize.body, color: colors.textMuted }}>
                                            Already have an account?{' '}
                                        </Text>
                                        <Link href="/sign-in">
                                            <Text style={ghostLink}>Sign In</Text>
                                        </Link>
                                    </View>
                                    <View nativeID="clerk-captcha" />
                                </>
                            )}
                        </View>
                    </SafeAreaView>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

// ─── Shared local styles ──────────────────────────────────────────────────────
const primaryButton = (disabled: boolean) => ({
    height: 50,
    backgroundColor: disabled ? colors.brand + '80' : colors.brand,
    borderRadius: radius.md,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginTop: spacing.sm,
});

const primaryButtonLabel = {
    fontFamily: fonts.bodySB,
    fontSize: fontSize.bodyLg,
    color: colors.surface,
};

const ghostLink = {
    fontFamily: fonts.bodySB,
    fontSize: fontSize.body,
    color: colors.brand,
};

const errorTextStyle = {
    fontFamily: fonts.body,
    fontSize: fontSize.caption,
    color: colors.error,
    marginTop: -spacing.sm,
};
