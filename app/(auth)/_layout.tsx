import { COLORS } from "@/constants";
import { AuthProvider } from "@/lib/hooks/useLoginPage";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <AuthProvider>
      <SafeAreaView className="bg-background-dark flex-1">
        <StatusBar
          barStyle="light-content"
          backgroundColor={COLORS.backgroundDark}
        />
        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaView>
    </AuthProvider>
  );
}
