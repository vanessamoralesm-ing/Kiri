import React from "react";

import {
    StyleSheet,
    TextInput,
    View,
    ViewStyle,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    style?: ViewStyle;
}

export default function SearchBar({
    value,
    onChangeText,
    placeholder = "Buscar...",
    style,
}: SearchBarProps) {
    return (
        <View style={[styles.contenedor, style]}>
            <Ionicons
                name="search-outline"
                size={28}
                color="#8A94A6"
            />

            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#B6BEC9"
                returnKeyType="search"
                clearButtonMode="while-editing"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    contenedor: {
        height: 58,
        backgroundColor: "#FFFFFF",
        borderRadius: 10,

        flexDirection: "row",
        alignItems: "center",

        paddingHorizontal: 12,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.14,
        shadowRadius: 4,

        elevation: 4,
    },

    input: {
        flex: 1,
        marginLeft: 10,

        fontSize: 14,
        fontFamily: "Nunito-Medium",

        color: "#2D3748",
    },
});