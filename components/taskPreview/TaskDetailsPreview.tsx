import { View, Text, Pressable } from "react-native";
import { TaskGroup } from "@/types/taskGroupProps";
import React, { useContext } from "react";
import { TextInput, Image } from "react-native";
import { CalendarClock, CalendarDays, Flag } from "lucide-react-native";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import TodosContext from "@/context/userTodos";
import CheckBox from "../global/CheckBox";
import AddTaskListContext from "@/context/addTaskList";
import TextAvatar from "../global/TextAvatar";
import RichTextEditor from "./RichTextEditor";
import { useColorScheme } from "nativewind";

interface TaskDetailsPreviewProps {
  type: "add/edit" | "preview";
  taskGroup: string;
  taskTitle: string;
  taskDescription: string;
  dueDate: { date: string; time: string } | undefined;
  logo?: string;
  checked?: boolean;
  priority: "Low" | "Medium" | "High";
  setPriority?: React.Dispatch<React.SetStateAction<"Low" | "Medium" | "High">>;
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
  taskTitleRef?: React.RefObject<TextInput>;
  taskTitleContainerRef?: React.RefObject<View>;
}

const TaskDetailsPreview = (props: TaskDetailsPreviewProps) => {
  const dark = useColorScheme().colorScheme === "dark";
  const { taskGroups }: { taskGroups: TaskGroup[] } = useContext(TodosContext);
  const { show } = useContext(AddTaskListContext);

  const {
    type,
    logo,
    taskGroup,
    taskTitle,
    taskDescription,
    dueDate,
    checked,
    priority,
    setPriority,
    setTaskGroup,
    setTaskTitle,
    setTaskDescription,
    setDueDate,
    setChecked,
    taskTitleRef,
    taskTitleContainerRef,
  } = props;

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
              } text-lg font-roboto font-bold`}
            >
              {taskGroup}
            </Text>
          </View>
        </View>

        {type === "add/edit" && (
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
                  backgroundColor: dark ? "#29293e" : "#b4bfcc",
                  color: dark ? "white" : "black",
                }}
                label={group.name}
                value={group.name}
              />
            ))}
            <Picker.Item
              style={{
                backgroundColor: dark ? "#3A506B" : "#c7ddfd90",
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
          Title
        </Text>

        <TextInput
          ref={taskTitleRef}
          placeholder="Enter task title..."
          value={taskTitle}
          onChangeText={(text) => {
            taskTitleContainerRef?.current?.setNativeProps({
              style: { borderWidth: 0 },
            });
            setTaskTitle && setTaskTitle(text);
          }}
          editable={type === "add/edit"}
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
            editable={type === "add/edit"}
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
              className={`dark:text-white text-black text-lg font-roboto font-bold`}
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
                    className={`dark:text-white text-black text-lg font-roboto font-bold`}
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
                    className={`dark:text-white text-black text-lg font-roboto font-bold`}
                  >
                    {dueDate.time}
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>

        <View className="h-full p-1">
          {type === "add/edit" && checked !== undefined && setChecked && (
            <CheckBox size={22} checked={checked} setChecked={setChecked} />
          )}
        </View>
      </View>

      <View
        className={`gap-2 p-4 rounded-xl dark:bg-dark-bg-300 bg-light-bg-300 overflow-hidden`}
      >
        <Text className={`dark:text-dark-text-200 text-light-text-200 text-sm`}>
          Priority
        </Text>

        <View className="p-1.5 gap-1.5">
          <View className="flex-row items-center">
            <Flag size={18} color={dark ? "#ffffff" : "#000000"} />

            {type === "add/edit" && setPriority ? (
              <Picker
                mode="dropdown"
                selectedValue={priority}
                onValueChange={(itemValue) => setPriority(itemValue)}
                dropdownIconColor={dark ? "#ffffff" : "#000000"}
                dropdownIconRippleColor={dark ? "#ffffff20" : "#00000020"}
                style={{
                  flexGrow: 1,
                }}
              >
                {["Low", "Medium", "High"].map((item, index) => (
                  <Picker.Item
                    key={index}
                    style={{
                      backgroundColor: dark ? "#29293e" : "#b4bfcc",
                      color: dark ? "white" : "black",
                    }}
                    label={item}
                    value={item}
                  />
                ))}
              </Picker>
            ) : (
              <Text
                className={`dark:text-white text-black text-lg font-roboto font-bold ml-3`}
              >
                {priority ?? "Medium"}
              </Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default TaskDetailsPreview;
