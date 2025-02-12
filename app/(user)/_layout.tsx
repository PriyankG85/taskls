import Header from "@/components/global/Header";
import TodosContext from "@/context/userTodos";
import UserContext from "@/context/userdetails";
import {
  getDataFromLocalStorage,
  setDataToLocalStorage,
} from "@/hooks/useHandleLocalStorage";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useContext, useEffect, useState } from "react";
import { useColorScheme } from "nativewind";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TaskProps } from "@/types/taskProps";
import parseDateString from "@/utils/parseDateString";

export default function RootLayout() {
  const colorScheme = useColorScheme().colorScheme;
  const { name } = useContext(UserContext);
  const [todos, setTodos] = useState<TaskProps[]>([]);
  const [taskGroups, setTaskGroups] = useState([]);

  useEffect(() => {
    const migrateExistingDates = async (existingTodos: TaskProps[]) => {
      const migrationFlag = await AsyncStorage.getItem("dateMigrationComplete");

      if (!migrationFlag) {
        // Perform the migration
        const updatedTodos = migrateDates(existingTodos);
        setTodos(updatedTodos); // Update state

        // Set the flag so migration doesn't run again
        await AsyncStorage.setItem("dateMigrationComplete", "true");
      }
    };

    getDataFromLocalStorage("todos").then((value) => {
      if (value) {
        setTodos(JSON.parse(value));
        migrateExistingDates(JSON.parse(value));
      }
    });

    getDataFromLocalStorage("taskGroups").then((value) => {
      if (value) {
        setTaskGroups(JSON.parse(value));
      }
    });
  }, []);

  return (
    <SafeAreaView className="dark:bg-dark-bg-300 bg-light-bg-300 flex-1">
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

      <Header name={name} />

      <TodosContext.Provider
        value={{ todos, setTodos, taskGroups, setTaskGroups }}
      >
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "transparent" },
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="tasksInGroup/index" />
          <Stack.Screen name="taskPreview/index" />
        </Stack>
      </TodosContext.Provider>
    </SafeAreaView>
  );
}

const migrateDates = (todos: TaskProps[]) => {
  const updatedTodos = todos.map((todo) => {
    if (todo.dueDate?.date && typeof todo.dueDate.date === "string") {
      // Parse the old date format
      const parsedDate = parseDateString(todo.dueDate.date);

      // Convert to ISO 8601
      const isoDate = parsedDate.toISOString();

      return {
        ...todo,
        dueDate: {
          ...todo.dueDate,
          date: isoDate,
        },
      };
    }
    return todo;
  });
  setDataToLocalStorage("todos", JSON.stringify(updatedTodos)); // Save back to local storage
  return updatedTodos;
};
