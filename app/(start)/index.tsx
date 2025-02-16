"use client";

import GlassmorphicBackground from "@/components/global/GlassmorphicBackground";
import { Box } from "@/components/ui/box";
import { Input, InputField } from "@/components/ui/input";
import UserContext from "@/context/userdetails";
import { setDataToLocalStorage } from "@/hooks/useHandleLocalStorage";
import { Image } from "expo-image";
import { router } from "expo-router";
import { MotiView, useDynamicAnimation } from "moti";
import { cssInterop } from "nativewind";
import React, { useContext, useState } from "react";
import { Pressable, Text, View } from "react-native";

cssInterop(Image, { className: "style" });

const Start = () => {
  const { setName: setNameInContext } = useContext(UserContext);
  const [name, setName] = useState("");
  const [warning, setWarning] = useState(false);
  const animationState = useDynamicAnimation();

  const handleSetup = () => {
    if (name === "") {
      setWarning(true);
      animationState.animateTo({
        translateX: -20,
      });
      setTimeout(() => {
        animationState.animateTo({
          translateX: 20,
        });
        setTimeout(() => {
          animationState.animateTo({
            translateX: 0,
          });
        }, 75);
      }, 75);
    } else {
      setNameInContext(name);
      setDataToLocalStorage("name", name);
      setDataToLocalStorage(
        "taskGroups",
        JSON.stringify([
          {
            name: "Daily Work",
            img: "https://img.icons8.com/color/96/today.png",
          },
          {
            name: "Study",
            img: "https://img.icons8.com/fluency/96/reading.png",
          },
        ])
      );
      router.push("/(user)/(tabs)");
    }
  };

  return (
    <GlassmorphicBackground
      gradientColors={["#002855", "#4c669f"]}
      blurIntensity={70}
    >
      <Box className="flex-1 items-center pt-[13vh] gap-14 font-Quattrocento">
        <MotiView
          from={{
            scale: 0.75,
          }}
          animate={{
            scale: 1,
          }}
          transition={{
            type: "timing",
          }}
          className="w-full h-[40%] items-center justify-center"
        >
          <Image
            source={require("@/assets/images/tasks-illustration.webp")}
            alt="tasks-illustration"
            contentFit="contain"
            className="size-full"
          />
        </MotiView>

        <View className="items-center">
          <Text className="text-3xl text-typography-white font-Metamorphous leading-[42px]">
            Task List
          </Text>
          <Text className="text-base text-typography-white font-Quattrocento">
            Manage your tasks and ideas with ease
          </Text>
        </View>

        <View className="w-[70%] gap-2">
          <MotiView
            state={animationState}
            transition={{
              type: "spring",
            }}
          >
            <Input
              className={`h-[55px] bg-[##DCDBDB] rounded-2xl shadow shadow-black p-2 ${
                warning && "border-error-200 border-2 shadow-error-500"
              }`}
            >
              <InputField
                value={name}
                onChangeText={(text) => {
                  setWarning(false);
                  setName(text);
                }}
                autoCapitalize="words"
                textAlign="center"
                placeholder="Your Name"
                className="text-lg text-center font-roboto text-typography-black"
              />
            </Input>
          </MotiView>
          {warning && (
            <Text className="text-error-50 ml-2 text-sm font-Metamorphous">
              Please enter your name first
            </Text>
          )}
        </View>

        <Pressable
          android_ripple={{ color: "#00285550", radius: 70 }}
          onPress={handleSetup}
          className="bg-dark-bg-300 text-base rounded-2xl overflow-hidden shadow shadow-black px-10 py-4"
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
