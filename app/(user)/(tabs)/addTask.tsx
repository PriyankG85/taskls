import {
  ScrollView,
  View,
  Text,
  useColorScheme,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react-native";
import { setDataToLocalStorage } from "@/hooks/useHandleLocalStorage";
import { useNavigation } from "expo-router";
import TodosContext from "@/context/userTodos";
import TaskDetailsPreview from "@/components/TaskDetailsPreview";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import * as Device from "expo-device";

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
  const dark = useColorScheme() === "dark";

  const [taskGroup, setTaskGroup] = useState("Daily Work");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [logo, setLogo] = useState<string | undefined>();
  const [checked, setChecked] = useState(true);

  const taskTitleRef = useRef<TextInput>(null);
  const taskTitleContainerRef = useRef<View>(null);
  const navigation = useNavigation();

  const { todos, setTodos } = useContext(TodosContext);
  const { taskGroups } = useContext(TodosContext);

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
      dueDate.setHours(new Date().getHours());
      dueDate.setMinutes(new Date().getMinutes());
      const localTime = new Date(dueDate.toString());
      identifier = await scheduleNotification(
        taskTitle,
        taskDescription,
        localTime
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
        ? dueDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            weekday: "short",
          })
        : null,
      logo,
    };
    const tasks = [...todos, taskDetails];
    const dataString = JSON.stringify(tasks);

    setDataToLocalStorage("todos", dataString);
    setTodos(tasks);

    navigation.goBack();
  };

  return (
    <ScrollView
      className={`flex-1 p-5 pt-7 ${
        dark ? "bg-dark-bg-100" : "bg-light-bg-100"
      }`}
    >
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
          dueDate={dueDate}
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
  dueDate: Date
) {
  return await Notifications.scheduleNotificationAsync({
    content: { title: `Reminder: ${title}`, body },
    trigger: { date: dueDate.setSeconds(dueDate.getSeconds() + 120) },
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
