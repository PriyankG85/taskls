import { Text } from "react-native";
import React from "react";
import { Box } from "../ui/box";

const TextAvatar = ({
  text,
  size = 28,
  textClassName,
  containerClassName,
}: {
  text: string;
  size?: number;
  textClassName?: string;
  containerClassName?: string;
}) => {
  const firstLetter = text.charAt(0);
  return (
    <Box
      className={
        "justify-center items-center rounded-full " + containerClassName
      }
      style={{ width: size, height: size }}
    >
      <Text
        className={"text-lg text-typography-950 font-bold " + textClassName}
      >
        {firstLetter}
      </Text>
    </Box>
  );
};

export default TextAvatar;
