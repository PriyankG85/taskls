import {
  ScrollView,
  View,
  Text,
  TextInput,
  Platform,
  ToastAndroid,
  Pressable,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { setDataToLocalStorage } from "@/hooks/useHandleLocalStorage";
import { useLocalSearchParams, useNavigation } from "expo-router";
import TodosContext from "@/context/userTodos";
import TaskDetails from "@/components/task/TaskDetails";
import * as Notifications from "expo-notifications";
import { useColorScheme } from "nativewind";
import { TaskProps } from "@/types/taskProps";
import cancelNotification from "@/utils/cancelNotifications";
import {
  registerForPushNotificationsAsync,
  scheduleNotification,
} from "@/utils/handlePushNotifications";

interface TaskGroupProps {
  name: string;
  img?: string;
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const EditTask = () => {
  const { taskId } = useLocalSearchParams();

  const dark = useColorScheme().colorScheme === "dark";
  const { todos, setTodos } = useContext<{
    todos: TaskProps[];
    setTodos: React.Dispatch<React.SetStateAction<TaskProps[]>>;
  }>(TodosContext);
  const { taskGroups } = useContext(TodosContext);
  const taskToEdit = todos.find((todo: TaskProps) => todo.taskId === taskId);

  // Handle the case where taskToEdit is not found
  if (!taskToEdit) {
    console.warn(`Task with id ${taskId} not found!`);
    return null;
  }

  const [taskGroup, setTaskGroup] = useState(taskToEdit.taskGroup);
  const [taskTitle, setTaskTitle] = useState(taskToEdit.taskTitle);
  const [taskDescription, setTaskDescription] = useState(
    taskToEdit.taskDescription
  );

  const initialDate = taskToEdit.dueDate?.date
    ? new Date(taskToEdit.dueDate.date)
    : new Date();
  const initialTime = taskToEdit.dueDate?.time
    ? taskToEdit.dueDate.time
    : new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
      });

  const [dueDate, setDueDate] = useState({
    date: initialDate,
    time: initialTime,
  });

  const [logo, setLogo] = useState<string | undefined>();
  const [checked, setChecked] = useState(!!taskToEdit.dueDate);
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Medium");
  const [tags, setTags] = useState<string[]>(taskToEdit.tags ?? []);

  const taskTitleRef = useRef<TextInput>(null);
  const taskTitleContainerRef = useRef<View>(null);
  const navigation = useNavigation();

  useEffect(() => {
    registerForPushNotificationsAsync().then(
      (token) => token && console.log("Expo push token:", token)
    );

    if (Platform.OS === "android") {
      Notifications.getNotificationChannelsAsync();
    }
  }, []);

  useEffect(() => {
    setLogo(
      taskGroups.find((group: TaskGroupProps) => group.name === taskGroup).img
    );
  }, [taskGroup]);

  const handleSaveTask = async () => {
    let invalidTitle = taskTitle.trim().length === 0;
    if (invalidTitle) {
      taskTitleContainerRef.current?.setNativeProps({
        style: {
          borderColor: "#FF231F7C",
          borderWidth: 1,
        },
      });
      taskTitleRef.current?.focus();
      return;
    }

    if (
      dueDate.date.toString() === "Invalid Date" ||
      dueDate.time === "Invalid Date"
    ) {
      ToastAndroid.show("Please select a date and time.", 5);
      return;
    }

    // Cancel Previous Notification
    await cancelNotification(taskToEdit?.notificationId);

    // Scheduling Notifications
    let identifier = null;
    if (checked) {
      const notificationId = await scheduleNotification(
        taskTitle,
        taskDescription,
        dueDate.date,
        dueDate.time
      );
      identifier = notificationId;
    }

    // Saving Task to Local Storage
    const newTaskDetails = {
      taskId: new Date().getTime().toString(),
      notificationId: identifier === null ? undefined : identifier,
      taskGroup,
      taskTitle: taskTitle.trim(),
      taskDescription: taskDescription.trim(),
      dueDate: checked
        ? {
            date: dueDate.date.toISOString(),
            time: dueDate.time,
          }
        : undefined,
      logo,
      priority,
      tags,
    };
    const editedTasks = todos.map((todo) =>
      todo.taskId === taskId ? newTaskDetails : todo
    );
    const dataString = JSON.stringify(editedTasks);

    setDataToLocalStorage("todos", dataString);
    setTodos(editedTasks);

    navigation.goBack();
  };

  const checkTaskModified = () => {
    if (
      taskTitle !== taskToEdit.taskTitle ||
      taskDescription !== taskToEdit.taskDescription ||
      dueDate.date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        weekday: "short",
      }) !== taskToEdit.dueDate?.date ||
      dueDate.time !== taskToEdit.dueDate?.time ||
      logo !== taskToEdit.logo ||
      taskGroup !== taskToEdit.taskGroup
    ) {
      return true;
    }
    return false;
  };

  return (
    <ScrollView className="flex-1 p-5 pt-7 dark:bg-dark-bg-100 bg-light-bg-100">
      <View style={{ gap: 20 }}>
        <Text
          className={`font-Metamorphous text-3xl ${
            dark ? "text-dark-text-100" : "text-light-text-100"
          }`}
        >
          Edit Task
        </Text>

        <TaskDetails
          taskGroup={taskGroup}
          taskTitle={taskTitle}
          taskDescription={taskDescription}
          dueDate={{
            date: dueDate.date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              weekday: "short",
            }),
            time: dueDate.time,
          }}
          logo={logo}
          setTaskGroup={setTaskGroup}
          setTaskTitle={setTaskTitle}
          setTaskDescription={setTaskDescription}
          setDueDate={setDueDate}
          taskTitleRef={taskTitleRef}
          taskTitleContainerRef={taskTitleContainerRef}
          type="add/edit"
          checked={checked}
          setChecked={setChecked}
          priority={priority}
          setPriority={setPriority}
          tags={tags}
          setTags={setTags}
        />
      </View>

      <Pressable
        android_ripple={{
          color: dark ? "#e0e0e010" : "#5c5c5c10",
          foreground: true,
        }}
        className="py-4 mb-20 rounded-xl bg-dark-accent-100 disabled:opacity-70 overflow-hidden"
        onPress={handleSaveTask}
        disabled={!checkTaskModified()}
      >
        <Text className="text-dark-text-100 text-xl text-center font-extrabold">
          Save Task
        </Text>
      </Pressable>
    </ScrollView>
  );
};

export default EditTask;
