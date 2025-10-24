import { store } from "@/store";
import { Platform } from "react-native";
import * as Linking from "expo-linking";
import * as Updates from "expo-updates";
import * as Application from "expo-application";
import { getSettingValue } from "./actions/settings";
import { APP_STORE_URL } from "@/constants";

export const checkOtaUpdate = async () => {
	if (Platform.OS !== "web") {
		try {
			const update = await Updates.checkForUpdateAsync();
			if (update.isAvailable) {
				store.setState("otaAvailable", true);
			} else {
				store.setState("otaAvailable", false);
			}
		} catch (error) {
			store.setState("otaAvailable", false);
		}
	}
};

export const fetchOtaUpdate = async () => {
	try {
		const res = await Updates.fetchUpdateAsync();
		if (res.isNew) {
			store.setState("otaAvailable", false);
			reload();
		} else {
			store.setState("otaAvailable", false);
		}
	} catch (error) {
		// alert(`Error fetching latest Expo update: ${error}`);
	}
};

export const reload = async () => {
	try {
		await Updates.reloadAsync();
	} catch (error) {
		// alert(`Error reloading: ${error}`);
	}
};

export const checkUpdate = async () => {
	if (Platform.OS !== "web") {
		const applicationVersion = Application.nativeApplicationVersion || "";
		store.setState("applicationVersion", applicationVersion);

		const res = await getSettingValue("version");

		if (res.err || res.count === 0) {
			store.setState("updateAvailable", false);
			return;
		}

		const appVersion = res.result[0].value?.app_version || 0;

		if (appVersion > applicationVersion) {
			store.setState("updateAvailable", true);
		} else {
			store.setState("updateAvailable", false);
		}
	}
};

export const fetchUpdate = async () => {
	if (Platform.OS == "web") {
		return;
	}

	const url = APP_STORE_URL[Platform.OS as "ios" | "android"];

	if (url) {
		Linking.openURL(url);
	} else {
		console.warn("No update URL available for this platform.");
	}
};
