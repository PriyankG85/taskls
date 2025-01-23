import { Pressable } from "react-native";
import React from "react";
import { Check } from "lucide-react-native";

const CheckBox = ({
  dark,
  size,
  checked,
  setChecked,
}: {
  dark: boolean;
  size: number;
  checked: boolean;
  setChecked: (val: boolean) => void;
}) => {
  return (
    <Pressable
      className="rounded p-0.5 justify-center items-center border-2 dark:border-gray-300 border-gray-500"
      style={{ width: size, height: size }}
      onPress={() => setChecked(!checked)}
    >
      {checked && (
        <Check size={size - 6} color={dark ? "#d1d5db" : "#6b7280"} />
      )}
    </Pressable>
  );
};

export default CheckBox;
