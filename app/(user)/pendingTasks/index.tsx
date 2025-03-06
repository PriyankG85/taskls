import { View, Text, ScrollView } from "react-native";
import React, { useContext } from "react";
import TodosContext from "@/context/userTodos";
import { TaskProps } from "@/types/taskProps";
import TaskCard from "@/components/taskInGroup/TaskCard";
import { router } from "expo-router";
import { VStack } from "@/components/ui/vstack";
import TaskControlsMenuWrapper from "@/components/global/TaskControlsMenuWrapper";

const PendingTasks = () => {
  const { todos } = useContext<{
    todos: TaskProps[];
    setTodos: React.Dispatch<React.SetStateAction<TaskProps[]>>;
  }>(TodosContext);
  const pendingTodos = todos.filter((todo) => !todo.completed);

  return (
    <ScrollView className="flex-1 p-5 pt-10 dark:bg-dark-bg-100 bg-light-bg-100">
      <View className="flex-row gap-5 items-center mb-5">
        <View className="gap-1">
          <Text className="font-Metamorphous text-3xl dark:text-dark-text-100 text-light-text-100">
            Pending Tasks
          </Text>
          <Text className="font-Metamorphous text-base dark:text-dark-accent-200 text-light-accent-200 ml-1">
            {pendingTodos.length} tasks pending
          </Text>
        </View>
      </View>

      <VStack space="md" reversed>
        {pendingTodos.map((todo) => (
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
              taskDescription={todo.taskDescription}
              taskGroup={todo.taskGroup}
              completed={todo.completed}
            />
          </TaskControlsMenuWrapper>
        ))}
      </VStack>
    </ScrollView>
  );
};

export default PendingTasks;
