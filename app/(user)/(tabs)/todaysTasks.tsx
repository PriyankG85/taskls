import {
  View,
  Text,
  useColorScheme,
  ScrollView,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import TodaysTaskCard from "@/components/TaskCard";
import TodosContext from "@/context/userTodos";
import { useRouter } from "expo-router";
import { TaskProps } from "@/types/taskProps";

const TodaysTasks = () => {
  const dark = useColorScheme() === "dark";
  const today = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    weekday: "short",
  });
  const { todos }: { todos: TaskProps[] } = useContext(TodosContext);
  const todaysTodos = todos.filter((todo) => todo.dueDate === today);
  const [selected, setSelected] = useState("All");
  const [todosToDisplay, setTodosToDisplay] = useState(todaysTodos);
  const router = useRouter();

  useEffect(() => {
    setTodosToDisplay(todaysTodos);

    if (selected === "All") {
      setTodosToDisplay(todaysTodos);
    } else if (selected === "In Progress") {
      setTodosToDisplay(
        todaysTodos.filter(
          (todo) => todo.completed === false || !todo.completed
        )
      );
    } else if (selected === "Completed") {
      setTodosToDisplay(todaysTodos.filter((todo) => todo.completed === true));
    }
  }, [todos, selected]);

  return (
    <ScrollView
      className={`flex-1 pt-7 ${dark ? "bg-dark-bg-100" : "bg-light-bg-100"}`}
      contentContainerStyle={{ gap: 25 }}
    >
      <View className="gap-1 px-5">
        <Text
          className={`font-Montserrat text-3xl ${
            dark ? "text-dark-text-100" : "text-light-text-100"
          }`}
        >
          Today's Tasks
        </Text>
        <Text
          className={`text-xl ${
            dark ? "text-blue-500" : "text-blue-600"
          } font-spaceMonoBold`}
        >
          {today}
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 10, paddingLeft: 20 }}
      >
        {["All", "In Progress", "Completed"].map((item) => (
          <Pressable
            key={item}
            className={`rounded-lg ${
              dark ? "bg-dark-bg-200" : "bg-light-bg-200"
            } px-7 py-2 ${selected === item && "bg-blue-500/80"}`}
            onPress={() => setSelected(item)}
          >
            <Text
              className={`text-base font-semibold ${
                dark ? "text-dark-text-200/70" : "text-light-text-200/70"
              } ${selected === item && "text-white"}`}
            >
              {item}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={{ gap: 10, paddingHorizontal: 20 }}>
        {todaysTodos.length === 0 ? (
          <Text
            className={`text-lg text-center ${
              dark ? "text-dark-text-200/60" : "text-light-text-200/60"
            }`}
          >
            No Tasks for Today!
          </Text>
        ) : todosToDisplay.length === 0 ? (
          <Text
            className={`text-lg text-center ${
              dark ? "text-dark-text-200/60" : "text-light-text-200/60"
            }`}
          >
            No Tasks
          </Text>
        ) : (
          todosToDisplay.map((todo, i) => (
            <TouchableOpacity
              key={i}
              activeOpacity={0.75}
              onPress={() =>
                router.push(
                  "/taskPreview?taskGroup=" +
                    todo.taskGroup +
                    "&taskTitle=" +
                    todo.taskTitle +
                    "&taskId=" +
                    todo.taskId +
                    "&notificationId=" +
                    todo.notificationId +
                    "&taskDescription=" +
                    todo.taskDescription +
                    "&dueDate=" +
                    todo.dueDate +
                    (todo.logo ? "&logo=" + encodeURIComponent(todo.logo) : "")
                )
              }
            >
              <TodaysTaskCard
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

      <View className="bottom_tabs_safe_area h-[35px]" />
    </ScrollView>
  );
};

export default TodaysTasks;
