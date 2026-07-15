import { useUserSync } from "@/hooks/useUserSync";
import { useAuth } from "@clerk/expo";
import { Redirect, Stack } from "expo-router";
import React from "react";
import { ActivityIndicator, View } from "react-native";

export default function RootLayout() {
  const { isSignedIn, isLoaded } = useAuth();
  // Sync user data with supabase
  const { isSyncing } = useUserSync();

  if (!isLoaded || isSyncing) {
    return (
      <View style={{ flex: 1, backgroundColor: "#08383C", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#4ADE80" />
      </View>
    );
  }

  if (!isSignedIn) {
    return <Redirect href={"/(auth)/sign-in"} />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
