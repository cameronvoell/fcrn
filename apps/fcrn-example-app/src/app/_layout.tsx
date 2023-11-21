import { Tabs } from "expo-router/tabs";
import React = require("react");
import { HomeIcon, UserIcon, KeyIcon } from "lucide-react-native";
export default function AppLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Feeds",
          headerShown: false,
          tabBarIcon({ color, size }) {
            return <HomeIcon color={color} size={size} />;
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon({ color, size }) {
            return <UserIcon color={color} size={size} />;
          },
        }}
      />
      <Tabs.Screen
        name="connect-warpcast"
        options={{
          title: "Connect Account",
          tabBarIcon({ color, size }) {
            return <KeyIcon color={color} size={size} />;
          },
        }}
      />
    </Tabs>
  );
}
