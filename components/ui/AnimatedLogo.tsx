import React, { useEffect } from "react";
import { Image, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export default function AnimatedLogo() {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.85);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 500 });

    scale.value = withSpring(1, {
      damping: 12,
      stiffness: 90,
    });
  }, [opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <View
      pointerEvents="auto"
      className="absolute inset-0 z-50 items-center justify-center bg-primary px-6"
    >
      <Animated.View
        className="w-full max-w-sm items-center justify-center"
        style={animatedStyle}
      >
        <Image
          source={require("../../assets/images/splash-icon-ps.png")}
          resizeMode="contain"
          className="h-36 w-full sm:h-44 md:h-52 lg:h-60"
        />
      </Animated.View>
    </View>
  );
}