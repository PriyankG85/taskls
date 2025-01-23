import { ScrollView, Text, View } from "react-native";
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

export default function Home() {
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
  const todaysTodos = todos.filter((todo) => todo.dueDate?.date === today);
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
              className="rounded-xl dark:bg-primary-300 bg-primary-500 px-10 py-2"
            >
              <ButtonText className="text-typography-0 font-spaceMono">
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
          <View className="flex-row items-center gap-2 px-5">
            <Text className="text-2xl font-spaceMono dark:text-dark-text-200 text-light-text-200">
              Pending
            </Text>

            <Text className="text-sm text-center dark:bg-dark-primary-300 dark:text-light-text-200 bg-light-primary-300 text-dark-text-200 rounded-lg w-5 h-5">
              {pendingTodos.length}
            </Text>
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
              <Text className="text-sm text-center dark:bg-dark-primary-300 dark:text-light-text-200 bg-light-primary-300 text-dark-text-200 rounded-lg w-5 h-5">
                {taskGroups.length}
              </Text>
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
                    handleRemoveTaskGroup={handleRemoveTaskGroup}
                  />
                ))
            )}
          </VStack>
        </View>
      </Box>
    </ScrollView>
  );
}
