import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { Suspense, useContext } from "react";
import TodosContext from "@/context/userTodos";
import TaskCard from "@/components/tabs/TaskCard";
import { useRouter } from "expo-router";
import { setDataToLocalStorage } from "@/hooks/useHandleLocalStorage";
import { TaskProps } from "@/types/taskProps";
import TaskControlsMenuWrapper from "@/components/global/TaskControlsMenuWrapper";
import LoadingIndicator from "@/components/global/LoadingIndicator";

const Completed = () => {
  const router = useRouter();
  const {
    todos,
    setTodos,
  }: { todos: TaskProps[]; setTodos(list: TaskProps[]): void } =
    useContext(TodosContext);
  const completedTodos = todos.filter((todo) => todo.completed === true);

  const handleClear = () => {
    const remainingTodos = todos.filter((todo) => todo.completed !== true);
    setDataToLocalStorage("todos", JSON.stringify(remainingTodos));
    setTodos(remainingTodos);
  };

  return (
    <Suspense fallback={<LoadingIndicator />}>
      <ScrollView className="flex-1 p-5 pt-10 dark:bg-dark-bg-100 bg-light-bg-100">
        <View className="flex-row items-center justify-between">
          <Text className={`font-Metamorphous text-3xl text-typography-950`}>
            Completed Tasks
          </Text>
          <TouchableOpacity
            onPress={handleClear}
            className={`px-3 ${completedTodos.length === 0 && "opacity-50"}`}
            activeOpacity={0.7}
            disabled={completedTodos.length === 0}
          >
            <Text className="text-base font-roboto text-typography-500">
              Clear
            </Text>
          </TouchableOpacity>
        </View>

        <View className="gap-y-2 mt-5">
          {completedTodos.length === 0 ? (
            <Text className={`text-lg text-typography-500`}>
              No tasks completed!
            </Text>
          ) : (
            completedTodos.map((todo) => (
              <TaskControlsMenuWrapper
                key={todo.taskId}
                taskId={todo.taskId}
                activeOpacity={0.75}
                onPress={() =>
                  router.push({
                    pathname: "/taskPreview",
                    params: {
                      taskGroup: todo.taskGroup,
                      taskTitle: todo.taskTitle,
                      taskId: todo.taskId,
                      notificationId: todo.notificationId,
                      taskDescription: todo.taskDescription,
                      dueDate: JSON.stringify(todo.dueDate),
                      logo: todo.logo,
                    },
                  })
                }
              >
                <TaskCard
                  taskId={todo.taskId}
                  notificationId={todo.notificationId}
                  taskTitle={todo.taskTitle}
                  dueDate={todo.dueDate}
                  logo={todo.logo}
                  taskGroup={todo.taskGroup}
                  completed={todo.completed}
                />
              </TaskControlsMenuWrapper>
            ))
          )}
        </View>
      </ScrollView>
    </Suspense>
  );
};

export default Completed;
