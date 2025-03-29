// TODO: Add createdAt & modifiedAt fields for better tracking

export type TaskProps = {
  notificationId?: string;
  taskId: string;
  taskGroup: string;
  taskTitle: string;
  taskDescription: string;
  dueDate?: string; // dueDate is saved as ISO date string
  logo?: string;
  completed?: boolean;
  priority: "Low" | "Medium" | "High";
  tags: string[];
};
