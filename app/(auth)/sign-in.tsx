import { useSignIn } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator, Image, KeyboardAvoidingView,
    Platform, ScrollView, Text, TextInput, TouchableOpacity, View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
                        style={{ width: '100%', height: 400 }}
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
                        {/* Brand mark */}
                        <View style={{ marginBottom: 4 }}>
                            <Text style={{ color: C.green, fontSize: 11, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase' }}>
                                {needsVerification ? "Verification" : "Welcome back"}
                            </Text>
                            <Text style={{ color: C.white, fontSize: 26, fontWeight: '800', marginTop: 4 }}>
                                {needsVerification ? "Check your inbox" : "Sign in to Jiwar"}
                            </Text>
                            <Text style={{ color: C.muted, fontSize: 14, marginTop: 6 }}>
                                {needsVerification ? "Enter the code we just sent you" : "Find your dream home today."}
                            </Text>
                        </View>

                        {needsVerification ? (
                            <>
                                <AuthInput
                                    placeholder="6-digit code"
                                    value={verifyCode}
                                    onChangeText={setVerifyCode}
                                    keyboardType="number-pad"
                                    style={{ textAlign: 'center', letterSpacing: 10, fontSize: 22 }}
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
                                        : <Text style={{ color: C.white, fontWeight: '800', fontSize: 16 }}>Verify</Text>
                                    }
                                </TouchableOpacity>
                                <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 24, marginTop: 4 }}>
                                    <TouchableOpacity onPress={() => signIn.mfa.sendEmailCode()}>
                                        <Text style={{ color: C.green, fontSize: 14, fontWeight: '600' }}>Resend code</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => signIn.reset()}>
                                        <Text style={{ color: C.muted, fontSize: 14 }}>Start over</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        ) : (
                            <>
                                <AuthInput
                                    placeholder="Email address"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                />
                                {errors.fields.identifier && (
                                    <Text style={{ color: '#F87171', fontSize: 12, marginTop: -6 }}>{errors.fields.identifier.message}</Text>
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
                                    onPress={handleLogin}
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
                                        : <Text style={{ color: C.white, fontWeight: '800', fontSize: 16 }}>Sign In</Text>
                                    }
                                </TouchableOpacity>

                                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 6 }}>
                                    <Text style={{ color: C.muted, fontSize: 14 }}>Don't have an account? </Text>
                                    <Link href="/sign-up">
                                        <Text style={{ color: C.green, fontWeight: '700', fontSize: 14 }}>Sign Up</Text>
                                    </Link>
                                </View>
                            </>
                        )}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}