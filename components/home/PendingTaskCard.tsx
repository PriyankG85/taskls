import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { memo, Suspense, useContext } from "react";
import toggleTaskCompleted from "@/hooks/useMarkTaskCompleted";
import { CheckCircle, Clock } from "lucide-react-native";
import TodosContext from "@/context/userTodos";
import { useColorScheme } from "nativewind";
import { Box } from "../ui/box";
import { ImageBackground } from "expo-image";
import { BlurView } from "expo-blur";
import { TaskProps } from "@/types/taskProps";
import { router } from "expo-router";
import TaskControlsMenuWrapper from "../global/TaskControlsMenuWrapper";
import LoadingIndicator from "../global/LoadingIndicator";

const PendingTaskCard = memo(
  ({
    taskId,
    notificationId,
    taskGroup,
    taskTitle,
    taskDescription,
    logo,
    dueDate: unformattedDueDate,
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
          activeOpacity={1}
          taskId={taskId}
          onPress={() =>
            router.push({
              pathname: "/taskPreview",
              params: {
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
        >
          <ImageBackground
            source={{
              uri: "https://images.unsplash.com/photo-1519681393784-d120267933ba?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1124&q=100",
            }}
            imageStyle={{ borderRadius: 16 }}
            className="bg-center bg-cover"
          >
            <Box className="flex-grow p-2.5 min-w-64 max-w-[320px] min-h-32 gap-2 rounded-2xl overflow-hidden shadow-md shadow-background-dark">
              <BlurView
                experimentalBlurMethod="dimezisBlurView"
                intensity={90}
                tint={dark ? "dark" : "light"}
                className="absolute top-0 left-0 right-0 bottom-0"
              />

              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center gap-2">
                  {logo && (
                    <Image
                      source={{
                        uri: logo,
                      }}
                      className="w-7 h-7 rounded-lg"
                    />
                  )}
                  <Text className="text-base dark:text-dark-text-100 text-light-text-100">
                    {taskGroup}
                  </Text>
                </View>

                <TouchableOpacity
                  className="p-2 rounded-full"
                  onPress={() =>
                    setTodos(
                      toggleTaskCompleted(todos, taskId, notificationId, false)
                    )
                  }
                >
                  <CheckCircle
                    size={20}
                    color={dark ? "#e9edc9" : "#31313160"}
                  />
                </TouchableOpacity>
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
          </ImageBackground>
        </TaskControlsMenuWrapper>
      </Suspense>
    );
  }
);

export default PendingTaskCard;
