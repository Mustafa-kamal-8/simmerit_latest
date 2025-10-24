import { Redirect, router } from "expo-router";
import React, { useEffect, useState } from "react";
import { GoogleIcon } from "@/constants/icons";
import { onboardinLogo } from "@/constants/images";
import { View, Text, Image, TouchableOpacity, ActivityIndicator, Platform } from "react-native";

import { login } from "@/lib/actions/users";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { useStore } from "@/store";
import { toast } from "@/lib/toast";
import { ANDROID_CLIENT_ID, COLORS, IOS_CLIENT_ID, WEB_CLIENT_ID } from "@/constants";
import * as AuthSession from "expo-auth-session";
import { useVideoPlayer, VideoView } from "expo-video";
import { loaderVideo } from "@/constants/videos";
import useLoginPage from "@/lib/hooks/useLoginPage";
import { Ionicons } from "@expo/vector-icons";

WebBrowser.maybeCompleteAuthSession();

const Login = () => {
	const { setIsMounted } = useLoginPage();

	const player = useVideoPlayer(loaderVideo, player => {
		player.loop = true;
		player.play();
	});

	const {
		state: { isLoggedIn },
	} = useStore();

	const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const [request, response, promptAsync] = Google.useAuthRequest({
		iosClientId: IOS_CLIENT_ID,
		androidClientId: ANDROID_CLIENT_ID,
		webClientId: WEB_CLIENT_ID,
		redirectUri: AuthSession.makeRedirectUri({
			scheme: "com.simmerit",
			native: "com.simmerit://",
		}),
		usePKCE: true,
	});

	useEffect(() => {
		if (response?.type === "success" && !isAuthenticating) {
			setIsMounted(true);
			setIsAuthenticating(true);

			const { authentication } = response;

			if (!authentication) {
				// console.error("No authentication data");
				toast.error("Authentication failed. Please try again.");
				setIsAuthenticating(false);
				return;
			}

			// Use setTimeout to avoid navigation conflicts
			setTimeout(() => {
				handleLogin(authentication.accessToken);
			}, 100);
		} else if (response?.type === "error") {
			console.error("Auth error:", response.error);
			setIsAuthenticating(false);
		}
	}, [response]);

	async function handleLogin(accessToken: string) {
		setIsLoading(true);

		try {
			const loggedIn = await login(accessToken);

			if (loggedIn) {
				toast.success("Successfully logged in!");
				setTimeout(() => {
					router.replace("/");
				}, 100);
			}
		} catch (error) {
			// console.error("Login error:", error);

			if (error instanceof Error) {
				toast.error(error.message);
				return;
			}

			toast.error("Login failed. Please try again.");
		} finally {
			setIsLoading(false);
			setIsAuthenticating(false);
		}
	}

	const handleGoogleLogin = () => {
		try {
			console.log("Starting Google auth prompt...");
			promptAsync().catch(err => {
				console.error("Error during auth prompt:", err);
				setIsAuthenticating(false);
			});
		} catch (err) {
			console.error("Failed to initiate login:", err);
			setIsAuthenticating(false);
		}
	};

	if (isLoggedIn) {
		return <Redirect href="/" />;
	}

	return (
		<View className="flex-1 bg-background-dark">
			<View className="flex-2.5 items-center pt-24">
				<Image source={onboardinLogo} className="w-auto h-32 z-10" resizeMode="contain" />

				<Text className="text-neutral text-xl font-semibold mt-5 text-center px-4 z-10">
					All Your Recipes Saved{"\n"}In One Place.
				</Text>
			</View>

			<View className="bg-primary rounded-t-3xl px-8 py-10 items-center z-10">
				<Text className="text-neutral text-xl font-semibold mb-8">✻ Start saving and get cooking ✻</Text>

				<TouchableOpacity
					disabled={isLoading || isLoggedIn}
					className="flex-row items-center justify-center bg-neutral rounded-lg py-4 px-5 w-full"
					onPress={handleGoogleLogin}
				>
					{isLoading ? (
						<ActivityIndicator size="small" className="text-neutral-dark" />
					) : (
						<Image source={GoogleIcon as any} style={{ width: 24, height: 24 }} />
					)}

					<Text className="text-base font-medium text-foreground ml-3">Continue with Google</Text>
				</TouchableOpacity>

				<TouchableOpacity
					disabled={isLoading || isLoggedIn}
					className="mt-2 flex-row items-center justify-center rounded-lg py-4 px-5 w-full"
					onPress={() => router.push("/email-login")}
				>
					{isLoading ? (
						<ActivityIndicator size="small" className="text-neutral-dark" />
					) : (
						<Ionicons name="mail" color={COLORS.neutral} size={24} />
					)}

					<Text className="text-base font-medium text-neutral ml-3">Continue with Email</Text>
				</TouchableOpacity>
			</View>

			<VideoView
				style={{
					width: "100%",
					height: "100%",
					position: "absolute",
					inset: 0,
					opacity: 0.6,
				}}
				player={player}
				nativeControls={false}
				contentFit="cover"
			/>
		</View>
	);
};

export default Login;
