import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { logo } from "@/constants/images";

type RecipeHeaderProps = {
	userName: string;
	userImage: string;
};

const RecipeHeader = ({ userName, userImage }: RecipeHeaderProps) => {
	return (
		<View className="flex-row items-center mb-5">
			<TouchableOpacity onPress={() => router.push("/profile")}>
				<Image source={{ uri: userImage }} className="w-12 h-12 rounded-full mr-3" resizeMode="cover" />
			</TouchableOpacity>
			<View className="flex-1">
				<Text numberOfLines={1} className="text-2xl font-bold text-foreground">
					Welcome, {userName.split(" ")[0]}!
				</Text>
				<Text numberOfLines={1} className="text-foreground-dark">
					Let's save some delicious recipes!
				</Text>
			</View>
		</View>
	);
};

export default RecipeHeader;
