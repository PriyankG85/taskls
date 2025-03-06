import Header from "@/components/global/Header";
import TodosContext from "@/context/userTodos";
import UserContext from "@/context/userdetails";
import { getDataFromLocalStorage } from "@/hooks/useHandleLocalStorage";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useContext, useEffect, useState } from "react";
import { useColorScheme } from "nativewind";
import { TaskProps } from "@/types/taskProps";
import AddTaskListProvider from "@/components/global/addTaskListProvider";
import { View } from "moti";

export default function RootLayout() {
  const colorScheme = useColorScheme().colorScheme;
  const { name } = useContext(UserContext);
  const [todos, setTodos] = useState<TaskProps[]>([]);
  const [taskGroups, setTaskGroups] = useState([]);

  useEffect(() => {
    getDataFromLocalStorage("todos").then((value) => {
      if (value) {
        setTodos(JSON.parse(value));
      }
    });

    getDataFromLocalStorage("taskGroups").then((value) => {
      if (value) {
        setTaskGroups(JSON.parse(value));
      }
    });
  }, []);

  return (
    <View className="dark:bg-dark-bg-100 bg-light-bg-100 flex-1">
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

      <TodosContext.Provider
        value={{ todos, setTodos, taskGroups, setTaskGroups }}
      >
        <AddTaskListProvider>
          <Header name={name} />

          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "transparent" },
              animation: "slide_from_right",
              animationDuration: 200,
              presentation: "card",
              gestureEnabled: true,
              gestureDirection: "horizontal",
            }}
          />
        </AddTaskListProvider>
      </TodosContext.Provider>
    </View>
  );
}
