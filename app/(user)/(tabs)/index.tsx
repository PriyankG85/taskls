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
import React, { Suspense, useContext, useEffect } from "react";
import TodosContext from "@/context/userTodos";
import { TaskProps } from "@/types/taskProps";
import { TaskGroup } from "@/types/taskGroupProps";
import LoadingIndicator from "@/components/global/LoadingIndicator";
import ScrollYContext from "@/context/scrollY";
import { Plus } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import AddTaskListContext from "@/context/addTaskList";
import Animated, { LinearTransition } from "react-native-reanimated";
import AnimatedHorizontalList from "@/components/global/AnimatedHorizontalList";

export default function Home() {
  const dark = useColorScheme().colorScheme === "dark";

  const { todos, taskGroups } = useContext<{
    todos: TaskProps[];
    taskGroups: TaskGroup[];
  }>(TodosContext);
  const scrollY: NativeAnimated.Value = useContext(ScrollYContext);

  const pendingTodos = React.useMemo(
    () =>
      todos.filter(
        (todo: TaskProps) => todo.completed === false || !todo.completed
      ),
    [todos]
  );

  const todaysTodosCount = () => {
    let count = 0;
    let todayDate = new Date().toISOString().split("T")[0];
    todos.map((todo: TaskProps) => {
      const taskDate = todo.dueDate?.split("T")[0];
      if (taskDate === todayDate) count += 1;
    });
    return count;
  };
  const completedTodaysTodosCount = () => {
    let count = 0;
    let todayDate = new Date().toISOString().split("T")[0];
    todos.map((todo: TaskProps) => {
      const taskDate = todo.dueDate?.split("T")[0];
      if (taskDate === todayDate && todo.completed === true) count += 1;
    });
    return count;
  };
  const todaysTasksProgress =
    todaysTodosCount() > 0
      ? Number((completedTodaysTodosCount() / todaysTodosCount()).toFixed(2))
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

          <AnimatedHorizontalList
            itemLayoutAnimation={LinearTransition}
            data={pendingTodos.toReversed()}
            ListEmptyComponent={
              <Text className="text-center dark:text-dark-text-200/70 text-light-text-200/70 text-lg font-Quattrocento">
                No Pending tasks!
              </Text>
            }
            renderItem={({ item: todo }) => (
              <PendingTaskCard
                key={todo.taskId}
                taskId={todo.taskId}
                notificationId={todo.notificationId}
                taskGroup={todo.taskGroup}
                taskTitle={todo.taskTitle}
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

            <Pressable
              android_ripple={{
                color: dark ? "#e0e0e010" : "#5c5c5c10",
                radius: 20,
                foreground: true,
              }}
              onPress={show}
              className="overflow-hidden rounded-full p-2"
            >
              <Plus size={20} color={dark ? "white" : "black"} />
            </Pressable>
          </View>

          <Animated.FlatList
            maxToRenderPerBatch={10}
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
