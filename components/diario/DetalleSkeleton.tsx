import React, {
  useEffect,
} from "react";

import {
  useWindowDimensions,
  View,
} from "react-native";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

export function DetalleSkeleton() {
  const {
    width,
  } =
    useWindowDimensions();

  const opacity =
    useSharedValue(0.45);

  const esTelefono =
    width < 768;

  useEffect(() => {
    opacity.value =
      withRepeat(
        withTiming(
          1,
          {
            duration: 800,
          }
        ),
        -1,
        true
      );
  }, [
    opacity,
  ]);

  const animatedStyle =
    useAnimatedStyle(() => ({
      opacity:
        opacity.value,
    }));

  return (
    <View className="flex-1 bg-[#F8FBFF]">
      <View
        style={{
          width: "100%",
          maxWidth: 920,
          alignSelf: "center",
          paddingHorizontal:
            esTelefono
              ? 16
              : 28,
          paddingTop:
            24,
        }}
      >
        <Animated.View
          style={animatedStyle}
          className="mb-5 h-16 rounded-[20px] bg-slate-200"
        />

        <Animated.View
          style={animatedStyle}
          className="mb-5 h-44 rounded-[26px] bg-slate-200"
        />

        <Animated.View
          style={animatedStyle}
          className="mb-4 h-28 rounded-[22px] bg-slate-200"
        />

        <Animated.View
          style={animatedStyle}
          className="mb-4 h-28 rounded-[22px] bg-slate-200"
        />

        <Animated.View
          style={animatedStyle}
          className="h-28 rounded-[22px] bg-slate-200"
        />
      </View>
    </View>
  );
}