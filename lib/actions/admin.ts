import Api from "@/lib/frontql/Api";

export async function getAdminStats() {
	const res = await Api.sql("/admin", {
		body: {
			sql: "SELECT (SELECT COUNT(*) FROM users WHERE is_deleted = 0) AS users, (SELECT COUNT(*) FROM recipes r LEFT JOIN users u ON r.user = u.id WHERE r.is_deleted = 0 AND u.is_deleted = 0) AS recipes, (SELECT COUNT(*) FROM favorites f LEFT JOIN users u ON f.user = u.id WHERE u.is_deleted = 0) AS favorites;",
		},
	});

	return res;
}

export async function getAdminUserStats() {
	const res = await Api.sql("/admin-users", {
		body: {
			sql: "SELECT u.id, u.name, u.email, u.created_at, r.total_recipes AS total_recipes, f.favorite_recipes AS favorite_recipes FROM users u LEFT JOIN (SELECT user, COUNT(*) AS total_recipes FROM recipes WHERE is_deleted = 0 GROUP BY user) r ON r.user = u.id LEFT JOIN (SELECT user, COUNT(*) AS favorite_recipes FROM favorites GROUP BY user) f ON f.user = u.id WHERE u.is_deleted = 0 ORDER BY u.id;",
		},
	});

	return res;
}
