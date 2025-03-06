import React, { useCallback, useEffect, useState } from "react";
import { config } from "./config";
import {
  View,
  ViewProps,
  useColorScheme as useSystemColorScheme,
} from "react-native";
import { OverlayProvider } from "@gluestack-ui/overlay";
import { useColorScheme as useColorSchemeNW } from "nativewind";
import AlertDialogProvider from "../alert-dialog-provider";
import { InputDialogProvider } from "../input-dialog";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function GluestackUIProvider({
  mode = "light",
  ...props
}: {
  mode?: "light" | "dark" | "system";
  children?: React.ReactNode;
  style?: ViewProps["style"];
}) {
  const systemColorScheme = useSystemColorScheme();
  const colorSchemeNW = useColorSchemeNW();
  const [colorScheme, setColorScheme] = useState(
    mode === "system" ? systemColorScheme : mode
  );

  const updateColorScheme = useCallback(() => {
    if (mode === "system") {
      setColorScheme(systemColorScheme);
      colorSchemeNW.setColorScheme("system");
    } else {
      setColorScheme(mode);
      colorSchemeNW.setColorScheme(mode);
    }
  }, [mode, systemColorScheme]);

  useEffect(() => {
    updateColorScheme();
  }, [mode, systemColorScheme, updateColorScheme]);

  return (
    <View
      style={[
        config[colorScheme ?? "dark"],
        {
          flex: 1,
          height: "100%",
          width: "100%",
        },
        props.style,
      ]}
    >
      <OverlayProvider>
        <AlertDialogProvider>
          <InputDialogProvider>{props.children}</InputDialogProvider>
        </AlertDialogProvider>
      </OverlayProvider>
    </View>
  );
}
