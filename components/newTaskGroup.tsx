import {
  View,
  Text,
  Modal,
  useColorScheme,
  TextInput,
  TouchableOpacity,
  Image,
  ToastAndroid,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { CircleHelp } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { setDataToLocalStorage } from "@/hooks/useHandleLocalStorage";
import TodosContext from "@/context/userTodos";

const NewTaskGroup = ({
  visible,
  setVisible,
}: {
  visible: boolean;
  setVisible(val: boolean): void;
}) => {
  const dark = useColorScheme() === "dark";
  const inputRef = useRef<TextInput>(null);
  const [input, setInput] = useState("");
  const [logo, setLogo] = useState<string | undefined>();
  const { taskGroups, setTaskGroups } = useContext(TodosContext);

  useEffect(() => {
    setInput("");
    setLogo(undefined);
  }, [visible]);

  const handleAddTaskGroup = async () => {
    let nameExists = false;
    taskGroups.forEach((group: any) => {
      if (group.name === input.trim()) nameExists = true;
    });

    if (input === "") {
      inputRef.current?.setNativeProps({
        style: {
          borderWidth: 1,
          borderColor: "red",
        },
      });
      inputRef.current?.focus();
      return;
    } else if (nameExists) {
      inputRef.current?.setNativeProps({
        style: {
          borderWidth: 1,
          borderColor: "red",
        },
      });
      ToastAndroid.show("Task Group exists with this name.", 5);
      return;
    }

    const groupData = {
      name: input,
      img: logo,
    };

    setDataToLocalStorage(
      "taskGroups",
      JSON.stringify([...taskGroups, groupData])
    );
    setTaskGroups([...taskGroups, groupData]);
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

  return (
    <Modal
      animationType="slide"
      visible={visible}
      transparent
      onRequestClose={() => setVisible(false)}
    >
      <View
        className={`h-fit w-full p-7 space-y-6 rounded-t-3xl bottom-0 absolute ${
          dark ? "bg-dark-bg-200" : "bg-[#8e9aaf]"
        }`}
      >
        <TouchableOpacity activeOpacity={0.5} onPress={() => setVisible(false)}>
          <Text
            className={`text-xl font-Montserrat ${
              dark ? "text-dark-text-100" : "text-light-text-100"
            }`}
          >
            Cancel
          </Text>
        </TouchableOpacity>

        <View className="space-y-5 mb-5">
          <TextInput
            value={input}
            ref={inputRef}
            onChangeText={(e) => {
              setInput(e);
              inputRef.current?.setNativeProps({
                style: {
                  borderWidth: 0,
                },
              });
            }}
            placeholder="Group Name"
            placeholderTextColor={dark ? "#ffffff70" : "#00000070"}
            className={`text-lg bg-slate-500/70 px-4 py-3 rounded-xl ${
              dark
                ? "bg-dark-bg-300 text-dark-text-200"
                : "bg-light-bg-300 text-light-text-200"
            }`}
          />

          <View
            className={`flex-row justify-between items-center py-3 px-4 rounded-xl ${
              dark ? "bg-dark-bg-300" : "bg-light-bg-300"
            }`}
          >
            <View
              className={`rounded-3xl w-16 h-16 p-2 ${
                dark ? "bg-dark-accent-100" : "bg-light-bg-200"
              } justify-center items-center`}
            >
              {logo ? (
                <Image
                  source={{ uri: logo }}
                  className="w-full h-full rounded-xl"
                />
              ) : (
                <CircleHelp size={24} color={dark ? "#ffffff" : "#000000"} />
              )}
            </View>

            <TouchableOpacity
              onPress={() => pickImage().then((uri) => setLogo(uri))}
              className={`justify-center items-center ${
                dark ? "bg-dark-bg-200" : "bg-light-bg-200"
              } rounded-xl py-3 px-5`}
            >
              <Text
                className={`${
                  dark ? "text-dark-text-200" : "text-light-text-200"
                } text-lg font-spaceMono`}
              >
                Change Logo
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.5}
          onPress={handleAddTaskGroup}
          className={`self-center ${
            dark ? "bg-dark-primary-200" : "bg-blue-500"
          } rounded-xl px-8 py-2`}
        >
          <Text className="text-lg font-spaceMonoBold text-dark-text-100">
            Add
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default NewTaskGroup;
