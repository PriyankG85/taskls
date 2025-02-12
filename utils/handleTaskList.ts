import { setDataToLocalStorage } from "@/hooks/useHandleLocalStorage";
import { TaskGroup } from "@/types/taskGroupProps";
import { TaskProps } from "@/types/taskProps";
import { ToastAndroid } from "react-native";

export const handleAddTaskList = async ({
  input,
  logo,
  taskGroups,
  setTaskGroups,
  onInvalidInput,
  onNoInput,
}: {
  input: string;
  logo?: string;
  taskGroups: TaskGroup[];
  setTaskGroups(groups: TaskGroup[]): void;
  onInvalidInput?: () => void;
  onNoInput?: () => void;
}) => {
  let nameExists = false;
  taskGroups.forEach((group: any) => {
    if (group.name === input.trim()) nameExists = true;
  });

  if (input === "") {
    onInvalidInput?.();
    onNoInput?.();
    return;
  } else if (nameExists) {
    onInvalidInput?.();
    ToastAndroid.show("A List exists with this name.", 5);
    return;
  }

  const groupData = {
    name: input,
    img: logo,
  };

  setDataToLocalStorage(
    "taskGroups",
    JSON.stringify([...taskGroups, groupData])
  );
  setTaskGroups([...taskGroups, groupData]);
};

export const handleDeleteTaskList = async (
  taskGroups: TaskGroup[],
  setTaskGroups: (groups: TaskGroup[]) => void,
  groupName: string,
  todos: TaskProps[],
  setTodos: (todos: TaskProps[]) => void
) => {
  const newGroups = taskGroups.filter(
    (group: TaskGroup) => group.name !== groupName
  );
  const newTodos = todos.filter((todo) => todo.taskGroup !== groupName);

  setDataToLocalStorage("todos", JSON.stringify(newTodos));
  setTodos(newTodos);

  setTaskGroups(newGroups);
  setDataToLocalStorage("taskGroups", JSON.stringify(newGroups));
};
