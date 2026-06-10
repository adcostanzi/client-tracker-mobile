import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { KeyboardAvoidingView } from "react-native";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
      >
        <Stack>
          <Stack.Screen name="index" options={{ title: "Clients" }} />
        </Stack>
      </KeyboardAvoidingView>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
