import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useContext } from "react";
import TaskDetailsPreview from "@/components/taskPreview/TaskDetailsPreview";
import { router, useLocalSearchParams } from "expo-router";
import { Trash2 } from "lucide-react-native";
import { decodeImgUri } from "@/utils/decodeImgUri";
import TodosContext from "@/context/userTodos";
import { useColorScheme } from "nativewind";
import { useAlertDialog } from "@/hooks/useAlertDialog";
import { handleDeleteTask } from "@/utils/handleTask";
import toggleTaskCompleted from "@/hooks/useMarkTaskCompleted";
import { TaskProps } from "@/types/taskProps";
import CheckBox from "@/components/global/CheckBox";
import Animated from "react-native-reanimated";

const TaskPreview = () => {
  const dark = useColorScheme().colorScheme === "dark";
  const params = useLocalSearchParams();
  const alertDialog = useAlertDialog();
  const { todos, setTodos } = useContext(TodosContext);

  const unformattedDueDate = params.dueDate
    ? JSON.parse(decodeURIComponent(params.dueDate as string))
    : undefined;
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

  const taskId = params.taskId as string;
  const notificationId = params.notificationId as string;
  const priority = params.priority as "Low" | "Medium" | "High";
  const taskGroup = decodeURIComponent(params.taskGroup as string);
  const taskTitle = decodeURIComponent(params.taskTitle as string);
  const taskDescription = decodeURIComponent(params.taskDescription as string);
  const decodedLogo = params.logo
    ? decodeImgUri(params.logo as string)
    : undefined;

  const handleRemoveTask = async () => {
    await handleDeleteTask(todos, setTodos, taskId, notificationId);
    router.back();
  };
  const completed = todos.find(
    (todo: TaskProps) => todo.taskId === taskId
  )?.completed;

  return (
    <Animated.ScrollView
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
        <View className="flex-row items-center justify-center gap-2">
          <CheckBox
            checked={completed ?? false}
            setChecked={(val) =>
              setTodos(
                toggleTaskCompleted(todos, taskId, notificationId, completed)
              )
            }
            size={22}
          />
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() =>
              alertDialog.show("Delete Task?", handleRemoveTask, "", "Yes")
            }
            className="p-1"
          >
            <Trash2 size={22} color="#FF5733" className="mr-3" />
          </TouchableOpacity>
        </View>
      </View>

      <TaskDetailsPreview
        priority={priority}
        taskGroup={taskGroup}
        taskTitle={taskTitle}
        taskDescription={taskDescription}
        dueDate={dueDate}
        logo={decodedLogo}
        type="preview"
      />
    </Animated.ScrollView>
  );
};

export default TaskPreview;
