import {
  View,
  Text,
  ScrollView,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import TodaysTaskCard from "@/components/tabs/TaskCard";
import TodosContext from "@/context/userTodos";
import { router } from "expo-router";
import { TaskProps } from "@/types/taskProps";
import { useColorScheme } from "nativewind";

const TodaysTasks = () => {
  const dark = useColorScheme().colorScheme === "dark";
  const today = new Date();
  const { todos }: { todos: TaskProps[] } = useContext(TodosContext);
  const todaysTodos = todos.filter((todo) => {
    const todayDate = today.toISOString().split("T")[0];
    const taskDate = todo.dueDate?.date
      ? todo.dueDate.date.split("T")[0]
      : undefined;
    return taskDate === todayDate;
  });
  const [selected, setSelected] = useState("All");
  const [todosToDisplay, setTodosToDisplay] = useState(todaysTodos);

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
      className="flex-1 pt-7 dark:bg-dark-bg-100 bg-light-bg-100"
      contentContainerStyle={{ gap: 25 }}
    >
      <View className="gap-1 px-5">
        <Text
          className={`font-Montserrat text-3xl dark:text-dark-text-100 text-light-text-100`}
        >
          Today's Tasks
        </Text>
        <Text
          className={`text-xl dark:text-blue-500 text-blue-600 font-spaceMonoBold`}
        >
          {today.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            weekday: "short",
          })}
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
            className="rounded-lg bg-background-0 px-7 py-2"
            onPress={() => setSelected(item)}
          >
            <Text
              className={`text-base font-roboto text-typography-400 ${
                selected === item && "text-typography-900 font-extrabold"
              }`}
            >
              {item}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <View className="gap-[10px] px-5">
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
