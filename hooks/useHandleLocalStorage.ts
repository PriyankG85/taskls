import AsyncStorage from "@react-native-async-storage/async-storage";
import { ColorSchemeName } from "react-native";

export const getDataFromLocalStorage = async (key: string) =>
  await AsyncStorage.getItem(key);

export const setDataToLocalStorage = async (
  key: string,
  value?: string | ColorSchemeName
) => await AsyncStorage.setItem(key, value ? value : "");
