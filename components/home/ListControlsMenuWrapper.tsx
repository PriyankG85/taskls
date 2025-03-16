import React, { useContext, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react-native";
import { Menu, MenuItem, MenuItemLabel, MenuSeparator } from "../ui/menu";
import { useAlertDialog } from "@/hooks/useAlertDialog";
import { TouchableOpacityProps, View } from "react-native";
import TodosContext from "@/context/userTodos";
import { TaskGroup } from "@/types/taskGroupProps";
import { TaskProps } from "@/types/taskProps";
import { handleDeleteTaskList } from "@/utils/handleTaskList";
import AddTaskListContext from "@/context/addTaskList";
import { router } from "expo-router";
import { Text } from "react-native";
import { Pressable } from "react-native";
import CheckBox from "../global/CheckBox";
import { useColorScheme } from "nativewind";

interface Props extends TouchableOpacityProps {
  logo?: string;
  listTitle: string;
  children: React.ReactElement;
}

const ListControlsMenuWrapper: React.FC<Props> = ({
  logo,
  listTitle,
  className,
  children,
  ...props
}) => {
  const dark = useColorScheme().colorScheme === "dark";
  const alertDialog = useAlertDialog();

  const [showMenu, setShowMenu] = useState(false);

  const {
    showWithEditMode,
  }: { showWithEditMode: (listName: string, logo?: string) => void } =
    useContext(AddTaskListContext);

  const { taskGroups, setTaskGroups, todos, setTodos } = useContext<{
    taskGroups: TaskGroup[];
    setTaskGroups(groups: TaskGroup[]): void;
    todos: TaskProps[];
    setTodos: React.Dispatch<React.SetStateAction<TaskProps[]>>;
  }>(TodosContext);

  const handleRemoveTaskGroup = () => {
    alertDialog.show(
      `Sure want to delete '${listTitle}' List?`,
      (e, customInputOptionsValues) =>
        handleDeleteTaskList(
          taskGroups,
          setTaskGroups,
          listTitle,
          todos,
          setTodos,
          customInputOptionsValues[0] ?? false
        ),
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

  const handleEdit = async () => {
    showWithEditMode(listTitle, logo);
  };

  const handleAddTask = () =>
    router.push({
      pathname: "/addTask",
      params: { taskGroup: listTitle },
    });

  return (
    <Menu
      isOpen={showMenu}
      onClose={() => setShowMenu(false)}
      placement="bottom right"
      offset={-7}
      className={"bg-background-muted shadow-sm"}
      trigger={(triggerProps) => (
        <Pressable
          android_ripple={{
            color: dark ? "#e0e0e010" : "#5c5c5c10",
            foreground: true,
          }}
          onLongPress={() => setShowMenu(true)}
          aria-expanded={triggerProps["aria-expanded"]}
          ref={triggerProps.ref}
          className="flex-row w-full rounded-3xl p-2 justify-between items-center overflow-hidden dark:bg-dark-bg-300 bg-light-bg-200 shadow elevation-md"
          {...props}
        >
          {children}
        </Pressable>
      )}
    >
      <MenuItem
        onPress={handleAddTask}
        className="gap-2 active:opacity-70"
        textValue="Add Task"
      >
        <Plus size={16} color={"#22c55e"} />
        <MenuItemLabel className="font-roboto">Add Task</MenuItemLabel>
      </MenuItem>

      <MenuSeparator />

      <MenuItem
        onPress={handleEdit}
        className="gap-2 active:opacity-70"
        textValue="Edit List"
      >
        <Pencil size={16} color={"#3B82F6"} />
        <MenuItemLabel className="font-roboto">Edit List</MenuItemLabel>
      </MenuItem>

      <MenuSeparator />

      <MenuItem
        onPress={handleRemoveTaskGroup}
        className="gap-2 active:opacity-70"
        textValue="Delete List"
      >
        <Trash2 size={16} color={"#B91C1C"} />
        <MenuItemLabel className="font-roboto">Delete List</MenuItemLabel>
      </MenuItem>
    </Menu>
  );
};

export default ListControlsMenuWrapper;
