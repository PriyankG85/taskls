"use client";

import GlassmorphicBackground from "@/components/global/GlassmorphicBackground";
import { Box } from "@/components/ui/box";
import { Input, InputField } from "@/components/ui/input";
import UserContext from "@/context/userdetails";
import { setDataToLocalStorage } from "@/hooks/useHandleLocalStorage";
import { Image } from "expo-image";
import { router } from "expo-router";
import { cssInterop } from "nativewind";
import React, { useContext, useState } from "react";
import { useColorScheme } from "react-native";
import { Pressable, Text, View } from "react-native";
import Animated, {
  withTiming,
  withSequence,
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

cssInterop(Image, { className: "style" });

const Start = () => {
  const dark = useColorScheme() === "dark";
  const { setName: setNameInContext } = useContext(UserContext);
  const [name, setName] = useState("");
  const [warning, setWarning] = useState(false);
  const translateX = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { scale: withTiming(warning ? 0.95 : 1, { duration: 300 }) },
      ],
    };
  });

  const handleSetup = () => {
    if (name === "") {
      setWarning(true);
      // shake animation
      translateX.value = withSequence(
        withTiming(10, { duration: 100 }),
        withTiming(-10, { duration: 100 }),
        withTiming(10, { duration: 100 }),
        withTiming(-10, { duration: 100 })
      );
    } else {
      setNameInContext(name);
      setDataToLocalStorage("name", name);
      const defaultTaskGroups = [
        {
          name: "Daily Work",
          img: "https://img.icons8.com/color/96/today.png",
        },
        {
          name: "Learning",
          img: "https://img.icons8.com/color/96/learning.png",
        },
      ];
      setDataToLocalStorage("taskGroups", JSON.stringify(defaultTaskGroups));
      router.push("/(user)/(tabs)");
    }
  };

  return (
    <GlassmorphicBackground
      className="flex-1"
      gradientColors={
        dark
          ? ["#1A1A2E", "#16213E", "#0F3460"]
          : ["#7A8CA0", "#5A7A9A", "#3D5A80"]
      }
    >
      <Box className="flex-1 items-center pt-[13vh] gap-14 font-Quattrocento">
        <View
          style={animatedStyle}
          className="w-full h-[40%] items-center justify-center"
        >
          <Image
            source={require("@/assets/images/tasks-illustration.webp")}
            alt="tasks-illustration"
            contentFit="contain"
            className="size-full"
          />
        </View>

        <View className="items-center">
          <Text className="text-3xl text-typography-white font-Metamorphous leading-[42px]">
            Task List
          </Text>
          <Text className="text-base text-typography-white font-Quattrocento">
            Manage your tasks and ideas with ease
          </Text>
        </View>

        <View className="w-[70%] gap-4">
          <Animated.View style={animatedStyle}>
            <Input
              className={`h-[55px] dark:bg-primary-400/95 bg-secondary-400/95 rounded-2xl elevation p-2 border-0 ${
                warning && "border-error-500 border-2 shadow-error-500"
              }`}
            >
              <InputField
                value={name}
                onChangeText={(text) => {
                  warning && setWarning(false);
                  setName(text);
                }}
                onSubmitEditing={handleSetup}
                autoCapitalize="words"
                textAlign="center"
                placeholder="Your Name"
                className="text-lg text-center font-roboto text-typography-black"
              />
            </Input>
          </Animated.View>
          {warning && (
            <Text
              className={`dark:text-error-500 text-error-300 ml-2 text-sm font-Metamorphous`}
            >
              Please enter your name first
            </Text>
          )}
        </View>

        <Pressable
          android_ripple={{
            color: dark ? "#e0e0e010" : "#5c5c5c10",
            foreground: true,
          }}
          onPress={handleSetup}
          className="bg-dark-bg-200 text-base rounded-2xl overflow-hidden shadow shadow-black px-10 py-4"
        >
          <Text className="font-Quattrocento text-base text-white">
            Continue
          </Text>
        </Pressable>
      </Box>
    </GlassmorphicBackground>
  );
};

export default Start;
