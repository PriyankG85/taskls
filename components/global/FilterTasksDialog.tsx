"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  useWindowDimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolate,
  runOnJS,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { X, Check, Filter, LucideIcon } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { Icon } from "../ui/icon";

// Filter option types
export type FilterOption = {
  id: string;
  label: string;
};

export type FilterCategory = {
  id: string;
  title: string;
  icon: LucideIcon;
  options: FilterOption[];
  multiSelect?: boolean;
};

export type FilterSelections = {
  [categoryId: string]: string[] | string;
};

interface FilterDialogProps {
  isVisible: boolean;
  onClose: () => void;
  onApply: (selections: FilterSelections) => void;
  categories: FilterCategory[];
  initialSelections?: FilterSelections;
}

const FilterTasksDialog: React.FC<FilterDialogProps> = ({
  isVisible,
  onClose,
  onApply,
  categories,
  initialSelections = {},
}) => {
  const dark = useColorScheme().colorScheme === "dark";
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const [selections, setSelections] =
    useState<FilterSelections>(initialSelections);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(height);

  useEffect(() => {
    if (isVisible) {
      opacity.value = withTiming(1, {
        duration: 300,
        easing: Easing.out(Easing.ease),
      });
      translateY.value = withTiming(0, {
        duration: 400,
        easing: Easing.out(Easing.ease),
      });
    } else {
      opacity.value = withTiming(0, {
        duration: 300,
        easing: Easing.in(Easing.ease),
      });
      translateY.value = withTiming(height, {
        duration: 400,
        easing: Easing.in(Easing.ease),
      });
    }
  }, [isVisible, height, opacity, translateY]);

  const overlayStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const modalStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      opacity: interpolate(
        translateY.value,
        [height, height / 2, 0],
        [0, 0.5, 1]
      ),
    };
  });

  const handleClose = () => {
    opacity.value = withTiming(0, {
      duration: 300,
      easing: Easing.in(Easing.ease),
    });
    translateY.value = withTiming(
      height,
      { duration: 400, easing: Easing.in(Easing.ease) },
      (finished) => {
        // Only call onClose after animation completes
        if (finished) runOnJS(onClose)();
      }
    );
  };

  const handleReset = () => {
    setSelections({});
  };

  const handleApply = () => {
    onApply(selections);
    handleClose();
  };

  const handleSelectOption = (categoryId: string, optionId: string) => {
    setSelections((prev) => {
      const category = categories.find((c) => c.id === categoryId);

      if (!category) return prev;

      if (category.multiSelect) {
        const currentSelections = (prev[categoryId] as string[]) || [];
        const isSelected = currentSelections.includes(optionId);

        return {
          ...prev,
          [categoryId]: isSelected
            ? currentSelections.filter((id) => id !== optionId)
            : [...currentSelections, optionId],
        };
      } else {
        return {
          ...prev,
          [categoryId]: prev[categoryId] === optionId ? "" : optionId,
        };
      }
    });
  };

  const isOptionSelected = (categoryId: string, optionId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    if (!category) return false;

    if (category.multiSelect) {
      return ((selections[categoryId] as string[]) || []).includes(optionId);
    } else {
      return selections[categoryId] === optionId;
    }
  };

  const hasActiveFilters = Object.keys(selections).some((key) => {
    const value = selections[key];
    return Array.isArray(value) ? value.length > 0 : Boolean(value);
  });

  return (
    <View style={{ width: "100%", height: "100%", position: "absolute" }}>
      <Modal
        transparent
        visible={isVisible}
        animationType="none"
        onRequestClose={handleClose}
        statusBarTranslucent
        onShow={() => setSelections(initialSelections)}
      >
        <View className="flex-1 justify-end">
          <TouchableWithoutFeedback onPress={handleClose}>
            <Animated.View
              style={[
                {
                  ...StyleSheet.absoluteFillObject,
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                },
                overlayStyle,
              ]}
            />
          </TouchableWithoutFeedback>

          <Animated.View
            style={[
              modalStyle,
              { paddingBottom: insets.bottom > 0 ? insets.bottom : 16 },
            ]}
            className={`gap-y-6 p-0 rounded-t-[2rem] shadow-lg overflow-hidden bg-background-50/95 max-h-[75%] border border-b-0 border-outline-200`}
          >
            <View
              className={`flex-row justify-between items-center p-4 border-b border-outline-200`}
            >
              <View className="flex-row items-center gap-3">
                <Filter size={18} color={dark ? "#FBFBFB" : "#333"} />
                <Text
                  className={`font-Metamorphous text-xl text-typography-950`}
                >
                  Filter Tasks
                </Text>
              </View>
              <Pressable
                onPress={handleClose}
                className="p-2"
                accessibilityLabel="Close filter dialog"
                accessibilityRole="button"
              >
                <X size={24} color={dark ? "#FBFBFB70" : "#33333370"} />
              </Pressable>
            </View>

            <ScrollView className="p-4" contentContainerClassName="gap-2">
              {categories.map((category) => (
                <View key={category.id} className="mb-4 gap-2">
                  <View className="flex-row items-center mb-3">
                    <Icon
                      as={category.icon}
                      color={dark ? "#FBFBFB" : "#333"}
                      size={"md"}
                    />
                    <Text className={`ml-2 text-lg text-typography-950`}>
                      {category.title}
                    </Text>
                  </View>
                  <View className="flex-row flex-wrap ml-7 gap-2">
                    {category.options.map((option) => (
                      <Pressable
                        key={option.id}
                        style={[
                          isOptionSelected(category.id, option.id)
                            ? { backgroundColor: dark ? "#0A84FF" : "#007AFF" }
                            : {
                                backgroundColor: dark
                                  ? "#ffffff20"
                                  : "#00000010",
                              },
                        ]}
                        className="flex-row items-center gap-2 px-5 py-2 rounded-full overflow-hidden"
                        android_ripple={{
                          color: dark ? "#ffffff30" : "#00000030",
                          foreground: true,
                        }}
                        onPress={() =>
                          handleSelectOption(category.id, option.id)
                        }
                        accessibilityLabel={`${option.label} filter option`}
                        accessibilityRole="checkbox"
                        accessibilityState={{
                          checked: isOptionSelected(category.id, option.id),
                        }}
                      >
                        <Text
                          style={[
                            {
                              fontSize: 14,
                              marginRight: 4,
                              color: dark ? "#FBFBFB" : "#333",
                            },
                            isOptionSelected(category.id, option.id) && {
                              color: "#fff",
                            },
                          ]}
                        >
                          {option.label}
                        </Text>
                        {isOptionSelected(category.id, option.id) && (
                          <Check size={16} color="#fff" />
                        )}
                      </Pressable>
                    ))}
                  </View>
                </View>
              ))}
            </ScrollView>

            <View
              className={`flex-row items-center gap-4 p-4 border-t border-outline-200`}
            >
              <Pressable
                android_ripple={{
                  color: dark ? "#ffffff30" : "#00000030",
                  foreground: true,
                }}
                className={`flex-row items-center gap-2 px-5 py-2 rounded-lg bg-background-200 overflow-hidden`}
                onPress={handleReset}
                disabled={!hasActiveFilters}
                accessibilityLabel="Reset filters"
                accessibilityRole="button"
              >
                <Text
                  style={[
                    {
                      fontSize: 16,
                      fontWeight: "600",
                      color: dark ? "#FBFBFB" : "#333",
                    },
                    !hasActiveFilters && { opacity: 0.5 },
                  ]}
                >
                  Reset
                </Text>
              </Pressable>
              <Pressable
                android_ripple={{
                  color: dark ? "#ffffff30" : "#00000030",
                  foreground: true,
                }}
                className={`flex-1 flex-row items-center justify-center gap-2 px-5 py-2 rounded-lg bg-info-400 overflow-hidden`}
                onPress={handleApply}
                accessibilityLabel="Apply filters"
                accessibilityRole="button"
              >
                <Text className="text-base font-semibold text-white">
                  Apply Filters
                </Text>
              </Pressable>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

export default FilterTasksDialog;
