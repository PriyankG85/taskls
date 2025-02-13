import React, { useContext } from "react";
import { Pencil, Trash2 } from "lucide-react-native";
import { Menu, MenuItem, MenuItemLabel, MenuSeparator } from "../ui/menu";
import { useAlertDialog } from "@/hooks/useAlertDialog";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import TodosContext from "@/context/userTodos";
import { TaskGroup } from "@/types/taskGroupProps";
import { useInputDialog } from "../ui/input-dialog";
import { TaskProps } from "@/types/taskProps";
import { handleDeleteTaskList, handleRenameList } from "@/utils/handleTaskList";

interface Props extends TouchableOpacityProps {
  listTitle: string;
  children: React.ReactElement;
}

const ListControlsMenuWrapper: React.FC<Props> = ({
  listTitle,
  className,
  children,
  ...props
}) => {
  const alertDialog = useAlertDialog();
  const [showMenu, setShowMenu] = React.useState(false);
  const { prompt } = useInputDialog();

  const { taskGroups, setTaskGroups, todos, setTodos } = useContext<{
    taskGroups: TaskGroup[];
    setTaskGroups(groups: TaskGroup[]): void;
    todos: TaskProps[];
    setTodos: React.Dispatch<React.SetStateAction<TaskProps[]>>;
  }>(TodosContext);

  const handleRemoveTaskGroup = (name: string) => {
    handleDeleteTaskList(taskGroups, setTaskGroups, name, todos, setTodos);
  };

  const handleRename = async () => {
    await handleRenameList({
      listTitle,
      taskGroups,
      setTaskGroups,
      todos,
      setTodos,
      prompt,
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
          className="flex-row w-full rounded-3xl p-3 justify-between items-center overflow-hidden dark:bg-dark-bg-300/80 bg-light-bg-300/80 shadow-background-dark shadow-xl"
          {...props}
        >
          {children}
        </TouchableOpacity>
      )}
    >
      <MenuItem
        onPress={handleRename}
        className="gap-2 active:bg-secondary-700"
        textValue="Rename List"
      >
        <Pencil size={16} color={"#3B82F6"} />
        <MenuItemLabel className="font-roboto">Rename List</MenuItemLabel>
      </MenuItem>

      <MenuSeparator />

      <MenuItem
        onPress={() =>
          alertDialog.show(
            `Sure want to delete ${listTitle} List?`,
            () => handleRemoveTaskGroup(listTitle),
            "All the tasks in this list will also be deleted."
          )
        }
        className="gap-2 active:bg-secondary-700"
        textValue="Delete List"
      >
        <Trash2 size={16} color={"#B91C1C"} />
        <MenuItemLabel className="font-roboto">Delete List</MenuItemLabel>
      </MenuItem>
    </Menu>
  );
};

export default ListControlsMenuWrapper;
