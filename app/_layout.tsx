import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";

import "./globals.css";
import { useStore } from "@/store";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/lib/toast/config";
import UpdateCard from "@/components/UpdateCard";
import { ShareIntentProvider } from "expo-share-intent";
import { checkOtaUpdate, checkUpdate, fetchOtaUpdate, fetchUpdate } from "@/lib/updates";
import { checkUserSession } from "@/lib/actions/users";
import { COLORS } from "@/constants";

export default function RootLayout() {
	const {
		setState,
		state: { otaAvailable, updateAvailable },
	} = useStore();

	useEffect(() => {
		setState("isLoading", true);

		checkUserSession();
		checkOtaUpdate();
		checkUpdate();

		const timer = setTimeout(() => {
			setState("isLoading", false);
		}, 3000);

		return () => clearTimeout(timer);
	}, []);

	return (
		<ShareIntentProvider
			options={{
				resetOnBackground: false,
				scheme: "simmerit",
			}}
		>
			<StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
			<Stack screenOptions={{ headerShown: false }} />

			<UpdateCard type="ota" onUpdate={fetchOtaUpdate} visible={otaAvailable} />
			<UpdateCard type="update" onUpdate={fetchUpdate} visible={updateAvailable} />

			<Toast config={toastConfig} />
		</ShareIntentProvider>
	);
}
