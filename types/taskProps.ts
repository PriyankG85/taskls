export type TaskProps = {
  notificationId?: string;
  taskId: string;
  taskGroup: string;
  taskTitle: string;
  taskDescription?: string;
  dueDate?: string;
  logo?: string;
  completed?: boolean;
};
