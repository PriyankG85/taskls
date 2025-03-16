import { Pressable, Platform } from "react-native";
import React from "react";
import Animated, {
  withTiming,
  useAnimatedStyle,
  runOnJS,
  useSharedValue,
} from "react-native-reanimated";
import { CheckIcon } from "lucide-react-native";
import { useColorScheme } from "nativewind";

const CheckBox = ({
  size = 24,
  checked,
  setChecked,
}: {
  size?: number;
  checked: boolean;
  setChecked: (val: boolean) => void;
}) => {
  const dark = useColorScheme().colorScheme === "dark";

  // Animation progress value
  const animationProgress = useSharedValue(checked ? 1 : 0);

  // Handle press manually
  const handlePress = () => {
    // Start animation
    animationProgress.value = withTiming(
      checked ? 0 : 1,
      { duration: 200 },
      (finished) => {
        if (finished) {
          // Only update state after animation completes
          runOnJS(setChecked)(!checked);
        }
      }
    );
  };

  // Animated styles based on progress
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: animationProgress.value,
    transform: [
      {
        scale: 0.8 + 0.2 * animationProgress.value,
      },
    ],
  }));

  const tintColor = Platform.select({
    ios: dark ? "#0A84FF" : "#007AFF",
    android: dark ? "#6750A4" : "#6200EE",
  });

  return (
    <Pressable
      style={[
        {
          width: size,
          height: size,
          borderRadius: 4,
          borderWidth: 2,
          borderColor: checked ? tintColor : dark ? "#666" : "#999",
          backgroundColor: checked ? tintColor : "transparent",
        },
      ]}
      onPress={handlePress}
    >
      <Animated.View
        style={[
          { flex: 1, justifyContent: "center", alignItems: "center" },
          animatedStyle,
        ]}
      >
        <CheckIcon color="#fff" strokeWidth={3} size={size * 0.75} />
      </Animated.View>
    </Pressable>
  );
};

export default CheckBox;
