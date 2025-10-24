import RecipeCard from "@/components/RecipeCard";
import { COLORS } from "@/constants";
import { saveRecipe } from "@/lib/actions/recipes";
import { toast } from "@/lib/toast";
import { useStore } from "@/store";
import { Ionicons } from "@expo/vector-icons";
import { Redirect, router } from "expo-router";
import { useShareIntentContext } from "expo-share-intent";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Clipboard from '@react-native-clipboard/clipboard';

function SaveRecipe() {
  const {
    state: { isLoggedIn, session },
  } = useStore();
  const { hasShareIntent, shareIntent, error, resetShareIntent } =
    useShareIntentContext();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [recipe, setRecipe] = useState<Partial<Recipe>>({
    title: "",
    description: "",
    source: "",
    source_logo: "",
    author: "",
    web_url: "",
    image: "",
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showRecipe, setShowRecipe] = useState<boolean>(false);
  const [manualInputMode, setManualInputMode] = useState<boolean>(false);

  if (!isLoggedIn) {
    return <Redirect href="/login" />;
  }

  const fetchMeta = async (url: string) => {
    setShowRecipe(false);
    setIsLoading(true);
    setManualInputMode(false);

    try {
      const fetchUrl = "https://social-media-metadata-extraction.arodos.com";

      const res = await fetch(fetchUrl, {
        method: "POST",
        body: JSON.stringify({ postUrl: url }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        toast.error("Failed to fetch metadata");
        return;
      }

      const json = await res.json();
      console.log("Metadata fetched:", json);

      // Unsupported or invalid URL
      if (json.error === "Unsupported platform or invalid URL") {
        toast.error(
          "Unsupported platform or invalid URL. You can enter details manually."
        );
        setRecipe({
          title: "",
          description: "",
          web_url: url,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        setManualInputMode(true);
        setShowRecipe(true);
        return;
      }

      const title = json?.text || "Untitled";
      const source = json?.platform || "";
      const source_logo = json?.logo || "";
      const description = json?.description || "";
      const author = json?.author || "";
      const image = json?.images?.[0] || "";
      const web_url = json?.url || url;

      setRecipe({
        title,
        image,
        description,
        source: source || new URL(shareIntent.webUrl!).hostname,
        web_url,
        source_logo,
        author: author || source || "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      setShowRecipe(true);
    } catch (e) {
      console.error("Failed to fetch metadata", e);
      toast.error("Something went wrong while fetching metadata");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (shareIntent?.type === "weburl" && shareIntent.webUrl) {
      fetchMeta(shareIntent.webUrl);
    }
  }, [shareIntent]);

  const handleSaveRecipe = async () => {
    if (!shareIntent) return;

    if (manualInputMode && (!recipe.title || !recipe.description)) {
      toast.error("Please fill in both Title and Description before saving.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await saveRecipe(recipe, session);

      if (res.err) {
        console.error("Error saving recipe:", res.result);
        toast.error("Recipe could not be saved!");
        return;
      }

      toast.success("Recipe saved successfully!");
      resetShareIntent();
      router.replace("/recipes");
    } catch (error) {
      toast.error("An error occurred while saving the recipe.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToHome = () => {
    router.replace("/");
    setShowRecipe(false);
    resetShareIntent();
  };

  return (
    <SafeAreaView className="bg-background flex-1">
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View className="flex-1">
        <View className="px-4 pt-6 pb-4 flex-row items-center">
          <TouchableOpacity
            onPress={goToHome}
            className="w-10 h-10 rounded-full bg-neutral-100 items-center justify-center mr-3"
          >
            <Ionicons name="arrow-back" size={20} color={COLORS.foreground} />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-foreground">
              Save Recipe
            </Text>
            <Text className="text-sm text-foreground-dark">
              Review and save to your collection
            </Text>
          </View>
        </View>

        {isLoading ? (
          <View className="flex-1 px-4">
            <FetchingRecipe />
          </View>
        ) : (
          <ScrollView
            className="flex-1 px-4"
            showsVerticalScrollIndicator={false}
          >
            {showRecipe && (
              <View className="mt-6">
                {!manualInputMode ? (
                  <RecipeCard recipe={recipe as Recipe} preview />
                ) : (
                  <View className="bg-white p-4 rounded-xl border border-neutral-200">
                    <Text className="text-foreground font-semibold mb-2">
                      Enter Recipe Details
                    </Text>
                    <TextInput
                      value={recipe.title}
                      onChangeText={(text) =>
                        setRecipe((prev) => ({ ...prev, title: text }))
                      }
                      placeholder="Title"
                      className="border border-neutral-300 rounded-lg px-3 py-2 mb-3 text-foreground"
                    />
                    <TextInput
                      value={recipe.description}
                      onChangeText={(text) =>
                        setRecipe((prev) => ({ ...prev, description: text }))
                      }
                      placeholder="Description"
                      multiline
                      numberOfLines={4}
                      className="border border-neutral-300 rounded-lg px-3 py-2 text-foreground"
                    />
                  </View>
                )}
              </View>
            )}

            {!hasShareIntent && !showRecipe && (
              <ManualSaveRecipe fetchRecipe={fetchMeta} />
            )}
          </ScrollView>
        )}

        {showRecipe && (
          <View className="px-4 py-6 bg-white border-t border-neutral-100">
            <TouchableOpacity
              disabled={isSubmitting || isLoading}
              onPress={handleSaveRecipe}
              className={`rounded-2xl py-4 items-center flex-row justify-center mb-3 ${
                isSubmitting || isLoading ? "bg-neutral-300" : "bg-secondary"
              }`}
            >
              {isSubmitting ? (
                <>
                  <ActivityIndicator
                    size="small"
                    color="white"
                    className="mr-2"
                  />
                  <Text className="text-white font-semibold text-lg">
                    Saving Recipe...
                  </Text>
                </>
              ) : (
                <>
                  <Ionicons
                    name="bookmark"
                    size={20}
                    color="white"
                    className="mr-2"
                  />
                  <Text className="text-white font-semibold text-lg">
                    Save to Collection
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={goToHome} className="py-3 items-center">
              <Text className="text-foreground-dark font-medium">Cancel</Text>
            </TouchableOpacity>
          </View>
        )}

        {error && (
          <View className="px-4 py-3 bg-red-50 border-t border-red-100">
            <Text className="text-red-600 text-center">{error}</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

export default SaveRecipe;

// ---------- Components ----------
const FetchingRecipe = () => (
  <View className="flex-1 justify-center items-center">
    <View className="bg-neutral rounded-3xl p-8 shadow-sm border border-neutral-100 mx-4">
      <View className="items-center">
        <View className="w-20 h-20 bg-primary/10 rounded-full items-center justify-center mb-6">
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
        <Text className="text-xl font-bold text-foreground text-center mb-2">
          Extracting Recipe
        </Text>
        <Text className="text-foreground-dark text-center leading-5">
          We're gathering all the delicious details from your shared recipe.
          This will just take a moment...
        </Text>
      </View>
    </View>
  </View>
);

const ManualSaveRecipe = ({
  fetchRecipe,
}: {
  fetchRecipe: (url: string) => Promise<void>;
}) => {
  const [webUrl, setWebUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isValidUrl = (url: string) => {
    const urlPattern = /^(https?):\/\/[^\s/$.?#].[^\s]*$/;
    return urlPattern.test(url);
  };

  const handleFetchRecipe = async () => {
    if (!webUrl.trim()) {
      toast.error("Please enter a valid recipe URL.");
      return;
    }
    if (!isValidUrl(webUrl)) {
      toast.error("Please enter a valid URL.");
      return;
    }
    setIsLoading(true);
    try {
      await fetchRecipe(webUrl);
      setWebUrl("");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasteFromClipboard = async () => {
    try {
      const clipboardContent = await Clipboard.getString();
      const content = clipboardContent.trim();
      if (!content) {
        toast.error("No content found in clipboard.");
        return;
      }
      if (!isValidUrl(content)) {
        toast.error("Clipboard content is not a valid URL.");
        return;
      }
      setWebUrl(content);
    } catch {
      toast.error("Failed to paste from clipboard.");
    }
  };

  return (
    <View className="flex-1 items-center justify-center py-20">
      <View className="items-center w-full px-4">
        <View className="w-20 h-20 bg-primary-light/10 rounded-full items-center justify-center mb-6">
          <Ionicons name="add-outline" size={32} color={COLORS.primaryLight} />
        </View>
        <Text className="text-xl font-bold text-foreground text-center mb-2">
          Add Recipe from URL
        </Text>
        <Text className="text-foreground-dark text-center mb-8 leading-5">
          Paste a recipe URL from anywhere and we'll extract the details.
        </Text>

        <View className="w-full mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-foreground font-medium">Recipe URL</Text>
            <TouchableOpacity
              onPress={handlePasteFromClipboard}
              disabled={isLoading}
              className="flex-row items-center bg-primary/10 px-3 py-1 rounded-lg"
            >
              <Ionicons
                name="clipboard-outline"
                size={16}
                color={COLORS.primary}
              />
              <Text className="text-primary font-medium ml-1 text-sm">
                Paste
              </Text>
            </TouchableOpacity>
          </View>
          <View className="bg-background border border-neutral-200 rounded-2xl px-4 py-4 flex-row items-center">
            <Ionicons
              name="globe-outline"
              size={20}
              color={COLORS.foregroundSecondary}
              className="mr-3"
            />
            <TextInput
              value={webUrl}
              onChangeText={setWebUrl}
              placeholder="https://example.com/an-awesome-recipe..."
              placeholderTextColor={COLORS.foregroundSecondary}
              className="flex-1 text-foreground"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              returnKeyType="go"
              onSubmitEditing={handleFetchRecipe}
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={handleFetchRecipe}
          disabled={isLoading || !webUrl.trim()}
          className={`w-full rounded-2xl py-4 items-center flex-row justify-center mb-4 ${
            isLoading || !webUrl.trim() ? "bg-neutral-300" : "bg-primary"
          }`}
        >
          {isLoading ? (
            <>
              <ActivityIndicator size="small" color="white" className="mr-2" />
              <Text className="text-white font-semibold text-base">
                Extracting Recipe...
              </Text>
            </>
          ) : (
            <>
              <Ionicons
                name="sparkles"
                size={20}
                color="white"
                className="mr-2"
              />
              <Text className="text-white font-semibold text-base">
                Extract Recipe
              </Text>
            </>
          )}
        </TouchableOpacity>

        <View className="flex-row items-center justify-center w-full my-4">
          <View className="flex-1 h-px bg-neutral-200" />
          <Text className="mx-4 text-foreground-dark font-medium">or</Text>
          <View className="flex-1 h-px bg-neutral-200" />
        </View>

        <TouchableOpacity
          onPress={() => router.replace("/")}
          className="w-full bg-background border border-neutral-200 rounded-2xl py-3 items-center"
        >
          <View className="flex-row items-center">
            <Ionicons
              name="search-outline"
              size={18}
              color={COLORS.foreground}
            />
            <Text className="text-foreground font-medium ml-2">
              Browse Recipe Collection
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};
