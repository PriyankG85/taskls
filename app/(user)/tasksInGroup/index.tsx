import { View, Text, Pressable } from "react-native";
import React from "react";
import TodosContext from "@/context/userTodos";
import { TaskProps } from "@/types/taskProps";
import TaskCard from "@/components/taskInGroup/TaskCard";
import { router, useLocalSearchParams } from "expo-router";
import { Box } from "@/components/ui/box";
import {
  Clock,
  Edit,
  Ellipsis,
  Flag,
  Plus,
  SlidersHorizontal,
  Trash2,
} from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { Image } from "expo-image";
import { TaskGroup } from "@/types/taskGroupProps";
import TaskControlsMenuWrapper from "@/components/global/TaskControlsMenuWrapper";
import { useAlertDialog } from "@/hooks/useAlertDialog";
import { handleDeleteTaskList } from "@/utils/handleTaskList";
import TextAvatar from "@/components/global/TextAvatar";
import AddTaskListContext from "@/context/addTaskList";
import FilterTasksDialog, {
  FilterCategory,
  FilterSelections,
} from "@/components/global/FilterTasksDialog";
import Animated, { LinearTransition } from "react-native-reanimated";
import { Menu, MenuItem, MenuItemLabel } from "@/components/ui/menu";
import { ScrollView } from "react-native";

const TasksInGroup = () => {
  const dark = useColorScheme().colorScheme === "dark";

  const { todos, taskGroups, setTodos, setTaskGroups } = React.useContext<{
    todos: TaskProps[];
    taskGroups: TaskGroup[];
    setTodos: React.Dispatch<React.SetStateAction<TaskProps[]>>;
    setTaskGroups: React.Dispatch<React.SetStateAction<TaskGroup[]>>;
  }>(TodosContext);
  const {
    showWithEditMode,
  }: { showWithEditMode: (listName: string, logo?: string) => void } =
    React.useContext(AddTaskListContext);

  const params = useLocalSearchParams();
  const listTitleParam = decodeURIComponent(params.groupName as string);
  const listInfo = taskGroups.find((group) => group.name === listTitleParam);

  const alertDialog = useAlertDialog();

  if (!listInfo) {
    alertDialog.show("Oops!", () => { }, "Something went wrong.", "Okay", false);
    router.back();
    return;
  }

  const groupTodos = React.useMemo(
    () => todos.filter((todo) => todo.taskGroup === listInfo?.name),
    [todos]
  );
  const groupName = listInfo.name;
  const groupLogo = listInfo.img;

  const [todosToDisplay, setTodosToDisplay] = React.useState(groupTodos);
  const [isFilterVisible, setIsFilterVisible] = React.useState(false);
  const [activeFilters, setActiveFilters] = React.useState<FilterSelections>(
    {}
  );

  const progress = groupTodos.filter((task) => task.completed).length / groupTodos.length;

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
    if (filtersCount() === 0) setTodosToDisplay(groupTodos);
    else applyFilters(activeFilters);
  }, [groupTodos]);

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
  ];

  const applyFilters = (selections: FilterSelections) => {
    setActiveFilters(selections);

    // Filter tasks based on selections
    let filtered = [...groupTodos];

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
          (priority) => (task.priority ?? "Medium") === priority
        )
      );
    }

    setTodosToDisplay(filtered);
  };

  const handleRemoveTaskGroup = () => {
    alertDialog.show(
      "Delete List?",
      (e, customInputOptionsValues) => {
        handleDeleteTaskList(
          taskGroups,
          setTaskGroups,
          groupName,
          todos,
          setTodos,
          customInputOptionsValues[0] ?? false
        );
        router.back();
      },
      undefined,
      "Yes",
      true,
      [
        {
          type: "checkbox",
          text: "Delete all tasks in this list as well?",
        },
      ]
    );
  };

  const handleEditList = async () => {
    showWithEditMode(groupName, groupLogo);
  };

  return (
    <>
      <View className="flex-1 px-5 pt-10 gap-4">
        <View className="flex-row justify-between items-center">
          <View className="flex-row gap-2">
            <Box className="rounded-3xl size-20 p-2 bg-background-100/25 justify-center items-center">
              {groupLogo && groupLogo !== "" ? (
                <Image
                  source={{ uri: groupLogo }}
                  className="w-full h-full rounded-xl"
                />
              ) : (
                <TextAvatar text={groupName} />
              )}
            </Box>
            <View className="gap-1 py-2">
              <View className="flex-row items-center gap-2 w-[57vw]">
                <Text
                  numberOfLines={1}
                  className="font-Metamorphous text-xl dark:text-dark-text-100 text-light-text-100"
                >
                  {groupName}
                </Text>
                <Pressable onPress={handleEditList}>
                  <Edit size={18} color={dark ? "#ffffff" : "#000000"} />
                </Pressable>
              </View>
              <Text className="font-Metamorphous text-sm dark:text-dark-accent-200 text-light-accent-200 ml-1">
                {groupTodos.length} tasks · {Math.round(groupTodos.length - groupTodos.length * progress)} pending
              </Text>
            </View>
          </View>
          <View className="flex-col items-center gap-1">
            <Pressable
              android_ripple={{
                color: dark ? "#e0e0e010" : "#5c5c5c10",
                radius: 5,
              }}
              className="p-1"
              onPress={() =>
                router.push({
                  pathname: "/addTask",
                  params: { taskGroup: groupName },
                })
              }
            >
              <Plus
                size={22}
                color={dark ? "#ffffff" : "#000000"}
                className="mr-3"
              />
            </Pressable>
            <Menu
              offset={5}
              trigger={(props) => (
                <Pressable
                  andriod_ripple={{
                    color: dark ? "#e0e0e010" : "#5c5c5c10",
                    radius: 5,
                  }}
                  {...props}
                >
                  <Ellipsis size={18} color={dark ? "#fbfbfb" : "#1b1b1b"} />
                </Pressable>
              )}
              className="right-2 bg-background-muted shadow rounded-xl"
            >
              <MenuItem
                key={"delete"}
                textValue="Delete"
                android_ripple={{
                  color: dark ? "#e0e0e010" : "#5c5c5c10",
                  foreground: true,
                }}
                onPress={handleRemoveTaskGroup}
                className="gap-2"
              >
                <Trash2 size={16} color={"#B91C1C"} />
                <MenuItemLabel
                  size="lg"
                  className="dark:text-white text-black font-roboto"
                >
                  Delete
                </MenuItemLabel>
              </MenuItem>
            </Menu>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-[10px] pl-[5px] items-center"
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
                className={`rounded-lg bg-background-50 px-7 py-2 overflow-hidden ${active && "border border-outline-500"
                  }`}
                onPress={() =>
                  applyFilters({ ...activeFilters, status: item.id })
                }
              >
                <Text
                  className={`text-base text-typography-400 ${active && "text-typography-900 font-extrabold"
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
          data={todosToDisplay.slice().reverse()}
          keyExtractor={(item) => item.taskId}
          renderItem={({ item: todo }) => (
            <TaskCard
              tags={todo.tags}
              taskId={todo.taskId}
              notificationId={todo.notificationId}
              taskTitle={todo.taskTitle}
              dueDate={todo.dueDate}
              completed={todo.completed}
            />
          )}
          ListEmptyComponent={
            <Text className="text-lg text-center text-typography-500">
              No tasks found
            </Text>
          }
          contentContainerClassName="mt-2 gap-2 pb-10"
          className="flex-1"
          itemLayoutAnimation={LinearTransition}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <FilterTasksDialog
        isVisible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        onApply={applyFilters}
        categories={filterCategories}
        initialSelections={activeFilters}
      />
    </>
  );
};

export default TasksInGroup;
