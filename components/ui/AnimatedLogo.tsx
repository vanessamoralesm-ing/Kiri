import React, { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export default function AnimatedLogo() {
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.85);

  useEffect(() => {
    logoOpacity.value = withTiming(1, {
      duration: 800,
    });

    logoScale.value = withSpring(1, {
      damping: 12,
      stiffness: 90,
    });
  }, []);

  const animatedLogoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [
      {
        scale: logoScale.value,
      },
    ],
  }));

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          animatedLogoStyle,
        ]}
      >
        <Image
          source={require("../../assets/images/splash-icon-ps.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4F8EF7",
    justifyContent: "center",
    alignItems: "center",
  },

  logoContainer: {
    width: "80%",
    maxWidth: 380,
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    width: "100%",
    height: 240,
  },
});