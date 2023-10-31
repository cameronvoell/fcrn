import { Tabs } from "expo-router/tabs";
import { HomeIcon, UserIcon } from "lucide-react-native";
export default function AppLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Feeds",
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
    </Tabs>
  );
}
