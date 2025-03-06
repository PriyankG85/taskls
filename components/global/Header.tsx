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
import { router } from "expo-router";
import AddTaskListContext from "@/context/addTaskList";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

const Header = ({ name }: { name: string }) => {
  const dark = useColorScheme().colorScheme === "dark";
  const { show } = useContext(AddTaskListContext);

  return (
    <SafeAreaView className="flex-row py-5 px-7 justify-between items-center">
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
        <Text className="text-sm font-spaceMonoBold leading-5 dark:text-dark-text-100 text-light-text-100">
          Hello!{"\n"}
          {name}
        </Text>
      </View>

      <View className="flex-row items-center gap-4">
        <Pressable>
          <Bell
            size={24}
            fill={dark ? "white" : "#525252"}
            color={dark ? "white" : "#525252"}
          />
        </Pressable>

        <Menu
          placement="bottom left"
          offset={5}
          trigger={({ ...triggerProps }) => (
            <Pressable {...triggerProps}>
              <PlusCircle
                size={32}
                fill={dark ? "white" : "#525252"}
                color={dark ? "black" : "white"}
                strokeWidth={1}
              />
            </Pressable>
          )}
          className={"bg-background-muted shadow-sm rounded-xl right-5"}
        >
          <MenuItem
            textValue="New Task"
            key={"New Task"}
            android_ripple={{
              color: dark ? "#6E6E6E50" : "#BDBDBD50",
              radius: 120,
            }}
            onPress={() => router.push("/addTask")}
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
            android_ripple={{
              color: dark ? "#6E6E6E50" : "#BDBDBD50",
              radius: 120,
            }}
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
    </SafeAreaView>
  );
};

export default Header;
