import { toast } from "@/lib/toast";
import { PAGE_SIZE } from "@/constants";
import { useState, useEffect, useCallback } from "react";
import { deleteRecipe, getRecipes } from "@/lib/actions/recipes";
import { deletefavorites, getfavorites } from "@/lib/actions/favorites";

export function useRecipes(userId: string, session: string) {
	const [recipes, setRecipes] = useState<Recipe[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
	const [page, setPage] = useState<number>(1);
	const [hasMore, setHasMore] = useState<boolean>(true);
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [isDeleting, setIsDeleting] = useState<boolean>(false);

	const handleDelete = useCallback(
		async (recipeId: string) => {
			if (isDeleting) return;
			setIsDeleting(true);
			try {
				const res = await deleteRecipe(recipeId);
				if (res.err) {
					console.error("Error deleting recipe:", res.result);
					toast.error("Recipe was not deleted!");
					return;
				}
				setRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
				toast.success("Recipe deleted successfully!");

				// Remove associated favorites
				const favRes = await getfavorites({ search: `recipe:${recipeId}`, fields: "id" });
				if (favRes.err) return;
				const favoritesToDelete = (favRes.result as Favorite[]).map(fav => fav.id);
				if (favoritesToDelete.length) await deletefavorites(favoritesToDelete[0]);
			} catch (error) {
				console.error("Error deleting recipe:", error);
				toast.error("An error occurred while deleting the recipe.");
			} finally {
				setIsDeleting(false);
			}
		},
		[isDeleting]
	);

	const fetchRecipes = useCallback(
		async (search = "", pageNum = 1, loadMore = false) => {
			if (pageNum === 1) {
				setIsLoading(true);
			} else {
				setIsLoadingMore(true);
			}

			try {
				const searchQuery = search
					? `title~*${search}*, user:${userId} | description~*${search}*, user:${userId} | source~*${search}*, user:${userId}`
					: `user:${userId}`;

				const res = await getRecipes({
					search: `${searchQuery},is_deleted:0`,
					page: `${pageNum},${PAGE_SIZE}`,
				});

				if (res.err) {
					console.log("Error fetching recipes:", res.result);
					return [];
				}

				const newRecipes = res.result;
				setHasMore(newRecipes.length === PAGE_SIZE);

				if (loadMore) {
					setRecipes(prev => [...prev, ...newRecipes]);
				} else {
					setRecipes(newRecipes);
				}

				return newRecipes;
			} catch (error) {
				console.log("Error fetching recipes:", error);
				return [];
			} finally {
				setIsLoading(false);
				setIsLoadingMore(false);
			}
		},
		[userId, session]
	);

	const handleSearch = useCallback((term: string) => {
		setSearchTerm(term);
		setPage(1);
	}, []);

	const loadMore = useCallback(() => {
		if (!isLoadingMore && hasMore) {
			const nextPage = page + 1;
			setPage(nextPage);
			fetchRecipes(searchTerm, nextPage, true);
		}
	}, [fetchRecipes, hasMore, isLoadingMore, page, searchTerm]);

	// Debounced search effect
	useEffect(() => {
		let timeout: NodeJS.Timeout;

		if (searchTerm) {
			timeout = setTimeout(() => {
				fetchRecipes(searchTerm, 1, false);
			}, 500);
		} else {
			fetchRecipes("", 1, false);
		}

		return () => {
			if (timeout) clearTimeout(timeout);
		};
	}, [searchTerm, fetchRecipes]);

	return {
		recipes,
		isLoading,
		isLoadingMore,
		hasMore,
		searchTerm,
		handleSearch,
		loadMore,
		handleDelete,
		isDeleting,
		refetch: () => fetchRecipes(searchTerm, 1, false),
	};
}
