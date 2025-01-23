import { View, Text, TouchableOpacity } from "react-native";
import { Bell } from "lucide-react-native";
import { useColorScheme } from "nativewind";

const Header = ({ name }: { name: string }) => {
  const dark = useColorScheme().colorScheme === "dark";

  return (
    <View className="flex-row py-5 px-7 justify-between items-center dark:bg-dark-bg-300 bg-light-bg-300">
      <View>
        <Text className="text-base font-Montserrat leading-5 dark:text-dark-text-100 text-light-text-100">
          Hello!{"\n"}
          {name}
        </Text>
      </View>

      <View>
        <TouchableOpacity activeOpacity={0.7}>
          <Bell
            size={24}
            fill={dark ? "white" : "black"}
            color={dark ? "white" : "black"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;
