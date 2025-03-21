import { View, Text, ScrollView, Pressable } from "react-native";
import React, { useContext } from "react";
import TaskDetailsPreview from "@/components/task/TaskDetails";
import { router, useLocalSearchParams } from "expo-router";
import { decodeImgUri } from "@/utils/decodeImgUri";
import TodosContext from "@/context/userTodos";
import { useColorScheme } from "nativewind";
import { useAlertDialog } from "@/hooks/useAlertDialog";
import { handleDeleteTask } from "@/utils/handleTask";
import toggleTaskCompleted from "@/hooks/useMarkTaskCompleted";
import { TaskProps } from "@/types/taskProps";
import CheckBox from "@/components/global/CheckBox";
import { Picker } from "@react-native-picker/picker";
import {
  Menu,
  MenuItem,
  MenuItemLabel,
  MenuSeparator,
} from "@/components/ui/menu";
import { EllipsisVertical, Pencil, Trash2 } from "lucide-react-native";

const TaskPreview = () => {
  const dark = useColorScheme().colorScheme === "dark";
  const { taskId }: { taskId: string } = useLocalSearchParams();
  const alertDialog = useAlertDialog();
  const { todos, setTodos } = useContext(TodosContext);

  const task = todos.find((todo: TaskProps) => todo.taskId === taskId);
  const {
    taskTitle,
    priority,
    tags,
    taskDescription,
    taskGroup,
    completed,
    dueDate: unformattedDueDate,
    logo,
    notificationId,
  }: TaskProps = task;

  const dueDate = unformattedDueDate
    ? {
        date: new Date(unformattedDueDate.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          weekday: "short",
        }),
        time: unformattedDueDate.time,
      }
    : undefined;

  const handleRemoveTask = async () => {
    await handleDeleteTask(todos, setTodos, taskId, notificationId);
    router.back();
  };

  return (
    <ScrollView
      className="flex-1 p-5 pt-7 dark:bg-dark-bg-100 bg-light-bg-100"
      contentContainerStyle={{ gap: 20 }}
    >
      <View className="flex-row justify-between items-center">
        <Text
          className={`font-Metamorphous text-3xl ${
            dark ? "text-dark-text-100" : "text-light-text-100"
          }`}
        >
          Task Preview
        </Text>
        <View className="flex-row items-center justify-center gap-3">
          <CheckBox
            checked={completed ?? false}
            setChecked={(val) =>
              setTodos(
                toggleTaskCompleted(todos, taskId, notificationId, completed)
              )
            }
            size={22}
          />
          <Menu
            placement="bottom left"
            trigger={(props) => (
              <Pressable
                andriod_ripple={{
                  color: dark ? "#e0e0e010" : "#5c5c5c10",
                  radius: 5,
                }}
                {...props}
              >
                <EllipsisVertical color={dark ? "#fbfbfb" : "#1b1b1b"} />
              </Pressable>
            )}
            offset={7}
            className="bg-background-muted shadow rounded-xl right-5"
          >
            <MenuItem
              key="edit"
              textValue="Edit"
              android_ripple={{
                color: dark ? "#e0e0e010" : "#5c5c5c10",
              }}
              onPress={() =>
                router.push({
                  pathname: "/editTask/[taskId]",
                  params: { taskId: taskId },
                })
              }
              className="gap-2"
            >
              <Pencil size={16} color={"#3B82F6"} />{" "}
              <MenuItemLabel
                size="lg"
                className="dark:text-white text-black font-roboto"
              >
                Edit
              </MenuItemLabel>
            </MenuItem>

            <MenuSeparator />

            <MenuItem
              key="delete"
              textValue="Delete"
              android_ripple={{
                color: dark ? "#e0e0e010" : "#5c5c5c10",
              }}
              onPress={() =>
                alertDialog.show("Delete Task?", handleRemoveTask, "", "Yes")
              }
              className="gap-2"
            >
              <Trash2 size={16} color={"#B91C1C"} />
              <MenuItemLabel
                size="lg"
                className="dark:text-white text-black font-roboto"
              >
                Delete
              </MenuItemLabel>
            </MenuItem>
          </Menu>
        </View>
      </View>

      <TaskDetailsPreview
        tags={tags}
        priority={priority}
        taskGroup={taskGroup}
        taskTitle={taskTitle}
        taskDescription={taskDescription}
        dueDate={dueDate}
        logo={logo}
        type="preview"
      />
    </ScrollView>
  );
};

export default TaskPreview;
