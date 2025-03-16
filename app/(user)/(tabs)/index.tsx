import {
  Animated as NativeAnimated,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CircularProgress from "@/components/global/CircularProgress";
import { router } from "expo-router";
import PendingTaskCard from "@/components/home/PendingTaskCard";
import TaskGroupCard from "@/components/home/TaskGroupCard";
import { Suspense, useContext } from "react";
import TodosContext from "@/context/userTodos";
import { TaskProps } from "@/types/taskProps";
import { TaskGroup } from "@/types/taskGroupProps";
import LoadingIndicator from "@/components/global/LoadingIndicator";
import ScrollYContext from "@/context/scrollY";
import { Plus } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import AddTaskListContext from "@/context/addTaskList";
import Animated, { LinearTransition } from "react-native-reanimated";

export default function Home() {
  const dark = useColorScheme().colorScheme === "dark";

  const { todos, taskGroups } = useContext<{
    todos: TaskProps[];
    taskGroups: TaskGroup[];
  }>(TodosContext);
  const scrollY: NativeAnimated.Value = useContext(ScrollYContext);

  const pendingTodos = todos.filter(
    (todo: TaskProps) => todo.completed === false || !todo.completed
  );
  const todaysTodos = todos.filter((todo) => {
    const todayDate = new Date().toISOString().split("T")[0];
    const taskDate = todo.dueDate?.date
      ? todo.dueDate.date.split("T")[0]
      : undefined;
    return taskDate === todayDate;
  });
  const completedTodos = todaysTodos.filter((todo) => todo.completed === true);
  const todaysTasksProgress =
    todaysTodos.length > 0
      ? Number((completedTodos.length / todaysTodos.length).toFixed(2))
      : 1;

  const groupProgress = (group: TaskGroup) => {
    let groupTasks = todos.filter((todo) => todo.taskGroup === group.name);
    let groupTasksDone = groupTasks.filter((todo) => todo.completed === true);
    let progress =
      groupTasks.length === 0
        ? 0
        : Number((groupTasksDone.length / groupTasks.length).toFixed(2));
    return progress;
  };

  const { show } = useContext(AddTaskListContext);

  return (
    <Suspense fallback={<LoadingIndicator />}>
      <ScrollView
        onScroll={NativeAnimated.event(
          [
            {
              nativeEvent: { contentOffset: { y: scrollY } },
            },
          ],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        contentContainerStyle={{ flexGrow: 1, marginBottom: 50, gap: 20 }}
        className="flex-1 pb-16 pt-8"
      >
        <View
          className="flex-row justify-between items-center p-5 mx-5 rounded-3xl  dark:bg-dark-primary-100/70 bg-light-primary-100/70
        "
        >
          <View className="items-start gap-5">
            <Text className="text-dark-text-100 text-lg font-Metamorphous">
              {todaysTasksProgress < 0.5
                ? "Your today's tasks are\npending!"
                : "Your today's are\nalmost done!"}
            </Text>

            <Pressable
              android_ripple={{
                color: dark ? "#e0e0e010" : "#5c5c5c10",
                foreground: true,
              }}
              onPress={() => router.push("/todaysTasks")}
              className="rounded-xl dark:bg-dark-primary-200 bg-background-muted active:opacity-80 px-10 py-2 overflow-hidden"
            >
              <Text className="text-typography-950 text-lg font-Quattrocento">
                View
              </Text>
            </Pressable>
          </View>

          <CircularProgress
            progress={todaysTasksProgress}
            circleColor={"#e0e0e050"}
            strokeColor={"#FBFBFB"}
            size={100}
            strokeWidth={10}
          />
        </View>

        <View>
          <View className="flex-row justify-between items-center pl-5 pr-7">
            <View className="flex-row items-center gap-2">
              <Text className="text-2xl font-Quattrocento dark:text-dark-text-200 text-light-text-200">
                Pending
              </Text>

              <View className="bg-neutral-200 dark:bg-neutral-700 px-2 py-0.5 rounded-lg">
                <Text className="text-xs text-neutral-800 dark:text-neutral-200">
                  {pendingTodos.length}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push("/pendingTasks")}
              disabled={pendingTodos.length === 0}
              className="disabled:opacity-70"
            >
              <Text className="text-typography-500 font-Quattrocento">
                View all
              </Text>
            </TouchableOpacity>
          </View>

          <Animated.FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="flex-row items-center p-5 gap-2 grow"
            itemLayoutAnimation={LinearTransition}
            data={pendingTodos.slice().reverse()}
            ListEmptyComponent={
              <Text className="text-center dark:text-dark-text-200/70 text-light-text-200/70 text-lg font-Quattrocento">
                No Pending tasks!
              </Text>
            }
            renderItem={({ item: todo }) => (
              <PendingTaskCard
                key={todo.taskId}
                priority={todo.priority}
                taskId={todo.taskId}
                notificationId={todo.notificationId}
                taskGroup={todo.taskGroup}
                taskTitle={todo.taskTitle}
                taskDescription={todo.taskDescription}
                logo={todo.logo && todo.logo}
                dueDate={todo.dueDate}
                completed={todo.completed}
              />
            )}
            keyExtractor={(item) => item.taskId}
          />
        </View>

        <View className="gap-3">
          <View className="flex-row justify-between items-center mx-5">
            <View className="flex-row items-center gap-2">
              <Text className="text-2xl font-Quattrocento dark:text-dark-text-200 text-light-text-200">
                Task Lists
              </Text>

              <View className="bg-neutral-200 dark:bg-neutral-700 px-2 py-0.5 rounded-lg">
                <Text className="text-xs text-neutral-800 dark:text-neutral-200">
                  {taskGroups.length}
                </Text>
              </View>
            </View>

            <TouchableOpacity onPress={show}>
              <Plus size={20} color={dark ? "white" : "black"} />
            </TouchableOpacity>
          </View>

          <Animated.FlatList
            itemLayoutAnimation={LinearTransition}
            data={taskGroups.slice().reverse()}
            renderItem={({ item: group }) => (
              <TaskGroupCard
                key={group.name}
                title={group.name}
                img={group.img}
                tasks={
                  todos.filter((todo) => todo.taskGroup === group.name).length
                }
                progress={groupProgress(group)}
              />
            )}
            keyExtractor={(item) => item.name}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            contentContainerClassName="grow pb-20 gap-2 px-5"
            ListEmptyComponent={
              <Text className="dark:text-dark-text-200/70 text-light-text-200/70 text-lg font-Quattrocento">
                No Task Lists!
              </Text>
            }
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </Suspense>
  );
}
