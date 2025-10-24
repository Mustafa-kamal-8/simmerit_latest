import * as SecureStore from 'expo-secure-store';
import { AppState, StoreOperations } from "./types";
import { INITIAL_STATE, PERSISTED_KEYS } from "./store-config";

class Store implements StoreOperations {
	private static instance: Store;
	private state: AppState = INITIAL_STATE;
	private listeners: Set<() => void> = new Set();
	private STORAGE_KEY = "app_state";

	private constructor() {
		this.initializeStore();
	}

	static getInstance(): Store {
		if (!Store.instance) {
			Store.instance = new Store();
		}
		return Store.instance;
	}

	private async initializeStore() {
		try {
			const savedState = await SecureStore.getItemAsync(this.STORAGE_KEY);
			if (savedState) {
				// Merge saved state with initial state, keeping non-persisted values at initial
				this.state = {
					...INITIAL_STATE,
					...JSON.parse(savedState),
				};
				this.notifyListeners();
			}
		} catch (error) {
			// console.error("Store initialization failed:", error);
			// If SecureStore fails, continue with initial state
			this.state = INITIAL_STATE;
			this.notifyListeners();
		}
	}

	private async persistState() {
		try {
			// Only persist configured states
			const persistedState = Object.entries(this.state)
				.filter(([key]) => PERSISTED_KEYS.includes(key as keyof AppState))
				.reduce(
					(acc, [key, value]) => ({
						...acc,
						[key]: value,
					}),
					{}
				);

			await SecureStore.setItemAsync(this.STORAGE_KEY, JSON.stringify(persistedState));
		} catch (error) {
			// console.error("State persistence failed:", error);
			// Continue with operation even if persistence fails
			// This allows the app to function without storage
		}
	}

	private notifyListeners() {
		this.listeners.forEach(listener => listener());
	}

	subscribe(listener: () => void) {
		this.listeners.add(listener);
		return () => {
			this.listeners.delete(listener);
		};
	}

	async setState<K extends keyof AppState>(key: K, value: AppState[K]): Promise<void> {
		this.state = { ...this.state, [key]: value };
		await this.persistState();
		this.notifyListeners();
	}

	getState<K extends keyof AppState>(key: K): AppState[K] | null {
		return this.state[key] ?? null;
	}

	async resetState(key: keyof AppState): Promise<void> {
		this.state = {
			...this.state,
			[key]: INITIAL_STATE[key],
		};

		// Only persist if the key is configured for persistence
		if (PERSISTED_KEYS.includes(key)) {
			await this.persistState();
		}
		this.notifyListeners();
	}

	async clearStore(): Promise<void> {
		this.state = INITIAL_STATE;
		await SecureStore.deleteItemAsync(this.STORAGE_KEY);
		this.notifyListeners();
	}

	getAllState(): AppState {
		return { ...this.state };
	}
}

export const store = Store.getInstance();