# Store Usage Examples

## Type Definitions

```typescript
// Your state types are strictly defined
interface User {
	name: string;
	email: string;
}

interface AppState {
	user: User | null;
	temporaryData: any | null;
}
```

## In React Components

```typescript
import { useStore } from "../store";

function UserProfile() {
	const { state, setState, getState } = useStore();

	// Type-safe state access
	const user = getState("user"); // type: User | null

	// Update with type checking
	const updateUser = async () => {
		await setState("user", {
			name: "John Doe",
			email: "john@example.com",
		});
	};

	// Access temporary data
	const tempData = getState("temporaryData");

	// Handle temporary state
	const setTemp = async () => {
		await setState("temporaryData", { someData: "value" });
		// This won't be persisted due to config
	};
}
```

## Outside React Components

```typescript
import store from "../store";

// In services
class UserService {
	async login(credentials: { email: string; password: string }) {
		const response = await api.login(credentials);

		// This will be persisted (configured in STATE_CONFIG)
		await store.setState("user", {
			name: response.name,
			email: response.email,
		});
	}

	async logout() {
		// Resets to initial state (null)
		await store.resetState("user");
	}
}

// In utility functions
function getUserEmail(): string | null {
	const user = store.getState("user");
	return user?.email ?? null;
}
```

## State Management

```typescript
// Subscribe to store changes
const unsubscribe = store.subscribe(() => {
	const currentState = store.getAllState();
	console.log("Store updated:", currentState);
});

// Cleanup subscription when done
unsubscribe();

// Reset specific state to initial value
await store.resetState("user");

// Clear entire store
await store.clearStore();
```

## Best Practices

1. Always use typed state access:

```typescript
const user = getState("user"); // Type: User | null
```

2. Handle async operations properly:

```typescript
try {
	await setState("user", newUser);
} catch (error) {
	console.error("Failed to update user:", error);
}
```

3. Clean up subscriptions in React components:

```typescript
useEffect(() => {
	const unsubscribe = store.subscribe(() => {
		// Handle updates
	});
	return unsubscribe;
}, []);
```

4. Use persistence configuration wisely:

```typescript
// In store-config.ts
export const STATE_CONFIG = {
	user: {
		initialValue: null,
		persist: true, // Will be saved to AsyncStorage
	},
	temporaryData: {
		initialValue: null,
		persist: false, // Won't be persisted
	},
} as const;
```

5. Type-safe state updates:

```typescript
// This will error if shape doesn't match User interface
setState("user", {
	name: "John",
	email: "john@example.com",
	invalidField: true, // TypeScript error
});
```
