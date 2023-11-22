import { Tabs } from "expo-router/tabs";
import React = require("react");
import { HomeIcon, UserIcon, MessageSquareIcon } from "lucide-react-native";
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
        name="messages"
        options={{
          title: "Messages",
          tabBarIcon({ color, size }) {
            return <MessageSquareIcon color={color} size={size} />;
          },
        }}
      />
    </Tabs>
  );
}
