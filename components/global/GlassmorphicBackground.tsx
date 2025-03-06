import React from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import Svg, { Circle, Ellipse, Path } from "react-native-svg";
import { SafeAreaView } from "react-native-safe-area-context";

interface GlassmorphicBackgroundProps {
  children: React.ReactNode;
  style?: ViewStyle;
  className?: string;
  blurIntensity?: number;
  gradientColors?: string[];
  showShapes?: boolean;
}

const GlassmorphicBackground: React.FC<GlassmorphicBackgroundProps> = ({
  children,
  style,
  className,
  blurIntensity = 50,
  gradientColors = ["#4c669f", "#3b5998", "#192f6a"],
  showShapes,
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
            <Circle cx="10%" cy="10%" r="50" fill="rgba(255, 255, 255, 0.1)" />
            <Ellipse
              cx="80%"
              cy="20%"
              rx="70"
              ry="40"
              fill="rgba(255, 255, 255, 0.1)"
            />
            <Path
              d="M50,50 Q100,25 150,50 T250,50"
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="2"
            />
            <Circle cx="70%" cy="80%" r="30" fill="rgba(255, 255, 255, 0.1)" />
          </Svg>
        )}
      </LinearGradient>
      <BlurView intensity={blurIntensity} style={StyleSheet.absoluteFillObject}>
        {children}
      </BlurView>
    </SafeAreaView>
  );
};

export default GlassmorphicBackground;
