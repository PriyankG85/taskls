import { View, TextInput } from "react-native";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import * as ImagePicker from "expo-image-picker";
import TodosContext from "@/context/userTodos";
import AddTaskListContext from "@/context/addTaskList";
import { useColorScheme } from "nativewind";

import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItemText,
} from "@/components/ui/actionsheet";
import { Image } from "expo-image";
import { BlurView } from "expo-blur";
import { Box } from "../ui/box";
import { Input, InputField } from "../ui/input";
import { Button, ButtonText } from "../ui/button";
import Animated from "react-native-reanimated";
import { handleAddTaskList, handleEditList } from "@/utils/handleTaskList";
import { StyleSheet } from "react-native";
import TextAvatar from "./TextAvatar";

const AnimatedImage = Animated.createAnimatedComponent(Image);

const AddTaskListProvider = ({ children }: { children: React.ReactNode }) => {
  const dark = useColorScheme().colorScheme === "dark";
  const inputRef = useRef<TextInput>(null);
  const { todos, setTodos, taskGroups, setTaskGroups } =
    useContext(TodosContext);

  const [input, setInput] = useState("");
  const [logo, setLogo] = useState<string | undefined>();
  const [invalid, setInvalid] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [oldListTitle, setOldListTitle] = useState("");
  const [oldLogo, setOldLogo] = useState<string | undefined>();

  const [visible, setVisible] = useState(false);

  const actionDisabled = editMode
    ? (input === oldListTitle && logo === oldLogo) || input === ""
    : input === "";

  useEffect(() => {
    if (!visible) {
      setInput("");
      setLogo(undefined);
      setInvalid(false);
      setEditMode(false);
      setOldListTitle("");
      setOldLogo(undefined);
    }
  }, [visible]);

  const handleAdd = async () => {
    const result = await handleAddTaskList({
      input,
      logo,
      taskGroups,
      setTaskGroups,
      onInvalidInput: () => setInvalid(true),
      onNoInput: () => inputRef.current?.focus(),
    });

    if (result) setVisible(false);
  };

  const handleUpdate = async () => {
    const result = await handleEditList({
      logo,
      oldListTitle,
      newListTitle: input,
      taskGroups,
      setTaskGroups,
      todos,
      setTodos,
    });

    if (result) setVisible(false);
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

  const show = useCallback(() => setVisible(true), []);

  const showWithEditMode = useCallback((listName: string, logo?: string) => {
    show();
    setInput(listName);
    setLogo(logo);
    setOldLogo(logo);
    setEditMode(true);
    setOldListTitle(listName);
  }, []);

  return (
    <AddTaskListContext.Provider value={{ visible, show, showWithEditMode }}>
      {children}

      <Actionsheet isOpen={visible} onClose={handleClose}>
        <ActionsheetBackdrop />

        <ActionsheetContent className="gap-y-6 p-0 rounded-t-[2rem] shadow-lg shadow-background-0 overflow-hidden bg-background-0/60">
          <BlurView
            experimentalBlurMethod="dimezisBlurView"
            intensity={75}
            tint={dark ? "dark" : "light"}
            className="absolute top-0 left-0 right-0 bottom-0"
            style={StyleSheet.absoluteFillObject}
          />

          <Box className="p-5 pt-2 gap-y-5 pb-20">
            <ActionsheetDragIndicatorWrapper>
              <ActionsheetDragIndicator className="dark:bg-secondary-600 bg-secondary-900" />
            </ActionsheetDragIndicatorWrapper>

            <ActionsheetItemText className="text-typography-950 text-xl font-Metamorphous mb-5">
              {editMode ? "Edit List" : "Add List"}
            </ActionsheetItemText>

            <View className="gap-y-5">
              <View className="flex-row justify-between items-center">
                <Box className="p-2 rounded-2xl border border-secondary-900 justify-center items-center">
                  {logo && logo !== "" ? (
                    <AnimatedImage
                      source={{
                        uri: logo,
                      }}
                      className="min-w-12 min-h-12 max-w-16 max-h-16 rounded-xl"
                    />
                  ) : (
                    <TextAvatar size={24} text={input === "" ? "?" : input} />
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
                  value={input}
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
              onPress={editMode ? handleUpdate : handleAdd}
              size="lg"
              className={`self-end dark:bg-info-700 bg-primary-950 rounded-xl min-w-28 ${
                actionDisabled ? "opacity-60" : ""
              }`}
              disabled={actionDisabled}
            >
              <ButtonText className="font-spaceMonoBold text-typography-0">
                {editMode ? "Update" : "Add"}
              </ButtonText>
            </Button>
          </Box>
        </ActionsheetContent>
      </Actionsheet>
    </AddTaskListContext.Provider>
  );
};

export default AddTaskListProvider;
