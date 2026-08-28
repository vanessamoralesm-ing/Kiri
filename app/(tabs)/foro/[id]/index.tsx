import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

export default function DetallePublicacionScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();

    return (
        <View className="flex-1 items-center justify-center bg-[#F8FAFC]">
            <Text
                className="text-xl text-slate-800"
                style={{
                    fontFamily: "Nunito-Bold",
                }}
            >
                Publicación {id}
            </Text>
        </View>
    );
}