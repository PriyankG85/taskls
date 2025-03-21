import React from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Circle, Ellipse, Path } from "react-native-svg";
import { SafeAreaView } from "react-native-safe-area-context";

interface GlassmorphicBackgroundProps {
  children: React.ReactNode;
  style?: ViewStyle;
  className?: string;
  gradientColors?: string[];
  showShapes?: boolean;
}

const GlassmorphicBackground: React.FC<GlassmorphicBackgroundProps> = ({
  children,
  style,
  className,
  gradientColors = ["#7A8CA0", "#5A7A9A", "#3D5A80"],
  showShapes = true,
}) => {
  return (
    <SafeAreaView
      style={[
        style,
        {
          overflow: "hidden",
        },
      ]}
      className={className}
    >
      <LinearGradient
        // @ts-ignore
        colors={gradientColors}
        style={StyleSheet.absoluteFillObject}
      >
        {/* background shapes */}
        {showShapes && (
          <Svg height="100%" width="100%" style={StyleSheet.absoluteFillObject}>
            <Circle cx="10%" cy="10%" r="50" fill="rgba(255, 255, 255, 0.03)" />
            <Ellipse
              cx="80%"
              cy="20%"
              rx="70"
              ry="40"
              fill="rgba(255, 255, 255, 0.03)"
            />
            <Path
              d="M50,50 Q100,25 150,50 T250,50"
              fill="none"
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="2"
            />
            <Circle cx="70%" cy="80%" r="30" fill="rgba(255, 255, 255, 0.03)" />
          </Svg>
        )}
      </LinearGradient>
      {children}
    </SafeAreaView>
  );
};

export default GlassmorphicBackground;
