import Loader from "@/components/Loader";
import { COLORS } from "@/constants";
import { useStore } from "@/store";
import { Redirect, Stack } from "expo-router";
import { useShareIntentContext } from "expo-share-intent";
import { StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  const {
    state: { isLoading, isLoggedIn },
  } = useStore();
  const { hasShareIntent } = useShareIntentContext();

  if (isLoading) {
    // return (
    // 	<SafeAreaView className="bg-background h-full flex items-center justify-center">
    // 		<StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
    // 		<ActivityIndicator className="text-primary" size="large" />
    // 	</SafeAreaView>
    // );
    return <Loader />;
  }

  if (!isLoggedIn) {
    return <Redirect href="/login" />;
  }

  if (hasShareIntent) {
    return <Redirect href="/save-recipe" />;
  }

  return (
    <SafeAreaView className="bg-background flex-1">
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaView>
  );
}
