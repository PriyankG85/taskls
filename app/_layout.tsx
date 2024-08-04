import { useFonts } from "expo-font";
import { Slot, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { Appearance, ColorSchemeName } from "react-native";
import { useEffect, useState } from "react";
import { getDataFromLocalStorage } from "@/hooks/useHandleLocalStorage";
import * as Notifications from "expo-notifications";
import UserContext from "@/context/userdetails";
import { StatusBar } from "expo-status-bar";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    SpaceMonoBold: require("../assets/fonts/SpaceMono-Bold.ttf"),
    Karma: require("../assets/fonts/Karma-Bold.ttf"),
    MontserratAlternates: require("../assets/fonts/MontserratAlternates-Regular.ttf"),
  });
  const [name, setName] = useState<string | null>(null);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    Notifications.getPermissionsAsync().then((e) => {
      if (e.granted) return;
      Notifications.requestPermissionsAsync();
    });

    getDataFromLocalStorage("name").then((value) => setName(value));

    const getTheme = async () => {
      const theme = await getDataFromLocalStorage("theme");
      if (theme === "dark" || theme === "light")
        Appearance.setColorScheme(theme as unknown as ColorSchemeName);
    };

    getTheme();

    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    if (!loaded) return;

    const inAuthGroup = segments[0] === "(start)";

    if (name && inAuthGroup) {
      router.replace("/(user)");
    } else if (!name && !inAuthGroup) {
      router.replace("/(start)");
    }
  }, [name, loaded, segments]);

  if (!loaded) {
    return null;
  }

  return (
    <UserContext.Provider
      value={{
        name: name!,
        setName: setName,
      }}
    >
      <StatusBar style="dark" />

      <Slot screenOptions={{ headerShown: false }} />
    </UserContext.Provider>
  );
};

export default RootLayout;
