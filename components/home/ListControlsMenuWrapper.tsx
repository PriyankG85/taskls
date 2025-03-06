import React, { useContext } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react-native";
import { Menu, MenuItem, MenuItemLabel, MenuSeparator } from "../ui/menu";
import { useAlertDialog } from "@/hooks/useAlertDialog";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import TodosContext from "@/context/userTodos";
import { TaskGroup } from "@/types/taskGroupProps";
import { TaskProps } from "@/types/taskProps";
import { handleDeleteTaskList } from "@/utils/handleTaskList";
import AddTaskListContext from "@/context/addTaskList";
import { router } from "expo-router";
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
  const alertDialog = useAlertDialog();
  const dark = useColorScheme().colorScheme === "dark";

  const [showMenu, setShowMenu] = React.useState(false);
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

  const handleRemoveTaskGroup = (name: string) => {
    handleDeleteTaskList(taskGroups, setTaskGroups, name, todos, setTodos);
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
        <TouchableOpacity
          activeOpacity={0.8}
          onLongPress={() => setShowMenu(true)}
          aria-expanded={triggerProps["aria-expanded"]}
          ref={triggerProps.ref}
          className="flex-row w-full rounded-3xl p-2 justify-between items-center overflow-hidden dark:bg-dark-bg-300/80 bg-light-bg-300/80 shadow-background-dark shadow-xl"
          {...props}
        >
          {children}
        </TouchableOpacity>
      )}
    >
      <MenuItem
        android_ripple={{
          color: dark ? "#6E6E6E50" : "#BDBDBD50",
          radius: 120,
        }}
        onPress={handleAddTask}
        className="gap-2"
        textValue="Add Task"
      >
        <Plus size={16} color={"#22c55e"} />
        <MenuItemLabel className="font-roboto">Add Task</MenuItemLabel>
      </MenuItem>

      <MenuSeparator />

      <MenuItem
        android_ripple={{
          color: dark ? "#6E6E6E50" : "#BDBDBD50",
          radius: 120,
        }}
        onPress={handleEdit}
        className="gap-2"
        textValue="Edit List"
      >
        <Pencil size={16} color={"#3B82F6"} />
        <MenuItemLabel className="font-roboto">Edit List</MenuItemLabel>
      </MenuItem>

      <MenuSeparator />

      <MenuItem
        android_ripple={{
          color: dark ? "#6E6E6E50" : "#BDBDBD50",
          radius: 120,
        }}
        onPress={() =>
          alertDialog.show(
            `Sure want to delete ${listTitle} List?`,
            () => handleRemoveTaskGroup(listTitle),
            "All the tasks in this list will also be deleted."
          )
        }
        className="gap-2"
        textValue="Delete List"
      >
        <Trash2 size={16} color={"#B91C1C"} />
        <MenuItemLabel className="font-roboto">Delete List</MenuItemLabel>
      </MenuItem>
    </Menu>
  );
};

export default ListControlsMenuWrapper;
