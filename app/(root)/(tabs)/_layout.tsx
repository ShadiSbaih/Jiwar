import { userUserStore } from "@/store/userStore";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ACTIVE_COLOR = "#F5A623";
const INACTIVE_COLOR = "#9CA3AF";

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
        <Label>Favorites</Label>
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
  //   const isAdmin = userUserStore((state) => state.isAdmin);
  const insets = useSafeAreaInsets();
  const isAdmin = userUserStore((state) => state.isAdmin);
  console.log("is admin?:"+isAdmin)

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: ACTIVE_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,
        tabBarStyle: {
          backgroundColor: "#1C1C2E",
          borderTopWidth: 0,
          height: 60 + insets.bottom,
          paddingTop: 8,
          paddingBottom: 10 + insets.bottom,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "search" : "search-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "heart" : "heart-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: "Add",
          href: isAdmin ? undefined : null,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "add-circle" : "add-circle-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  return Platform.OS === "ios" ? <IOSTabLayout /> : <AndroidTabLayout />;
}
