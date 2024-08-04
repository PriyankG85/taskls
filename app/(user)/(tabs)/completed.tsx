import {
  View,
  Text,
  useColorScheme,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useContext } from "react";
import TodosContext from "@/context/userTodos";
import TaskCard from "@/components/TaskCard";
import { useRouter } from "expo-router";
import { setDataToLocalStorage } from "@/hooks/useHandleLocalStorage";
import { TaskProps } from "@/types/taskProps";

const Completed = () => {
  const dark = useColorScheme() === "dark";
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
    <ScrollView
      className={`flex-1 p-5 pt-10 gap-5 ${
        dark ? "bg-dark-bg-100" : "bg-light-bg-100"
      }`}
    >
      <View className="flex-row items-center justify-between">
        <Text
          className={`font-Montserrat text-3xl ${
            dark ? "text-dark-text-100" : "text-light-text-100"
          }`}
        >
          Completed Tasks
        </Text>
        <TouchableOpacity
          onPress={handleClear}
          className={`px-3 ${completedTodos.length === 0 && "opacity-50"}`}
          activeOpacity={0.7}
          disabled={completedTodos.length === 0}
        >
          <Text
            className={`text-sm font-spaceMono ${
              dark ? "text-dark-text-200/90" : "text-light-text-200/90"
            }`}
          >
            Clear
          </Text>
        </TouchableOpacity>
      </View>

      <View className="space-y-2">
        {completedTodos.length === 0 ? (
          <Text
            className={`text-lg ${
              dark ? "text-dark-text-200/60" : "text-light-text-200/60"
            }`}
          >
            No completed Tasks found!
          </Text>
        ) : (
          completedTodos.map((todo) => (
            <TouchableOpacity
              key={todo.taskId}
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
                    (todo.logo ? "&logo=" + encodeURIComponent(todo.logo) : "")
                )
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
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
};

export default Completed;
