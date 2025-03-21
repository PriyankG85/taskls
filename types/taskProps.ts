// TODO: Add createdAt & modifiedAt fields for better tracking

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
  tags: string[];
};
