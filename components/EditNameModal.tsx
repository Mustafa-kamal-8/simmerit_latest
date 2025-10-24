import React, { useState } from "react";
import { Feather, Ionicons } from "@expo/vector-icons";
import { View, TouchableOpacity, Text, Modal, TouchableWithoutFeedback, TextInput, Alert, ActivityIndicator } from "react-native";
import { COLORS } from "@/constants";

type EditNameModalProps = {
	visible: boolean;
	currentName: string;
	onClose: () => void;
	onSave: (newName: string) => Promise<boolean>;
};

const EditNameModal = ({ visible, currentName, onClose, onSave }: EditNameModalProps) => {
	const [name, setName] = useState(currentName);
	const [isLoading, setIsLoading] = useState(false);

	const handleClose = () => {
		setName(currentName);
		onClose();
	};

	const handleSave = async () => {
		const trimmedName = name.trim();

		if (!trimmedName) {
			Alert.alert("Error", "Name cannot be empty.");
			return;
		}

		if (trimmedName === currentName) {
			handleClose();
			return;
		}

		setIsLoading(true);

		try {
			const success = await onSave(trimmedName);
			if (success) {
				onClose();
			}
		} catch (error) {
			Alert.alert("Error", "Failed to update name. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Modal transparent={true} visible={visible} animationType="slide" onRequestClose={handleClose}>
			<TouchableWithoutFeedback onPress={handleClose}>
				<View className="flex-1 justify-end">
					<TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
						<View className="bg-white rounded-t-3xl px-6 pt-4 pb-8 shadow-lg">
							<View className="flex-row items-start justify-between mb-4">
								<View className="flex-1">
									<Text className="text-lg font-bold text-neutral-900">Edit Name</Text>
									<Text className="text-sm text-neutral-500">Update your display name</Text>
								</View>
								<TouchableOpacity onPress={handleClose} className="p-2 -mr-2">
									<Feather name="x" size={22} color={COLORS.foregroundSecondary} />
								</TouchableOpacity>
							</View>

							<View className="items-center mb-6">
								<View className="w-10 h-1 bg-neutral-300 rounded-full" />
							</View>

							<View className="gap-y-4">
								<View>
									<Text className="text-sm font-medium text-neutral-700 mb-2">Full Name</Text>
									<View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
										<Ionicons name="person-outline" size={20} color={COLORS.foregroundSecondary} />
										<TextInput
											value={name}
											onChangeText={setName}
											placeholder="Enter your full name"
											placeholderTextColor={COLORS.foregroundSecondary}
											autoCapitalize="words"
											className="flex-1 ml-3 text-foreground"
											editable={!isLoading}
											maxLength={50}
										/>
									</View>
								</View>

								<View className="gap-y-3 mt-4">
									<TouchableOpacity
										onPress={handleSave}
										disabled={isLoading}
										className={`flex-row items-center justify-center py-4 rounded-xl ${
											isLoading ? "bg-gray-300" : "bg-primary"
										}`}
									>
										{isLoading ? (
											<ActivityIndicator size="small" color="white" />
										) : (
											<>
												<Text className="text-white font-semibold text-lg mr-2">Save Changes</Text>
												<Feather name="check" size={20} color="white" />
											</>
										)}
									</TouchableOpacity>

									<TouchableOpacity
										onPress={handleClose}
										disabled={isLoading}
										className="flex-row items-center justify-center py-3"
									>
										<Text className="text-neutral-600 font-medium">Cancel</Text>
									</TouchableOpacity>
								</View>
							</View>
						</View>
					</TouchableWithoutFeedback>
				</View>
			</TouchableWithoutFeedback>
		</Modal>
	);
};

export default EditNameModal;
