import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

import { useAppTheme } from "../../lib/theme";

export default function TabsLayout() {
  const colors = useAppTheme();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.secondaryText,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          height: 86,
          paddingTop: 10,
          paddingBottom: 14
        },
        tabBarLabelStyle: {
          fontFamily: "Atkinson Hyperlegible Next",
          fontSize: 12,
          fontWeight: "600"
        },
        tabBarIcon: ({ color, size, focused }) => {
          const nameByRoute: Record<string, keyof typeof MaterialIcons.glyphMap> = {
            home: "home",
            gestures: "gesture",
            devices: "precision-manufacturing",
            notifications: "notifications",
            profile: "person"
          };
          const iconName = nameByRoute[route.name] ?? "circle";
          return <MaterialIcons name={iconName as any} size={focused ? size + 2 : size} color={color as any} />;
        }
      })}
    >
      <Tabs.Screen 
        name="home" 
        options={{ 
          title: "Home" 
        }} 
      />
      <Tabs.Screen 
        name="devices" 
        options={{ 
          title: "Devices"
        }} 
      />
      <Tabs.Screen 
        name="gestures" 
        options={{ 
          title: "Gestures"
        }} 
      />
      <Tabs.Screen 
        name="notifications" 
        options={{ 
          title: "Notifications"
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: "Profile" 
        }} 
      />
      {/* Hide the scans tab completely from tab bar in both states */}
      <Tabs.Screen 
        name="scans" 
        options={{ 
          title: "Scans",
          href: null
        }} 
      />
    </Tabs>
  );
}
