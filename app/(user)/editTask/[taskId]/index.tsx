import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  ToastAndroid,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { setDataToLocalStorage } from "@/hooks/useHandleLocalStorage";
import { useLocalSearchParams, useNavigation } from "expo-router";
import TodosContext from "@/context/userTodos";
import TaskDetailsPreview from "@/components/taskPreview/TaskDetailsPreview";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import * as Device from "expo-device";
import { useColorScheme } from "nativewind";
import { TaskProps } from "@/types/taskProps";
import cancelNotification from "@/utils/cancelNotifications";

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
    if (taskTitle === "") {
      taskTitleContainerRef.current?.setNativeProps({
        style: {
          borderColor: "red",
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
      taskTitle,
      taskDescription,
      dueDate: checked
        ? {
            date: dueDate.date.toISOString(),
            time: dueDate.time,
          }
        : undefined,
      logo,
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
          className={`font-Montserrat text-3xl ${
            dark ? "text-dark-text-100" : "text-light-text-100"
          }`}
        >
          Edit Task
        </Text>

        <TaskDetailsPreview
          dark={dark}
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
          type="add"
          checked={checked}
          setChecked={setChecked}
        />
      </View>

      <TouchableOpacity
        activeOpacity={0.75}
        className="py-4 my-14 rounded-xl bg-dark-accent-100 disabled:opacity-70"
        onPress={handleSaveTask}
        disabled={!checkTaskModified()}
      >
        <Text className="text-dark-text-100 text-xl text-center font-extrabold">
          Save Task
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

async function scheduleNotification(
  title: string,
  body: string | undefined,
  dueDate: Date,
  time: string
) {
  const dataTime = new Date(dueDate);
  dataTime.setHours(Number(time.split(":")[0]));
  dataTime.setMinutes(Number(time.split(":")[1]));

  return await Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: {
      date: dataTime,
      type: Notifications.SchedulableTriggerInputTypes.DATE,
    },
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    // EAS projectId is used here.
    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;
      if (!projectId) {
        throw new Error("Project ID not found");
      }
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(token);
    } catch (e) {
      token = `${e}`;
    }
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}

export default EditTask;
