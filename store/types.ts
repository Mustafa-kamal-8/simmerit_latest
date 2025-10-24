import { STATE_CONFIG } from "./store-config";

export interface AppState {
	user: User | null;
	session: string;
	isLoggedIn: boolean;
	isLoading: boolean;

	applicationVersion: string;
	deviceInfo: { [key: PropertyKey]: any };
	deviceToken: any;
	updateAvailable: boolean;
	otaAvailable: boolean;
	appBackgroundTime: any;
	deviceOs: any;
	notificationReceived: boolean;
}

export type StateKeys = keyof typeof STATE_CONFIG;

export interface StateConfig<T> {
	initialValue: T;
	persist: boolean;
}

export type StoreError = {
	code: string;
	message: string;
};

export interface StoreOperations {
	setState: <K extends keyof AppState>(key: K, value: AppState[K]) => Promise<void>;
	getState: <K extends keyof AppState>(key: K) => AppState[K] | any;
	resetState: (key: keyof AppState) => Promise<void>;
	clearStore: () => Promise<void>;
	subscribe: (listener: () => void) => () => void;
	getAllState: () => AppState;
}

// This is the type used by the useStore hook
export interface StoreHookType extends StoreOperations {
	state: AppState;
}
