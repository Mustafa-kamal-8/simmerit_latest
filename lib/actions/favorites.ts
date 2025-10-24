import Api from "@/lib/frontql/Api";

const endpoint = "/favorites";

export async function getfavorites({ search, fields }: { fields?: string; search?: string } = {}) {
	const res = await Api.get(endpoint, {
		search,
		fields,
	});

	return res;
}

export async function savefavorites({ session, recipeId }: { session: string; recipeId: string }) {
	const res = await Api.post(endpoint, {
		body: {
			recipe: recipeId,
		},
		session,
		filter: "user:{id}",
	});

	return res;
}

export async function deletefavorites(recipeId: string) {
	const res = await Api.delete(`${endpoint}/${recipeId}`);

	return res;
}
