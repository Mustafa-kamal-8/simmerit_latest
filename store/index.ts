import { useEffect, useState } from "react";
import { store } from "./Store";
import { AppState, StoreHookType } from "./types";

export const useStore = (): StoreHookType => {
	const [state, setState] = useState<AppState>(store.getAllState());

	useEffect(() => {
		const unsubscribe = store.subscribe(() => {
			setState(store.getAllState());
		});

		return unsubscribe;
	}, []);

	return {
		state,
		setState: store.setState.bind(store),
		getState: store.getState.bind(store),
		resetState: store.resetState.bind(store),
		clearStore: store.clearStore.bind(store),
		subscribe: store.subscribe.bind(store),
		getAllState: store.getAllState.bind(store),
	};
};

export { store };
