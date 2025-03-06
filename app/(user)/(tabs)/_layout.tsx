import { Href, router, useSegments } from "expo-router";
import { Icon } from "@/components/ui/icon";
import { Animated, Pressable, View } from "react-native";
import {
  Bolt,
  CalendarDays,
  CheckCheck,
  Home,
  LucideIcon,
} from "lucide-react-native";
import React, { Suspense, useRef, useState } from "react";
import FloatingBottomTabs from "@/components/tabs/FloatingBottomTabs";
import { Tabs } from "expo-router";
import LoadingIndicator from "@/components/global/LoadingIndicator";
import ScrollYContext from "@/context/scrollY";
import { useColorScheme } from "nativewind";

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
  const dark = useColorScheme().colorScheme === "dark";

  const scrollY = useRef(new Animated.Value(0)).current;
  const segments = useSegments();

  const [activeIndex, setActiveIndex] = useState(0);

  // Determine the active tab index.
  React.useEffect(() => {
    setActiveIndex(
      tabs.findIndex((tab) => tab.name === segments[segments.length - 1])
    );
  }, [segments]);

  return (
    <Suspense fallback={<LoadingIndicator />}>
      <View className="flex-1">
        <ScrollYContext.Provider value={scrollY}>
          <Tabs
            tabBar={() => (
              <FloatingBottomTabs scrollY={scrollY} bottomSpace={16}>
                {tabs.map((tab, index) => (
                  <Pressable
                    key={tab.name}
                    onPress={() => {
                      router.push(tab.href);
                    }}
                    className="flex items-center justify-center p-3"
                  >
                    <Icon
                      as={tab.icon}
                      color={
                        dark
                          ? activeIndex === index
                            ? "#fff"
                            : "#ffffff50"
                          : activeIndex === index
                          ? "#000"
                          : "#00000050"
                      }
                      size={"xl"}
                    />
                  </Pressable>
                ))}
              </FloatingBottomTabs>
            )}
            screenOptions={{
              headerShown: false,
              tabBarShowLabel: false,
              sceneStyle: {
                backgroundColor: "transparent",
              },
              animation: "shift",
              transitionSpec: {
                animation: "spring",
                config: {
                  stiffness: 100,
                  damping: 50,
                },
              },
            }}
          >
            {tabs.map((tab) => (
              <Tabs.Screen
                key={tab.name}
                name={tab.name === "(tabs)" ? "index" : tab.name}
                initialParams={{ scrollY }}
              />
            ))}
          </Tabs>
        </ScrollYContext.Provider>
      </View>
    </Suspense>
  );
};

export default RootLayout;
