import {
  View,
  Text,
  Pressable,
  Animated as NativeAnimated,
  ScrollView,
} from "react-native";
import React, { Suspense, useContext, useState } from "react";
import TodaysTaskCard from "@/components/tabs/TaskCard";
import TodosContext from "@/context/userTodos";
import { router } from "expo-router";
import { TaskProps } from "@/types/taskProps";
import { useColorScheme } from "nativewind";
import LoadingIndicator from "@/components/global/LoadingIndicator";
import Animated, { LinearTransition } from "react-native-reanimated";
import ScrollYContext from "@/context/scrollY";
import TaskControlsMenuWrapper from "@/components/global/TaskControlsMenuWrapper";
import { Clock, Flag, List, SlidersHorizontal } from "lucide-react-native";
import FilterTasksDialog, {
  FilterCategory,
  FilterSelections,
} from "@/components/global/FilterTasksDialog";
import { TaskGroup } from "@/types/taskGroupProps";

const TodaysTasks = () => {
  const dark = useColorScheme().colorScheme === "dark";
  const today = new Date();
  const { todos, taskGroups }: { todos: TaskProps[]; taskGroups: TaskGroup[] } =
    useContext(TodosContext);
  const scrollY: NativeAnimated.Value = useContext(ScrollYContext);

  const todaysTodos = React.useMemo(
    () =>
      todos.filter((todo) => {
        const todayDate = today.toISOString().split("T")[0];
        const taskDate = todo.dueDate?.split("T")[0];
        return taskDate === todayDate;
      }),
    [todos]
  );
  const [todosToDisplay, setTodosToDisplay] = useState(todaysTodos);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterSelections>({});

  const filtersOtherThanStatusCount = () => {
    let count = 0;
    Object.keys(activeFilters).map((key) => {
      if (key === "status") return;
      let value = activeFilters[key];
      if (Array.isArray(value)) count += value.length;
      else count += 1;
    });
    return count;
  };

  const filtersCount = () => {
    let count = 0;
    Object.keys(activeFilters).map((key) => {
      let value = activeFilters[key];
      if (Array.isArray(value)) count += value.length;
      else count += 1;
    });
    return count;
  };

  React.useEffect(() => {
    if (filtersCount() === 0) setTodosToDisplay(todaysTodos);
    else applyFilters(activeFilters);
  }, [todaysTodos]);

  // Define filter categories
  const filterCategories: FilterCategory[] = [
    {
      id: "status",
      title: "Status",
      icon: Clock,
      options: [
        { id: "all", label: "All" },
        { id: "in-progress", label: "In Progress" },
        { id: "completed", label: "Completed" },
      ],
    },
    {
      id: "priority",
      title: "Priority",
      icon: Flag,
      options: [
        { id: "High", label: "High" },
        { id: "Medium", label: "Medium" },
        { id: "Low", label: "Low" },
      ],
      multiSelect: true,
    },
    {
      id: "list",
      title: "List",
      icon: List,
      options: taskGroups.map((group) => ({
        id: group.name,
        label: group.name,
      })),
    },
  ];

  const applyFilters = (selections: FilterSelections) => {
    setActiveFilters(selections);

    // Filter tasks based on selections
    let filtered = [...todaysTodos];

    //* Apply status filter
    if (selections.status) {
      filtered =
        selections.status === "all"
          ? filtered
          : filtered.filter(
              (task) =>
                (task.completed ?? false) ===
                (selections.status === "completed")
            );
    }

    //* Apply priority filter
    if (selections.priority) {
      filtered = filtered.filter((task) =>
        (selections.priority as string[]).some(
          (priority) => priority === (task.priority ?? "Medium")
        )
      );
    }

    //* Apply list filter
    if (selections.list) {
      filtered = filtered.filter((task) => task.taskGroup === selections.list);
    }

    setTodosToDisplay(filtered);
  };

  return (
    <Suspense fallback={<LoadingIndicator />}>
      <View className="flex-1 pt-7 gap-6">
        <View className="gap-1 px-5">
          <Text
            className={`font-Metamorphous text-3xl dark:text-dark-text-100 text-light-text-100`}
          >
            Today's Tasks
          </Text>
          <Text
            className={`text-xl dark:text-blue-500 text-blue-600 font-roboto font-bold`}
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
          contentContainerClassName="gap-[10px] pl-5 items-center"
          className="max-h-[36px]"
        >
          {filterCategories[0].options.map((item) => {
            let active =
              !Object.keys(activeFilters).includes("status") &&
              item.id === "all"
                ? true
                : activeFilters.status === item.id;
            return (
              <Pressable
                key={item.id}
                android_ripple={{
                  color: dark ? "#e0e0e010" : "#5c5c5c10",
                  foreground: true,
                }}
                className={`rounded-lg bg-background-50 px-7 py-2 overflow-hidden ${
                  active && "border border-outline-500"
                }`}
                onPress={() =>
                  applyFilters({ ...activeFilters, status: item.id })
                }
              >
                <Text
                  className={`text-base font-roboto text-typography-400 ${
                    active && "text-typography-900 font-extrabold"
                  }`}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}

          <View className="relative">
            <Pressable
              android_ripple={{
                color: dark ? "#e0e0e010" : "#5c5c5c10",
                foreground: true,
              }}
              className="rounded-lg size-10 justify-center items-center bg-background-50 overflow-hidden"
              onPress={() => setIsFilterVisible(true)}
            >
              <SlidersHorizontal
                size={20}
                strokeWidth={1.5}
                color={dark ? "#d1d5db" : "#6b7280"}
              />
            </Pressable>
            {filtersOtherThanStatusCount() > 0 && (
              <View className="absolute bottom-0 -right-2 bg-neutral-200 dark:bg-neutral-700 px-2 py-0.5 rounded-full">
                <Text className="text-xs text-neutral-800 dark:text-neutral-200">
                  {filtersOtherThanStatusCount()}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        <Animated.FlatList
          maxToRenderPerBatch={10}
          onScroll={NativeAnimated.event(
            [
              {
                nativeEvent: { contentOffset: { y: scrollY } },
              },
            ],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
          data={todosToDisplay.slice().reverse()}
          keyExtractor={(item) => item.taskId}
          showsVerticalScrollIndicator={false}
          className="flex-1"
          contentContainerClassName="gap-2 px-5 pb-20"
          itemLayoutAnimation={LinearTransition}
          renderItem={({ item: todo }) => (
            <TaskControlsMenuWrapper
              key={todo.taskId}
              taskId={todo.taskId}
              onPress={() =>
                router.push({
                  pathname: "/taskPreview",
                  params: { taskId: todo.taskId },
                })
              }
            >
              <TodaysTaskCard
                tags={todo.tags}
                taskId={todo.taskId}
                notificationId={todo.notificationId}
                taskTitle={todo.taskTitle}
                dueDate={todo.dueDate}
                logo={todo.logo}
                taskGroup={todo.taskGroup}
                completed={todo.completed}
              />
            </TaskControlsMenuWrapper>
          )}
          ListEmptyComponent={
            <Text className={`text-lg text-center text-typography-400`}>
              No Tasks
            </Text>
          }
        />
      </View>

      <FilterTasksDialog
        isVisible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        onApply={applyFilters}
        categories={filterCategories}
        initialSelections={activeFilters}
      />
    </Suspense>
  );
};

export default TodaysTasks;
