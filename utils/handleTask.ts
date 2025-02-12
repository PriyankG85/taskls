import { TaskProps } from "@/types/taskProps";
import cancelNotification from "./cancelNotifications";
import { setDataToLocalStorage } from "@/hooks/useHandleLocalStorage";

export const handleDeleteTask = async (
  todos: TaskProps[],
  setTodos: React.Dispatch<React.SetStateAction<TaskProps[]>>,
  taskId: string,
  notificationId: string | undefined
) => {
  const newTasks = todos.filter((task) => task.taskId !== taskId);

  setTodos(newTasks);
  await cancelNotification(notificationId);
  setDataToLocalStorage("todos", JSON.stringify(newTasks));
};
