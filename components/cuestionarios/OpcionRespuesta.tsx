import React from "react";

import {
    Pressable,
    Text,
    View,
} from "react-native";

interface Props {
    texto: string;
    seleccionada: boolean;
    onPress: () => void;
}

export default function OpcionRespuesta({
    texto,
    seleccionada,
    onPress,
}: Props) {
    return (
        <Pressable
            onPress={onPress}
            className={`w-full rounded-2xl border px-4 py-4 mb-3 ${seleccionada
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-400 bg-white"
                }`}
            style={{
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.08,
                shadowRadius: 3,
                elevation: 2,
            }}
        >
            <View className="flex-row items-center">
                <View
                    className={`w-5 h-5 rounded-full border-2 mr-3 items-center justify-center ${seleccionada
                            ? "border-blue-500"
                            : "border-slate-400"
                        }`}
                >
                    {seleccionada && (
                        <View className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    )}
                </View>

                <Text
                    style={{
                        fontFamily: seleccionada
                            ? "Nunito-SemiBold"
                            : "Nunito-Medium",
                        fontSize: 15,
                        color: seleccionada
                            ? "#4F8EF7"
                            : "#2D3748",
                    }}
                >
                    {texto}
                </Text>
            </View>
        </Pressable>
    );
}