import { useFonts } from "expo-font";
import { Slot, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { getDataFromLocalStorage } from "@/hooks/useHandleLocalStorage";
import * as Notifications from "expo-notifications";
import UserContext from "@/context/userdetails";
import { StatusBar } from "expo-status-bar";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/styles/global.css";
import { GestureHandlerRootView } from "react-native-gesture-handler";

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

const RootLayout = () => {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    SpaceMonoBold: require("../assets/fonts/SpaceMono-Bold.ttf"),
    MontserratAlternates: require("../assets/fonts/MontserratAlternates-Regular.ttf"),
    Metamorphous: require("../assets/fonts/Metamorphous.ttf"),
    Quattrocento: require("../assets/fonts/Quattrocento-Sans.ttf"),
  });
  const [name, setName] = useState<string | null>(null);
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");

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

      if (theme !== null) {
        setTheme(theme as "light" | "dark" | "system");
      }
    };

    getTheme();

    if (loaded && theme) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    if (!loaded) return;

    const inAuthGroup = segments[0] === "(start)";

    if (name && inAuthGroup) {
      router.replace("/(user)/(tabs)");
    } else if (!name && !inAuthGroup) {
      router.replace("/");
    }
  }, [name, loaded, segments]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <UserContext.Provider value={{ name, setName, theme, setTheme }}>
        <GluestackUIProvider mode={theme}>
          <StatusBar style="light" />
          <Slot screenOptions={{ headerShown: false }} />
        </GluestackUIProvider>
      </UserContext.Provider>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
