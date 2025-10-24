import { useState } from "react";
import { toast } from "@/lib/toast";
import { Alert } from "react-native";
import { capitalize } from "@/lib/utils";
import { TEST_EMAILS } from "@/constants/emails";
import { authenticate, getUsers, saveUser } from "@/lib/actions/users";
import { sendEmail, OTPEmailTemplate } from "@/lib/email";

type ModalStep = "email" | "otp";

interface EmailAuthState {
	currentStep: ModalStep;
	email: string;
	name: string;
	otp: string;
	isLoading: boolean;
	isRegistering: boolean;
	sendingOtp: boolean;
	userId: string;
	sentOTP: string;
}

export const useEmailAuth = (onClose: () => void) => {
	const [state, setState] = useState<EmailAuthState>({
		currentStep: "email",
		email: "",
		name: "",
		otp: "",
		isLoading: false,
		isRegistering: false,
		sendingOtp: false,
		userId: "",
		sentOTP: "",
	});

	const resetState = () => {
		setState({
			currentStep: "email",
			email: "",
			name: "",
			otp: "",
			isLoading: false,
			isRegistering: false,
			sendingOtp: false,
			userId: "",
			sentOTP: "",
		});
	};

	const updateState = (updates: Partial<EmailAuthState>) => {
		setState(prev => ({ ...prev, ...updates }));
	};

	const handleClose = () => {
		resetState();
		onClose();
	};

	const validateEmail = (email: string): boolean => {
		if (!email.trim()) {
			toast.error("Please enter a valid email address.");
			return false;
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			toast.error("Please enter a valid email format.");
			return false;
		}

		return true;
	};

	const validateOtp = (otp: string): boolean => {
		if (!otp.trim() || otp.length < 4) {
			toast.error("Please enter a valid OTP.");
			return false;
		}
		return true;
	};

	const sendOTPEmail = async (userEmail: string): Promise<void> => {
		const normalizedEmail = userEmail.trim().toLowerCase();

		if (TEST_EMAILS.includes(normalizedEmail)) {
			updateState({ sentOTP: "0000" });
			return;
		}

		updateState({ sendingOtp: true });

		try {
			const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
			const userName = capitalize(userEmail.split("@")[0]);

			const htmlTemplate = OTPEmailTemplate(otpCode);

			await sendEmail({
				sendTo: [{ name: userName, email: userEmail }],
				subject: "Your Simmer It Verification Code",
				htmlPart: htmlTemplate,
			});

			updateState({ sentOTP: otpCode, sendingOtp: false });
			toast.success("Verification code sent to your email!");
		} catch (error) {
			updateState({ sendingOtp: false });
			toast.error("Failed to send verification code. Please try again.");
		}
	};

	const registerUser = async (userEmail: string): Promise<string | null> => {
		const res = await saveUser({
			email: userEmail,
			name: state.name.trim(),
			image: "https://uploads.backendservices.in/storage/arodos/avatar-user.png",
		});

		if (res.err) {
			toast.error("Failed to register user. Please try again.");
			return null;
		}

		return res.result.lastInsertID;
	};

	const checkUserExists = async (userEmail: string): Promise<void> => {
		updateState({ isLoading: true });

		try {
			const userRes = await getUsers({ search: `email:${userEmail}` });

			if (userRes.err) {
				throw new Error("Error fetching user");
			}

			const userExists = userRes.count > 0;
			const userId = userExists ? userRes.result[0].id : "";

			updateState({ userId });

			if (userExists) {
				const isDeleted = userRes.result[0].is_deleted;

				if (isDeleted) {
					Alert.alert(
						"Account Deleted",
						`Your account with email ${userEmail} has been deleted. Please use another email to register.`,
						[{ text: "OK", onPress: () => updateState({ isLoading: false }) }]
					);
					return;
				}

				await sendOTPEmail(userEmail);
				updateState({ currentStep: "otp", isRegistering: false });
			} else {
				// User not found, ask for registration
				Alert.alert(
					"User Not Found",
					`No user found with email ${userEmail}. Would you like to register with this email?`,
					[
						{
							text: "Cancel",
							style: "cancel",
							onPress: () => updateState({ isLoading: false }),
						},
						{
							text: "Register",
							onPress: async () => {
								updateState({ isRegistering: true, isLoading: true });
								await sendOTPEmail(userEmail);
								updateState({ currentStep: "otp", isLoading: false });
							},
						},
					]
				);
			}
		} catch (error) {
			toast.error("Failed to check user. Please try again.");
		} finally {
			updateState({ isLoading: false });
		}
	};

	const handleEmailSubmit = async (): Promise<void> => {
		if (!validateEmail(state.email)) return;
		await checkUserExists(state.email);
	};

	const handleOtpSubmit = async (): Promise<void> => {
		try {
			if (state.isRegistering && !state.name) {
				toast.error("Please enter your name to continue.");
				return;
			}
			if (!validateOtp(state.otp)) return;

			updateState({ isLoading: true });

			// Validate OTP
			const isValidOtp = state.otp === state.sentOTP;
			if (!isValidOtp) {
				toast.error("Invalid OTP. Please try again.");
				updateState({ isLoading: false });
				return;
			}

			let uId = state.userId;

			// Handle registration if needed
			if (state.isRegistering) {
				const userId = await registerUser(state.email);
				if (!userId) {
					updateState({ isLoading: false });
					handleClose();
					return;
				}
				uId = userId;
			}

			// Authenticate user
			const isAuthenticated = await authenticate(state.email, uId);

			if (isAuthenticated) {
				toast.success("You have successfully logged in!");
				handleClose();
			} else {
				toast.error("Authentication failed. Please try again.");
				handleClose();
			}
		} catch (error) {
			toast.error("Failed to authenticate. Please try again.");
			handleClose();
		}
	};

	const handleBackToEmail = (): void => {
		updateState({
			currentStep: "email",
			otp: "",
			isRegistering: false,
		});
	};

	const handleResendOtp = async (): Promise<void> => {
		if (!state.sendingOtp) {
			await sendOTPEmail(state.email);
		}
	};

	return {
		state,
		actions: {
			updateState,
			handleClose,
			handleEmailSubmit,
			handleOtpSubmit,
			handleBackToEmail,
			handleResendOtp,
		},
	};
};
