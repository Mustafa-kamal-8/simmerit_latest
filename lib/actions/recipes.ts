import Api from "@/lib/frontql/Api";

const endPoint = "/recipes";

type GetRecipesParams = {
	fields?: string;
} & GetParams;

export async function getRecipes({ search, page, sort = "-created_at", fields }: GetRecipesParams = {}) {
	const res = await Api.get(endPoint, {
		search,
		page,
		sort,
		fields,
	});

	return res;
}

export async function saveRecipe(body: Partial<any>, session: string) {
	const res = await Api.post(endPoint, {
		body: body,
		session: session,
		filter: "user:{id}",
	});

	return res;
}

export async function updateRecipe({ id, body, session }: { id: string; body: Partial<any>; session: string }) {
	const res = await Api.put(`${endPoint}/${id}`, {
		body: body,
		session: session,
		filter: "user:{id}",
	});

	return res;
}

export async function deleteRecipe(id: string) {
	const res = await Api.put(`${endPoint}/${id}`, {
		body: { is_deleted: true },
	});

	return res;
}
