import React from "react";
import { COLORS } from "@/constants";
import { Feather } from "@expo/vector-icons";
import { useEmailAuth } from "@/lib/hooks/useEmailAuth";
import { EmailInput, OtpInput } from "./EmailModalInputs";
import { View, TouchableOpacity, Text, Modal, TouchableWithoutFeedback } from "react-native";

type EmailModalProps = {
	visible: boolean;
	onClose: () => void;
};

const EmailModal = ({ visible, onClose }: EmailModalProps) => {
	const { state, actions } = useEmailAuth(onClose);

	const getHeaderText = () => {
		if (state.currentStep === "email") return "Enter Your Email";
		return state.isRegistering ? "Verify & Register" : "Enter OTP";
	};

	const getSubHeaderText = () => {
		if (state.currentStep === "email") return "Please enter your email to continue";
		return `Enter the OTP sent to ${state.email}`;
	};

	return (
		<Modal transparent={true} visible={visible} animationType="slide" onRequestClose={actions.handleClose}>
			<TouchableWithoutFeedback onPress={actions.handleClose}>
				<View className="flex-1 justify-end">
					<TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
						<View className="bg-white rounded-t-3xl px-6 pt-4 pb-8 shadow-lg">
							<View className="flex-row items-start justify-between mb-4">
								<View className="flex-1">
									<Text className="text-lg font-bold text-neutral-900">{getHeaderText()}</Text>
									<Text className="text-sm text-neutral-500">{getSubHeaderText()}</Text>
								</View>
								<TouchableOpacity onPress={actions.handleClose} className="p-2 -mr-2">
									<Feather name="x" size={22} color={COLORS.foregroundSecondary} />
								</TouchableOpacity>
							</View>

							<View className="items-center mb-6">
								<View className="w-10 h-1 bg-neutral-300 rounded-full" />
							</View>

							<View className="gap-y-4">
								{state.currentStep === "email" ? (
									<EmailInput
										email={state.email}
										onEmailChange={email => actions.updateState({ email })}
										onSubmit={actions.handleEmailSubmit}
										isLoading={state.isLoading}
									/>
								) : (
									<OtpInput
										otp={state.otp}
										onOtpChange={otp => actions.updateState({ otp })}
										onSubmit={actions.handleOtpSubmit}
										onBack={actions.handleBackToEmail}
										onResend={actions.handleResendOtp}
										isLoading={state.isLoading}
										sendingOtp={state.sendingOtp}
										isRegistering={state.isRegistering}
									/>
								)}
							</View>
						</View>
					</TouchableWithoutFeedback>
				</View>
			</TouchableWithoutFeedback>
		</Modal>
	);
};

export default EmailModal;
