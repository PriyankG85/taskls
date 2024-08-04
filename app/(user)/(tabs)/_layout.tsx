import { Tabs } from "expo-router";
import { View, useColorScheme } from "react-native";
import {
  Bolt,
  CalendarDays,
  CheckCheck,
  Home,
  Plus,
} from "lucide-react-native";

const RootLayout = () => {
  const dark = useColorScheme() === "dark";

  return (
    <View className={`flex-1 ${dark ? "bg-dark-bg-100" : "bg-light-bg-100"}`}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: dark ? "#e0e0e0" : "#333333",
          tabBarInactiveTintColor: dark ? "#e0e0e070" : "#33333370",
          tabBarStyle: {
            backgroundColor: dark ? "#424057" : "#b4bfcc",
            paddingTop: 10,
            paddingBottom: 15,
            height: 70,
            borderTopWidth: 0,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            position: "relative",
          },
          headerShown: false,
          tabBarShowLabel: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ color }) => <Home size={28} color={color} />,
          }}
        />
        <Tabs.Screen
          name="todaysTasks"
          options={{
            tabBarIcon: ({ color }) => <CalendarDays size={28} color={color} />,
          }}
        />
        <Tabs.Screen
          name="addTask"
          options={{
            tabBarIcon: ({ color }) => (
              <View
                className={`absolute bottom-7 ${
                  dark
                    ? "bg-dark-accent-100 border-4 border-dark-bg-300"
                    : "bg-light-accent-100 border-light-bg-300"
                } rounded-full p-2 shadow-lg shadow-black/50`}
              >
                <Plus size={32} color={color} />
              </View>
            ),
            tabBarStyle: { display: "none" },
            tabBarActiveTintColor: "#e0e0e0",
            tabBarInactiveTintColor: "#e0e0e070",
          }}
        />
        <Tabs.Screen
          name="completed"
          options={{
            tabBarIcon: ({ color }) => <CheckCheck size={28} color={color} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            tabBarIcon: ({ color }) => <Bolt size={28} color={color} />,
          }}
        />
      </Tabs>
    </View>
  );
};

export default RootLayout;
