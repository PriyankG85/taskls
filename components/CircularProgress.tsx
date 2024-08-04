import { useEffect } from "react";
import { View, Text } from "react-native";
import Animated, {
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Circle, Svg } from "react-native-svg";

const CircularProgress = ({
  progress,
  circleColor,
  strokeColor,
  size,
  strokeWidth,
}: {
  progress: number;
  circleColor: string;
  strokeColor: string;
  size: number;
  strokeWidth: number;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const currentProgress = useSharedValue(0);
  const strokeDashOffsetAnimation = useDerivedValue(
    () => circumference * (1 - currentProgress.value)
  );
  const AnimatedCircle = Animated.createAnimatedComponent(Circle);

  useEffect(() => {
    currentProgress.value = withTiming(progress, { duration: 500 });
  }, [progress]);

  return (
    <Animated.View style={{ width: size, height: size }}>
      <Svg>
        <Circle
          stroke={circleColor}
          strokeWidth={strokeWidth}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill={"none"}
          strokeDasharray={circumference}
        />
        <AnimatedCircle
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill={"none"}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashOffsetAnimation}
          transform={`rotate(-90, ${size / 2}, ${size / 2})`}
        />
      </Svg>

      <View className="absolute justify-center items-center w-full h-full">
        <Text style={{ fontSize: size / 4, color: strokeColor }}>
          {progress * 100}%
        </Text>
      </View>
    </Animated.View>
  );
};

export default CircularProgress;
