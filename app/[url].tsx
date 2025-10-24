import { useShareIntentContext } from "expo-share-intent";
import { Redirect, useLocalSearchParams } from "expo-router";

/**
 * This component handles deep links that come from share intents.
 * It redirects to the appropriate screen based on the URL parameters.
 */
export default function DeepLinkHandler() {
	const { dataUrl } = useLocalSearchParams();
	const { hasShareIntent } = useShareIntentContext();

	// If there's a share intent and a dataUrl parameter,
	// redirect to the save-recipe screen
	if (hasShareIntent || dataUrl === "simmeritShareKey") {
		return <Redirect href="/save-recipe" />;
	}

	// Default fallback - redirect to home
	return <Redirect href="/" />;
}
