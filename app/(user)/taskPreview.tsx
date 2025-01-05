import {
  View,
  Text,
  useColorScheme,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import React, { useContext } from "react";
import TaskDetailsPreview from "@/components/TaskDetailsPreview";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { ArrowLeft, Trash2 } from "lucide-react-native";
import { decodeUri } from "@/utils/decodeUri";
import TodosContext from "@/context/userTodos";
import { setDataToLocalStorage } from "@/hooks/useHandleLocalStorage";
import cancelNotification from "@/utils/cancelNotifications";
import { TaskProps } from "@/types/taskProps";

const TaskPreview = () => {
  const dark = useColorScheme() === "dark";
  const {
    notificationId,
    taskId,
    taskGroup,
    taskTitle,
    taskDescription,
    dueDate,
    logo,
  } = useLocalSearchParams();
  const navigation = useNavigation();
  const decodedLogo = logo ? decodeUri(logo as string) : undefined;
  const { todos, setTodos } = useContext(TodosContext);

  const handleDeleteTask = async () => {
    const newTasks = todos.filter((task: TaskProps) => task.taskId !== taskId);

    setTodos(newTasks);
    await cancelNotification(notificationId as string);
    setDataToLocalStorage("todos", JSON.stringify(newTasks));
    router.back();
  };

  return (
    <ScrollView
      className={`flex-1 p-5 pt-7 ${
        dark ? "bg-dark-bg-100" : "bg-light-bg-100"
      }`}
      contentContainerStyle={{ gap: 20 }}
    >
      <View className="flex-row justify-between items-center">
        <View className="flex-row gap-3 items-center">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft size={28} color={dark ? "white" : "black"} />
          </TouchableOpacity>

          <Text
            className={`font-Montserrat text-3xl ${
              dark ? "text-dark-text-100" : "text-light-text-100"
            }`}
          >
            Task Preview
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() =>
            Alert.alert(`Sure want to delete this task?`, undefined, [
              { text: "NO" },
              {
                text: "YES",
                onPress() {
                  handleDeleteTask();
                },
              },
            ])
          }
        >
          <Trash2 size={24} color="#FF573380" className="mr-3" />
        </TouchableOpacity>
      </View>

      <TaskDetailsPreview
        dark={dark}
        taskGroup={taskGroup as string}
        taskTitle={taskTitle as string}
        taskDescription={taskDescription as string}
        dueDate={dueDate as string}
        logo={decodedLogo}
        type="preview"
      />
    </ScrollView>
  );
};

export default TaskPreview;
