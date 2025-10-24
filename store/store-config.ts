import { AppState, StateConfig, StateKeys } from "./types";

export const STATE_CONFIG: {
	[K in keyof AppState]: StateConfig<AppState[K]>;
} = {
	user: { initialValue: null, persist: true },
	session: { initialValue: "", persist: true },
	isLoggedIn: { initialValue: false, persist: true },
	isLoading: { initialValue: false, persist: true },

	applicationVersion: { initialValue: "", persist: true },
	deviceInfo: { initialValue: {}, persist: true },
	deviceToken: { initialValue: null, persist: true },
	updateAvailable: { initialValue: false, persist: true },
	otaAvailable: { initialValue: false, persist: true },
	appBackgroundTime: { initialValue: null, persist: true },
	deviceOs: { initialValue: null, persist: true },
	notificationReceived: { initialValue: false, persist: true },
};

export const INITIAL_STATE: AppState = Object.entries(STATE_CONFIG).reduce(
	(acc, [key, config]) => ({
		...acc,
		[key]: config.initialValue,
	}),
	{} as AppState
);

export const PERSISTED_KEYS = Object.entries(STATE_CONFIG)
	.filter(([_, config]) => config.persist)
	.map(([key]) => key as StateKeys);
