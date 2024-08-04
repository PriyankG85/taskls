import { Pressable } from "react-native";
import React from "react";
import { Check } from "lucide-react-native";

const CheckBox = ({
  size,
  checked,
  setChecked,
}: {
  size: number;
  checked: boolean;
  setChecked: (val: boolean) => void;
}) => {
  return (
    <Pressable
      className="rounded p-0.5 justify-center items-center border-2 border-gray-300"
      style={{ width: size, height: size }}
      onPress={() => setChecked(!checked)}
    >
      {checked && <Check size={size - 6} color="#d1d5db" />}
    </Pressable>
  );
};

export default CheckBox;
