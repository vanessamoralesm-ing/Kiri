import React from "react";

import {
    StyleSheet,
    TextInput,
    View,
    ViewStyle,
} from "react-native";

import {
    Ionicons,
} from "@expo/vector-icons";

import {
    useThemeColor,
} from "@/hooks/use-theme-color";


// ==========================================================
// PROPS
// ==========================================================

interface SearchBarProps {
    value: string;

    onChangeText:
    (text: string) => void;

    placeholder?:
    string;

    style?:
    ViewStyle;
}


// ==========================================================
// COMPONENTE
// ==========================================================

export default function SearchBar({
    value,
    onChangeText,
    placeholder = "Buscar...",
    style,
}: SearchBarProps) {

    // ========================================================
    // COLORES DEL TEMA
    // ========================================================

    const inputBackgroundColor =
        useThemeColor(
            {},
            "inputBackground"
        );

    const inputBorderColor =
        useThemeColor(
            {},
            "inputBorder"
        );

    const textColor =
        useThemeColor(
            {},
            "text"
        );

    const placeholderColor =
        useThemeColor(
            {},
            "placeholder"
        );

    const iconColor =
        useThemeColor(
            {},
            "icon"
        );


    // ========================================================
    // UI
    // ========================================================

    return (
        <View
            style={[
                styles.contenedor,

                {
                    backgroundColor:
                        inputBackgroundColor,

                    borderColor:
                        inputBorderColor,
                },

                style,
            ]}
        >

            <Ionicons
                name="search-outline"
                size={28}
                color={
                    iconColor
                }
            />


            <TextInput
                style={[
                    styles.input,

                    {
                        color:
                            textColor,
                    },
                ]}

                value={
                    value
                }

                onChangeText={
                    onChangeText
                }

                placeholder={
                    placeholder
                }

                placeholderTextColor={
                    placeholderColor
                }

                returnKeyType="search"

                clearButtonMode="while-editing"

                selectionColor="#4F8EF7"
            />

        </View>
    );
}


// ==========================================================
// ESTILOS
// ==========================================================

const styles =
    StyleSheet.create({

        contenedor: {
            height:
                58,

            borderRadius:
                10,

            flexDirection:
                "row",

            alignItems:
                "center",

            paddingHorizontal:
                12,

            borderWidth:
                1,

            shadowColor:
                "#000000",

            shadowOffset: {
                width:
                    0,

                height:
                    3,
            },

            shadowOpacity:
                0.12,

            shadowRadius:
                4,

            elevation:
                4,
        },


        input: {
            flex:
                1,

            marginLeft:
                10,

            fontSize:
                14,

            fontFamily:
                "Nunito-Medium",
        },

    });