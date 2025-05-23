import { useFonts } from "expo-font";
import { Slot, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { Suspense, useEffect, useState } from "react";
import { getDataFromLocalStorage } from "@/hooks/useHandleLocalStorage";
import * as Notifications from "expo-notifications";
import UserContext from "@/context/userdetails";
import { StatusBar } from "expo-status-bar";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/styles/global.css";
import LoadingIndicator from "@/components/global/LoadingIndicator";
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [loaded] = useFonts({
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
    <Suspense fallback={<LoadingIndicator />}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <UserContext.Provider value={{ name, setName, theme, setTheme }}>
          <GluestackUIProvider mode={theme}>
            <StatusBar style="light" />
            <Slot screenOptions={{ headerShown: false }} />
          </GluestackUIProvider>
        </UserContext.Provider>
      </GestureHandlerRootView>
    </Suspense>
  );
};

export default RootLayout;
