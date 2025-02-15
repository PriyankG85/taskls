import { View, Text, TouchableOpacity } from "react-native";
import { CheckCircle, Clock } from "lucide-react-native";
import { Image } from "expo-image";
import { memo, Suspense, useContext } from "react";
import TodosContext from "@/context/userTodos";
import toggleTaskCompleted from "@/hooks/useMarkTaskCompleted";
import { TaskProps } from "@/types/taskProps";
import { useColorScheme } from "nativewind";
import LoadingIndicator from "../global/LoadingIndicator";

const TaskCard = memo(
  ({
    taskId,
    notificationId,
    taskTitle,
    dueDate,
    logo,
    taskGroup,
    completed,
  }: TaskProps) => {
    const dark = useColorScheme().colorScheme === "dark";
    const { todos, setTodos } = useContext(TodosContext);

    return (
      <Suspense fallback={<LoadingIndicator />}>
        <View
          className={`justify-between flex-row p-5 rounded-xl ${
            dark ? "bg-dark-primary-200/80" : "bg-white/80"
          }`}
        >
          <View className="gap-2">
            <View className="flex-row gap-x-2 items-center">
              {logo && (
                <Image
                  source={{ uri: logo }}
                  alt="group_logo"
                  className="w-7 h-7 rounded-xl"
                />
              )}
              <Text
                className={`${
                  dark ? "text-gray-300/70" : "text-gray-500/70"
                } text-base`}
              >
                {taskGroup}
              </Text>
            </View>
            <Text
              numberOfLines={2}
              className={`${
                dark ? "text-dark-text-100" : "text-light-text-100"
              } text-xl font-semibold max-w-[65vw]`}
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
          </View>

          <View className="justify-between items-end">
            <TouchableOpacity
              className="p-2 rounded-full"
              onPress={() =>
                setTodos(
                  toggleTaskCompleted(todos, taskId, notificationId, completed)
                )
              }
            >
              <CheckCircle
                size={24}
                color={completed ? "#4CAF60" : "#9ca3afb3"}
              />
            </TouchableOpacity>

            <View
              className={`px-2 py-[2px] rounded-full ${
                dark
                  ? `${completed ? "bg-green-300/50" : "bg-purple-300/50"}`
                  : `${completed ? "bg-green-300/50" : "bg-purple-300/50"}`
              }`}
            >
              {completed ? (
                <Text
                  className={`${
                    dark ? "text-white/60" : "text-gray-400/80"
                  } text-xs`}
                >
                  Done
                </Text>
              ) : (
                <Text
                  className={`${
                    dark ? "text-white/60" : "text-gray-400/80"
                  } text-xs`}
                >
                  In Progress
                </Text>
              )}
            </View>
          </View>
        </View>
      </Suspense>
    );
  }
);

export default TaskCard;
