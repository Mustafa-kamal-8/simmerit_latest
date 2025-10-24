type User = {
	id: string;
	name: string;
	email: string;
	image: string;
	is_deleted: boolean;
	expiry: number;
	is_admin: boolean;
	created_at: string;
	updated_at: string;
};

type Recipe = {
	id: string;
	user: string;
	title: string;
	description: string;
	source: string;
	web_url: string;
	image: string;
	source_logo: string;
	author: string;
	is_deleted: boolean;
	created_at: string;
	updated_at: string;
};

type Favorite = {
	id: string;
	recipe: string;
	user: string;
	created_at: string;
	updated_at: string;
};
