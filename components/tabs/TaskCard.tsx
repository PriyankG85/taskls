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

type Props = {
  notificationId?: string;
  taskId: string;
  taskTitle: string;
  taskDescription: string;
  dueDate?:
    | {
        date: string;
        time: string;
      }
    | undefined;
  logo?: string;
  completed?: boolean;
  priority: "Low" | "Medium" | "High";
  taskGroup?: string;
};
const TaskCard = memo(
  ({
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
        <View
          className={`justify-between flex-row p-5 rounded-lg dark:bg-background-100 bg-background-0`}
        >
          <View className="gap-2">
            {taskGroup && (
              <View
                className="flex-row gap-x-2 items-center rounded-lg bg-background-muted"
                style={{ paddingRight: 6 }}
              >
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
                <Text
                  className={`${
                    dark ? "text-gray-300/70" : "text-gray-500/70"
                  } text-sm`}
                >
                  {taskGroup}
                </Text>
              </View>
            )}
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
