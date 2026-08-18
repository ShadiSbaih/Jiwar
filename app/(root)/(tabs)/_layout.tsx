import { userUserStore } from "@/store/userStore";
import { colors, fonts, fontSize, heights, spacing } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Desert Minimal navigation colors
const ACTIVE_COLOR = colors.brand;      // Olive
const INACTIVE_COLOR = colors.textMuted; // Stone

export function IOSTabLayout() {
  const isAdmin = userUserStore((state) => state.isAdmin);

  return (
    <NativeTabs tintColor={ACTIVE_COLOR}>
      <NativeTabs.Trigger name="index">
        <Label>Home</Label>
        <Icon sf="house.fill" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="explore">
        <Icon sf="magnifyingglass" />
        <Label>Explore</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="favorites">
        <Icon sf="heart.fill" />
        <Label>Saved</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <Icon sf="person.fill" />
        <Label>Profile</Label>
      </NativeTabs.Trigger>
      {isAdmin && (
        <NativeTabs.Trigger name="add">
          <Icon sf="plus.circle.fill" />
          <Label>Add</Label>
        </NativeTabs.Trigger>
      )}
    </NativeTabs>
  );
}

function AndroidTabLayout() {
  const insets = useSafeAreaInsets();
  const isAdmin = userUserStore((state) => state.isAdmin);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        animation: "fade",
        tabBarActiveTintColor: ACTIVE_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height: heights.navBar + insets.bottom,
          paddingTop: spacing.sm,
          paddingBottom: spacing.sm + insets.bottom,
          // No heavy shadows — subtle border does the separation
          shadowColor: colors.textPrimary,
          shadowOffset: { width: 0, height: -1 },
          shadowOpacity: 0.04,
          shadowRadius: 4,
          elevation: 4,
        },
        tabBarLabelStyle: {
          fontFamily: fonts.bodyM,
          fontSize: fontSize.micro,
          letterSpacing: 0.2,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} color={color} size={22} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "search" : "search-outline"} color={color} size={22} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Saved",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "heart" : "heart-outline"} color={color} size={22} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "person" : "person-outline"} color={color} size={22} />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: "Add",
          href: isAdmin ? undefined : null,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "add-circle" : "add-circle-outline"} color={color} size={22} />
          ),
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  return Platform.OS === "ios" ? <IOSTabLayout /> : <AndroidTabLayout />;
}
