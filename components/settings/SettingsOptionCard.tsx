import { View, Text } from "react-native";
import { useColorScheme } from "nativewind";
import React from "react";

const SettingsOptionCard = ({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string;
  subtitle?: string;
  icon: React.ReactElement;
  children?: React.ReactNode;
}) => {
  const dark = useColorScheme().colorScheme === "dark";

  return (
    <View
      className={`w-full flex-row rounded-xl p-4 justify-between items-center ${
        dark ? "bg-dark-bg-300/80" : "bg-light-bg-300/80"
      }`}
    >
      <View className="flex-row items-center gap-4">
        <View
          className={`rounded-xl ${
            dark ? "bg-dark-bg-200/50" : "bg-dark-accent-200"
          } p-2`}
        >
          {icon}
        </View>

        <View>
          <Text
            className={`text-lg font-spaceMonoBold ${
              dark ? "text-white" : "text-black"
            } leading-5`}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              className={`text-sm capitalize font-Quattrocento ${
                dark ? "text-dark-text-200/80" : "text-light-text-200/80"
              }`}
            >
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      {children}
    </View>
  );
};

export default SettingsOptionCard;
