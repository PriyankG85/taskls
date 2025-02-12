import React from "react";
import { useRef, useEffect } from "react";
import { ViewProps } from "react-native";
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

    useEffect(() => {
      const listenerId = scrollY.addListener(({ value }) => {
        if (value < 0) {
          // Pulled down
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        } else if (value > 10) {
          // Scrolled up
          Animated.spring(translateY, {
            toValue: BOTTOM_TAB_HEIGHT + insets.bottom + bottomSpace,
            useNativeDriver: true,
          }).start();
        }
      });

      return () => {
        scrollY.removeListener(listenerId);
      };
    }, [scrollY, translateY, insets.bottom]);

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
        className="absolute left-5 right-5 flex-row items-center justify-around rounded-3xl border border-outline-100 bg-background-dark dark:bg-background-muted px-4 py-2 dark:shadow-white shadow-black shadow-lg elevation-md"
        {...props}
      >
        {children}
      </Animated.View>
    );
  }
);

FloatingBottomTabs.displayName = "FloatingBottomTabs";

export default FloatingBottomTabs;
