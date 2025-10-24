import { COLORS } from "@/constants";
import { logo } from "@/constants/images";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

interface UpdateCardProps {
  onUpdate?: () => void;
  title?: string;
  description?: string;
  type: "update" | "ota";
  visible?: boolean;
}

const UpdateCard = ({
  onUpdate = () => {},
  title = "New update available!",
  description = "Please update the app to get the latest features and improvements.",
  type,
  visible = false,
}: UpdateCardProps) => {
  if (!visible) return null;
  return (
    <SafeAreaView
      className={`absolute bottom-0 left-0 right-0 z-50 ${
        type === "update"
          ? "top-0 items-center justify-center bg-neutral/80"
          : ""
      }`}
    >
      <Animated.View
        className="w-[90%] bg-white rounded-2xl p-5 shadow-md self-center my-2.5 border border-neutral-100"
        entering={FadeInUp}
        exiting={FadeOutDown}
      >
        <View className="flex-row items-center mb-3">
          <View className="bg-primary-fade w-9 h-9 rounded-md overflow-hidden justify-center items-center mr-3">
            <Image source={logo} className="size-full" />
          </View>
          <Text className="text-primary text-lg font-bold flex-1">{title}</Text>
        </View>

        <Text className="text-neutral-600 text-sm leading-5 mb-5">
          {description}
        </Text>

        <TouchableOpacity
          className="flex-row justify-center bg-primary-fade rounded-xl py-3 items-center"
          onPress={onUpdate}
        >
          <Text className="text-white font-semibold text-base mr-3">
            Update Now
          </Text>
          <Feather name="download-cloud" size={22} color={COLORS.neutral} />
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

export default UpdateCard;
