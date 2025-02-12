import { View, TextInput } from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FileQuestion } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import TodosContext from "@/context/userTodos";
import { useColorScheme } from "nativewind";

import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItemText,
} from "@/components/ui/actionsheet";
import { Image, ImageBackground } from "expo-image";
import { BlurView } from "expo-blur";
import { Box } from "../ui/box";
import { Input, InputField } from "../ui/input";
import { Button, ButtonText } from "../ui/button";
import Animated from "react-native-reanimated";
import { handleAddTaskList } from "@/utils/handleTaskList";

const AnimatedImage = Animated.createAnimatedComponent(Image);

const NewTaskGroup = ({
  visible,
  setVisible,
}: {
  visible: boolean;
  setVisible(val: boolean): void;
}) => {
  const dark = useColorScheme().colorScheme === "dark";
  const inputRef = useRef<TextInput>(null);
  const { taskGroups, setTaskGroups } = useContext(TodosContext);

  const [input, setInput] = useState("");
  const [logo, setLogo] = useState<string | undefined>();
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    setInput("");
    setLogo(undefined);
  }, [visible]);

  const handleAddTaskGroup = async () => {
    handleAddTaskList({
      input,
      logo,
      taskGroups,
      setTaskGroups,
      onInvalidInput: () => setInvalid(true),
      onNoInput: () => inputRef.current?.focus(),
    });
    setVisible(false);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) {
      return result.assets[0].uri;
    }
  };

  const handleClose = () => {
    setVisible(false);
  };

  return (
    <>
      <Actionsheet isOpen={visible} onClose={handleClose}>
        <ActionsheetBackdrop />

        <ActionsheetContent className="gap-y-6 p-0 rounded-t-[2rem] shadow-lg shadow-background-0 overflow-hidden">
          <ImageBackground
            source={{
              uri: "https://images.unsplash.com/photo-1519681393784-d120267933ba?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1124&q=100",
            }}
            className="bg-center bg-cover"
          >
            <BlurView
              experimentalBlurMethod="dimezisBlurView"
              intensity={95}
              tint={dark ? "dark" : "light"}
              className="absolute top-0 left-0 right-0 bottom-0"
            />

            <Box className="p-5 pt-2 gap-y-5 pb-20">
              <ActionsheetDragIndicatorWrapper>
                <ActionsheetDragIndicator className="dark:bg-secondary-600 bg-secondary-900" />
              </ActionsheetDragIndicatorWrapper>

              <ActionsheetItemText className="text-typography-950 text-xl font-Montserrat mb-5">
                Add List
              </ActionsheetItemText>

              <View className="gap-y-5">
                <View className="flex-row justify-between items-center">
                  <Box className="p-2 rounded-2xl border border-secondary-900 justify-center items-center">
                    {logo ? (
                      <AnimatedImage
                        source={{
                          uri: logo,
                        }}
                        className="min-w-12 min-h-12 max-w-16 max-h-16 rounded-xl"
                      />
                    ) : (
                      <FileQuestion
                        size={24}
                        color={dark ? "#ffffff" : "#000000"}
                      />
                    )}
                  </Box>

                  <Button
                    onPress={() => pickImage().then((uri) => setLogo(uri))}
                    className="justify-center items-center bg-primary-500 rounded-lg"
                    size="xl"
                  >
                    <ButtonText size="md">Change Logo</ButtonText>
                  </Button>
                </View>

                <Input
                  size="lg"
                  variant="outline"
                  isInvalid={invalid}
                  ref={inputRef}
                  className="border-secondary-900 focus:border focus:border-primary focus:shadow-outline"
                >
                  <InputField
                    onChangeText={(e) => {
                      setInvalid(false);
                      setInput(e);
                    }}
                    maxLength={20}
                    placeholder="Group Name"
                    placeholderTextColor={dark ? "#ffffff70" : "#00000070"}
                    className="px-4 py-3 placeholder:text-typography-500"
                  />
                </Input>
              </View>

              <Button
                onPress={handleAddTaskGroup}
                size="lg"
                className="self-end dark:bg-info-700 bg-primary-950 rounded-xl min-w-28"
              >
                <ButtonText className="font-spaceMonoBold text-typography-0">
                  Add
                </ButtonText>
              </Button>
            </Box>
          </ImageBackground>
        </ActionsheetContent>
      </Actionsheet>
    </>
  );
};

export default NewTaskGroup;
