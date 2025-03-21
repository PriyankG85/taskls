"use client";

import type React from "react";
import { useState, memo } from "react";
import { View, Text, Pressable } from "react-native";
import { Check, Filter, LucideIcon } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { Icon } from "../ui/icon";
import Actionsheet from "../ui/actionsheet";
import { Box } from "../ui/box";

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

const FilterTasksDialog: React.FC<FilterDialogProps> = memo(
  ({ isVisible, onClose, onApply, categories, initialSelections = {} }) => {
    const dark = useColorScheme().colorScheme === "dark";
    const [selections, setSelections] =
      useState<FilterSelections>(initialSelections);

    const handleReset = () => {
      setSelections({});
    };

    const handleApply = () => {
      onApply(selections);
      onClose();
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
      <Actionsheet
        isVisible={isVisible}
        onClose={onClose}
        headerText={"Filter Tasks"}
        headerIcon={Filter}
      >
        <Box className="px-4 gap-2">
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
                        ? {
                            backgroundColor: dark ? "#0A84FF" : "#007AFF",
                          }
                        : {
                            backgroundColor: dark ? "#ffffff20" : "#00000010",
                          },
                    ]}
                    className="flex-row items-center gap-2 px-5 py-2 rounded-full overflow-hidden"
                    android_ripple={{
                      color: dark ? "#ffffff30" : "#00000030",
                      foreground: true,
                    }}
                    onPress={() => handleSelectOption(category.id, option.id)}
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
        </Box>

        <View
          className={`flex-row items-center gap-4 mx-4 pt-4 border-t border-outline-200`}
        >
          <Pressable
            android_ripple={{
              color: dark ? "#ffffff30" : "#00000030",
              foreground: true,
            }}
            className={`flex-row items-center justify-center gap-2 px-5 py-2 min-w-[112px] rounded-lg bg-background-200 overflow-hidden`}
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
      </Actionsheet>
    );
  }
);

export default FilterTasksDialog;
