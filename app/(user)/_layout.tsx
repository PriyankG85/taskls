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
import { TaskProps } from "@/types/taskProps";
import AddTaskListDialogProvider from "@/components/global/addTaskListProvider";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View } from "react-native";

// TODO: Remove after migration
async function dueDateFormatMigration(todos: any) {
  const isDone = await getDataFromLocalStorage("dueDateFormatMigrationDone");
  if (isDone === "true") {
    return todos;
  }
  let newTodos = todos.forEach((todo: any) => {
    if (todo.dueDate) {
      todo.dueDate = todo.dueDate.date;
    }
  });
  await setDataToLocalStorage("todos", JSON.stringify(newTodos));
  await setDataToLocalStorage("dueDateFormatMigrationDone", "true");
  return newTodos;
}

export default function RootLayout() {
  const colorScheme = useColorScheme().colorScheme;
  const { name } = useContext(UserContext);
  const [todos, setTodos] = useState<TaskProps[]>([]);
  const [taskGroups, setTaskGroups] = useState([]);

  useEffect(() => {
    getDataFromLocalStorage("todos").then(async (value) => {
      if (value) {
        // TODO: Change after migration
        setTodos(await dueDateFormatMigration(JSON.parse(value)));
        // setTodos(JSON.parse(value));
      }
    });

    getDataFromLocalStorage("taskGroups").then((value) => {
      if (value) {
        setTaskGroups(JSON.parse(value));
      }
    });
  }, []);

  return (
    <SafeAreaProvider>
      <View className="dark:bg-dark-bg-100 bg-light-bg-100 flex-1">
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

        <TodosContext.Provider
          value={{ todos, setTodos, taskGroups, setTaskGroups }}
        >
          <AddTaskListDialogProvider>
            <Header name={name} />

            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: "transparent" },
                animation: "slide_from_right",
                presentation: "card",
                gestureEnabled: true,
                gestureDirection: "horizontal",
              }}
            />
          </AddTaskListDialogProvider>
        </TodosContext.Provider>
      </View>
    </SafeAreaProvider>
  );
}
