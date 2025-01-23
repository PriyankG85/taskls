import { router, Tabs } from "expo-router";
import { View } from "react-native";
import {
  Bolt,
  CalendarDays,
  CheckCheck,
  Home,
  Plus,
} from "lucide-react-native";
import { Fab, FabIcon } from "@/components/ui/fab";
import { useColorScheme } from "nativewind";
import {
  Menu,
  MenuItem,
  MenuItemLabel,
  MenuSeparator,
} from "@/components/ui/menu";
import { useState } from "react";
import NewTaskGroup from "@/components/global/newTaskGroup";

const RootLayout = () => {
  const dark = useColorScheme().colorScheme === "dark";
  const [showModal, setShowModal] = useState(false);

  return (
    <View className="flex-1 dark:bg-dark-bg-100 bg-light-bg-100">
      <Tabs
        screenOptions={{
          tabBarHideOnKeyboard: true,
          tabBarActiveTintColor: dark ? "#e0e0e0" : "#000",
          tabBarInactiveTintColor: dark ? "#e0e0e070" : "#33333370",
          tabBarStyle: {
            borderWidth: 1,
            borderColor: dark ? "#29293e" : "#b4bfcc",
            backgroundColor: dark ? "#29293e" : "#b4bfcc",
            margin: 16,
            display: "flex",
            paddingTop: 10,
            height: 60,
            borderTopWidth: 0,
            borderRadius: 28,
            position: "relative",
          },
          headerShown: false,
          tabBarShowLabel: false,
          animation: "shift",
          transitionSpec: {
            animation: "spring",
            config: {
              stiffness: 1000,
              damping: 50,
              mass: 3,
              overshootClamping: true,
              restDisplacementThreshold: 0.01,
              restSpeedThreshold: 0.01,
            },
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ color }) => <Home color={color} />,
          }}
        />
        <Tabs.Screen
          name="todaysTasks"
          options={{
            tabBarIcon: ({ color }) => <CalendarDays color={color} />,
          }}
        />
        <Tabs.Screen
          name="completed"
          options={{
            tabBarIcon: ({ color }) => <CheckCheck color={color} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            tabBarIcon: ({ color }) => <Bolt color={color} />,
          }}
        />
      </Tabs>

      <Menu
        placement="top"
        offset={5}
        trigger={({ ...triggerProps }) => (
          <Fab
            placement="bottom right"
            size="lg"
            className="bg-primary-500 hover:bg-primary-600 active:bg-primary-700 bottom-safe-offset-[6.5rem] right-6 shadow-lg"
            {...triggerProps}
          >
            <FabIcon as={Plus} size={"xl"} />
          </Fab>
        )}
        className={"bg-background-700 rounded-xl right-5"}
      >
        <MenuItem
          textValue="New Task"
          key={"New Task"}
          className="active:bg-background-600"
          onPress={() => router.push("/addTask")}
        >
          <MenuItemLabel size="lg" className="text-typography-0 font-roboto">
            New Task
          </MenuItemLabel>
        </MenuItem>
        <MenuSeparator />
        <MenuItem
          textValue="New List"
          key={"New List"}
          className="active:bg-background-600"
          onPress={() => setShowModal(true)}
        >
          <MenuItemLabel size="lg" className="text-typography-0 font-roboto">
            New List
          </MenuItemLabel>
        </MenuItem>
      </Menu>

      <NewTaskGroup visible={showModal} setVisible={setShowModal} />
    </View>
  );
};

export default RootLayout;
