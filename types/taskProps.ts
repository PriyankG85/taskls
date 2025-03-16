export type TaskProps = {
  notificationId?: string;
  taskId: string;
  taskGroup: string;
  taskTitle: string;
  taskDescription: string;
  dueDate?: { date: string; time: string } | undefined;
  logo?: string;
  completed?: boolean;
  priority: "Low" | "Medium" | "High";
};
