import React, { useContext } from "react";
import { useAlertDialog } from "@/hooks/useAlertDialog";
import { Menu, MenuItem, MenuItemLabel, MenuSeparator } from "../ui/menu";
import { Pencil, Trash2 } from "lucide-react-native";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import TodosContext from "@/context/userTodos";
import { TaskProps } from "@/types/taskProps";
import { setDataToLocalStorage } from "@/hooks/useHandleLocalStorage";
import { router } from "expo-router";
import { handleDeleteTask } from "@/utils/handleTask";
import { useColorScheme } from "nativewind";

interface Props extends TouchableOpacityProps {
  children: React.ReactElement;
  taskId: string;
}

const TaskControlsMenuWrapper: React.FC<Props> = ({
  children,
  taskId,
  ...props
}) => {
  const alertDialog = useAlertDialog();
  const dark = useColorScheme().colorScheme === "dark";

  const [showMenu, setShowMenu] = React.useState(false);

  const { todos, setTodos } = useContext<{
    todos: TaskProps[];
    setTodos: React.Dispatch<React.SetStateAction<TaskProps[]>>;
  }>(TodosContext);

  const handleRemoveTask = async (taskId: string) => {
    const notificationId = todos.find(
      (todo) => todo.taskId === taskId
    )?.notificationId;
    await handleDeleteTask(todos, setTodos, taskId, notificationId);
  };

  const handleEditTask = () => {
    router.push({
      pathname: "/editTask/[taskId]",
      params: { taskId },
    });
  };

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
        onPress={handleEditTask}
        className="gap-2 active:bg-secondary-700"
        textValue="Edit Task"
      >
        <Pencil size={16} color={"#3B82F6"} />
        <MenuItemLabel className="font-roboto">Edit Task</MenuItemLabel>
      </MenuItem>

      <MenuSeparator />

      <MenuItem
        android_ripple={{
          color: dark ? "#6E6E6E50" : "#BDBDBD50",
          radius: 120,
        }}
        onPress={() =>
          alertDialog.show(`Sure want to delete the task?`, () =>
            handleRemoveTask(taskId)
          )
        }
        className="gap-2 active:bg-secondary-700"
        textValue="Delete Task"
      >
        <Trash2 size={16} color={"#B91C1C"} />
        <MenuItemLabel className="font-roboto">Delete Task</MenuItemLabel>
      </MenuItem>
    </Menu>
  );
};

export default TaskControlsMenuWrapper;
