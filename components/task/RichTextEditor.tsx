"use client";

import type React from "react";
import { useRef } from "react";
import { StyleSheet, ScrollView } from "react-native";
import {
  RichEditor,
  RichToolbar,
  actions,
} from "react-native-pell-rich-editor";
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
  height = 250,
  placeholder = "Enter task description...",
  editable = true,
}) => {
  const dark = useColorScheme().colorScheme === "dark";
  const richText = useRef<RichEditor>(null);

  const handleContentChange = (html: string) => {
    onChange && onChange(html);
  };

  // Define which actions to show based on screen size
  const getToolbarActions = () => {
    const baseActions = [
      actions.setBold,
      actions.setItalic,
      actions.setUnderline,
      actions.insertBulletsList,
      actions.insertOrderedList,
      actions.code,
      actions.setStrikethrough,
    ];

    return baseActions;
  };

  return (
    <>
      <ScrollView
        style={{ maxHeight: height }}
        nestedScrollEnabled={true}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <RichEditor
          ref={richText}
          onChange={handleContentChange}
          placeholder={placeholder}
          initialContentHTML={value}
          style={styles.editor}
          containerStyle={styles.editorContainer}
          useContainer={true}
          styleWithCSS={true}
          editorStyle={{
            contentCSSText: `
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            font-size: 16px;
            line-height: 1.5;
            code {
              background-color: #1b1b1b;
              color: #f8f8f2;
              padding: 10px;
              border-radius: 4px;
            }
            pre {
              background-color: #1b1b1b;
              color: #f8f8f2;
              padding: 10px;
              border-radius: 4px;
            }
            `,
            color: dark ? "#fff" : "#000",
            backgroundColor: dark ? "#29293e" : "#b4bfcc",
            placeholderColor: dark ? "#ffffff50" : "#00000050",
          }}
          scrollEnabled={false}
          disabled={!editable}
        />
      </ScrollView>
      {editable && (
        <RichToolbar
          editor={richText}
          selectedIconTint="#007AFF"
          iconTint="#333333"
          actions={getToolbarActions()}
          iconSize={18}
          style={styles.toolbar}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  editorContainer: {
    flex: 1,
  },
  editor: {
    paddingHorizontal: 7,
  },
  toolbar: {
    height: 40,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: "#E1E1E1",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    paddingHorizontal: 4,
    backgroundColor: "#E6F2FF",
  },
});

export default RichTextEditor;
