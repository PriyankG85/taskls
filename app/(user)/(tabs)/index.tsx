import {
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import CircularProgress from "@/components/CircularProgress";
import { router } from "expo-router";
import PendingTaskCard from "@/components/PendingTaskCard";
import TaskGroupCard from "@/components/TaskGroupCard";
import { useContext, useState } from "react";
import TodosContext from "@/context/userTodos";
import { Plus } from "lucide-react-native";
import NewTaskGroup from "@/components/newTaskGroup";
import { setDataToLocalStorage } from "@/hooks/useHandleLocalStorage";
import { TaskProps } from "@/types/taskProps";

interface TaskGroup {
  name: string;
  img?: string;
}

export default function Home() {
  const colorScheme = useColorScheme();
  const [showModal, setShowModal] = useState(false);
  const { todos, taskGroups, setTaskGroups } = useContext<{
    todos: TaskProps[];
    taskGroups: TaskGroup[];
    setTaskGroups(groups: TaskGroup[]): void;
  }>(TodosContext);

  const pendingTodos = todos.filter(
    (todo: TaskProps) => todo.completed === false || !todo.completed
  );
  const today = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    weekday: "short",
  });
  const todaysTodos = todos.filter((todo) => todo.dueDate === today);
  const completedTodos = todaysTodos.filter((todo) => todo.completed === true);
  const todaysTasksProgress =
    todaysTodos.length > 0
      ? Number((completedTodos.length / todaysTodos.length).toFixed(2))
      : 1;

  const handleRemoveTaskGroup = (name: string) => {
    const newGroups = taskGroups.filter((group) => group.name !== name);

    setTaskGroups(newGroups);
    setDataToLocalStorage("taskGroups", JSON.stringify(newGroups));
  };

  const groupProgress = (group: TaskGroup) => {
    let groupTasks = todos.filter((todo) => todo.taskGroup === group.name);
    let groupTasksDone = groupTasks.filter((todo) => todo.completed === true);
    let progress =
      groupTasks.length === 0
        ? 0
        : Number((groupTasksDone.length / groupTasks.length).toFixed(2));
    return progress;
  };

  return (
    <ScrollView
      className={`flex-1 pl-5 pt-8 gap-7 ${
        colorScheme === "dark" ? "bg-dark-bg-100" : "bg-light-bg-100"
      }`}
    >
      <View
        className={`flex-row justify-between items-center p-7 mr-5 rounded-3xl ${
          colorScheme === "dark"
            ? "bg-dark-primary-100"
            : "bg-light-primary-100"
        }`}
      >
        <View className="items-start gap-5">
          <Text className="text-dark-text-100 text-lg font-Montserrat">
            {todaysTasksProgress < 0.5
              ? "Your today's tasks are\npending!"
              : "Your today's are\nalmost done!"}
          </Text>

          <Pressable
            onPress={() => router.push("/todaysTasks")}
            className={`rounded-xl ${
              colorScheme === "dark" ? "bg-dark-accent-200" : "bg-light-bg-200"
            } px-10 py-2`}
          >
            <Text
              className={`${
                colorScheme === "dark"
                  ? "text-dark-primary-100"
                  : "text-light-text-100"
              } text-lg font-spaceMono`}
            >
              View
            </Text>
          </Pressable>
        </View>

        <CircularProgress
          progress={todaysTasksProgress}
          circleColor={"#e0e0e050"}
          strokeColor={"#e0e0e0"}
          size={100}
          strokeWidth={10}
        />
      </View>

      <View className="space-y-3">
        <View className="flex-row items-center gap-2">
          <Text
            className={`text-2xl font-spaceMono ${
              colorScheme === "dark"
                ? "text-dark-text-200"
                : "text-light-text-200"
            }`}
          >
            Pending
          </Text>

          <Text
            className={`text-sm text-center ${
              colorScheme === "dark"
                ? "bg-dark-primary-300 text-light-text-200"
                : "bg-light-primary-300 text-dark-text-200"
            } rounded-lg w-5 h-5`}
          >
            {pendingTodos.length}
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 10, paddingRight: 20 }}
        >
          {pendingTodos.length > 0 ? (
            pendingTodos.reverse().map(
              (todo, i) =>
                !todo.completed && (
                  <TouchableOpacity
                    key={i}
                    activeOpacity={0.75}
                    onPress={() =>
                      router.push(
                        "/taskPreview?taskGroup=" +
                          todo.taskGroup +
                          "&taskTitle=" +
                          todo.taskTitle +
                          "&notificationId=" +
                          todo.notificationId +
                          "&taskId=" +
                          todo.taskId +
                          "&taskDescription=" +
                          todo.taskDescription +
                          "&dueDate=" +
                          todo.dueDate +
                          (todo.logo
                            ? "&logo=" + encodeURIComponent(todo.logo)
                            : "")
                      )
                    }
                  >
                    <PendingTaskCard
                      dark={colorScheme === "dark"}
                      taskId={todo.taskId}
                      notificationId={todo.notificationId}
                      taskGroup={todo.taskGroup}
                      title={todo.taskTitle}
                      logo={todo.logo && todo.logo}
                      dueDate={todo.dueDate}
                    />
                  </TouchableOpacity>
                )
            )
          ) : (
            <Text
              className={`text-center ${
                colorScheme === "dark"
                  ? "text-dark-text-200/70"
                  : "text-light-text-200/70"
              } text-lg font-spaceMono`}
            >
              No Pending tasks!
            </Text>
          )}
        </ScrollView>
      </View>

      <View className="space-y-3">
        <View className="flex-row justify-between items-center pr-7">
          <View className="flex-row items-center gap-2">
            <Text
              className={`text-2xl font-spaceMono ${
                colorScheme === "dark"
                  ? "text-dark-text-200"
                  : "text-light-text-200"
              }`}
            >
              Task Groups
            </Text>
            <Text
              className={`text-sm text-center ${
                colorScheme === "dark"
                  ? "bg-dark-primary-300 text-light-text-200"
                  : "bg-light-primary-300 text-dark-text-200"
              } rounded-lg w-5 h-5`}
            >
              {taskGroups.length}
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => setShowModal(true)}
            className="p-1"
          >
            <Plus
              size={20}
              color={colorScheme === "dark" ? "white" : "black"}
            />
          </TouchableOpacity>
        </View>

        <View style={{ gap: 10, paddingRight: 20 }}>
          {taskGroups.length === 0 ? (
            <Text
              className={`${
                colorScheme === "dark"
                  ? "text-dark-text-200/70"
                  : "text-light-text-200/70"
              } text-lg font-spaceMono`}
            >
              No Task Groups
            </Text>
          ) : (
            taskGroups
              .reverse()
              .map((group, i) => (
                <TaskGroupCard
                  key={i}
                  title={group.name}
                  img={group.img}
                  tasks={
                    todos.filter((todo) => todo.taskGroup === group.name).length
                  }
                  progress={groupProgress(group)}
                  handleRemoveTaskGroup={handleRemoveTaskGroup}
                />
              ))
          )}
        </View>

        <View className="bottom_tabs_safe_area h-[35px]" />
      </View>

      <NewTaskGroup visible={showModal} setVisible={setShowModal} />
    </ScrollView>
  );
}
