import { View, Text, Image } from "react-native";
import React, { memo, Suspense, useContext } from "react";
import toggleTaskCompleted from "@/hooks/useMarkTaskCompleted";
import { Clock } from "lucide-react-native";
import TodosContext from "@/context/userTodos";
import { useColorScheme } from "nativewind";
import { Box } from "../ui/box";
import { TaskProps } from "@/types/taskProps";
import { router } from "expo-router";
import TaskControlsMenuWrapper from "../global/TaskControlsMenuWrapper";
import LoadingIndicator from "../global/LoadingIndicator";
import CheckBox from "../global/CheckBox";
import TextAvatar from "../global/TextAvatar";

const PendingTaskCard = memo(
  ({
    taskId,
    notificationId,
    taskGroup,
    taskTitle,
    taskDescription,
    logo,
    dueDate: unformattedDueDate,
    completed,
    priority,
  }: TaskProps) => {
    const { todos, setTodos } = useContext(TodosContext);
    const dark = useColorScheme().colorScheme === "dark";

    const dueDate = unformattedDueDate
      ? {
          date: unformattedDueDate.date,
          time: unformattedDueDate.time,
        }
      : undefined;

    return (
      <Suspense fallback={<LoadingIndicator />}>
        <TaskControlsMenuWrapper
          android_ripple={{
            color: dark ? "#e0e0e010" : "#5c5c5c10",
            foreground: true,
          }}
          taskId={taskId}
          onPress={() =>
            router.push({
              pathname: "/taskPreview",
              params: {
                priority,
                taskGroup,
                taskTitle,
                taskId,
                notificationId,
                taskDescription,
                dueDate: JSON.stringify(dueDate),
                logo,
              },
            })
          }
          className="rounded-2xl shadow-md overflow-hidden"
        >
          <Box className="flex-grow p-2.5 min-w-64 max-w-[320px] min-h-32 gap-3 rounded-2xl overflow-hidden dark:bg-dark-bg-300 bg-light-bg-200 border border-outline-100 dark:border-0">
            <View className="flex-row justify-between items-center">
              <View
                className="flex-row items-center gap-2 rounded-lg bg-secondary-100/70"
                style={{ paddingRight: 6 }}
              >
                {logo ? (
                  <Image
                    source={{
                      uri: logo,
                    }}
                    width={25}
                    height={25}
                    className="aspect-square rounded-lg"
                  />
                ) : (
                  <TextAvatar
                    text={taskGroup}
                    size={25}
                    textClassName="text-sm"
                  />
                )}
                <Text className="text-sm dark:text-dark-text-100 text-light-text-100">
                  {taskGroup}
                </Text>
              </View>

              <CheckBox
                checked={completed ?? false}
                setChecked={(val) =>
                  setTodos(
                    toggleTaskCompleted(
                      todos,
                      taskId,
                      notificationId,
                      completed
                    )
                  )
                }
                size={20}
              />
            </View>

            <Text
              className="text-lg font-semibold leading-5 dark:text-dark-text-200 text-light-text-100"
              numberOfLines={3}
            >
              {taskTitle}
            </Text>
            {dueDate && (
              <View className="flex-row items-center gap-1">
                <Clock size={14} color={dark ? "#9ca3afb3" : "#5c5c5c70"} />

                <Text
                  className={`dark:text-[#9ca3af] text-light-text-200/70 font-Metamorphous text-xs`}
                >
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
          </Box>
        </TaskControlsMenuWrapper>
      </Suspense>
    );
  }
);

export default PendingTaskCard;
