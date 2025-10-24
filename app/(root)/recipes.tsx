import { useStore } from "@/store";
import { Ionicons } from "@expo/vector-icons";
import SearchBar from "@/components/SearchBar";
import RecipeCard from "@/components/RecipeCard";
import FilterTabs from "@/components/FilterTabs";
import { useRecipes } from "@/lib/hooks/useRecipes";
import RecipeHeader from "@/components/RecipeHeader";
import { useFavorites } from "@/lib/hooks/useFavorites";
import React, { useEffect, useState, useMemo } from "react";
import SkeletonRecipeCard from "@/components/SkeletonRecipeCard";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { COLORS, TUTORIAL_VIDEO_URL } from "@/constants";
import { router } from "expo-router";
import * as Linking from "expo-linking";

const Recipes = () => {
  const {
    state: { user, session },
  } = useStore();

  const [activeFilter, setActiveFilter] = useState<
    "all" | "favorites" | "social"
  >("all");

  const {
    recipes,
    isLoading,
    isLoadingMore,
    hasMore,
    searchTerm,
    handleSearch,
    handleDelete,
    loadMore,
    isDeleting,
  } = useRecipes(user?.id || "", session);

  const { favorites, isToggling, toggleFavorite, fetchFavorites } =
    useFavorites(user?.id || "", session);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const filteredRecipes = useMemo(() => {
    //   if (!recipes.length) return recipes;

    const term = searchTerm.toLowerCase().trim();

    const filterBySearch = (recipe: Recipe) => {
      const title = recipe.title?.toLowerCase() || "";
      const description = recipe.description?.toLowerCase() || "";
      const url = recipe.web_url?.toLowerCase() || ""; // ensure it's a string

      return (
        title.includes(term) || description.includes(term) || url.includes(term)
      );
    };

    switch (activeFilter) {
      case "all":
        return recipes.filter(filterBySearch);

      case "favorites":
        return recipes
          .filter((recipe) => favorites.some((fav) => fav.recipe === recipe.id))
          .filter(filterBySearch);

      default:
        return recipes;
    }
  }, [recipes, activeFilter, favorites, searchTerm]);

  return (
    <View className="flex-1 bg-background px-4">
      <View className="pt-5">
        <RecipeHeader
          userName={user?.name || ""}
          userImage={user?.image || ""}
        />

        <View className="flex-row items-center gap-3 mb-6">
          <View className="flex-1">
            <SearchBar value={searchTerm} onChangeText={handleSearch} />
          </View>

          <TouchableOpacity
            className="w-12 h-12 bg-primary-fade rounded-xl items-center justify-center active:scale-95"
            onPress={() => router.replace("/save-recipe")}
          >
            <Ionicons name="add" size={24} color={COLORS.neutral} />
          </TouchableOpacity>

          <View>
            <FilterTabs
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
            />
          </View>
        </View>
      </View>

      {filteredRecipes.length ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={filteredRecipes}
          keyExtractor={({ id }) => id.toString()}
          ListFooterComponent={
            <>
              {isLoadingMore && (
                <View className="py-4">
                  <ActivityIndicator size="small" className="text-secondary" />
                </View>
              )}
              <View className="h-10" />
            </>
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          renderItem={({ item: recipe }) => (
            <RecipeCard
              disableFavorite={isToggling}
              favorites={favorites}
              recipe={recipe}
              toggleFavorite={toggleFavorite}
              onDelete={handleDelete}
            />
          )}
        />
      ) : isLoading ? (
        <LoadingState />
      ) : (
        <EmptyState />
      )}
    </View>
  );
};

export default Recipes;

const EmptyState = () => (
  <View className="mt-10 flex-1 items-center px-6">
    <View className="items-center max-w-sm">
      <View className="w-24 h-24 bg-neutral rounded-full items-center justify-center mb-6">
        <Ionicons name="restaurant" size={48} color={COLORS.primary} />
      </View>

      <Text className="text-foreground font-bold text-2xl text-center mb-3">
        Start Your Recipe Journey
      </Text>

      <Text className="text-foreground-dark text-center text-base leading-6 mb-8">
        Discover, save, and organize your favorite recipes from anywhere. Your
        culinary adventure begins here!
      </Text>

      <View className="w-full gap-y-3">
        <TouchableOpacity
          className="bg-primary py-4 px-8 rounded-2xl active:scale-95"
          onPress={() => Linking.openURL(TUTORIAL_VIDEO_URL)}
        >
          <View className="flex-row items-center justify-center">
            <Ionicons name="play-circle" size={20} color={COLORS.neutral} />
            <Text className="text-neutral font-semibold text-lg ml-2">
              View Tutorial
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-neutral border-2 border-primary/20 py-4 px-8 rounded-2xl active:scale-95"
          onPress={() => {
            router.replace("/save-recipe");
          }}
        >
          <View className="flex-row items-center justify-center">
            <Ionicons
              name="add-circle-outline"
              size={20}
              color={COLORS.primary}
            />
            <Text className="text-primary font-semibold text-lg ml-2">
              Add First Recipe
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

const LoadingState = () => (
  <View className="flex-1">
    {Array(5)
      .fill(0)
      .map((_, index) => (
        <SkeletonRecipeCard key={`skeleton-${index}`} />
      ))}
  </View>
);
