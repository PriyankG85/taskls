"use client";

import { Plus, X } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import type React from "react";
import { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";
import AnimatedHorizontalList from "../global/AnimatedHorizontalList";

interface TagProps {
  tags: string[];
  onTagsChange?: (tags: string[]) => void;
  placeholder?: string;
  size?: number;
}

const Tag: React.FC<TagProps> = ({
  tags,
  onTagsChange,
  placeholder = "Add a tag...",
  size = 13,
}) => {
  const dark = useColorScheme().colorScheme === "dark";
  const [inputValue, setInputValue] = useState("");

  const addTag = () => {
    if (
      inputValue.trim() !== "" &&
      !tags.includes(inputValue.trim()) &&
      onTagsChange
    ) {
      const newTags = [...tags, inputValue.trim()];
      onTagsChange(newTags);
      setInputValue("");
    }
  };

  const removeTag = (index: number) => {
    if (!onTagsChange) return;
    const newTags = [...tags];
    newTags.splice(index, 1);
    onTagsChange(newTags);
  };

  const handleKeyPress = ({
    nativeEvent,
  }: {
    nativeEvent: { key: string };
  }) => {
    if (nativeEvent.key === "Enter") {
      addTag();
    }
  };

  return (
    <View className="gap-2">
      {onTagsChange && (
        <View className="flex-row items-center border border-outline-100 rounded">
          <TextInput
            className="flex-1 p-3 text-base dark:text-white"
            value={inputValue}
            onChangeText={setInputValue}
            placeholder={placeholder}
            onSubmitEditing={addTag}
            onKeyPress={handleKeyPress}
            returnKeyType="done"
            placeholderTextColor={dark ? "#9ca3af" : "#6b7280"}
          />
          <Pressable
            android_ripple={{
              color: "#FFFFFF10",
              borderless: true,
              radius: 20,
            }}
            onPress={addTag}
            className="p-3"
          >
            <Plus size={22} color={"#FBFBFB"} />
          </Pressable>
        </View>
      )}

      {tags.length > 0 && (
        <AnimatedHorizontalList
          maxToRenderPerBatch={10}
          data={tags}
          renderItem={({ item: tag, index }) => (
            <View className="flex-row items-center bg-[#6200EE]/80 dark:bg-[#6750A4]/80 rounded-full py-1 px-3 mr-2 gap-1">
              <Text className="text-white mr-1" style={{ fontSize: size }}>
                {tag}
              </Text>
              {onTagsChange && (
                <Pressable
                  android_ripple={{ color: "#FFFFFF", borderless: true }}
                  onPress={() => removeTag(index)}
                  className="rounded-full justify-center items-center overflow-hidden"
                >
                  <X size={16} color="#FFF" />
                </Pressable>
              )}
            </View>
          )}
          className="mt-2"
          contentContainerClassName="flex-row flex-nowrap"
        />
      )}
    </View>
  );
};

export default Tag;
