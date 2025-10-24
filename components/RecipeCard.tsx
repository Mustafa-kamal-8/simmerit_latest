import { COLORS } from "@/constants";
import { toast } from "@/lib/toast";
import { Feather, Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { format } from "date-fns";
import * as Linking from "expo-linking";
import { FC, useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";

interface RecipeCardProps {
  recipe: Recipe;
  toggleFavorite?: (recipeId: string) => void;
  favorites?: Favorite[];
  disableFavorite?: boolean;
  preview?: boolean;
  onDelete?: (recipeId: string) => void;
}

const RecipeCard: FC<RecipeCardProps> = ({
  recipe,
  toggleFavorite,
  favorites,
  disableFavorite,
  preview,
  onDelete,
}) => {
  const [showFullDescription, setShowFullDescription] =
    useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const isSvgImage = recipe.image?.toLowerCase().endsWith(".svg");
  const isFavorite = favorites?.some((fav) => fav.recipe === recipe.id);

  const handleCopyToClipboard = async (url: string) => {
    if (isCopied) return;

    try {
      await Clipboard.setStringAsync(url);
      toast.success("URL copied to clipboard!", "Copied");
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, 3000);
    } catch (error) {
      toast.error("Failed to copy URL to clipboard.");
    }
  };

  // ✅ Condition to detect "link-only" recipes
  const isLinkOnly =
    recipe.title === "Link Only" ||
    recipe.description === "Unsupported platform or invalid URL" ||
    (!recipe.image && !recipe.description && recipe.web_url);

  return (
    <View className="mb-5 bg-neutral overflow-hidden rounded-xl">
      <TouchableOpacity
        disabled={disableFavorite}
        onPress={() => recipe.web_url && Linking.openURL(recipe.web_url)}
        className="relative"
      >
        {isSvgImage || !recipe.image ? (
          <View className="w-full h-64 bg-neutral flex items-center justify-center">
            <Ionicons
              name="restaurant-outline"
              size={96}
              color={COLORS.secondary}
            />
          </View>
        ) : (
          <View className="w-full h-64 overflow-hidden bg-gray-100">
            <Image
              source={{ uri: recipe.image }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
        )}

        {preview ? null : (
          <View className="absolute top-0 right-0 size-20">
            <TouchableOpacity
              className="size-full items-center justify-center"
              disabled={disableFavorite}
              onPress={() => toggleFavorite?.(recipe.id)}
            >
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={28}
                color={COLORS.secondary}
              />
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>

      <View className="bg-primary-fade p-4">
        {/* ✅ Title */}
        <Text numberOfLines={2} className="text-neutral mb-1 text-justify">
          {recipe.title}
        </Text>

        {/* ✅ Show actual link only if metadata missing */}
        {isLinkOnly && recipe.web_url ? (
          <TouchableOpacity onPress={() => Linking.openURL(recipe.web_url)}>
            <Text
              numberOfLines={1}
              selectable
              className="text-blue-400 underline text-xs mb-2"
            >
              {recipe.web_url}
            </Text>
          </TouchableOpacity>
        ) : null}

        {/* ✅ Description */}
        {recipe.description ? (
          <View className="mb-4 mt-2">
            <Text
              numberOfLines={showFullDescription ? undefined : 1}
              className="text-neutral text-justify"
            >
              {recipe.description}
            </Text>
            <TouchableOpacity
              onPress={() => setShowFullDescription(!showFullDescription)}
            >
              <Text className="text-foreground-light text-sm">
                {showFullDescription ? "Show Less" : "Show More"}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* ✅ Footer Section */}
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center flex-1">
            {recipe.source_logo ? (
              <Image
                source={{ uri: recipe.source_logo }}
                className="size-7 mr-3"
              />
            ) : (
              <Feather name="globe" size={24} color="white" className="mr-3" />
            )}

            <View className="flex-1">
              <Text className="text-foreground-light font-medium">
                {recipe.author || "Unknown Author"}
              </Text>
              <Text className="text-foreground-secondary mt-1">
                {format(new Date(recipe.created_at), "dd-MM-yyyy")}
              </Text>
            </View>
          </View>

          {/* ✅ Copy & Delete Buttons */}
          <View className="flex-row items-center gap-x-4">
            <TouchableOpacity
              disabled={isCopied}
              onPress={() =>
                recipe.web_url ? handleCopyToClipboard(recipe.web_url) : null
              }
            >
              <Feather
                name={isCopied ? "check" : "copy"}
                size={20}
                color="white"
              />
            </TouchableOpacity>

            {onDelete && (
              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    "Delete Recipe",
                    "Are you sure you want to delete this recipe?",
                    [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Delete",
                        style: "destructive",
                        onPress: () => onDelete(recipe.id),
                      },
                    ]
                  );
                }}
              >
                <Feather name="trash-2" size={20} color={COLORS.secondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default RecipeCard;
