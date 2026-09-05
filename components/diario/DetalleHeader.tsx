import React from "react";

import {
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

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
  const {
    width,
  } =
    useWindowDimensions();

  const esTelefonoPequeno =
    width < 390;

  const scaleEdit =
    useSharedValue(1);

  const scaleDelete =
    useSharedValue(1);

  const editStyle =
    useAnimatedStyle(() => ({
      transform: [
        {
          scale:
            scaleEdit.value,
        },
      ],
    }));

  const deleteStyle =
    useAnimatedStyle(() => ({
      transform: [
        {
          scale:
            scaleDelete.value,
        },
      ],
    }));

  return (
    <View className="mb-6">
      <View className="flex-row items-center">
        <Pressable
          onPress={onBack}
          hitSlop={8}
          className="h-12 w-12 items-center justify-center rounded-[18px] border border-blue-100 bg-white shadow-sm"
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color="#4F8EF7"
          />
        </Pressable>

        <View
          className="ml-4 flex-1"
          style={{
            paddingRight:
              esTelefonoPequeno
                ? 6
                : 12,
          }}
        >
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.82}
            className="font-nunito-bold text-[#315B9A]"
            style={{
              fontSize:
                esTelefonoPequeno
                  ? 20
                  : 24,
            }}
          >
            Detalle del Registro
          </Text>

          <Text
            numberOfLines={1}
            className="mt-1 font-nunito-medium text-[#8B98AC]"
            style={{
              fontSize:
                esTelefonoPequeno
                  ? 12
                  : 14,
            }}
          >
            Revisa tu experiencia emocional
          </Text>
        </View>

        <Animated.View
          style={editStyle}
          className="mr-2"
        >
          <Pressable
            onPress={onEdit}
            hitSlop={6}
            onPressIn={() => {
              scaleEdit.value =
                withSpring(
                  1.08,
                  {
                    damping: 12,
                    stiffness: 220,
                  }
                );
            }}
            onPressOut={() => {
              scaleEdit.value =
                withSpring(1);
            }}
            className="h-[50px] w-[50px] items-center justify-center rounded-[18px] border border-blue-100 bg-[#EEF5FF] shadow-sm"
          >
            <Ionicons
              name="create-outline"
              size={23}
              color="#4F8EF7"
            />
          </Pressable>
        </Animated.View>

        <Animated.View
          style={deleteStyle}
        >
          <Pressable
            onPress={onDelete}
            hitSlop={6}
            onPressIn={() => {
              scaleDelete.value =
                withSpring(
                  1.08,
                  {
                    damping: 12,
                    stiffness: 220,
                  }
                );
            }}
            onPressOut={() => {
              scaleDelete.value =
                withSpring(1);
            }}
            className="h-[50px] w-[50px] items-center justify-center rounded-[18px] border border-red-100 bg-[#FFF2F2] shadow-sm"
          >
            <Ionicons
              name="trash-outline"
              size={22}
              color="#EF6B6B"
            />
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}