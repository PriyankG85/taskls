import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React, { useContext } from "react";
import TodosContext from "@/context/userTodos";
import { TaskProps } from "@/types/taskProps";
import TaskCard from "@/components/taskInGroup/TaskCard";
import { router, useLocalSearchParams } from "expo-router";
import { VStack } from "@/components/ui/vstack";
import { Box } from "@/components/ui/box";
import { Edit, FileQuestion, Trash2 } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { Image } from "expo-image";
import { TaskGroup } from "@/types/taskGroupProps";
import TaskControlsMenuWrapper from "@/components/global/TaskControlsMenuWrapper";
import { useAlertDialog } from "@/hooks/useAlertDialog";
import { handleDeleteTaskList, handleRenameList } from "@/utils/handleTaskList";
import { useInputDialog } from "@/components/ui/input-dialog";

const TasksInGroup = () => {
  const dark = useColorScheme().colorScheme === "dark";
  const params = useLocalSearchParams();
  const groupName = decodeURIComponent(params.groupName as string);
  const { todos, taskGroups, setTodos, setTaskGroups } = useContext<{
    todos: TaskProps[];
    taskGroups: TaskGroup[];
    setTodos: React.Dispatch<React.SetStateAction<TaskProps[]>>;
    setTaskGroups: React.Dispatch<React.SetStateAction<TaskGroup[]>>;
  }>(TodosContext);
  const groupTodos = todos.filter((todo) => todo.taskGroup === groupName);
  const groupLogo = taskGroups.find((group) => group.name === groupName)?.img;

  const alertDialog = useAlertDialog();
  const { prompt } = useInputDialog();

  const handleRemoveTaskGroup = () => {
    handleDeleteTaskList(taskGroups, setTaskGroups, groupName, todos, setTodos);
  };

  const handleRename = async () => {
    await handleRenameList({
      listTitle: groupName,
      taskGroups,
      setTaskGroups,
      todos,
      setTodos,
      prompt,
    });
  };

  return (
    <ScrollView className="flex-1 p-5 pt-10 dark:bg-dark-bg-100 bg-light-bg-100">
      <View className="flex-row justify-between items-center mb-5">
        <View className="flex-row gap-5 items-center">
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
            <View className="flex-row items-center gap-2">
              <Text
                numberOfLines={1}
                className="font-Metamorphous text-3xl dark:text-dark-text-100 text-light-text-100"
              >
                {groupName}
              </Text>
              <Pressable onPress={handleRename}>
                <Edit size={18} color={dark ? "#ffffff" : "#000000"} />
              </Pressable>
            </View>
            <Text className="font-Metamorphous text-base dark:text-dark-accent-200 text-light-accent-200 ml-1">
              {groupTodos.length} tasks
            </Text>
          </View>
        </View>
        <View>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() =>
              alertDialog.show("Delete List?", handleRemoveTaskGroup, "", "Yes")
            }
          >
            <Trash2 size={24} color="#FF573380" className="mr-3" />
          </TouchableOpacity>
        </View>
      </View>

      <VStack space="md">
        {groupTodos.map((todo) => (
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

export default TasksInGroup;
