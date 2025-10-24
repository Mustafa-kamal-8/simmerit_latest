import { toast } from "@/lib/toast";
import { router } from "expo-router";
import { COLORS } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState, useCallback } from "react";
import { getAdminStats, getAdminUserStats } from "@/lib/actions/admin";
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, FlatList } from "react-native";

type AdminStats = {
	users: number;
	recipes: number;
	favorites: number;
};
type UserWithStats = {
	id: string;
	name: string;
	email: string;
	created_at: string;
	total_recipes: number;
	favorite_recipes: number;
};

const Admin = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [userStats, setUserStats] = useState<UserWithStats[]>([]);
	const [stats, setStats] = useState<AdminStats>({ users: 0, recipes: 0, favorites: 0 });

	const fetchData = useCallback(async () => {
		setIsLoading(true);
		try {
			const adminStatsRes = await getAdminStats();
			if (adminStatsRes.err) {
				throw new Error(adminStatsRes.result);
			}

			const adminUserStatsRes = await getAdminUserStats();
			if (adminUserStatsRes.err) {
				throw new Error(adminUserStatsRes.result);
			}

			const { users, recipes, favorites } = adminStatsRes.result[0] || {};
			setStats({ users: users || 0, recipes: recipes || 0, favorites: favorites || 0 });

			setUserStats(adminUserStatsRes.result || []);
		} catch (e) {
			toast.error("Failed to fetch admin data. Please refresh the page.");
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return (
		<View className="flex-1 bg-background px-4 pt-8">
			<View className="flex-row justify-between items-center mb-6">
				<View className="flex-row items-center">
					<TouchableOpacity onPress={() => router.back()}>
						<Ionicons name="arrow-back" size={24} color={COLORS.foreground} className="mr-3" />
					</TouchableOpacity>
					<Text className="text-2xl font-bold text-foreground">Admin Dashboard</Text>
				</View>

				<TouchableOpacity onPress={fetchData}>
					<Ionicons name="refresh-circle-outline" size={28} color={COLORS.primary} />
				</TouchableOpacity>
			</View>

			<View className="flex-row justify-between mb-8 gap-3">
				<View className="flex-1 bg-primary-fade rounded-2xl p-5 items-center shadow-md">
					<Ionicons name="people-outline" size={28} color={COLORS.neutral} />
					<Text className="text-2xl font-bold text-white mt-2">{stats.users}</Text>
					<Text className="text-white mt-1">Users Joined</Text>
				</View>
				<View className="flex-1 bg-primary-light rounded-2xl p-4 items-center shadow-md">
					<Ionicons name="book-outline" size={28} color={COLORS.neutral} />
					<Text className="text-2xl font-bold text-white mt-2">{stats.recipes}</Text>
					<Text className="text-white mt-1">Recipes Saved</Text>
				</View>
				<View className="flex-1 bg-secondary rounded-2xl p-5 items-center shadow-md">
					<Ionicons name="heart-outline" size={28} color={COLORS.neutral} />
					<Text className="text-2xl font-bold text-white mt-2">{stats.favorites}</Text>
					<Text className="text-white mt-1">Favorites</Text>
				</View>
			</View>

			{/* Users List */}
			<View className="bg-neutral rounded-2xl p-5 flex-1">
				<Text className="text-lg font-bold mb-4 text-foreground">Users</Text>

				<ScrollView>
					{isLoading ? (
						<View className="py-10 items-center">
							<ActivityIndicator size="large" color={COLORS.primaryLight} />
							<Text className="mt-4 text-foreground-dark">Loading data...</Text>
						</View>
					) : userStats.length === 0 ? (
						<Text className="text-foreground-dark text-center py-8">No users found.</Text>
					) : (
						<FlatList
							data={userStats}
							scrollEnabled={false}
							keyExtractor={item => item.id}
							renderItem={({ item, index }) => (
								<View
									className={`flex-row justify-between items-center py-3 border-b border-neutral-300 ${
										index === userStats.length - 1 ? "border-b-0" : ""
									}`}
								>
									<View>
										<Text className="text-base font-semibold text-foreground">{item.name}</Text>
										<Text className="text-xs text-foreground-dark">{item.email}</Text>
										<Text className="text-xs text-foreground-dark mt-1">
											Joined At: {new Date(item.created_at).toLocaleDateString()}
										</Text>
									</View>
									<View className="flex-row items-center gap-3">
										<View className="flex-row items-center mr-2">
											<Ionicons name="book-outline" size={16} color={COLORS.primaryLight} />
											<Text className="ml-1 text-foreground-dark text-sm">{item.total_recipes}</Text>
										</View>
										<View className="flex-row items-center">
											<Ionicons name="heart-outline" size={16} color={COLORS.secondary} />
											<Text className="ml-1 text-foreground-dark text-sm">{item.favorite_recipes}</Text>
										</View>
									</View>
								</View>
							)}
							ListEmptyComponent={() => (
								<Text className="text-foreground-dark text-center py-8">No users found.</Text>
							)}
							ListFooterComponent={() => <View className="py-6" />}
						/>
					)}
				</ScrollView>
			</View>
		</View>
	);
};

export default Admin;
