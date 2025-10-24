import Api from "@/lib/frontql/Api";
import { store } from "@/store";
import { toast } from "@/lib/toast";

const endPoint = "/users";

export async function authUser({ email, id }: { email: string; id: string }) {
	const res = await Api.post(`/auth-users`, {
		body: { email, id },
		fields: "id, email, name, image, is_deleted, is_admin",
	});

	return res;
}

export async function getUsers({ search, page, sort }: GetParams = {}) {
	const res = await Api.get(endPoint, {
		search: search,
		page: page,
		sort: sort,
	});

	return res;
}

export async function saveUser(body: Partial<User> | Partial<User>[]) {
	const res = await Api.post(endPoint, {
		body: body,
	});

	return res;
}

export async function updateUser(id: string, body: Partial<User>) {
	const res = await Api.put(`${endPoint}/${id}`, {
		body: body,
	});

	return res;
}

export async function deleteUser(id: string) {
	const res = await Api.put(`${endPoint}/${id}`, {
		body: { is_deleted: true },
	});

	return res;
}

//
async function fetchUserFromGoogle(accessToken: string) {
	const res = await fetch("https://www.googleapis.com/userinfo/v2/me", {
		headers: { Authorization: `Bearer ${accessToken}` },
	});
	const userInfo = await res.json();

	return userInfo;
}

export async function authenticate(email: string, userId: string) {
	const res = await authUser({ email: email, id: userId });

	if (res.err) {
		throw new Error("Error logging in");
	}

	const { result, session } = res;

	store.setState("user", result);
	store.setState("session", session);
	store.setState("isLoggedIn", true);

	return true;
}

export async function login(accessToken: string) {
	const userInfo = await fetchUserFromGoogle(accessToken);
	const { email, name, picture } = userInfo;

	// Get the user from the database with the email
	const userRes = await getUsers({ search: `email:${email}` });

	if (userRes.err) {
		throw new Error("Error fetching user");
	}

	const userExists = userRes.count > 0;

	let userId = userExists ? userRes.result[0].id : "";

	if (userExists && userRes.result[0].is_deleted) {
		throw new Error("Account is deleted. Please use a different email.");
	} else if (!userExists) {
		// Create the user in the database
		const newUserRes = await saveUser({
			email: email,
			name: name,
			image: picture,
		});

		if (newUserRes.err) {
			throw new Error("Error creating user");
		}

		userId = newUserRes.result.lastInsertID;
	}

	await authenticate(email, userId);

	return true;
}

export async function logout() {
	try {
		await store.setState("user", null);
		await store.setState("session", "");
		await store.setState("isLoggedIn", false);

		// toast.success("Logged out successfully");
		return true;
	} catch (error) {
		// console.error("Error logging out:", error);
		toast.error("Could not log out");
		return false;
	}
}

export async function checkUserSession() {
	try {
		const user = store.getState("user");

		if (!user || !user.id) {
			await logout();
			return;
		}

		const userRes = await getUsers({ search: `email:${user.email}` });

		if (userRes.err) {
			throw new Error("Error fetching user");
		}

		if (userRes.count === 0) {
			await logout();
			return;
		}

		store.setState("user", {
			...userRes.result[0],
			expiry: user.expiry,
		});

		const sessionExpiry = user.expiry;
		const now = new Date().getTime();

		if (!sessionExpiry) {
			await logout();
			return;
		}

		if (now <= sessionExpiry) {
			// Session is still valid
			return;
		}

		await authenticate(user.email, user.id);
	} catch (error) {
		// console.error("Error checking user session:", error);
		toast.error("Session expired. Please log in again.");
		await logout();
	}
}
