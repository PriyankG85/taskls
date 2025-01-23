import Header from "@/components/global/Header";
import TodosContext from "@/context/userTodos";
import UserContext from "@/context/userdetails";
import { getDataFromLocalStorage } from "@/hooks/useHandleLocalStorage";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useContext, useEffect, useState } from "react";
import { useColorScheme } from "nativewind";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  const colorScheme = useColorScheme().colorScheme;
  const { name } = useContext(UserContext);
  const [todos, setTodos] = useState([]);
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
    <SafeAreaView className="dark:bg-dark-bg-300 bg-light-bg-300 flex-1">
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

      <Header name={name} />

      <TodosContext.Provider
        value={{ todos, setTodos, taskGroups, setTaskGroups }}
      >
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="tasksInGroup" />
          <Stack.Screen name="taskPreview" />
        </Stack>
      </TodosContext.Provider>
    </SafeAreaView>
  );
}
