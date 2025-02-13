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

export const handleRenameList = async ({
  listTitle,
  taskGroups,
  todos,
  setTaskGroups,
  setTodos,
  prompt,
}: {
  listTitle: string;
  taskGroups: TaskGroup[];
  todos: TaskProps[];
  setTaskGroups: (groups: TaskGroup[]) => void;
  setTodos: (todos: TaskProps[]) => void;
  prompt: (message: string) => Promise<string>;
}) => {
  const input = await prompt("Enter a new name for the list");
  if (input.length !== 0) {
    const modifiedGroups = taskGroups.map((group: TaskGroup) =>
      group.name === listTitle
        ? {
            ...group,
            name: input.length === 0 ? group.name : input,
          }
        : group
    );
    const modifiedTasks = todos.map((task: TaskProps) =>
      task.taskGroup === listTitle
        ? {
            ...task,
            taskGroup: input.length === 0 ? task.taskGroup : input,
          }
        : task
    );
    setTodos(modifiedTasks);
    setDataToLocalStorage("todos", JSON.stringify(modifiedTasks));
    setTaskGroups(modifiedGroups);
    setDataToLocalStorage("taskGroups", JSON.stringify(modifiedGroups));
  }
};
