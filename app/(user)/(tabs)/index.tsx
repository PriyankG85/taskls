import { Pressable, ScrollView, Text, View } from "react-native";
import CircularProgress from "@/components/global/CircularProgress";
import { router } from "expo-router";
import PendingTaskCard from "@/components/home/PendingTaskCard";
import TaskGroupCard from "@/components/home/TaskGroupCard";
import { useContext } from "react";
import TodosContext from "@/context/userTodos";
import { setDataToLocalStorage } from "@/hooks/useHandleLocalStorage";
import { TaskProps } from "@/types/taskProps";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { TaskGroup } from "@/types/taskGroupProps";
import { Badge, BadgeIcon, BadgeText } from "@/components/ui/badge";

export default function Home() {
  const { todos, taskGroups } = useContext<{
    todos: TaskProps[];
    taskGroups: TaskGroup[];
  }>(TodosContext);

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

  return (
    <ScrollView className="flex-1 pt-8 dark:bg-dark-bg-100 bg-light-bg-100">
      <Box className="mb-12 gap-5">
        <View
          className="flex-row justify-between items-center p-7 mx-5 rounded-3xl           dark:bg-dark-primary-100 bg-light-primary-100
        "
        >
          <View className="items-start gap-5">
            <Text className="text-dark-text-100 text-lg font-Montserrat">
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
              <ButtonText className="text-typography-950 font-spaceMono">
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
              <Text className="text-2xl font-spaceMono dark:text-dark-text-200 text-light-text-200">
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

            <Pressable onPress={() => router.push("/pendingTasks")}>
              <Text className="text-typography-400 font-Quattrocento">
                View all
              </Text>
            </Pressable>
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
                <Text className="text-center dark:text-dark-text-200/70 text-light-text-200/70 text-lg font-spaceMono">
                  No Pending tasks!
                </Text>
              )}
            </HStack>
          </ScrollView>
        </View>

        <View className="gap-3 px-5">
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center gap-2">
              <Text className="text-2xl font-spaceMono dark:text-dark-text-200 text-light-text-200">
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
          </View>

          <VStack space="md">
            {taskGroups.length === 0 ? (
              <Text className="dark:text-dark-text-200/70 text-light-text-200/70 text-lg font-spaceMono">
                No Task Lists!
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
                      todos.filter((todo) => todo.taskGroup === group.name)
                        .length
                    }
                    progress={groupProgress(group)}
                  />
                ))
            )}
          </VStack>
        </View>
      </Box>
    </ScrollView>
  );
}
