import React from "react";
import { Redirect } from "expo-router";
import { useShareIntentContext } from "expo-share-intent";
import { useStore } from "@/store";
import Loader from "@/components/Loader";

const Index = () => {
	const {
		state: { isLoggedIn, isLoading },
	} = useStore();

	const { hasShareIntent } = useShareIntentContext();

	if (isLoading) {
		return <Loader />;
	}

	if (!isLoggedIn) {
		return <Redirect href="/login" />;
	}

	if (hasShareIntent) {
		return <Redirect href="/save-recipe" />;
	}

	return <Redirect href="/recipes" />;
};

export default Index;
