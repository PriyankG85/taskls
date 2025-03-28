import { router } from "expo-router";
import React, { useCallback } from "react";
import { useRef, useEffect } from "react";
import { BackHandler, View, ViewProps } from "react-native";
import { Animated } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BOTTOM_TAB_HEIGHT = 60;

export type FloatingBottomTabsProps = ViewProps & {
  scrollY: Animated.Value;
  children: React.ReactNode;
  bottomSpace?: number;
};

const FloatingBottomTabs = React.forwardRef<
  React.ElementRef<typeof Animated.View>,
  FloatingBottomTabsProps
>(
  (
    { scrollY, children, bottomSpace = 0, ...props }: FloatingBottomTabsProps,
    ref
  ) => {
    const insets = useSafeAreaInsets();
    const translateY = useRef(new Animated.Value(0)).current;

    // Add state to track last scroll position for direction detection
    const lastScrollY = useRef(0);

    const showTabs = useCallback(() => {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        speed: 44,
        bounciness: 0,
      }).start();
    }, []);

    const hideTabs = useCallback(() => {
      Animated.spring(translateY, {
        toValue: BOTTOM_TAB_HEIGHT + insets.bottom + bottomSpace,
        useNativeDriver: true,
        speed: 44,
        bounciness: 0,
      }).start();
    }, [])

    useEffect(() => {
      const listenerId = scrollY.addListener(({ value }) => {
        // Check if scrolling up or down by comparing with last position
        const isScrollingDown = value > lastScrollY.current;
        lastScrollY.current = value;

        if (value < 0) {
          // Pulled down (overscroll), always show tabs
          showTabs();
        } else if (isScrollingDown && value > 10) {
          // Scrolling DOWN, hide the tabs
          hideTabs();
        } else if (!isScrollingDown) {
          // Scrolling UP, show the tabs
          showTabs();
        }
      });

      return () => {
        scrollY.removeListener(listenerId);
      };
    }, [scrollY, translateY, insets.bottom, bottomSpace]);

    // Handle back button press to show tabs if hidden
    useEffect(() => {
      const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
        if (lastScrollY.current > 0) {
          showTabs();
          return undefined;
        }
      });

      return () => backHandler.remove();
    }, []);

    return (
      <Animated.View
        ref={ref}
        style={[
          {
            height: BOTTOM_TAB_HEIGHT,
          },
          {
            bottom: insets.bottom + bottomSpace,
            transform: [{ translateY }],
          },
        ]}
        className="absolute w-fit self-center justify-center z-50 dark:shadow-white shadow-black shadow-lg elevation-md rounded-3xl"
        {...props}
      >
        <View className="flex-row items-center justify-around rounded-3xl border border-outline-100 bg-background-muted dark:bg-background-muted px-4 py-2 gap-7">
          {children}
        </View>
      </Animated.View>
    );
  }
);

FloatingBottomTabs.displayName = "FloatingBottomTabs";

export default FloatingBottomTabs;
