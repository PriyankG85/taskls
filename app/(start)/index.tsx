import UserContext from "@/context/userdetails";
import { setDataToLocalStorage } from "@/hooks/useHandleLocalStorage";
import { Image } from "expo-image";
import { router } from "expo-router";
import { MotiView, useDynamicAnimation } from "moti";
import { useContext, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

const Start = () => {
  const { setName: setNameContext } = useContext(UserContext);
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
      setNameContext(name);
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
      router.push("/(user)");
    }
  };

  return (
    <View className="bg-light-bg-200 flex-1 items-center pt-[25%] gap-14 font-spaceMono">
      <MotiView
        from={{
          scale: 0.5,
        }}
        animate={{
          scale: 1,
        }}
        transition={{
          type: "timing",
        }}
        className="w-full h-[40%] items-end"
      >
        <Image
          source={require("@/assets/images/start_bg.svg")}
          contentFit="contain"
          className="w-[90%] h-full"
          priority="high"
        />
      </MotiView>

      <View className="items-center">
        <Text className="text-3xl font-Karma leading-[42px]">Task List</Text>
        <Text className="text-base font-Montserrat">
          Manage your tasks and ideas with ease
        </Text>
      </View>

      <View className="w-[70%]">
        <MotiView
          state={animationState}
          transition={{
            type: "spring",
          }}
        >
          <TextInput
            value={name}
            onChangeText={(text) => {
              setWarning(false);
              setName(text);
            }}
            placeholder="Your Name"
            placeholderTextColor="white"
            className={`h-[55px] bg-light-bg-300 text-white text-center text-base rounded-[10px] p-2 ${
              warning && "border-red-500 border-2"
            }`}
          />
        </MotiView>
        {warning && (
          <Text className="text-red-500 ml-2 text-sm font-Montserrat">
            Please enter your name first
          </Text>
        )}
      </View>

      <Pressable
        onPress={handleSetup}
        className="bg-dark-bg-300 text-base rounded-2xl px-10 py-4"
      >
        <Text className="font-spaceMono text-base text-white">Continue</Text>
      </Pressable>
    </View>
  );
};

export default Start;
