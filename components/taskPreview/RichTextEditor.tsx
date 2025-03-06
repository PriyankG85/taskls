"use client";

import type React from "react";
import { useRef, useEffect, useState } from "react";
import { View, StyleSheet, useWindowDimensions, Platform } from "react-native";
import {
  RichEditor,
  RichToolbar,
  actions,
} from "react-native-pell-rich-editor";
import { Feather } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";

interface Props {
  value?: string;
  onChange?: (value: string) => void;
  height?: number;
  placeholder?: string;
  editable?: boolean;
  dom: import("expo/dom").DOMProps;
}

const RichTextEditor: React.FC<Props> = ({
  value = "",
  onChange,
  height = 200,
  placeholder = "Enter task description...",
  editable = true,
}) => {
  const dark = useColorScheme().colorScheme === "dark";

  const richText = useRef<RichEditor>(null);
  const { width } = useWindowDimensions();

  // Determine if we're on a small screen
  const isSmallScreen = width < 768;

  useEffect(() => {
    if (richText.current) {
      richText.current.setContentHTML(value);
    }
  }, [value]);

  // Custom icon component for toolbar
  const renderIcon = (action: string, selected: boolean) => {
    let iconName = "";

    switch (action) {
      case actions.setBold:
        iconName = "bold";
        break;
      case actions.setItalic:
        iconName = "italic";
        break;
      case actions.insertBulletsList:
        iconName = "list";
        break;
      case actions.insertOrderedList:
        iconName = "list-order";
        break;
      case actions.insertLink:
        iconName = "link";
        break;
      case actions.setStrikethrough:
        iconName = "strikethrough";
        break;
      case actions.setUnderline:
        iconName = "underline";
        break;
      case actions.undo:
        iconName = "corner-up-left";
        break;
      case actions.redo:
        iconName = "corner-up-right";
        break;
      default:
        iconName = "edit-2";
    }

    return (
      <Feather
        name={iconName as any}
        size={20}
        color={selected ? "#007AFF" : "#333"}
      />
    );
  };

  // Define which actions to show based on screen size
  const getToolbarActions = () => {
    const baseActions = [
      actions.setBold,
      actions.setItalic,
      actions.setUnderline,
      actions.insertBulletsList,
      actions.insertOrderedList,
      actions.undo,
      actions.redo,
    ];

    // Add more actions for larger screens
    if (!isSmallScreen) {
      return [
        ...baseActions,
        actions.setStrikethrough,
        actions.insertLink,
        actions.heading1,
        actions.heading2,
      ];
    }

    return baseActions;
  };

  return (
    <View style={[styles.container, { height }]}>
      <RichEditor
        ref={richText}
        onChange={(text) => onChange && onChange(text)}
        placeholder={placeholder}
        disabled={!editable}
        initialContentHTML={value}
        style={styles.editor}
        useContainer={true}
        editorStyle={{
          contentCSSText: `
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            font-size: 16px;
            line-height: 1.5;
          `,
          color: dark ? "#fff" : "#000",
          backgroundColor: dark ? "#29293e" : "#b4bfcc",
          placeholderColor: dark ? "#ffffff50" : "#00000050",
        }}
        scrollEnabled
      />
      {editable && (
        <RichToolbar
          editor={richText}
          selectedIconTint="#007AFF"
          iconTint="#333333"
          actions={getToolbarActions()}
          iconMap={renderIcon}
          iconSize={18}
          style={styles.toolbar}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
  editor: {
    flex: 1,
    paddingHorizontal: 7,
  },
  toolbar: {
    backgroundColor: "#F7F7F7",
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: "#E1E1E1",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    paddingHorizontal: 4,
  },
});

export default RichTextEditor;
