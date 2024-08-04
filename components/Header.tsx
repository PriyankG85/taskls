import { View, Text, TouchableOpacity, useColorScheme } from "react-native";
import { Bell } from "lucide-react-native";

const Header = ({ name }: { name: string }) => {
  const colorScheme = useColorScheme();

  return (
    <View
      className={`flex-row py-5 px-7 justify-between items-center ${
        colorScheme === "dark" ? "bg-dark-bg-300" : "bg-light-bg-300"
      }`}
    >
      <View>
        <Text
          className={`text-base font-Montserrat leading-5 ${
            colorScheme === "dark"
              ? "text-dark-text-100"
              : "text-light-text-100"
          }`}
        >
          Hello!{"\n"}
          {name}
        </Text>
      </View>

      <View>
        <TouchableOpacity activeOpacity={0.7}>
          <Bell
            fill={colorScheme === "dark" ? "white" : "black"}
            size={24}
            color={colorScheme === "dark" ? "white" : "black"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;
