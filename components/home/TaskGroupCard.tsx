import { View, Text } from "react-native";
import React, { memo, Suspense } from "react";
import CircularProgress from "../global/CircularProgress";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Box } from "../ui/box";
import ListControlsMenuWrapper from "./ListControlsMenuWrapper";
import LoadingIndicator from "../global/LoadingIndicator";
import TextAvatar from "../global/TextAvatar";

type Props = {
  title: string;
  tasks: number;
  progress: number;
  img?: string;
};

const TaskGroupCard = memo(({ title, tasks, progress, img }: Props) => {
  return (
    <Suspense fallback={<LoadingIndicator />}>
      <ListControlsMenuWrapper
        listTitle={title}
        logo={img}
        onPress={() =>
          router.push(`/tasksInGroup?groupName=${encodeURIComponent(title)}`)
        }
      >
        <Box className="flex-row justify-between w-full">
          <View className="flex-row items-center gap-4">
            <Box className="rounded-3xl w-16 h-16 p-2 bg-dark-accent-100 justify-center items-center">
              {img && img !== "" ? (
                <Image
                  source={{ uri: img }}
                  className="w-full h-full rounded-xl"
                />
              ) : (
                <TextAvatar text={title} />
              )}
            </Box>

            <View>
              <Text className="text-xl font-semibold dark:text-white text-black leading-5">
                {title.length > 16 ? title.slice(0, 16) + "..." : title}
              </Text>
              <Text className="text-sm dark:text-dark-text-200/80 text-light-text-200/80">
                {tasks} Tasks
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-x-4">
            <CircularProgress
              progress={progress}
              circleColor="#6366F150"
              strokeColor="#6366F1"
              size={50}
              strokeWidth={6}
            />
          </View>
        </Box>
      </ListControlsMenuWrapper>
    </Suspense>
  );
});

export default TaskGroupCard;
