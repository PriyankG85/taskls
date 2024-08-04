import {
  View,
  Text,
  useColorScheme,
  TouchableOpacity,
  Alert,
} from "react-native";
import React from "react";
import CircularProgress from "./CircularProgress";
import { Image } from "expo-image";
import { CircleHelp, Trash2 } from "lucide-react-native";

const TaskGroupCard = ({
  title,
  tasks,
  progress,
  img,
  handleRemoveTaskGroup,
}: {
  title: string;
  tasks: number;
  progress: number;
  img?: string;
  handleRemoveTaskGroup(name: string): void;
}) => {
  const colorScheme = useColorScheme();

  return (
    <View
      className={`flex-row w-full rounded-3xl p-3 justify-between items-center overflow-hidden ${
        colorScheme === "dark" ? "bg-dark-bg-300/80" : "bg-light-bg-300/80"
      }`}
    >
      <View className="flex-row items-center gap-4">
        <View className="rounded-3xl w-16 h-16 p-2 bg-dark-accent-100 justify-center items-center">
          {img ? (
            <Image source={{ uri: img }} className="w-full h-full rounded-xl" />
          ) : (
            <CircleHelp
              size={28}
              color={colorScheme === "dark" ? "#ffffff" : "#000000"}
            />
          )}
        </View>

        <View>
          <Text
            className={`text-xl font-semibold ${
              colorScheme === "dark" ? "text-white" : "text-black"
            } leading-5`}
          >
            {title.length > 16 ? title.slice(0, 16) + "..." : title}
          </Text>
          <Text
            className={`text-sm ${
              colorScheme === "dark"
                ? "text-dark-text-200/80"
                : "text-light-text-200/80"
            }`}
          >
            {tasks} Tasks
          </Text>
        </View>
      </View>

      <View className="flex-row items-center space-x-4">
        <CircularProgress
          progress={progress}
          circleColor="#6366F150"
          strokeColor="#6366F1"
          size={50}
          strokeWidth={6}
        />
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() =>
            Alert.alert(`Sure want to delete ${title} Group?`, undefined, [
              { text: "NO" },
              {
                text: "YES",
                onPress() {
                  handleRemoveTaskGroup(title);
                },
              },
            ])
          }
        >
          <Trash2 size={20} color="#FF573380" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TaskGroupCard;
