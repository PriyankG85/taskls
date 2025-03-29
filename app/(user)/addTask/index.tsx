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
import {
  registerForPushNotificationsAsync,
  scheduleNotification,
} from "@/utils/handlePushNotifications";
import { TaskProps } from "@/types/taskProps";

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
  const {
    todos,
    setTodos,
  }: {
    todos: TaskProps[];
    setTodos: React.Dispatch<React.SetStateAction<TaskProps[]>>;
  } = useContext(TodosContext);
  const { taskGroups } = useContext(TodosContext);

  const { taskGroup: groupNameInParams }: { taskGroup: string } =
    useLocalSearchParams();

  const [taskGroup, setTaskGroup] = useState(
    groupNameInParams ?? taskGroups[0].name
  );
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [checked, setChecked] = useState(true);

  const [dueDate, setDueDate] = useState(new Date());
  const [logo, setLogo] = useState<string | undefined>();
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Medium");
  const [tags, setTags] = useState<string[]>([]);

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

    let identifier = null;

    // Scheduling Notifications
    if (checked && dueDate) {
      const notificationId = await scheduleNotification(
        taskTitle,
        taskDescription,
        dueDate
      );
      identifier = notificationId;
    }

    // Saving Task to Local Storage
    const taskDetails = {
      taskId: crypto.randomUUID(),
      notificationId: identifier === null ? undefined : identifier,
      taskGroup,
      taskTitle: taskTitle.trim(),
      taskDescription: taskDescription.trim(),
      dueDate: checked && dueDate ? dueDate.toISOString() : undefined,
      logo,
      priority,
      tags,
    };
    const tasks = [...todos, taskDetails];
    const dataString = JSON.stringify(tasks);

    setDataToLocalStorage("todos", dataString);
    setTodos(tasks);

    navigation.goBack();
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

        <TaskDetails
          taskGroup={taskGroup}
          taskTitle={taskTitle}
          taskDescription={taskDescription}
          dueDate={dueDate.toISOString()}
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
