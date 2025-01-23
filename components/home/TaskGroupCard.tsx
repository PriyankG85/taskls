import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import CircularProgress from "../global/CircularProgress";
import { Image } from "expo-image";
import { FileQuestion, Trash2 } from "lucide-react-native";
import { router } from "expo-router";
import { Box } from "../ui/box";
import { useColorScheme } from "nativewind";
import { Menu, MenuItem, MenuItemLabel } from "../ui/menu";
import { useAlertDialog } from "@/hooks/useAlertDialog";

type Props = {
  title: string;
  tasks: number;
  progress: number;
  img?: string;
  handleRemoveTaskGroup(name: string): void;
};

const TaskGroupCard = ({
  title,
  tasks,
  progress,
  img,
  handleRemoveTaskGroup,
}: Props) => {
  const colorScheme = useColorScheme().colorScheme;
  const alertDialog = useAlertDialog();

  const [showMenu, setShowMenu] = React.useState(false);

  return (
    <>
      <Menu
        isOpen={showMenu}
        onClose={() => setShowMenu(false)}
        placement="bottom right"
        offset={-7}
        className={"bg-secondary-600 shadow-sm"}
        trigger={(triggerProps) => (
          <TouchableOpacity
            activeOpacity={0.75}
            className="flex-row w-full rounded-3xl p-3 justify-between items-center overflow-hidden dark:bg-dark-bg-300/80 bg-light-bg-300/80 shadow-background-dark shadow-xl"
            onPress={() =>
              router.push(
                `/tasksInGroup?groupName=${encodeURIComponent(title)}`
              )
            }
            onLongPress={() => setShowMenu(true)}
            aria-expanded={triggerProps["aria-expanded"]}
            ref={triggerProps.ref}
          >
            <Box className="flex-row justify-between w-full">
              <View className="flex-row items-center gap-4">
                <Box className="rounded-3xl w-16 h-16 p-2 bg-dark-accent-100 justify-center items-center">
                  {img ? (
                    <Image
                      source={{ uri: img }}
                      className="w-full h-full rounded-xl"
                    />
                  ) : (
                    <FileQuestion
                      size={28}
                      color={colorScheme === "dark" ? "#ffffff" : "#000000"}
                    />
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
          </TouchableOpacity>
        )}
      >
        <MenuItem
          onPress={() =>
            alertDialog.show(`Sure want to delete ${title} List?`, () =>
              handleRemoveTaskGroup(title)
            )
          }
          className="gap-2 active:bg-secondary-700"
        >
          <Trash2 size={16} color={"#B91C1C"} />
          <MenuItemLabel className="font-roboto">Delete List</MenuItemLabel>
        </MenuItem>
      </Menu>
    </>
  );
};

export default TaskGroupCard;
