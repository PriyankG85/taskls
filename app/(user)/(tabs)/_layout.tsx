import { Href, router, useSegments } from "expo-router";
import { Icon } from "@/components/ui/icon";
import { Animated, Pressable, View } from "react-native";
import {
  Bolt,
  CalendarDays,
  CheckCheck,
  Home,
  LucideIcon,
  Plus,
} from "lucide-react-native";
import { Fab, FabIcon } from "@/components/ui/fab";
import {
  Menu,
  MenuItem,
  MenuItemLabel,
  MenuSeparator,
} from "@/components/ui/menu";
import React, { useRef, useState } from "react";
import NewTaskGroup from "@/components/global/newTaskGroup";
import FloatingBottomTabs from "@/components/tabs/FloatingBottomTabs";
import { Tabs as DefaultTabsUI } from "expo-router";
import { ScrollView } from "react-native";

type TabsProps = {
  name: string;
  href: Href;
  icon: LucideIcon;
}[];

const tabs: TabsProps = [
  {
    name: "(tabs)",
    href: "/(user)/(tabs)",
    icon: Home,
  },
  {
    name: "todaysTasks",
    href: "/todaysTasks",
    icon: CalendarDays,
  },
  {
    name: "completed",
    href: "/completed",
    icon: CheckCheck,
  },
  {
    name: "settings",
    href: "/settings",
    icon: Bolt,
  },
];

const RootLayout = () => {
  const [showModal, setShowModal] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const segments = useSegments();

  // Determine the active tab index.
  const activeIndex = tabs.findIndex(
    (tab) => tab.name === segments[segments.length - 1]
  );

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: true }
      )}
      scrollEventThrottle={16}
      className="flex-1 dark:bg-dark-bg-100 bg-light-bg-100"
    >
      <DefaultTabsUI
        tabBar={() => (
          <FloatingBottomTabs scrollY={scrollY} bottomSpace={16}>
            {tabs.map((tab, index) => (
              <Pressable
                key={tab.name}
                onPress={() => {
                  router.push(tab.href);
                }}
                className="flex items-center justify-center p-2.5"
              >
                <Icon
                  as={tab.icon}
                  color={activeIndex === index ? "#fff" : "#ffffff50"}
                  size={"xl"}
                />
              </Pressable>
            ))}
          </FloatingBottomTabs>
        )}
        screenOptions={{
          tabBarHideOnKeyboard: true,
          tabBarActiveTintColor: "#e0e0e0",
          tabBarInactiveTintColor: "#e0e0e070",
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
          sceneStyle: {
            backgroundColor: "transparent",
          },
        }}
      >
        {tabs.map((tab) => (
          <DefaultTabsUI.Screen
            key={tab.name}
            name={tab.name === "(tabs)" ? "index" : tab.name}
          />
        ))}
      </DefaultTabsUI>

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
    </ScrollView>
  );
};

export default RootLayout;
