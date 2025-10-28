import LoadingScreen from "@/components/LoadingScreen";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";
import "react-native-reanimated";
import { AuthProvider, useAuth } from "../context/AuthContext";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <AppProviders />;
}

function AppProviders() {
  const [isDark, setIsDark] = useState(false);
  const theme = isDark ? MD3DarkTheme : MD3LightTheme;

  return (
    <AuthProvider>
      <PaperProvider theme={theme}>
        <InitialLayout />
      </PaperProvider>
    </AuthProvider>
  );
}

function InitialLayout() {
  const { session, loading } = useAuth(); //
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    const inTabsGroup = segments[0] === "(tabs)";

    if (session && !inTabsGroup) {
      router.replace("/(tabs)");
    } else if (!session) {
      if (segments[0] !== "main") {
        router.replace("/main");
      }
    }
  }, [session, loading, segments, router]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Stack>
      <Stack.Screen name="main" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
