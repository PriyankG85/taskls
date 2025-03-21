import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Animated as NativeAnimated,
  ScrollView,
} from "react-native";
import React, { Suspense, useContext } from "react";
import TodosContext from "@/context/userTodos";
import TaskCard from "@/components/tabs/TaskCard";
import { useRouter } from "expo-router";
import { setDataToLocalStorage } from "@/hooks/useHandleLocalStorage";
import { TaskProps } from "@/types/taskProps";
import TaskControlsMenuWrapper from "@/components/global/TaskControlsMenuWrapper";
import LoadingIndicator from "@/components/global/LoadingIndicator";
import Animated, { LinearTransition } from "react-native-reanimated";
import ScrollYContext from "@/context/scrollY";
import { TaskGroup } from "@/types/taskGroupProps";
import { useAlertDialog } from "@/hooks/useAlertDialog";
import { useColorScheme } from "nativewind";

const Completed = () => {
  const router = useRouter();
  const {
    todos,
    setTodos,
    taskGroups,
  }: {
    todos: TaskProps[];
    setTodos(list: TaskProps[]): void;
    taskGroups: TaskGroup[];
  } = useContext(TodosContext);
  const dark = useColorScheme().colorScheme === "dark";
  const alertDialog = useAlertDialog();

  const [selectedList, setSelectedList] = React.useState("All");
  const scrollY: NativeAnimated.Value = useContext(ScrollYContext);

  // TODO: Sort the completed todos according to the modifiedAt field
  const completedTodos = todos
    .filter((todo) => todo.completed === true)
    .reverse();

  const handleClear = () => {
    alertDialog.show(
      `Sure want to permanently remove all completed tasks?`,
      () => {
        const remainingTodos = todos.filter((todo) => todo.completed !== true);
        setDataToLocalStorage("todos", JSON.stringify(remainingTodos));
        setTodos(remainingTodos);
      }
    );
  };

  return (
    <Suspense fallback={<LoadingIndicator />}>
      <View className="flex-1 px-5 pt-10 gap-6">
        <View className="flex-row items-center justify-between">
          <Text className={`font-Metamorphous text-3xl text-typography-950`}>
            Completed Tasks
          </Text>
          <TouchableOpacity
            onPress={handleClear}
            className={`px-3 ${completedTodos.length === 0 && "opacity-50"}`}
            activeOpacity={0.7}
            disabled={completedTodos.length === 0}
          >
            <Text className="text-base font-roboto text-typography-500">
              Clear
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-2 items-center"
          className="max-h-[36px]"
        >
          {["All", ...taskGroups.map((group) => group.name)].map((item) => (
            <Pressable
              key={item}
              android_ripple={{
                color: dark ? "#e0e0e010" : "#5c5c5c10",
                foreground: true,
              }}
              className={`rounded-lg bg-background-50 px-7 py-2 overflow-hidden ${
                selectedList === item && "border border-outline-500"
              }`}
              onPress={() => setSelectedList(item)}
            >
              <Text
                className={`text-base font-roboto text-typography-400 ${
                  selectedList === item && "text-typography-900 font-extrabold"
                }`}
              >
                {item}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <Animated.FlatList
          maxToRenderPerBatch={10}
          className="flex-1"
          onScroll={NativeAnimated.event(
            [
              {
                nativeEvent: { contentOffset: { y: scrollY } },
              },
            ],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
          data={completedTodos.filter(
            (todo) => todo.taskGroup === selectedList || selectedList === "All"
          )}
          keyExtractor={(item) => item.taskId}
          showsVerticalScrollIndicator={false}
          contentContainerClassName="gap-2 pb-20"
          itemLayoutAnimation={LinearTransition}
          renderItem={({ item: todo }) => (
            <TaskCard
              tags={todo.tags}
              taskId={todo.taskId}
              notificationId={todo.notificationId}
              taskTitle={todo.taskTitle}
              dueDate={todo.dueDate}
              logo={todo.logo}
              taskGroup={todo.taskGroup}
              completed={todo.completed}
            />
          )}
          ListEmptyComponent={
            <Text className={`text-lg text-center text-typography-500`}>
              No tasks completed!
            </Text>
          }
        />
      </View>
    </Suspense>
  );
};

export default Completed;
