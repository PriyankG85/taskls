import { View, Text, Pressable } from "react-native";
import { TaskGroup } from "@/types/taskGroupProps";
import React, { useContext } from "react";
import { TextInput, Image } from "react-native";
import { CalendarClock, CalendarDays } from "lucide-react-native";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import TodosContext from "@/context/userTodos";
import CheckBox from "../global/CheckBox";
import AddTaskListContext from "@/context/addTaskList";
import TextAvatar from "../global/TextAvatar";
import RichTextEditor from "./RichTextEditor";

interface TaskDetailsPreviewProps {
  dark: boolean;
  type: "add" | "preview";
  taskGroup: string;
  taskTitle: string;
  taskDescription: string;
  dueDate: { date: string; time: string } | undefined;
  logo?: string;
  checked?: boolean;
  setTaskGroup?: (taskGroup: string) => void;
  setTaskTitle?: (taskTitle: string) => void;
  setTaskDescription?: (taskDescription: string) => void;
  setDueDate?: React.Dispatch<
    React.SetStateAction<{
      date: Date;
      time: string;
    }>
  >;
  setChecked?: (val: boolean) => void;
  taskTitleRef?: React.RefObject<TextInput | null>;
  taskTitleContainerRef?: React.RefObject<View | null>;
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
  const { taskGroups }: { taskGroups: TaskGroup[] } = useContext(TodosContext);
  const { show } = useContext(AddTaskListContext);

  return (
    <View className="gap-y-5 pb-20">
      <View className="flex-row justify-between items-center p-4 rounded-xl dark:bg-dark-bg-300 bg-light-bg-300">
        <View className="flex-row items-center gap-x-4">
          <View
            className={`rounded-3xl w-16 h-16 p-1.5 ${
              dark ? "bg-dark-accent-100" : "bg-light-bg-200"
            } justify-center items-center`}
          >
            {logo && logo !== "" ? (
              <Image
                source={{ uri: logo }}
                className="w-full h-full rounded-xl"
              />
            ) : (
              <TextAvatar text={taskGroup} />
            )}
          </View>
          <View>
            <Text
              className={`${
                dark ? "text-dark-text-200" : "text-light-text-200"
              } text-sm`}
            >
              List
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
              if (val === "__+__") show();
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
        ref={taskTitleContainerRef as React.RefObject<View> | undefined}
        className={`p-4 rounded-xl ${
          dark ? "bg-dark-bg-300" : "bg-light-bg-300"
        }`}
      >
        <Text
          className={`${
            dark ? "text-dark-text-200" : "text-light-text-200"
          } text-sm`}
        >
          Title
        </Text>

        {/* TODO: Make the text in all TextInputs selectable in the preview mode */}
        <TextInput
          ref={taskTitleRef as React.RefObject<TextInput> | undefined}
          multiline
          placeholder="Enter task title..."
          value={taskTitle}
          onChangeText={(text) => {
            taskTitleContainerRef?.current?.setNativeProps({
              style: { borderWidth: 0 },
            });
            setTaskTitle && setTaskTitle(text);
          }}
          editable={type === "add"}
          placeholderTextColor={dark ? "#ffffff50" : "#00000050"}
          className={`dark:text-white text-black text-lg`}
          style={{
            fontFamily:
              "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
          }}
        />
      </View>

      {taskDescription === "" && type === "preview" ? null : (
        <View
          className={`gap-2 rounded-xl dark:bg-dark-bg-300 bg-light-bg-300 overflow-hidden`}
        >
          <Text
            className={`dark:text-dark-text-200 text-light-text-200 text-sm mt-4 ml-4`}
          >
            Description
          </Text>
          <RichTextEditor
            value={taskDescription}
            onChange={(e) => setTaskDescription && setTaskDescription(e)}
            editable={type === "add"}
            placeholder={`Enter task description...`}
            dom={{ matchContents: true }}
          />
        </View>
      )}

      <View
        className={`flex-row justify-between items-center p-4 rounded-xl dark:bg-dark-bg-300 bg-light-bg-300`}
      >
        <View className="flex-grow gap-1.5">
          <Text
            className={`dark:text-dark-text-200 text-light-text-200 text-sm`}
          >
            Due Date & Time
          </Text>
          {checked === false || !dueDate ? (
            <Text
              className={`dark:text-white text-black text-lg font-spaceMonoBold`}
            >
              No due date set
            </Text>
          ) : (
            <View className="p-1.5 gap-1.5">
              <View className="flex-row items-center gap-3">
                <CalendarDays size={18} color={dark ? "#ffffff" : "#000000"} />
                <Pressable
                  disabled={type === "preview"}
                  onPress={() =>
                    DateTimePickerAndroid.open({
                      minimumDate: new Date(),
                      value: new Date(dueDate.date),
                      onChange: (event, selectedDate) => {
                        if (
                          selectedDate &&
                          selectedDate.toString() !== "Invalid Date" &&
                          setDueDate
                        ) {
                          setDueDate((prev) => ({
                            ...prev,
                            date: selectedDate,
                          }));
                        }
                      },
                      mode: "date",
                    })
                  }
                >
                  <Text
                    className={`dark:text-white text-black text-lg font-spaceMonoBold`}
                  >
                    {dueDate.date}
                  </Text>
                </Pressable>
              </View>
              <View className="flex-row items-center gap-3">
                <CalendarClock size={18} color={dark ? "#ffffff" : "#000000"} />
                <Pressable
                  disabled={type === "preview"}
                  onPress={() =>
                    DateTimePickerAndroid.open({
                      value: new Date(dueDate.date),
                      display: "spinner",
                      minimumDate: new Date(),
                      onChange: (event, selectedDate) => {
                        if (
                          selectedDate &&
                          selectedDate.toString() !== "Invalid Date" &&
                          setDueDate
                        ) {
                          setDueDate((prev) => ({
                            ...prev,
                            time: selectedDate.toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            }),
                          }));
                        }
                      },
                      mode: "time",
                      is24Hour: true,
                    })
                  }
                >
                  <Text
                    className={`dark:text-white text-black text-lg font-spaceMonoBold`}
                  >
                    {dueDate.time}
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>

        <View className="h-full p-1">
          {type === "add" && checked !== undefined && setChecked && (
            <CheckBox
              dark={dark}
              size={20}
              checked={checked}
              setChecked={setChecked}
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default TaskDetailsPreview;
