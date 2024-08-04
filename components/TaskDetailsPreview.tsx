import { View, Text } from "react-native";
import React, { useContext, useState } from "react";
import { TextInput, Image, TouchableOpacity } from "react-native";
import { CalendarDays, ChevronDown, CircleHelp } from "lucide-react-native";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import TodosContext from "@/context/userTodos";
import NewTaskGroup from "./newTaskGroup";
import CheckBox from "./CheckBox";

interface TaskDetailsPreviewProps {
  dark: boolean;
  type: "add" | "preview";
  taskGroup: string;
  taskTitle: string;
  taskDescription: string;
  dueDate: Date | string;
  logo?: string;
  checked?: boolean;
  setTaskGroup?: (taskGroup: string) => void;
  setTaskTitle?: (taskTitle: string) => void;
  setTaskDescription?: (taskDescription: string) => void;
  setDueDate?: (dueDate: Date) => void;
  setChecked?: (val: boolean) => void;
  taskTitleRef?: React.RefObject<TextInput>;
  taskTitleContainerRef?: React.RefObject<View>;
}

interface TaskGroupProps {
  name: string;
  img?: string;
}

const TaskDetailsPreview = ({
  dark,
  checked,
  type,
  taskGroup,
  taskTitle,
  taskDescription,
  dueDate,
  logo,
  setChecked,
  setTaskGroup,
  setTaskTitle,
  setTaskDescription,
  setDueDate,
  taskTitleRef,
  taskTitleContainerRef,
}: TaskDetailsPreviewProps) => {
  const { taskGroups }: { taskGroups: TaskGroupProps[] } =
    useContext(TodosContext);
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View className="gap-y-5">
      <View
        className={`flex-row justify-between items-center p-4 rounded-xl ${
          dark ? "bg-dark-bg-300" : "bg-light-bg-300"
        }`}
      >
        <View className="flex-row items-center space-x-4">
          <View
            className={`rounded-3xl w-16 h-16 p-1.5 ${
              dark ? "bg-dark-accent-100" : "bg-light-bg-200"
            } justify-center items-center`}
          >
            {logo ? (
              <Image
                source={{ uri: logo }}
                className="w-full h-full rounded-xl"
              />
            ) : (
              <CircleHelp size={28} color={dark ? "#ffffff" : "#000000"} />
            )}
          </View>
          <View>
            <Text
              className={`${
                dark ? "text-dark-text-200" : "text-light-text-200"
              } text-sm`}
            >
              Task Group
            </Text>
            <Text
              className={`${
                dark ? "text-white" : "text-black"
              } text-lg font-spaceMonoBold`}
            >
              {taskGroup}
            </Text>
          </View>
        </View>

        {type === "add" && (
          <Picker
            mode="dropdown"
            selectedValue={"Daily Work"}
            onValueChange={(val) => {
              if (val === "__+__") setModalVisible(true);
              else setTaskGroup && setTaskGroup(val);
            }}
            style={{ width: 45, height: 45 }}
            dropdownIconColor={dark ? "white" : "black"}
          >
            {taskGroups.map((group) => (
              <Picker.Item
                key={group.name}
                style={{
                  backgroundColor: dark ? "#3A506B" : "#c7ddfd90",
                  color: dark ? "white" : "black",
                }}
                label={group.name}
                value={group.name}
              />
            ))}
            <Picker.Item
              style={{
                backgroundColor: dark ? "#07223a90" : "#c7ddfd90",
                color: dark ? "white" : "black",
              }}
              label={"+ New"}
              value="__+__"
            />
          </Picker>
        )}
      </View>

      <View
        ref={taskTitleContainerRef}
        className={`p-4 rounded-xl ${
          dark ? "bg-dark-bg-300" : "bg-light-bg-300"
        }`}
      >
        <Text
          className={`${
            dark ? "text-dark-text-200" : "text-light-text-200"
          } text-sm`}
        >
          Task Name
        </Text>
        <TextInput
          ref={taskTitleRef}
          placeholder="Task Name"
          value={taskTitle}
          onChangeText={(text) => {
            taskTitleContainerRef?.current?.setNativeProps({
              style: { borderWidth: 0 },
            });
            setTaskTitle && setTaskTitle(text);
          }}
          editable={type === "add"}
          placeholderTextColor={dark ? "#ffffff50" : "#00000050"}
          className={`${
            dark ? "text-white" : "text-black"
          } text-lg font-spaceMonoBold`}
        />
      </View>

      <View
        className={`p-4 rounded-xl ${
          dark ? "bg-dark-bg-300" : "bg-light-bg-300"
        }`}
      >
        <Text
          className={`${
            dark ? "text-dark-text-200" : "text-light-text-200"
          } text-sm`}
        >
          Task Description
        </Text>
        <TextInput
          multiline={true}
          numberOfLines={5}
          textAlignVertical="top"
          placeholder={
            taskDescription === "" && type === "preview"
              ? "No Description"
              : "Task Description"
          }
          placeholderTextColor={dark ? "#ffffff50" : "#00000050"}
          value={taskDescription}
          onChangeText={setTaskDescription}
          editable={type === "add"}
          className={`${
            dark ? "text-white" : "text-black"
          } text-lg font-spaceMonoBold`}
        />
      </View>
      <View
        className={`flex-row justify-between items-center p-4 rounded-xl ${
          dark ? "bg-dark-bg-300" : "bg-light-bg-300"
        }`}
      >
        <View className="flex-row gap-3 items-center">
          <CalendarDays size={24} color={dark ? "#ffffff" : "#000000"} />
          <View>
            <Text
              className={`${
                dark ? "text-dark-text-200" : "text-light-text-200"
              } text-sm`}
            >
              Due Date
            </Text>
            {checked === false || dueDate === "null" ? (
              <Text
                className={`${
                  dark ? "text-white" : "text-black"
                } text-lg font-spaceMonoBold`}
              >
                No due date
              </Text>
            ) : (
              <Text
                className={`${
                  dark ? "text-white" : "text-black"
                } text-lg font-spaceMonoBold`}
              >
                {typeof dueDate === "string"
                  ? dueDate
                  : dueDate.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      weekday: "short",
                    })}
              </Text>
            )}
          </View>
        </View>

        {type === "add" && checked !== undefined && setChecked && (
          <View className="space-y-3 items-center h-full w-6">
            <CheckBox size={20} checked={checked} setChecked={setChecked} />

            {typeof dueDate === "object" && checked && (
              <TouchableOpacity
                onPress={() =>
                  DateTimePickerAndroid.open({
                    value: dueDate,
                    onChange: (event, selectedDate) => {
                      if (selectedDate && setDueDate) {
                        setDueDate(selectedDate);
                      }
                    },
                    mode: "date",
                    is24Hour: true,
                  })
                }
              >
                <ChevronDown size={24} color={dark ? "#ffffff" : "#000000"} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      <NewTaskGroup visible={modalVisible} setVisible={setModalVisible} />
    </View>
  );
};

export default TaskDetailsPreview;
