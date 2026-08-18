import { useSignIn } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator, Image, KeyboardAvoidingView,
    Platform, ScrollView, Text, TouchableOpacity, View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import OTPInput from "../../components/OTPInput";
import { AppTextInput } from "../../components/DesignSystem";
import { colors, fonts, fontSize, radius, spacing } from "../../constants/theme";

export default function SignInScreen() {
    const { signIn, errors, fetchStatus } = useSignIn();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [verifyCode, setVerifyCode] = useState("");

    const isLoading = fetchStatus === "fetching";

    const goToApp = ({ session, decorateUrl }: any) => {
        if (session?.currentTask) return;
        router.replace(decorateUrl("/") as any);
    };

    const handleLogin = async () => {
        const { error } = await signIn.password({ emailAddress: email, password });
        if (error) return;
        if (signIn.status === "complete") {
            await signIn.finalize({ navigate: goToApp });
        } else if (signIn.status === "needs_second_factor") {
            await signIn.mfa.sendPhoneCode();
        } else if (signIn.status === "needs_client_trust") {
            const emailFactor = signIn.supportedSecondFactors.find((f) => f.strategy === "email_code");
            if (emailFactor) await signIn.mfa.sendEmailCode();
        }
    };

    const handleVerifyCode = async () => {
        await signIn.mfa.verifyEmailCode({ code: verifyCode });
        if (signIn.status === "complete") {
            await signIn.finalize({ navigate: goToApp });
        }
    };

    const needsVerification = signIn.status === "needs_client_trust";

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
                    {/* ── Hero image — top portion ── */}
                    <View style={{ position: 'relative', height: 320 }}>
                        <Image
                            source={require("../../assets/images/onboarding.png")}
                            style={{ width: '100%', height: 320 }}
                            resizeMode="cover"
                        />
                        {/* Very subtle bottom fade */}
                        <View style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: 80,
                            backgroundColor: 'transparent',
                        }} />
                    </View>

                    {/* ── Form area — ivory, NOT dark panel ── */}
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
                            {/* Jiwar wordmark */}
                            <Text style={{
                                fontFamily: fonts.displaySB,
                                fontSize: fontSize.h3,
                                color: colors.brand,
                                letterSpacing: -0.3,
                            }}>
                                Jiwar
                            </Text>

                            {/* Welcome heading */}
                            <View style={{ gap: spacing.xs, marginBottom: spacing.sm }}>
                                <Text style={{
                                    fontFamily: fonts.displayI,
                                    fontSize: fontSize.h1,
                                    color: colors.textPrimary,
                                    lineHeight: lineHeight(fontSize.h1),
                                }}>
                                    {needsVerification ? "Check your inbox" : "Welcome back."}
                                </Text>
                                <Text style={{
                                    fontFamily: fonts.body,
                                    fontSize: fontSize.body,
                                    color: colors.textMuted,
                                    lineHeight: 22,
                                }}>
                                    {needsVerification
                                        ? "Enter the six-digit code we sent to your email."
                                        : "Find your next home with confidence."}
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
                                            : <Text style={primaryButtonLabel}>Verify</Text>
                                        }
                                    </TouchableOpacity>

                                    <View style={{ flexDirection: 'row', justifyContent: 'center', gap: spacing.xxl, marginTop: spacing.sm }}>
                                        <TouchableOpacity onPress={() => signIn.mfa.sendEmailCode()}>
                                            <Text style={ghostLink}>Resend code</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => signIn.reset()}>
                                            <Text style={{ fontFamily: fonts.body, fontSize: fontSize.body, color: colors.textMuted }}>
                                                Start over
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            ) : (
                                <>
                                    <AppTextInput
                                        placeholder="Email address"
                                        value={email}
                                        onChangeText={setEmail}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                    {errors.fields.identifier && (
                                        <Text style={errorTextStyle}>{errors.fields.identifier.message}</Text>
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
                                        onPress={handleLogin}
                                        disabled={isLoading}
                                        style={primaryButton(isLoading)}
                                    >
                                        {isLoading
                                            ? <ActivityIndicator color={colors.surface} />
                                            : <Text style={primaryButtonLabel}>Sign In</Text>
                                        }
                                    </TouchableOpacity>

                                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: spacing.sm }}>
                                        <Text style={{ fontFamily: fonts.body, fontSize: fontSize.body, color: colors.textMuted }}>
                                            Don't have an account?{' '}
                                        </Text>
                                        <Link href="/sign-up">
                                            <Text style={ghostLink}>Sign Up</Text>
                                        </Link>
                                    </View>
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
const lineHeight = (fs: number) => Math.round(fs * 1.3);

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