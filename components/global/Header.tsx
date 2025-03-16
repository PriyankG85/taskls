import { View, Text, Pressable, StyleSheet } from "react-native";
import { useColorScheme } from "nativewind";
import { Bell, PlusCircle } from "lucide-react-native";
import {
  Menu,
  MenuItem,
  MenuItemLabel,
  MenuSeparator,
} from "@/components/ui/menu";
import { useContext } from "react";
import { router, usePathname } from "expo-router";
import AddTaskListContext from "@/context/addTaskList";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Header = ({ name }: { name: string }) => {
  const dark = useColorScheme().colorScheme === "dark";
  const { show } = useContext(AddTaskListContext);
  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  return (
    <View
      style={{ paddingTop: insets.top + 12 }}
      className="flex-row pb-5 px-7 justify-between items-center"
    >
      <BlurView
        experimentalBlurMethod="dimezisBlurView"
        tint={dark ? "dark" : "light"}
        intensity={50}
        className="absolute top-0 left-0 right-0 bottom-0"
      >
        <LinearGradient
          // @ts-ignore
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          colors={
            dark
              ? ["#29293e", "#1A1A2E", "#1b1b1b"]
              : ["#b4bfcc", "#dce8f5", "#E6F2FF"]
          }
          style={StyleSheet.absoluteFillObject}
        />
      </BlurView>

      <View>
        <Text className="text-sm font-roboto font-bold leading-5 dark:text-dark-text-100 text-light-text-100">
          Hello!{"\n"}
          {name}
        </Text>
      </View>

      <View className="flex-row items-center gap-4">
        <Pressable>
          <Bell
            size={24}
            fill={dark ? "white" : "#00429a"}
            color={dark ? "white" : "#00429a"}
          />
        </Pressable>

        <Menu
          placement="bottom left"
          offset={5}
          trigger={({ ...triggerProps }) => (
            <Pressable {...triggerProps}>
              <PlusCircle
                size={32}
                fill={dark ? "white" : "#00429a"}
                color={dark ? "black" : "white"}
                strokeWidth={1}
              />
            </Pressable>
          )}
          className={"bg-background-muted shadow rounded-xl right-5"}
        >
          <MenuItem
            textValue="New Task"
            key={"New Task"}
            className="active:opacity-70"
            onPress={() => pathname !== "/addTask" && router.push("/addTask")}
          >
            <MenuItemLabel
              size="lg"
              className="dark:text-white text-black font-roboto"
            >
              New Task
            </MenuItemLabel>
          </MenuItem>
          <MenuSeparator />
          <MenuItem
            textValue="New List"
            key={"New List"}
            className="active:opacity-70"
            onPress={show}
          >
            <MenuItemLabel
              size="lg"
              className="dark:text-white text-black font-roboto"
            >
              New List
            </MenuItemLabel>
          </MenuItem>
        </Menu>
      </View>
    </View>
  );
};

export default Header;
