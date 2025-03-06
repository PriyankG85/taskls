import {
  Animated,
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
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { TaskGroup } from "@/types/taskGroupProps";
import { Badge, BadgeText } from "@/components/ui/badge";
import LoadingIndicator from "@/components/global/LoadingIndicator";
import ScrollYContext from "@/context/scrollY";
import { Plus } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import AddTaskListContext from "@/context/addTaskList";

export default function Home() {
  const dark = useColorScheme().colorScheme === "dark";

  const { todos, taskGroups } = useContext<{
    todos: TaskProps[];
    taskGroups: TaskGroup[];
  }>(TodosContext);
  const scrollY: Animated.Value = useContext(ScrollYContext);

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
        onScroll={Animated.event(
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

            <Button
              variant="solid"
              size="lg"
              action="primary"
              onPress={() => router.push("/todaysTasks")}
              className="rounded-xl dark:bg-dark-primary-200 bg-background-muted px-10 py-2"
            >
              <ButtonText className="text-typography-950 font-Quattrocento">
                View
              </ButtonText>
            </Button>
          </View>

          <CircularProgress
            progress={todaysTasksProgress}
            circleColor={"#e0e0e050"}
            strokeColor={"#e0e0e0"}
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

              <Badge
                size="sm"
                className="dark:bg-dark-primary-300 bg-light-primary-300 rounded-lg"
              >
                <BadgeText className="text-xs dark:text-light-text-200 text-dark-text-200">
                  {pendingTodos.length}
                </BadgeText>
              </Badge>
            </View>

            <TouchableOpacity onPress={() => router.push("/pendingTasks")}>
              <Text className="text-typography-400 font-Quattrocento">
                View all
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <HStack space="md" className="flex-row items-center p-5">
              {pendingTodos.length > 0 ? (
                pendingTodos
                  .reverse()
                  .map(
                    (todo, i) =>
                      !todo.completed && (
                        <PendingTaskCard
                          key={i}
                          taskId={todo.taskId}
                          notificationId={todo.notificationId}
                          taskGroup={todo.taskGroup}
                          taskTitle={todo.taskTitle}
                          taskDescription={todo.taskDescription}
                          logo={todo.logo && todo.logo}
                          dueDate={todo.dueDate}
                        />
                      )
                  )
              ) : (
                <Text className="text-center dark:text-dark-text-200/70 text-light-text-200/70 text-lg font-Quattrocento">
                  No Pending tasks!
                </Text>
              )}
            </HStack>
          </ScrollView>
        </View>

        <View className="gap-3 px-5">
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center gap-2">
              <Text className="text-2xl font-Quattrocento dark:text-dark-text-200 text-light-text-200">
                Task Lists
              </Text>

              <Badge
                size="sm"
                className="dark:bg-dark-primary-300 bg-light-primary-300 rounded-lg"
              >
                <BadgeText className="text-xs dark:text-light-text-200 text-dark-text-200">
                  {taskGroups.length}
                </BadgeText>
              </Badge>
            </View>

            <TouchableOpacity onPress={show}>
              <Plus size={20} color={dark ? "white" : "black"} />
            </TouchableOpacity>
          </View>

          <VStack space="md" reversed>
            {taskGroups.length === 0 ? (
              <Text className="dark:text-dark-text-200/70 text-light-text-200/70 text-lg font-Quattrocento">
                No Task Lists!
              </Text>
            ) : (
              taskGroups.map((group, i) => (
                <TaskGroupCard
                  key={i}
                  title={group.name}
                  img={group.img}
                  tasks={
                    todos.filter((todo) => todo.taskGroup === group.name).length
                  }
                  progress={groupProgress(group)}
                />
              ))
            )}
          </VStack>
        </View>
      </ScrollView>
    </Suspense>
  );
}
