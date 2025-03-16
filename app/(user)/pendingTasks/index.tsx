import { View, Text, Pressable } from "react-native";
import React, { useContext } from "react";
import TodosContext from "@/context/userTodos";
import { TaskProps } from "@/types/taskProps";
import TaskCard from "@/components/tabs/TaskCard";
import { router } from "expo-router";
import TaskControlsMenuWrapper from "@/components/global/TaskControlsMenuWrapper";
import { TaskGroup } from "@/types/taskGroupProps";
import FilterTasksDialog, {
  FilterCategory,
  FilterSelections,
} from "@/components/global/FilterTasksDialog";
import { Check, Flag, List, SlidersHorizontal } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import Animated, { LinearTransition } from "react-native-reanimated";

const PendingTasks = () => {
  const dark = useColorScheme().colorScheme === "dark";
  const { todos, taskGroups } = useContext<{
    todos: TaskProps[];
    taskGroups: TaskGroup[];
  }>(TodosContext);

  const pendingTodos = todos.filter((todo) => !todo.completed);
  const [todosToDisplay, setTodosToDisplay] = React.useState(pendingTodos);
  const [isFilterVisible, setIsFilterVisible] = React.useState(false);
  const [activeFilters, setActiveFilters] = React.useState<FilterSelections>(
    {}
  );

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
    setTodosToDisplay(pendingTodos);
  }, [todos]);

  // Define filter categories
  const filterCategories: FilterCategory[] = [
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
    let filtered = [...pendingTodos];

    //* Apply priority filter
    if (selections.priority && selections.priority.length > 0) {
      filtered = filtered.filter((task) =>
        (selections.priority as string[]).some(
          (priority) => (task.priority ?? "Medium") === priority
        )
      );
    }

    //* Apply list filter
    if (selections.list) {
      filtered = filtered.filter((task) => task.taskGroup === selections.list);
    }

    setTodosToDisplay(filtered);
  };

  const removeFilter = (key: string, value: string) => {
    let isFilterMutiSelectable = filterCategories.find(
      (c) => c.id === key
    )?.multiSelect;
    let newFilters = { ...activeFilters };
    if (!isFilterMutiSelectable) delete newFilters[key];
    else
      newFilters[key] = (newFilters[key] as string[]).filter(
        (id) => id !== value
      );
    applyFilters(newFilters);
  };

  return (
    <Animated.View className="flex-1 gap-5 pt-10">
      <View className="flex-row px-5 gap-7 items-end justify-between">
        <View className="gap-1">
          <Text className="font-Metamorphous text-3xl dark:text-dark-text-100 text-light-text-100">
            Pending Tasks
          </Text>
          <Text className="font-Metamorphous text-base dark:text-dark-accent-200 text-light-accent-200 ml-1">
            {pendingTodos.length} tasks pending
          </Text>
        </View>

        <Pressable
          android_ripple={{
            color: dark ? "#e0e0e010" : "#5c5c5c10",
            foreground: true,
          }}
          className="rounded-lg size-8 justify-center items-center bg-background-50 overflow-hidden"
          onPress={() => setIsFilterVisible(true)}
        >
          <SlidersHorizontal
            size={18}
            strokeWidth={1.5}
            color={dark ? "#d1d5db" : "#6b7280"}
          />
        </Pressable>
      </View>

      {filtersCount() > 0 && (
        <Animated.FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="px-5 gap-2"
          className="max-h-[36px]"
          data={Object.keys(activeFilters).flatMap((key) => {
            const value = activeFilters[key];
            if (Array.isArray(value)) {
              return value.map((val) => ({
                id: val,
                key: key,
              }));
            } else {
              return {
                id: activeFilters[key] as string,
                key: key,
              };
            }
          })}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            let Icon = filterCategories.find((c) => c.id === item.key)?.icon;
            let label = filterCategories
              .find((c) => c.id === item.key)
              ?.options.find((o) => o.id === item.id)?.label;

            return (
              <Pressable
                key={item.id}
                style={{ backgroundColor: dark ? "#0A84FF" : "#007AFF" }}
                className="flex-row items-center gap-2 px-5 py-2 rounded-full overflow-hidden"
                android_ripple={{
                  color: dark ? "#ffffff30" : "#00000030",
                  foreground: true,
                }}
                onPress={() => removeFilter(item.key, item.id)}
                accessibilityLabel={`${label} filter option`}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: true }}
              >
                {Icon && <Icon size={16} color="#fff" />}
                <Text
                  style={[
                    {
                      fontSize: 14,
                      marginRight: 4,
                      color: "#fff",
                    },
                  ]}
                >
                  {label}
                </Text>
                <Check size={16} color="#fff" />
              </Pressable>
            );
          }}
        />
      )}

      <Animated.FlatList
        data={todosToDisplay.slice().reverse()}
        renderItem={({ item: todo }) => (
          <TaskControlsMenuWrapper
            key={todo.taskId}
            taskId={todo.taskId}
            onPress={() =>
              router.push({
                pathname: "/taskPreview",
                params: {
                  priority: todo.priority,
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
            <TaskCard
              priority={todo.priority}
              taskId={todo.taskId}
              notificationId={todo.notificationId}
              taskTitle={todo.taskTitle}
              dueDate={todo.dueDate}
              taskDescription={todo.taskDescription}
              taskGroup={todo.taskGroup}
              completed={todo.completed}
            />
          </TaskControlsMenuWrapper>
        )}
        ListEmptyComponent={
          <Text className="dark:text-dark-text-200/70 text-light-text-200/70 text-lg text-center mt-4 font-Quattrocento">
            No pending tasks!
          </Text>
        }
        keyExtractor={(item) => item.taskId}
        contentContainerClassName="px-5 pb-10 gap-2"
        className="flex-1"
        itemLayoutAnimation={LinearTransition}
        showsVerticalScrollIndicator={false}
      />

      <FilterTasksDialog
        isVisible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        onApply={applyFilters}
        categories={filterCategories}
        initialSelections={activeFilters}
      />
    </Animated.View>
  );
};

export default PendingTasks;
