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
  return "success";
};

export const handleDeleteTaskList = async (
  taskGroups: TaskGroup[],
  setTaskGroups: (groups: TaskGroup[]) => void,
  groupName: string,
  todos: TaskProps[],
  setTodos: (todos: TaskProps[]) => void,
  deleteTasksInList: boolean = false
) => {
  const newGroups = taskGroups.filter(
    (group: TaskGroup) => group.name !== groupName
  );
  setTaskGroups(newGroups);
  setDataToLocalStorage("taskGroups", JSON.stringify(newGroups));

  if (!deleteTasksInList) return;

  const newTodos = todos.filter((todo) => todo.taskGroup !== groupName);
  setDataToLocalStorage("todos", JSON.stringify(newTodos));
  setTodos(newTodos);
};

export const handleEditList = async ({
  logo,
  oldListTitle,
  newListTitle,
  taskGroups,
  todos,
  setTaskGroups,
  setTodos,
}: {
  logo?: string;
  oldListTitle: string;
  newListTitle: string;
  taskGroups: TaskGroup[];
  todos: TaskProps[];
  setTaskGroups: (groups: TaskGroup[]) => void;
  setTodos: (todos: TaskProps[]) => void;
}) => {
  let nameExists = false;

  taskGroups.forEach((group: any) => {
    if (group.name === newListTitle.trim()) nameExists = true;
  });

  if (nameExists && newListTitle !== oldListTitle) {
    ToastAndroid.show("A List already exists with this name.", 5);
    return;
  }

  if (newListTitle.length !== 0) {
    const modifiedGroups = taskGroups.map((group: TaskGroup) =>
      group.name === oldListTitle
        ? {
            ...group,
            name: newListTitle === group.name ? group.name : newListTitle,
            img: logo,
          }
        : group
    );
    const modifiedTasks = todos.map((task: TaskProps) =>
      task.taskGroup === oldListTitle
        ? {
            ...task,
            taskGroup:
              newListTitle === task.taskGroup ? task.taskGroup : newListTitle,
            logo,
          }
        : task
    );
    setTodos(modifiedTasks);
    setDataToLocalStorage("todos", JSON.stringify(modifiedTasks));
    setTaskGroups(modifiedGroups);
    setDataToLocalStorage("taskGroups", JSON.stringify(modifiedGroups));
  }
  return { logo, newListTitle };
};
