import { TaskProps } from "@/types/taskProps";
import DefaultTaskCard from "../tabs/TaskCard";
import { memo } from "react";

const TaskCard = memo(
  ({
    taskId,
    notificationId,
    taskTitle,
    taskDescription,
    dueDate,
    completed,
    priority,
  }: TaskProps) => {
    return (
      <DefaultTaskCard
        taskId={taskId}
        priority={priority}
        notificationId={notificationId}
        taskTitle={taskTitle}
        taskDescription={taskDescription}
        dueDate={dueDate}
        completed={completed}
      />
    );
  }
);

export default TaskCard;
