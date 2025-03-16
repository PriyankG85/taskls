import cancelNotification from "@/utils/cancelNotifications";
import { setDataToLocalStorage } from "./useHandleLocalStorage";

const toggleTaskCompleted = (
  todosContext: Array<any>,
  taskId: string,
  notificationId: string | undefined,
  currentIsCompleted: boolean | undefined
) => {
  const updatedTodos = todosContext.map((todo) => {
    if (todo.taskId === taskId) {
      return { ...todo, completed: !currentIsCompleted ? true : false };
    }
    return todo;
  });

  if (!currentIsCompleted && notificationId) cancelNotification(notificationId);
  else null;
  setDataToLocalStorage("todos", JSON.stringify(updatedTodos));
  return updatedTodos;
};

export default toggleTaskCompleted;
