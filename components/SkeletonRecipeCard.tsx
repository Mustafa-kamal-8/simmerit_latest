import React, { useEffect, useRef } from "react";
import { View, Animated } from "react-native";

const SkeletonRecipeCard = () => {
	// Create animation value
	const opacityAnim = useRef(new Animated.Value(0.3)).current;

	useEffect(() => {
		// Create pulse animation
		const pulse = Animated.sequence([
			Animated.timing(opacityAnim, {
				toValue: 0.6,
				duration: 800,
				useNativeDriver: true,
			}),
			Animated.timing(opacityAnim, {
				toValue: 0.3,
				duration: 800,
				useNativeDriver: true,
			}),
		]);

		// Run animation in loop
		Animated.loop(pulse).start();

		return () => {
			opacityAnim.stopAnimation();
		};
	}, []);

	const animatedStyle = {
		opacity: opacityAnim,
		backgroundColor: "#333",
	};

	return (
		<View className="bg-neutral rounded-xl overflow-hidden mb-4">
			{/* Image placeholder */}
			<Animated.View style={animatedStyle} className="h-40 w-full" />

			<View className="p-4">
				{/* Title placeholder */}
				<Animated.View style={animatedStyle} className="h-6 rounded mb-2 w-3/4" />

				{/* Description placeholder */}
				<Animated.View style={animatedStyle} className="h-4 rounded mb-1 w-full" />
				<Animated.View style={animatedStyle} className="h-4 rounded mb-3 w-2/3" />

				{/* Footer placeholders */}
				<View className="flex-row justify-between items-center mt-2">
					<Animated.View style={animatedStyle} className="h-5 rounded w-20" />
					<Animated.View style={animatedStyle} className="h-8 w-8 rounded-full" />
				</View>
			</View>
		</View>
	);
};

export default SkeletonRecipeCard;
