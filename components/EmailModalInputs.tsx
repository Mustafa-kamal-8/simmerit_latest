import React from "react";
import { COLORS } from "@/constants";
import { Ionicons, Feather } from "@expo/vector-icons";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";

interface EmailInputProps {
	email: string;
	onEmailChange: (email: string) => void;
	onSubmit: () => void;
	isLoading: boolean;
}

export const EmailInput: React.FC<EmailInputProps> = ({ email, onEmailChange, onSubmit, isLoading }) => (
	<>
		<View>
			<Text className="text-sm font-medium text-neutral-700 mb-2">Email Address</Text>
			<View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
				<Ionicons name="mail-outline" size={20} color={COLORS.foregroundSecondary} />
				<TextInput
					value={email}
					onChangeText={onEmailChange}
					placeholder="Enter your email"
					placeholderTextColor={COLORS.foregroundSecondary}
					keyboardType="email-address"
					autoCapitalize="none"
					autoComplete="email"
					className="flex-1 ml-3 text-foreground"
					editable={!isLoading}
				/>
			</View>
		</View>

		<TouchableOpacity
			onPress={onSubmit}
			disabled={isLoading}
			className={`flex-row items-center justify-center py-4 rounded-xl ${isLoading ? "bg-gray-300" : "bg-primary"}`}
		>
			{isLoading ? (
				<ActivityIndicator size="small" color="white" />
			) : (
				<>
					<Text className="text-white font-semibold text-lg mr-2">Continue</Text>
					<Feather name="arrow-right" size={20} color="white" />
				</>
			)}
		</TouchableOpacity>
	</>
);

interface OtpInputProps {
	otp: string;
	onOtpChange: (otp: string) => void;
	onSubmit: () => void;
	onBack: () => void;
	onResend: () => void;
	isLoading: boolean;
	sendingOtp: boolean;
	isRegistering: boolean;
}

export const OtpInput: React.FC<OtpInputProps> = ({
	otp,
	onOtpChange,
	onSubmit,
	onBack,
	onResend,
	isLoading,
	sendingOtp,
	isRegistering,
}) => (
	<>
		<View>
			<Text className="text-sm font-medium text-neutral-700 mb-2">OTP Code</Text>
			<View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
				<Ionicons name="keypad-outline" size={20} color={COLORS.foregroundSecondary} />
				<TextInput
					value={otp}
					onChangeText={onOtpChange}
					placeholder="Enter the OTP"
					placeholderTextColor={COLORS.foregroundSecondary}
					keyboardType="number-pad"
					maxLength={4}
					className="flex-1 ml-3 text-foreground tracking-widest"
					editable={!isLoading}
				/>
			</View>
		</View>

		<View className="gap-y-3">
			<TouchableOpacity
				onPress={onSubmit}
				disabled={isLoading}
				className={`flex-row items-center justify-center py-4 rounded-xl ${isLoading ? "bg-gray-300" : "bg-primary"}`}
			>
				{isLoading ? (
					<ActivityIndicator size="small" color="white" />
				) : (
					<>
						<Text className="text-white font-semibold text-lg mr-2">
							{isRegistering ? "Complete Registration" : "Login"}
						</Text>
						<Feather name="check" size={20} color="white" />
					</>
				)}
			</TouchableOpacity>

			<TouchableOpacity onPress={onBack} disabled={isLoading} className="flex-row items-center justify-center py-3">
				<Feather name="arrow-left" size={16} color={COLORS.foregroundSecondary} />
				<Text className="text-neutral-600 ml-2">Back to Email</Text>
			</TouchableOpacity>
		</View>

		<TouchableOpacity disabled={sendingOtp} onPress={onResend} className="items-center py-2 disabled:opacity-50">
			<Text className="text-sm text-primary">Didn't receive the code? Resend</Text>
		</TouchableOpacity>
	</>
);

interface NameInputProps {
	name: string;
	onNameChange: (name: string) => void;
	isLoading: boolean;
}

export const NameInput: React.FC<NameInputProps> = ({ name, onNameChange, isLoading }) => (
	<View>
		<Text className="text-sm font-medium text-neutral-700 mb-2">Full Name</Text>
		<View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
			<Ionicons name="person-outline" size={20} color={COLORS.foregroundSecondary} />
			<TextInput
				value={name}
				onChangeText={onNameChange}
				placeholder="Enter your full name"
				placeholderTextColor={COLORS.foregroundSecondary}
				className="flex-1 ml-3 text-foreground"
				editable={!isLoading}
			/>
		</View>
	</View>
);
