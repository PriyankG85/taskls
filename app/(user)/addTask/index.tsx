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
import TaskDetailsPreview from "@/components/taskPreview/TaskDetailsPreview";
import * as Notifications from "expo-notifications";
import { useColorScheme } from "nativewind";
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

const AddTask = () => {
  const dark = useColorScheme().colorScheme === "dark";
  const { todos, setTodos } = useContext(TodosContext);
  const { taskGroups } = useContext(TodosContext);

  const { taskGroup: groupNameInParams }: { taskGroup: string } =
    useLocalSearchParams();

  const [taskGroup, setTaskGroup] = useState(
    groupNameInParams ?? taskGroups[0].name
  );
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
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Medium");
  // const [attachments, setAttachments] = useState<DocumentPickerResponse[]>([])

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

    if (
      dueDate.date.toString() === "Invalid Date" ||
      dueDate.time === "Invalid Date"
    ) {
      ToastAndroid.show("Please select a date and time.", 5);
      return;
    }

    console.warn("data: ", {
      taskGroup,
      taskTitle,
      taskDescription,
      dueDate,
      logo,
      priority,
    });

    let identifier = null;

    // Scheduling Notifications
    // FIXME: Notifications not working..
    // if (checked) {
    //   const notificationId = await scheduleNotification(
    //     taskTitle,
    //     taskDescription,
    //     dueDate.date,
    //     dueDate.time
    //   );
    //   identifier = notificationId;
    // }

    // // Saving Task to Local Storage
    // const taskDetails = {
    //   taskId: new Date().getTime().toString(),
    //   notificationId: identifier === null ? undefined : identifier,
    //   taskGroup,
    //   taskTitle,
    //   taskDescription,
    //   dueDate: checked
    //     ? {
    //         date: dueDate.date.toISOString(),
    //         time: dueDate.time,
    //       }
    //     : undefined,
    //   logo,
    //   priority,
    // };
    // const tasks = [...todos, taskDetails];
    // const dataString = JSON.stringify(tasks);

    // setDataToLocalStorage("todos", dataString);
    // setTodos(tasks);

    // navigation.goBack();
  };

  return (
    <ScrollView className="flex-1 p-5 pt-7">
      <View style={{ gap: 20 }}>
        <Text
          className={`font-Metamorphous text-3xl ${
            dark ? "text-dark-text-100" : "text-light-text-100"
          }`}
        >
          New Task
        </Text>

        <TaskDetailsPreview
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
        />
      </View>

      <Pressable
        android_ripple={{
          color: dark ? "#e0e0e010" : "#5c5c5c10",
          foreground: true,
        }}
        className="py-4 mb-20 rounded-xl bg-dark-accent-100 overflow-hidden"
        onPress={handleAddTask}
      >
        <Text className="text-dark-text-100 text-xl text-center font-extrabold">
          Add Task
        </Text>
      </Pressable>
    </ScrollView>
  );
};

export default AddTask;
