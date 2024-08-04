import Header from "@/components/Header";
import TodosContext from "@/context/userTodos";
import UserContext from "@/context/userdetails";
import { getDataFromLocalStorage } from "@/hooks/useHandleLocalStorage";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  const colorScheme = useColorScheme();
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
    <SafeAreaView
      className={`${
        colorScheme === "dark" ? "bg-dark-bg-300" : "bg-light-bg-300"
      } flex-1`}
    >
      <StatusBar style="auto" />

      <Header name={name} />

      <TodosContext.Provider
        value={{ todos, setTodos, taskGroups, setTaskGroups }}
      >
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="taskPreview" />
        </Stack>
      </TodosContext.Provider>
    </SafeAreaView>
  );
}
