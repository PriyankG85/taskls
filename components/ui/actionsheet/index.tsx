"use client";

import type React from "react";
import { useEffect } from "react";
import {
  View,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  useWindowDimensions,
  Pressable,
  ScrollView,
  Text,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolate,
  runOnJS,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";
import {
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import swipeModalGesture from "@/utils/swipeModalGesture";
import { Icon } from "../icon";
import { LucideIcon, X } from "lucide-react-native";

interface ActionsheetProps {
  isVisible: boolean;
  onClose: () => void;
  className?: string;
  children: React.ReactNode;
  headerIcon?: LucideIcon;
  headerText?: string;
}

export default function Actionsheet({
  headerText,
  headerIcon,
  children,
  className,
  onClose,
  isVisible,
  ...props
}: ActionsheetProps) {
  const dark = useColorScheme().colorScheme === "dark";
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(height);

  useEffect(() => {
    if (isVisible) {
      opacity.value = withTiming(1, {
        duration: 300,
        easing: Easing.out(Easing.ease),
      });
      translateY.value = withTiming(0, {
        duration: 400,
        easing: Easing.out(Easing.ease),
      });
    } else {
      opacity.value = withTiming(0, {
        duration: 300,
        easing: Easing.in(Easing.ease),
      });
      translateY.value = withTiming(height, {
        duration: 400,
        easing: Easing.in(Easing.ease),
      });
    }
  }, [isVisible, height, opacity, translateY]);

  const overlayStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const modalStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      opacity: interpolate(
        translateY.value,
        [height, height / 2, 0],
        [0, 0.5, 1]
      ),
    };
  });

  const handleClose = () => {
    opacity.value = withTiming(0, {
      duration: 300,
      easing: Easing.in(Easing.ease),
    });
    translateY.value = withTiming(
      height,
      { duration: 400, easing: Easing.in(Easing.ease) },
      (finished) => {
        // Only call onClose after animation completes
        if (finished) runOnJS(onClose)();
      }
    );
  };

  const panGesture = swipeModalGesture(translateY, height, handleClose);

  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        zIndex: isVisible ? 1000 : -1,
      }}
    >
      <Modal
        transparent
        visible={isVisible}
        animationType="none"
        onRequestClose={handleClose}
        statusBarTranslucent
        {...props}
      >
        <GestureHandlerRootView>
          <View className="flex-1 justify-end">
            <TouchableWithoutFeedback onPress={handleClose}>
              <Animated.View
                style={[
                  {
                    ...StyleSheet.absoluteFillObject,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                  },
                  overlayStyle,
                ]}
              />
            </TouchableWithoutFeedback>

            <GestureDetector gesture={panGesture}>
              <Animated.View
                style={[
                  modalStyle,
                  { paddingBottom: insets.bottom > 0 ? insets.bottom : 16 },
                ]}
                className={
                  `rounded-t-[2rem] shadow-lg overflow-hidden bg-background-0/95 max-h-[75%] ` +
                  className
                }
              >
                <View className="self-center w-12 h-1 mt-2 rounded-full bg-outline-200" />

                <View
                  className={`flex-row justify-between items-center px-7 py-4 border-b border-outline-200`}
                >
                  <View className="flex-row items-center gap-3">
                    {headerIcon && (
                      <Icon
                        as={headerIcon}
                        size={"md"}
                        color={dark ? "#FBFBFB" : "#333"}
                      />
                    )}
                    <Text
                      className={`font-Metamorphous text-xl text-typography-950`}
                    >
                      {headerText}
                    </Text>
                  </View>
                  <Pressable
                    android_ripple={{
                      color: dark ? "#e0e0e010" : "#5c5c5c10",
                      radius: 20,
                      foreground: true,
                    }}
                    onPress={handleClose}
                    className="p-2"
                    accessibilityLabel="Close filter dialog"
                    accessibilityRole="button"
                  >
                    <X size={24} color={dark ? "#FBFBFB70" : "#33333370"} />
                  </Pressable>
                </View>

                <ScrollView
                  className="p-4"
                  contentContainerClassName="gap-6 py-4"
                >
                  {children}
                </ScrollView>
              </Animated.View>
            </GestureDetector>
          </View>
        </GestureHandlerRootView>
      </Modal>
    </View>
  );
}
