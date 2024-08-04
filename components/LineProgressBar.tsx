import { View, Text } from "react-native";
import React from "react";

const LineProgressBar = ({
  progress,
  colorHex,
}: {
  progress: number;
  colorHex: string;
}) => {
  return (
    <View>
      <View
        className="h-2 rounded-full"
        style={{ backgroundColor: `${colorHex}50` }}
      >
        <View
          className="h-full rounded-full"
          style={{ width: `${progress * 100}%`, backgroundColor: colorHex }}
        />
      </View>
    </View>
  );
};

export default LineProgressBar;
