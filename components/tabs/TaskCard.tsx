import { View, Text } from "react-native";
import { Clock } from "lucide-react-native";
import { Image } from "expo-image";
import { memo, Suspense, useContext } from "react";
import TodosContext from "@/context/userTodos";
import toggleTaskCompleted from "@/hooks/useMarkTaskCompleted";
import { useColorScheme } from "nativewind";
import LoadingIndicator from "../global/LoadingIndicator";
import CheckBox from "../global/CheckBox";
import TextAvatar from "../global/TextAvatar";
import { TaskProps } from "@/types/taskProps";
import TaskControlsMenuWrapper from "../global/TaskControlsMenuWrapper";
import { router } from "expo-router";
import Tag from "../task/Tag";

interface Props
  extends Omit<TaskProps, "taskGroup" | "taskDescription" | "priority"> {
  taskGroup?: string;
}

const TaskCard = memo(
  ({
    tags = [],
    taskId,
    notificationId,
    taskTitle,
    dueDate,
    logo,
    taskGroup,
    completed,
  }: Props) => {
    const dark = useColorScheme().colorScheme === "dark";
    const { todos, setTodos } = useContext(TodosContext);

    return (
      <Suspense fallback={<LoadingIndicator />}>
        <TaskControlsMenuWrapper
          taskId={taskId}
          onPress={() =>
            router.push({
              pathname: "/taskPreview",
              params: { taskId },
            })
          }
        >
          <View
            className={`justify-between flex-row px-5 py-4 rounded-lg dark:bg-background-100 bg-background-0`}
          >
            <View className="gap-2 flex-1 items-start">
              {taskGroup && (
                <View className="flex-row gap-x-2 pr-2 items-center rounded-lg bg-background-muted">
                  {logo ? (
                    <Image
                      source={{ uri: logo }}
                      alt="group_logo"
                      className="w-7 h-7 rounded-xl"
                    />
                  ) : (
                    <TextAvatar
                      text={taskGroup}
                      size={25}
                      textClassName="text-sm"
                    />
                  )}
                  <Text className="dark:text-gray-300/70 text-gray-500/70 text-sm">
                    {taskGroup}
                  </Text>
                </View>
              )}
              <Text
                numberOfLines={2}
                className={`dark:text-dark-text-100 text-light-text-100 text-lg font-semibold max-w-[65vw]`}
              >
                {taskTitle}
              </Text>
              {dueDate && (
                <View className="flex-row items-center gap-1">
                  <Clock size={16} color={"#9ca3afb3"} />

                  <Text className="text-[#9ca3af] font-Metamorphous text-xs">
                    {new Date(dueDate.date).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                    {" • "}
                    {dueDate.time}
                  </Text>
                </View>
              )}
              {tags.length > 0 && (
                <View className="flex-row items-center gap-2">
                  <Tag tags={tags} size={12} />
                </View>
              )}
            </View>

            <View className="justify-between items-end gap-2">
              <CheckBox
                checked={completed ?? false}
                setChecked={(val) =>
                  setTodos(
                    toggleTaskCompleted(todos, taskId, notificationId, !val)
                  )
                }
              />

              <View
                className={`px-2 py-[2px] rounded-full ${
                  dark
                    ? `${completed ? "bg-green-300/50" : "bg-purple-300/50"}`
                    : `${completed ? "bg-green-300/50" : "bg-purple-300/50"}`
                }`}
              >
                <Text
                  className={`${dark ? "text-white" : "text-gray-400"} text-xs`}
                >
                  {completed ? "Done" : "In Progress"}
                </Text>
              </View>
            </View>
          </View>
        </TaskControlsMenuWrapper>
      </Suspense>
    );
  }
);

export default TaskCard;
