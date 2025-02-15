import {
  Linking,
  Platform,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { Suspense, useContext, useEffect, useState } from "react";
import { Bell, Edit, SunMoon } from "lucide-react-native";
import SettingsOptionCard from "@/components/settings/SettingsOptionCard";
import { Picker } from "@react-native-picker/picker";
import { setDataToLocalStorage } from "@/hooks/useHandleLocalStorage";
import * as Notifications from "expo-notifications";
import UserContext from "@/context/userdetails";
import { useColorScheme } from "nativewind";
import LoadingIndicator from "@/components/global/LoadingIndicator";

const Settings = () => {
  const colorScheme = useColorScheme();
  const dark = colorScheme.colorScheme === "dark";
  const [switchValue, setSwitchValue] = useState(false);
  const [isNameEditable, setIsNameEditable] = useState(false);

  const { name, setName, setTheme } = useContext(UserContext);
  const [input, setInput] = useState(name);

  useEffect(() => {
    const checkSettings = async () => {
      const settings = await Notifications.getPermissionsAsync();
      if (settings.granted) {
        setSwitchValue(true);
      }
    };

    checkSettings();
  }, []);

  return (
    <Suspense fallback={<LoadingIndicator />}>
      <View className="flex-1 p-5 pt-10 dark:bg-dark-bg-100 bg-light-bg-100">
        <Text className="font-Metamorphous text-3xl dark:text-dark-text-100 text-light-text-100">
          Settings
        </Text>
        <View className="mt-12">
          <View className="flex-row items-center justify-between border-b dark:border-b-[#ffffff30] border-b-[#00000030] pb-2">
            <TextInput
              value={input!}
              onChangeText={(text) => setInput(text)}
              className={`text-2xl font-spaceMonoBold ${
                dark
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
              <Edit size={24} color={dark ? "white" : "black"} />
            </TouchableOpacity>
          </View>

          <Text
            className={`mt-10 text-lg font-semibold ${
              dark ? "text-dark-text-100/70" : "text-light-text-100/70"
            }`}
          >
            General
          </Text>

          <View className="gap-2.5 mt-[7px] pt-3.5 border-t dark:border-t-[#ffffff30] border-t-[#00000030]">
            <SettingsOptionCard
              title="Appearance"
              subtitle={colorScheme.colorScheme}
              icon={<SunMoon size={24} color={dark ? "white" : "black"} />}
            >
              <Picker
                style={{
                  width: 45,
                  height: 45,
                  color: dark ? "white" : "black",
                }}
                selectedValue={colorScheme.colorScheme}
                onValueChange={(theme) => {
                  if (theme !== colorScheme.colorScheme) {
                    setDataToLocalStorage("theme", theme);
                    setTheme(theme);
                  }
                }}
                dropdownIconColor={dark ? "white" : "black"}
                selectionColor={dark ? "#3A506B" : "#c7ddfd90"}
                itemStyle={{
                  color: dark ? "white" : "black",
                }}
                mode="dropdown"
              >
                <Picker.Item
                  style={{
                    backgroundColor: dark ? "#333333" : "#fdfdfd",
                    color: dark ? "white" : "black",
                  }}
                  label="Dark"
                  value="dark"
                />
                <Picker.Item
                  style={{
                    backgroundColor: dark ? "#333333" : "#fdfdfd",
                    color: dark ? "white" : "black",
                  }}
                  label="Light"
                  value="light"
                />
                <Picker.Item
                  style={{
                    backgroundColor: dark ? "#333333" : "#fdfdfd",
                    color: dark ? "white" : "black",
                  }}
                  label="System"
                  value="system"
                />
              </Picker>
            </SettingsOptionCard>

            <SettingsOptionCard
              title="Notifications"
              icon={<Bell size={24} color={dark ? "white" : "black"} />}
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
    </Suspense>
  );
};

export default Settings;
