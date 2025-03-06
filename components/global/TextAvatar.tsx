import { Text } from "react-native";
import React from "react";
import { Box } from "../ui/box";

const TextAvatar = ({ text, size = 28 }: { text: string; size?: number }) => {
  const firstLetter = text.charAt(0);
  return (
    <Box
      className="justify-center items-center rounded-full"
      style={{ width: size, height: size }}
    >
      <Text className="text-lg text-typography-950 font-bold">
        {firstLetter}
      </Text>
    </Box>
  );
};

export default TextAvatar;
