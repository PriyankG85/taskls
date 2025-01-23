import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useContext } from "react";
import TodosContext from "@/context/userTodos";
import { TaskProps } from "@/types/taskProps";
import TaskCard from "@/components/taskInGroup/TaskCard";
import { router, useLocalSearchParams } from "expo-router";
import { VStack } from "@/components/ui/vstack";
import { Box } from "@/components/ui/box";
import { FileQuestion } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { Image } from "expo-image";
import { TaskGroup } from "@/types/taskGroupProps";

const TasksInGroup = () => {
  const dark = useColorScheme().colorScheme === "dark";
  const params = useLocalSearchParams();
  const groupName = decodeURIComponent(params.groupName as string);
  const { todos, taskGroups } = useContext<{
    todos: TaskProps[];
    taskGroups: TaskGroup[];
    setTodos: React.Dispatch<React.SetStateAction<TaskProps[]>>;
  }>(TodosContext);
  const groupTodos = todos.filter((todo) => todo.taskGroup === groupName);
  const groupLogo = taskGroups.find((group) => group.name === groupName)?.img;

  return (
    <ScrollView className="flex-1 p-5 pt-10 dark:bg-dark-bg-100 bg-light-bg-100">
      <View className="flex-row gap-5 items-center mb-5">
        <Box className="rounded-3xl size-20 p-2 bg-background-100/25 justify-center items-center">
          {groupLogo ? (
            <Image
              source={{ uri: groupLogo }}
              className="w-full h-full rounded-xl"
            />
          ) : (
            <FileQuestion size={28} color={dark ? "#ffffff" : "#000000"} />
          )}
        </Box>
        <View className="gap-1">
          <Text className="font-Montserrat text-3xl dark:text-dark-text-100 text-light-text-100">
            {groupName} Tasks
          </Text>
          <Text className="font-Montserrat text-base dark:text-dark-accent-200 text-light-accent-200 ml-1">
            {groupTodos.length} tasks
          </Text>
        </View>
      </View>

      <VStack space="md">
        {groupTodos.map((todo) => (
          <TouchableOpacity
            key={todo.taskId}
            activeOpacity={0.75}
            onPress={() =>
              router.push(
                `/taskPreview?taskGroup=${encodeURIComponent(
                  todo.taskGroup
                )}&taskTitle=${encodeURIComponent(todo.taskTitle)}&taskId=${
                  todo.taskId
                }&notificationId=${todo.notificationId}${
                  todo.taskDescription &&
                  "&taskDescription=" +
                    encodeURIComponent(todo.taskDescription as string)
                }${
                  todo.dueDate &&
                  "&dueDate=" + encodeURIComponent(JSON.stringify(todo.dueDate))
                }${todo.logo && "&logo=" + encodeURIComponent(todo.logo)}`
              )
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
          </TouchableOpacity>
        ))}
      </VStack>
    </ScrollView>
  );
};

export default TasksInGroup;
