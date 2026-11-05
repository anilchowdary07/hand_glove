import "../global.css";

import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Manrope_400Regular,
  Manrope_600SemiBold,
  Manrope_700Bold,
  useFonts as useManropeFonts
} from "@expo-google-fonts/manrope";
import {
  AtkinsonHyperlegibleNext_400Regular,
  AtkinsonHyperlegibleNext_500Medium,
  AtkinsonHyperlegibleNext_600SemiBold,
  AtkinsonHyperlegibleNext_700Bold,
  useFonts as useAtkinsonFonts
} from "@expo-google-fonts/atkinson-hyperlegible-next";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { queryClient } from "../lib/queryClient";
import { useAppTheme } from "../lib/theme";
import { RouteGuard } from "../components/RouteGuard";
import { useFirebaseSync } from "../lib/firebaseSync";

SplashScreen.preventAutoHideAsync().catch(() => undefined);

export default function RootLayout() {
  const [manropeLoaded, manropeError] = useManropeFonts({
    Manrope_400Regular,
    Manrope_600SemiBold,
    Manrope_700Bold
  });
  const [atkinsonLoaded, atkinsonError] = useAtkinsonFonts({
    AtkinsonHyperlegibleNext_400Regular,
    AtkinsonHyperlegibleNext_500Medium,
    AtkinsonHyperlegibleNext_600SemiBold,
    AtkinsonHyperlegibleNext_700Bold
  });

  useEffect(() => {
    if ((manropeLoaded || manropeError) && (atkinsonLoaded || atkinsonError)) {
      void SplashScreen.hideAsync();
    }
  }, [atkinsonLoaded, atkinsonError, manropeLoaded, manropeError]);

  const colors = useAppTheme();
  useFirebaseSync();

  if (!manropeLoaded && !manropeError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style={colors.background === "#0F172A" ? "light" : "dark"} />
          <RouteGuard>
            <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="login" />
              <Stack.Screen name="register" />
              <Stack.Screen name="forgot-password" />
              <Stack.Screen name="settings" />
              <Stack.Screen name="onboarding/intro" />
              <Stack.Screen name="onboarding/condition" />
              <Stack.Screen name="onboarding/hand" />
              <Stack.Screen name="onboarding/details" />
              <Stack.Screen name="scans/intro" />
              <Stack.Screen name="scans/camera" />
              <Stack.Screen name="scans/review" />
              <Stack.Screen name="scans/upload" />
              <Stack.Screen name="orders/config" />
              <Stack.Screen name="orders/delivery" />
              <Stack.Screen name="orders/payment" />
              <Stack.Screen name="orders/summary" />
              <Stack.Screen name="orders/success" />
              <Stack.Screen name="orders/tracking" />
              <Stack.Screen name="glove/connect" />
              <Stack.Screen name="admin/index" />
              <Stack.Screen name="(tabs)" />
            </Stack>
          </RouteGuard>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

