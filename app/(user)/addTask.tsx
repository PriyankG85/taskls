import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react-native";
import { setDataToLocalStorage } from "@/hooks/useHandleLocalStorage";
import { useNavigation } from "expo-router";
import TodosContext from "@/context/userTodos";
import TaskDetailsPreview from "@/components/taskPreview/TaskDetailsPreview";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import * as Device from "expo-device";
import { useColorScheme } from "nativewind";

interface TaskGroupProps {
  name: string;
  img?: string;
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const AddTask = () => {
  const dark = useColorScheme().colorScheme === "dark";
  const { todos, setTodos } = useContext(TodosContext);
  const { taskGroups } = useContext(TodosContext);

  const [taskGroup, setTaskGroup] = useState(taskGroups[0].name);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [dueDate, setDueDate] = useState({
    date: new Date(),
    time: new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
    }),
  });
  const [logo, setLogo] = useState<string | undefined>();
  const [checked, setChecked] = useState(true);

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

  const handleAddTask = async () => {
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

    let identifier = null;

    // Scheduling Notifications
    if (checked) {
      dueDate.date.setHours(new Date().getHours());
      dueDate.date.setMinutes(new Date().getMinutes());
      identifier = await scheduleNotification(
        taskTitle,
        taskDescription,
        dueDate.date,
        dueDate.time
      );
    }

    // Saving Task to Local Storage
    const taskDetails = {
      taskId: new Date().getTime().toString(),
      notificationId: identifier,
      taskGroup,
      taskTitle,
      taskDescription,
      dueDate: checked
        ? {
            date: dueDate.date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              weekday: "short",
            }),
            time: dueDate.time,
          }
        : undefined,
      logo,
    };
    const tasks = [...todos, taskDetails];
    const dataString = JSON.stringify(tasks);

    setDataToLocalStorage("todos", dataString);
    setTodos(tasks);

    navigation.goBack();
  };

  return (
    <ScrollView className="flex-1 p-5 pt-7 dark:bg-dark-bg-100 bg-light-bg-100">
      <View style={{ gap: 20 }}>
        <View className="flex-row gap-3 items-center">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft size={28} color={dark ? "white" : "black"} />
          </TouchableOpacity>

          <Text
            className={`font-Montserrat text-3xl ${
              dark ? "text-dark-text-100" : "text-light-text-100"
            }`}
          >
            New Task
          </Text>
        </View>

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
        className="py-4 my-14 rounded-xl bg-dark-accent-100"
        onPress={handleAddTask}
      >
        <Text className="text-dark-text-100 text-xl text-center font-extrabold">
          Add Task
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddTask;

async function scheduleNotification(
  title: string,
  body: string,
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
