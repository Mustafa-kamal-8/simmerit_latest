import { toast } from "@/lib/toast";
import { useState, useCallback } from "react";
import { getfavorites, savefavorites, deletefavorites } from "@/lib/actions/favorites";

export function useFavorites(userId: string, session: string) {
	const [favorites, setFavorites] = useState<Favorite[]>([]);
	const [isToggling, setIsToggling] = useState<boolean>(false);

	const fetchFavorites = useCallback(async () => {
		try {
			const favRes = await getfavorites({ search: `user:${userId}` });

			if (favRes.err) {
				console.log("Error fetching favorites:", favRes.result);
				return;
			}

			setFavorites(favRes.result);
		} catch (error) {
			console.error("Error fetching favorites:", error);
		}
	}, [userId, session]);

	const toggleFavorite = useCallback(
		async (recipeId: string) => {
			if (!userId || !recipeId) return;

			setIsToggling(true);

			try {
				const isAlreadyFavorite = favorites.some(fav => fav.recipe === recipeId);

				if (isAlreadyFavorite) {
					const current = favorites.find(fav => fav.recipe === recipeId);
					if (!current) return;

					const previousState = [...favorites];
					setFavorites(favorites.filter(fav => fav.recipe !== recipeId));

					const result = await deletefavorites(current.id);
					if (!result || result?.err) {
						toast.error("Failed to remove favorite!");
						setFavorites(previousState); // rollback
						return;
					}

					toast.success("Recipe removed from favorites!", "Removed");
				} else {
					const timestamp = new Date().toISOString();
					const optimisticFavorite: Favorite = {
						id: `${userId}-${recipeId}`,
						recipe: recipeId,
						user: userId,
						created_at: timestamp,
						updated_at: timestamp,
					};

					const previousState = [...favorites];
					const optimisticState = [...favorites, optimisticFavorite];
					setFavorites(optimisticState);

					const result = await savefavorites({ session, recipeId });

					if (!result || result?.err) {
						toast.error("Failed to save favorite!");
						setFavorites(previousState); // rollback
						return;
					}

					toast.success("Recipe added to favorites!", "Added");

					setFavorites(
						optimisticState.map(fav => (fav.recipe === recipeId ? { ...fav, id: result.result.lastInsertID } : fav))
					);
				}
			} catch (error) {
				toast.error("Failed to toggle favorite!");
			} finally {
				setIsToggling(false);
			}
		},
		[favorites, userId, session]
	);

	return {
		favorites,
		isToggling,
		toggleFavorite,
		fetchFavorites,
	};
}
