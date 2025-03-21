import { View, TextInput, Pressable } from "react-native";
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
import Actionsheet from "@/components/ui/actionsheet";
import { Image } from "expo-image";
import { Box } from "../ui/box";
import { Input } from "../ui/input";
import Animated from "react-native-reanimated";
import { handleAddTaskList, handleEditList } from "@/utils/handleTaskList";
import TextAvatar from "./TextAvatar";
import { Text } from "react-native";

const AnimatedImage = Animated.createAnimatedComponent(Image);

const AddTaskListDialogProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
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
      inputRef.current?.clear();
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

      <Actionsheet
        isVisible={visible}
        onClose={handleClose}
        headerText={editMode ? "Edit List" : "Add List"}
      >
        <Box className="p-5 pt-2 gap-y-5 pb-12">
          <View className="gap-y-5">
            <View className="flex-row justify-between items-center">
              <Box className="p-2 rounded-2xl border border-secondary-900 justify-center items-center">
                {logo && logo !== "" ? (
                  <AnimatedImage
                    source={{
                      uri: logo,
                    }}
                    className="min-w-12 min-h-12 size-20 rounded-xl"
                  />
                ) : (
                  <TextAvatar size={24} text={input === "" ? "?" : input} />
                )}
              </Box>

              <Pressable
                android_ripple={{ color: "#1b1b1b20", foreground: true }}
                onPress={() => pickImage().then((uri) => setLogo(uri))}
                className="justify-center items-center dark:bg-primary-500 bg-secondary-950 rounded-lg px-7 py-3 overflow-hidden"
              >
                <Text className="text-typography-0 text-base">Change Logo</Text>
              </Pressable>
            </View>

            <Input size="lg" variant="outline" isInvalid={invalid}>
              <TextInput
                ref={inputRef}
                defaultValue={oldListTitle}
                onChangeText={(text) => {
                  setInvalid(false);
                  setInput(text);
                }}
                maxLength={24}
                placeholder="Group Name"
                placeholderTextColor={dark ? "#ffffff70" : "#00000070"}
                className="flex-1 px-4 py-3 text-typography-900 border-secondary-900 focus:border focus:border-primary focus:shadow-outline"
              />
            </Input>
          </View>
        </Box>

        <View className="mx-4 pt-4 border-t border-outline-200">
          <Pressable
            android_ripple={{ color: "#ffffff30", foreground: true }}
            onPress={editMode ? handleUpdate : handleAdd}
            className={`self-end items-center justify-center bg-info-400 rounded-xl min-w-28 py-2.5 overflow-hidden ${
              actionDisabled ? "opacity-60" : ""
            }`}
            disabled={actionDisabled}
          >
            <Text className="text-typography-white text-lg">
              {editMode ? "Update" : "Add"}
            </Text>
          </Pressable>
        </View>
      </Actionsheet>
    </AddTaskListContext.Provider>
  );
};

export default AddTaskListDialogProvider;
