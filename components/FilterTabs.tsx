import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { View, TouchableOpacity, Text, Modal, TouchableWithoutFeedback, FlatList } from "react-native";
import { COLORS } from "@/constants";

type FilterOption = "all" | "favorites" | "social";

type FilterTabsProps = {
	activeFilter: FilterOption;
	setActiveFilter: (filter: FilterOption) => void;
};

const _OPTIONS: { label: string; value: FilterOption }[] = [
	{ label: "All Recipes", value: "all" },
	{ label: "Favorites", value: "favorites" },
];

const FilterTabs = ({ activeFilter, setActiveFilter }: FilterTabsProps) => {
	const [modalVisible, setModalVisible] = useState(false);

	const handleOpenFilter = () => {
		setModalVisible(true);
	};

	const handleCloseFilter = () => {
		setModalVisible(false);
	};

	const selectFilter = (filter: FilterOption) => {
		setActiveFilter(filter);
		handleCloseFilter();
	};

	return (
		<>
			<TouchableOpacity
				onPress={handleOpenFilter}
				className={`w-12 h-12 rounded-xl items-center justify-center ${
					activeFilter === "favorites" ? "bg-secondary" : "bg-neutral border border-neutral-200"
				}`}
			>
				<Feather name="filter" size={20} color={activeFilter === "favorites" ? COLORS.neutral : COLORS.foreground} />
			</TouchableOpacity>

			<Modal transparent={true} visible={modalVisible} animationType="slide" onRequestClose={handleCloseFilter}>
				<TouchableWithoutFeedback onPress={handleCloseFilter}>
					<View className="flex-1 justify-end">
						<TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
							<View className="bg-white rounded-t-3xl px-6 pt-4 pb-8 shadow-lg">
								<View className="flex-row items-start justify-between mb-4">
									<View>
										<Text className="text-lg font-bold text-neutral-900">Filter Recipes</Text>
										<Text className="text-sm text-neutral-500">Select a filter to view your recipes</Text>
									</View>
									<TouchableOpacity onPress={handleCloseFilter} className="p-2 -mr-2">
										<Feather name="x" size={22} color={COLORS.foregroundSecondary} />
									</TouchableOpacity>
								</View>
								<View className="items-center mb-4">
									<View className="w-10 h-1 bg-neutral-300 rounded-full" />
								</View>

								<View className="gap-y-2">
									<FlatList
										data={_OPTIONS}
										keyExtractor={item => item.value}
										renderItem={({ item }) => (
											<TouchableOpacity
												onPress={() => selectFilter(item.value)}
												className={`flex-row items-center px-3 py-4 rounded-xl ${
													activeFilter === item.value ? "bg-secondary/10" : ""
												}`}
											>
												<View
													className={`h-5 w-5 rounded-full mr-3 border-2 ${
														activeFilter === item.value
															? "border-secondary bg-secondary"
															: "border-neutral-400 bg-transparent"
													}`}
												/>
												<Text
													className={`text-base ${
														activeFilter === item.value
															? "text-secondary font-semibold"
															: "text-neutral-700"
													}`}
												>
													{item.label}
												</Text>
											</TouchableOpacity>
										)}
										contentContainerStyle={{ paddingBottom: 20 }}
										keyboardShouldPersistTaps="handled"
									/>
								</View>
							</View>
						</TouchableWithoutFeedback>
					</View>
				</TouchableWithoutFeedback>
			</Modal>
		</>
	);
};

export default FilterTabs;
