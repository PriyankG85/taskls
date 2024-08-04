import {
  Appearance,
  ColorSchemeName,
  Linking,
  Platform,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Bell, Edit, SunMoon } from "lucide-react-native";
import SettingsOptionCard from "@/components/SettingsOptionCard";
import { Picker } from "@react-native-picker/picker";
import { setDataToLocalStorage } from "@/hooks/useHandleLocalStorage";
import * as Notifications from "expo-notifications";
import UserContext from "@/context/userdetails";

const Settings = () => {
  const colorScheme = useColorScheme();
  const [switchValue, setSwitchValue] = useState(false);
  const [permissionResponse] = Notifications.usePermissions();
  const [isNameEditable, setIsNameEditable] = useState(false);
  const { name, setName } = useContext(UserContext);
  const [input, setInput] = useState(name);

  useEffect(() => {
    if (permissionResponse) setSwitchValue(permissionResponse.granted);
  }, [permissionResponse]);

  return (
    <View
      className={`flex-1 p-5 pt-10 ${
        colorScheme === "dark" ? "bg-dark-bg-100" : "bg-light-bg-100"
      }`}
    >
      <Text
        className={`font-Montserrat text-3xl ${
          colorScheme === "dark" ? "text-dark-text-100" : "text-light-text-100"
        }`}
      >
        Settings
      </Text>
      <View className="mt-12">
        <View
          className={`flex-row items-center justify-between border-b ${
            colorScheme === "dark"
              ? "border-b-[#ffffff30]"
              : "border-b-[#00000030]"
          } pb-2`}
        >
          <TextInput
            value={input!}
            onChangeText={(text) => setInput(text)}
            className={`text-2xl font-spaceMonoBold ${
              colorScheme === "dark"
                ? `${
                    isNameEditable
                      ? "text-dark-text-200"
                      : "text-dark-text-200/70"
                  }`
                : `${
                    isNameEditable
                      ? "text-light-text-200"
                      : "text-light-text-200/70"
                  }`
            }`}
            editable={isNameEditable}
            onBlur={() => {
              setName(input);
              setIsNameEditable(false);
              setDataToLocalStorage("name", name);
            }}
          />

          <TouchableOpacity
            onPress={() => {
              setIsNameEditable(true);
            }}
          >
            <Edit
              size={24}
              color={colorScheme === "dark" ? "white" : "black"}
            />
          </TouchableOpacity>
        </View>

        <Text
          className={`mt-10 text-lg font-semibold ${
            colorScheme === "dark"
              ? "text-dark-text-100/70"
              : "text-light-text-100/70"
          }`}
        >
          General
        </Text>

        <View
          style={{
            gap: 10,
            borderTopColor: colorScheme === "dark" ? "#ffffff30" : "#00000030",
            borderTopWidth: 1,
            paddingTop: 14,
            marginTop: 7,
          }}
        >
          <SettingsOptionCard
            title="Appearance"
            subtitle={colorScheme!}
            icon={
              <SunMoon
                size={24}
                color={colorScheme === "dark" ? "white" : "black"}
              />
            }
          >
            <Picker
              style={{
                width: 45,
                height: 45,
                color: colorScheme === "dark" ? "white" : "black",
              }}
              selectedValue={colorScheme}
              onValueChange={(theme) => {
                if (theme !== colorScheme) {
                  setDataToLocalStorage("theme", theme as ColorSchemeName);
                  Appearance.setColorScheme(theme as ColorSchemeName);
                }
              }}
              dropdownIconColor={colorScheme === "dark" ? "white" : "black"}
              mode="dropdown"
            >
              <Picker.Item
                style={{
                  backgroundColor:
                    colorScheme === "dark" ? "#3A506B" : "#c7ddfd90",
                  color: colorScheme === "dark" ? "white" : "black",
                }}
                label="Dark"
                value="dark"
              />
              <Picker.Item
                style={{
                  backgroundColor:
                    colorScheme === "dark" ? "#3A506B" : "#c7ddfd90",
                  color: colorScheme === "dark" ? "white" : "black",
                }}
                label="Light"
                value="light"
              />
            </Picker>
          </SettingsOptionCard>

          <SettingsOptionCard
            title="Notifications"
            icon={
              <Bell
                size={24}
                color={colorScheme === "dark" ? "white" : "black"}
              />
            }
          >
            <Switch
              value={switchValue}
              onValueChange={() => {
                if (Platform.OS === "ios") {
                  Linking.openURL("app-settings:");
                } else {
                  Linking.openSettings();
                }
              }}
            />
          </SettingsOptionCard>
        </View>
      </View>
    </View>
  );
};

export default Settings;
