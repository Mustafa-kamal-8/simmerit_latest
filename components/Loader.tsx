import { COLORS } from "@/constants";
import { onboardinLogo } from "@/constants/images";
import { loaderVideo } from "@/constants/videos";
import { useVideoPlayer, VideoView } from "expo-video";
import React from "react";
import { Image, StatusBar, Text, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const Loader = () => {
  const inset = useSafeAreaInsets();

  const player = useVideoPlayer(loaderVideo, (player) => {
    player.loop = true;
    player.play();
  });

  return (
    <SafeAreaView className="bg-background-dark flex-1">
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.backgroundDark}
      />
      <View className="items-center flex-1 justify-center z-10">
        <Image
          source={onboardinLogo}
          className="w-auto h-32"
          resizeMode="contain"
        />

        <Text className="text-neutral text-xl font-semibold mt-5 text-center px-4">
          {/* Pin, Save, Cook - Your Recipes,{"\n"}Your Way. */}
          All Your Recipes Saved{"\n"}In One Place.
        </Text>
      </View>

      <VideoView
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: inset.top,
          bottom: inset.bottom,
          opacity: 0.6,
        }}
        className="absolute inset-0"
        player={player}
        nativeControls={false}
        contentFit="cover"
      />
    </SafeAreaView>
  );
};

export default Loader;
