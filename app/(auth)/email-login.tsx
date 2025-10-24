import React, { useEffect } from "react";
import { router } from "expo-router";
import { COLORS } from "@/constants";
import { loaderVideo } from "@/constants/videos";
import { onboardinLogo } from "@/constants/images";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEmailAuth } from "@/lib/hooks/useEmailAuth";
import { EmailInput, NameInput, OtpInput } from "@/components/EmailModalInputs";
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const EmailLogin = () => {
  const { state, actions } = useEmailAuth(() => router.replace("/login"));

  const player = useVideoPlayer(loaderVideo, (player) => {
    player.loop = true;
    player.play();
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          "https://social-media-metadata-extraction.arodos.com"
        );
        const data = await res.json();
        console.log("✅ API Response:", data);
      } catch (error) {
        console.error("❌ API Error:", error);
      }
    };

    fetchData();
  }, []);

  const getHeaderText = () => {
    if (state.currentStep === "email") return "Enter Your Email";
    return state.isRegistering ? "Verify & Register" : "Enter OTP";
  };

  const getSubHeaderText = () => {
    if (state.currentStep === "email")
      return "Please enter your email to continue";
    return `Enter the OTP sent to ${state.email}`;
  };

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <ScrollView
        className="flex-1 px-6 z-10"
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center pt-12 pb-8">
          <View className="items-center mb-6">
            <Image
              source={onboardinLogo}
              className="w-auto h-32 z-10"
              resizeMode="contain"
            />
          </View>

          <Text className="text-2xl font-bold text-neutral text-center mb-2 drop-shadow-lg">
            {getHeaderText()}
          </Text>

          <Text className="text-base text-neutral/90 text-center px-4 drop-shadow-md">
            {getSubHeaderText()}
          </Text>
        </View>

        <View className="flex-row items-center justify-center mb-8">
          <View
            className={`w-10 h-10 rounded-full items-center justify-center shadow-lg ${
              state.currentStep === "email" ? "bg-primary" : "bg-primary-light"
            }`}
          >
            {state.currentStep === "email" ? (
              <Text className="text-neutral font-bold text-lg">1</Text>
            ) : (
              <Feather name="check" size={20} color={COLORS.neutral} />
            )}
          </View>

          <View
            className={`w-16 h-2 mx-3 rounded-full shadow-sm ${
              state.currentStep === "otp" ? "bg-primary" : "bg-neutral/30"
            }`}
          />

          <View
            className={`w-10 h-10 rounded-full items-center justify-center shadow-lg ${
              state.currentStep === "otp" ? "bg-primary" : "bg-neutral/30"
            }`}
          >
            <Text
              className={`font-bold text-lg ${
                state.currentStep === "otp" ? "text-neutral" : "text-neutral/60"
              }`}
            >
              2
            </Text>
          </View>
        </View>

        {/* Content Container */}
        <View className="bg-neutral/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-neutral/20 mb-6">
          <View className="gap-y-6">
            {state.currentStep === "email" ? (
              <EmailInput
                email={state.email}
                onEmailChange={(email) => actions.updateState({ email })}
                onSubmit={actions.handleEmailSubmit}
                isLoading={state.isLoading}
              />
            ) : (
              <>
                {state.isRegistering && (
                  <NameInput
                    name={state.name}
                    onNameChange={(name) => actions.updateState({ name })}
                    isLoading={state.isLoading}
                  />
                )}

                <OtpInput
                  otp={state.otp}
                  onOtpChange={(otp) => actions.updateState({ otp })}
                  onSubmit={actions.handleOtpSubmit}
                  onBack={actions.handleBackToEmail}
                  onResend={actions.handleResendOtp}
                  isLoading={state.isLoading}
                  sendingOtp={state.sendingOtp}
                  isRegistering={state.isRegistering}
                />
              </>
            )}
          </View>
        </View>

        {state.currentStep === "email" && (
          <View className="bg-primary-light/20 backdrop-blur-sm rounded-xl p-4 mb-6 shadow-lg border border-primary-light/40">
            <View className="flex-row items-start">
              <Ionicons
                name="information-circle"
                size={20}
                color={COLORS.neutral}
                className="mt-0.5"
              />
              <View className="flex-1 ml-3">
                <Text className="text-sm font-semibold text-neutral mb-1">
                  New to Simmer It?
                </Text>
                <Text className="text-sm text-neutral/90">
                  If you don't have an account, we'll help you create one after
                  email verification.
                </Text>
              </View>
            </View>
          </View>
        )}

        {state.currentStep === "otp" && (
          <View className="bg-primary-light/20 backdrop-blur-sm rounded-xl p-4 mb-6 shadow-lg border border-primary-light/40">
            <View className="flex-row items-start">
              <Ionicons
                name="shield-checkmark"
                size={20}
                color={COLORS.neutral}
                className="mt-0.5"
              />
              <View className="flex-1 ml-3">
                <Text className="text-sm font-semibold text-neutral mb-1">
                  Secure Verification
                </Text>
                <Text className="text-sm text-neutral/90">
                  We've sent a 4-digit code to your email {state.email}. Please
                  enter it to verify your account.
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      <View className="px-6 bg-neutral/90 backdrop-blur-sm border-t border-neutral/20 z-10">
        <TouchableOpacity
          onPress={() => router.back()}
          className="items-start py-4 flex-row justify-center gap-4"
        >
          <Ionicons name="arrow-back" size={20} className="mb-1" />
          <Text className="text-sm font-medium">Back to login options</Text>
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
    </SafeAreaView>
  );
};

export default EmailLogin;
