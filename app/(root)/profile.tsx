import React, { useState } from "react";
import { useStore } from "@/store";
import { router } from "expo-router";
import { logo } from "@/constants/images";
import { logout, updateUser } from "@/lib/actions/users";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, Image, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native";
import { COLORS, TUTORIAL_VIDEO_URL } from "@/constants";
import { toast } from "@/lib/toast";
import EditNameModal from "@/components/EditNameModal";
import * as Linking from "expo-linking";

const Profile = () => {
	const {
		state: { user, applicationVersion },
		setState,
	} = useStore();

	const [showEditNameModal, setShowEditNameModal] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const handleUpdateName = async (newName: string): Promise<boolean> => {
		if (!user?.id) {
			Alert.alert("Error", "User not found.");
			return false;
		}

		try {
			const res = await updateUser(user.id, { name: newName });

			if (res.err) {
				Alert.alert("Error", "Failed to update name. Please try again.");
				return false;
			}

			await setState("user", { ...user, name: newName });
			toast.success("Name updated successfully!");
			return true;
		} catch (error) {
			Alert.alert("Error", "Failed to update name. Please try again.");
			return false;
		}
	};

	const handleLogout = async () => {
		Alert.alert("Logout", "Are you sure you want to logout?", [
			{
				text: "Cancel",
				style: "cancel",
			},
			{
				text: "Logout",
				onPress: async () => {
					await logout();
					router.push("/login");
				},
				style: "destructive",
			},
		]);
	};

	const handleDeleteAccount = async () => {
		Alert.alert("Delete Account", "Are you sure you want to delete your account? This action cannot be undone.", [
			{
				text: "Cancel",
				style: "cancel",
			},
			{
				text: "Delete",
				onPress: async () => {
					if (!user?.id) {
						toast.error("User not found.");
						return;
					}
					setIsDeleting(true);

					try {
						const res = await updateUser(user.id, { is_deleted: true });

						if (res.err) {
							toast.error("Failed to delete account. Please try again.");
							return;
						}

						await logout();
						toast.success("Account deleted successfully!");
						router.push("/login");
					} catch (error) {
						toast.error("Failed to delete account. Please try again.");
					} finally {
						setIsDeleting(false);
					}
				},
				style: "destructive",
			},
		]);
	};

	return (
		<View className="flex-1 bg-background px-4">
			<View className="pt-5">
				<View className="flex-row items-center mb-5">
					<TouchableOpacity onPress={() => router.back()}>
						<Ionicons name="arrow-back" size={24} color={COLORS.foreground} className="mr-3" />
					</TouchableOpacity>
					<View className="flex-1">
						<Text className="text-2xl font-bold text-foreground">Profile</Text>
						<Text className="text-foreground-dark">Manage your account settings</Text>
					</View>
				</View>
			</View>

			<ScrollView showsVerticalScrollIndicator={false} className="flex-1">
				<View className="items-center my-6">
					<View className="relative">
						<Image source={{ uri: user?.image }} className="w-32 h-32 rounded-full" resizeMode="cover" />
					</View>
					<Text className="mt-4 text-xl font-bold text-foreground">{user?.name}</Text>
					<Text className="text-foreground-dark mt-1">{user?.email}</Text>
					<Text className="text-foreground-dark text-sm mt-1">{user?.is_admin ? "Admin" : ""}</Text>
				</View>

				<View className="bg-neutral rounded-xl p-5 mb-5">
					<Text className="text-lg font-bold mb-4">Personal Information</Text>

					<View className="mb-4">
						<View className="flex-row justify-between items-center mb-2">
							<Text className="text-foreground-dark">Full Name</Text>
							<TouchableOpacity onPress={() => setShowEditNameModal(true)} className="flex-row items-center">
								<Ionicons name="pencil-outline" size={16} color={COLORS.primary} />
								<Text className="text-primary text-sm ml-1 font-medium">Edit</Text>
							</TouchableOpacity>
						</View>
						<Text className="text-foreground font-medium">{user?.name}</Text>
					</View>

					<View className="mb-4">
						<Text className="text-foreground-dark mb-2">Email</Text>
						<Text className="text-foreground font-medium">{user?.email}</Text>
					</View>
				</View>

				<View className="bg-neutral rounded-xl p-5 mb-10">
					<Text className="text-lg font-bold mb-4">App Information</Text>

					<View className="flex-row justify-between items-center mb-4">
						<View>
							<Text className="text-foreground font-medium">Version</Text>
							<Text className="text-foreground-dark text-sm">Current app version</Text>
						</View>
						<Text className="text-foreground-dark">{applicationVersion}</Text>
					</View>

					<TouchableOpacity className="flex-row justify-between items-center" onPress={() => router.push("/privacy")}>
						<View>
							<Text className="text-foreground font-medium">Privacy Policy</Text>
							<Text className="text-foreground-dark text-sm">Read our privacy policy</Text>
						</View>
						<Ionicons name="chevron-forward" size={18} color={COLORS.foreground} />
					</TouchableOpacity>
				</View>

				{/* Actions */}
				<View className="bg-neutral rounded-xl mb-10">
					<View className="p-5 pb-0">
						<Text className="text-lg font-bold mb-4">Actions</Text>

						{user?.is_admin ? (
							<TouchableOpacity
								className="flex-row justify-between items-center mb-4"
								onPress={() => router.push("/admin")}
							>
								<View>
									<Text className="text-foreground font-medium">Admin</Text>
									<Text className="text-foreground-dark text-sm">Go to admin page</Text>
								</View>
								<Ionicons name="settings" size={18} color={COLORS.primaryFade} />
							</TouchableOpacity>
						) : null}

						<TouchableOpacity className="flex-row justify-between items-center mb-4" onPress={handleLogout}>
							<View>
								<Text className="text-foreground font-medium">Logout</Text>
								<Text className="text-foreground-dark text-sm">Sign out of your account</Text>
							</View>
							<Ionicons name="log-out" size={18} color={COLORS.secondary} />
						</TouchableOpacity>

						<TouchableOpacity
							className="flex-row justify-between items-center mb-4"
							onPress={() => Linking.openURL(TUTORIAL_VIDEO_URL)}
						>
							<View>
								<Text className="text-foreground font-medium">Watch Tutorial</Text>
								<Text className="text-foreground-dark text-sm">Learn how to use the app</Text>
							</View>
							<Ionicons name="play-circle" size={18} color={COLORS.backgroundDark} />
						</TouchableOpacity>
					</View>

					<TouchableOpacity
						className="bg-secondary/5 p-5 rounded-xl flex-row justify-between items-center"
						onPress={handleDeleteAccount}
						disabled={isDeleting}
						style={{ opacity: isDeleting ? 0.5 : 1 }}
					>
						<View>
							<Text className="text-secondary font-medium">Delete Account</Text>
							<Text className="text-secondary text-sm">Permanently delete your account</Text>
						</View>

						{isDeleting ? (
							<ActivityIndicator size="small" color={COLORS.secondary} />
						) : (
							<Ionicons name="trash-bin" size={18} color={COLORS.secondary} />
						)}
					</TouchableOpacity>
				</View>
			</ScrollView>

			<EditNameModal
				visible={showEditNameModal}
				currentName={user?.name || ""}
				onClose={() => setShowEditNameModal(false)}
				onSave={handleUpdateName}
			/>
		</View>
	);
};

export default Profile;
