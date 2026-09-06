import React from "react";

import { Pressable, Text, useWindowDimensions, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { useThemeColor } from "@/hooks/use-theme-color";

type DetalleHeaderProps = {
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function DetalleHeader({
  onBack,
  onEdit,
  onDelete,
}: DetalleHeaderProps) {
  const { width } = useWindowDimensions();

  // ======================================================
  // TEMA
  // ======================================================

  const surfaceColor = useThemeColor({}, "surface");

  const surfaceSecondaryColor = useThemeColor({}, "surfaceSecondary");

  const borderColor = useThemeColor({}, "border");

  const textColor = useThemeColor({}, "text");

  const textSecondaryColor = useThemeColor({}, "textSecondary");

  const primaryColor = useThemeColor({}, "primary");

  const primarySoftColor = useThemeColor({}, "primarySoft");

  const dangerColor = useThemeColor({}, "danger");

  // ======================================================
  // RESPONSIVE
  // ======================================================

  const esTelefonoPequeno = width < 390;

  // ======================================================
  // ANIMACIONES
  // ======================================================

  const scaleEdit = useSharedValue(1);

  const scaleDelete = useSharedValue(1);

  const editStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: scaleEdit.value,
      },
    ],
  }));

  const deleteStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: scaleDelete.value,
      },
    ],
  }));

  // ======================================================
  // UI
  // ======================================================

  return (
    <View
      style={{
        marginBottom: 24,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {/* ==================================================
            REGRESAR
        ================================================== */}

        <Pressable
          onPress={onBack}
          hitSlop={8}
          style={({ pressed }) => ({
            width: 48,
            height: 48,

            borderRadius: 18,

            borderWidth: 1,
            borderColor,

            alignItems: "center",
            justifyContent: "center",

            backgroundColor: pressed ? surfaceSecondaryColor : surfaceColor,

            elevation: 1,

            shadowColor: "#000000",

            shadowOffset: {
              width: 0,
              height: 2,
            },

            shadowOpacity: 0.05,

            shadowRadius: 5,
          })}
        >
          <Ionicons name="arrow-back" size={22} color={primaryColor} />
        </Pressable>

        {/* ==================================================
            TÍTULO
        ================================================== */}

        <View
          style={{
            flex: 1,

            marginLeft: 16,

            paddingRight: esTelefonoPequeno ? 6 : 12,
          }}
        >
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.82}
            style={{
              fontFamily: "Nunito-Bold",

              fontSize: esTelefonoPequeno ? 20 : 24,

              color: textColor,
            }}
          >
            Detalle del Registro
          </Text>

          <Text
            numberOfLines={1}
            style={{
              marginTop: 4,

              fontFamily: "Nunito-Medium",

              fontSize: esTelefonoPequeno ? 12 : 14,

              color: textSecondaryColor,
            }}
          >
            Revisa tu experiencia emocional
          </Text>
        </View>

        {/* ==================================================
            EDITAR
        ================================================== */}

        <Animated.View
          style={[
            editStyle,
            {
              marginRight: 8,
            },
          ]}
        >
          <Pressable
            onPress={onEdit}
            hitSlop={6}
            onPressIn={() => {
              scaleEdit.value = withSpring(1.08, {
                damping: 12,

                stiffness: 220,
              });
            }}
            onPressOut={() => {
              scaleEdit.value = withSpring(1);
            }}
            style={{
              width: 50,
              height: 50,

              borderRadius: 18,

              borderWidth: 1,
              borderColor,

              alignItems: "center",
              justifyContent: "center",

              backgroundColor: primarySoftColor,

              elevation: 1,

              shadowColor: "#000000",

              shadowOffset: {
                width: 0,

                height: 2,
              },

              shadowOpacity: 0.05,

              shadowRadius: 5,
            }}
          >
            <Ionicons name="create-outline" size={23} color={primaryColor} />
          </Pressable>
        </Animated.View>

        {/* ==================================================
            ELIMINAR
        ================================================== */}

        <Animated.View style={deleteStyle}>
          <Pressable
            onPress={onDelete}
            hitSlop={6}
            onPressIn={() => {
              scaleDelete.value = withSpring(1.08, {
                damping: 12,

                stiffness: 220,
              });
            }}
            onPressOut={() => {
              scaleDelete.value = withSpring(1);
            }}
            style={{
              width: 50,
              height: 50,

              borderRadius: 18,

              borderWidth: 1,
              borderColor,

              alignItems: "center",
              justifyContent: "center",

              backgroundColor: "rgba(239, 68, 68, 0.10)",

              elevation: 1,

              shadowColor: "#000000",

              shadowOffset: {
                width: 0,

                height: 2,
              },

              shadowOpacity: 0.05,

              shadowRadius: 5,
            }}
          >
            <Ionicons name="trash-outline" size={22} color={dangerColor} />
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}
