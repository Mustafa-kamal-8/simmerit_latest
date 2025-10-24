import { COLORS } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import React from "react";
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Privacy = () => {
	return (
		<SafeAreaView className="flex-1 bg-background">
			<StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

			<View className="flex-row items-center px-4 pb-6 bg-background">
				<TouchableOpacity onPress={() => router.back()} className="mr-3">
					<Ionicons name="arrow-back" size={24} color={COLORS.foreground} />
				</TouchableOpacity>
				<Text className="text-2xl font-bold text-foreground">Privacy Policy</Text>
			</View>

			<ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
				<View className="bg-primary-light rounded-xl p-4 mb-6">
					<View className="flex-row items-center">
						<Ionicons name="calendar-outline" size={20} color={COLORS.neutral} />
						<Text className="text-neutral font-medium ml-2">Last Updated: June 2025</Text>
					</View>
				</View>

				<View className="bg-neutral rounded-xl p-5 mb-5">
					<View className="flex-row items-center mb-3">
						<Ionicons name="shield-checkmark-outline" size={24} color={COLORS.primary} />
						<Text className="text-lg font-bold text-foreground ml-2">Your Privacy Matters</Text>
					</View>
					<Text className="text-foreground-dark leading-6">
						We are committed to protecting your privacy and ensuring the security of your personal information. This
						privacy policy explains how we collect, use, and safeguard your data when you use our recipe sharing app.
					</Text>
				</View>

				<View className="bg-neutral rounded-xl p-5 mb-5">
					<View className="flex-row items-center mb-4">
						<Ionicons name="information-circle-outline" size={24} color={COLORS.secondary} />
						<Text className="text-lg font-bold text-foreground ml-2">Information We Collect</Text>
					</View>

					<View className="mb-4">
						<Text className="text-foreground font-semibold mb-2">Personal Information:</Text>
						<Text className="text-foreground-dark leading-6">
							• Name, email address and profile picture when you create an account{"\n"}• Profile information you
							choose to share{"\n"}• Recipes and content you save or create{"\n"}• Your cooking preferences and
							dietary restrictions
						</Text>
					</View>
				</View>

				<View className="bg-neutral rounded-xl p-5 mb-5">
					<View className="flex-row items-center mb-4">
						<Ionicons name="settings-outline" size={24} color={COLORS.primaryLight} />
						<Text className="text-lg font-bold text-foreground ml-2">How We Use Your Information</Text>
					</View>

					<Text className="text-foreground-dark leading-6 mb-3">We use your information to:</Text>

					<Text className="text-foreground-dark leading-6">
						• Provide and improve our recipe sharing service{"\n"}• Personalize your app experience{"\n"}• Send
						important updates about your account{"\n"}• Respond to your support requests{"\n"}• Ensure security and
						prevent fraud{"\n"}• Analyze usage to enhance app functionality
					</Text>
				</View>

				<View className="bg-neutral rounded-xl p-5 mb-5">
					<View className="flex-row items-center mb-4">
						<Ionicons name="lock-closed-outline" size={24} color={COLORS.primaryFade} />
						<Text className="text-lg font-bold text-foreground ml-2">Data Storage & Security</Text>
					</View>

					<Text className="text-foreground-dark leading-6">
						Your data is stored securely using industry-standard encryption and security measures. We implement
						appropriate technical and organizational safeguards to protect your personal information against
						unauthorized access, alteration, disclosure, or destruction. All data transmission occurs over secure
						HTTPS connections, and we regularly update our security protocols to address emerging threats.
					</Text>
				</View>

				<View className="bg-neutral rounded-xl p-5 mb-5">
					<View className="flex-row items-center mb-4">
						<Ionicons name="people-outline" size={24} color={COLORS.secondary} />
						<Text className="text-lg font-bold text-foreground ml-2">Data Sharing</Text>
					</View>

					<Text className="text-foreground-dark leading-6 mb-3">
						We do not sell, trade, or rent your personal information to third parties. We may share your information
						only in these limited circumstances:
					</Text>

					<Text className="text-foreground-dark leading-6">
						• With your explicit consent{"\n"}• To comply with legal obligations{"\n"}• To protect our rights and
						prevent fraud{"\n"}• With service providers who help operate our app (under strict confidentiality
						agreements)
					</Text>
				</View>

				<View className="bg-neutral rounded-xl p-5 mb-5">
					<View className="flex-row items-center mb-4">
						<Ionicons name="checkmark-circle-outline" size={24} color={COLORS.primaryLight} />
						<Text className="text-lg font-bold text-foreground ml-2">Your Rights</Text>
					</View>

					<Text className="text-foreground-dark leading-6 mb-3">You have the right to:</Text>

					<Text className="text-foreground-dark leading-6">
						• Access and review your personal data{"\n"}• Update or correct your information{"\n"}• Delete your
						account and associated data{"\n"}• Opt-out of non-essential communications
					</Text>
				</View>

				<View className="bg-neutral rounded-xl p-5 mb-5">
					<View className="flex-row items-center mb-4">
						<Ionicons name="time-outline" size={24} color={COLORS.primary} />
						<Text className="text-lg font-bold text-foreground ml-2">Data Retention</Text>
					</View>

					<Text className="text-foreground-dark leading-6">
						We retain your personal information only as long as necessary to provide our services and fulfill the
						purposes outlined in this policy. Account data is kept while your account is active, and for a reasonable
						period afterward to allow for account recovery. You may request deletion of your data at any time through
						your account settings or by contacting us directly.
					</Text>
				</View>

				<View className="bg-neutral rounded-xl p-5 mb-5">
					<View className="flex-row items-center mb-4">
						<Ionicons name="heart-outline" size={24} color={COLORS.secondary} />
						<Text className="text-lg font-bold text-foreground ml-2">Children's Privacy</Text>
					</View>

					<Text className="text-foreground-dark leading-6">
						Our service is not intended for children under 13 years of age. We do not knowingly collect personal
						information from children under 13. If you are a parent and believe your child has provided us with
						personal information, please contact us to have it removed.
					</Text>
				</View>

				<View className="bg-neutral rounded-xl p-5 mb-5">
					<View className="flex-row items-center mb-4">
						<Ionicons name="refresh-outline" size={24} color={COLORS.primaryLight} />
						<Text className="text-lg font-bold text-foreground ml-2">Changes to This Policy</Text>
					</View>

					<Text className="text-foreground-dark leading-6">
						We may update this privacy policy from time to time. We will notify you of any changes by posting the new
						policy in the app and updating the "Last Updated" date. Your continued use of the app after any changes
						constitutes acceptance of the updated policy.
					</Text>
				</View>

				<View className="bg-primary-fade rounded-xl p-5 mb-8">
					<View className="flex-row items-center mb-4">
						<Ionicons name="mail-outline" size={24} color={COLORS.neutral} />
						<Text className="text-lg font-bold text-neutral ml-2">Contact Us</Text>
					</View>

					<Text className="text-neutral leading-6 mb-3">
						If you have any questions about this privacy policy or how we handle your data, or if you want to delete
						your account please contact us:
					</Text>

					<View className="bg-neutral/10 rounded-lg p-3">
						<TouchableOpacity onPress={() => Linking.openURL("mailto:mymail.dhruba@gmail.com")}>
							<Text className="text-neutral font-medium underline">Email: mymail.dhruba@gmail.com</Text>
						</TouchableOpacity>
						{/* <TouchableOpacity onPress={() => Linking.openURL("mailto:help@recipeapp.com")}>
							<Text className="text-neutral font-medium underline">Support: help@recipeapp.com</Text>
						</TouchableOpacity> */}
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default Privacy;
