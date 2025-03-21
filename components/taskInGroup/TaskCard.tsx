import { TaskProps } from "@/types/taskProps";
import DefaultTaskCard from "../tabs/TaskCard";
import { memo } from "react";

const TaskCard = memo(
  ({
    taskId,
    notificationId,
    taskTitle,
    dueDate,
    completed,
    tags,
  }: Omit<
    TaskProps,
    "taskDescription" | "priority" | "taskGroup" | "logo"
  >) => {
    return (
      <DefaultTaskCard
        taskId={taskId}
        tags={tags}
        notificationId={notificationId}
        taskTitle={taskTitle}
        dueDate={dueDate}
        completed={completed}
      />
    );
  }
);

export default TaskCard;
